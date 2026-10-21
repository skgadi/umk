/*
 * Uyamak serial hardware access.
 * Plain JavaScript; no TypeScript syntax or imports required.
 *
 * Protocol assumptions:
 *   - One command produces one CBOR response.
 *   - CBOR objects use definite lengths.
 *   - Commands are not pipelined.
 *
 * Keep these helper names prefixed with GskSerial to avoid collisions
 * with the other JavaScript files in the worker bundle.
 */

function GskSerialGetCborLength(data, offset, depth) {
  offset = offset || 0;
  depth = depth || 0;

  if (depth > 64) {
    throw new Error("CBOR nesting depth exceeded");
  }

  if (offset >= data.length) {
    return null;
  }

  var initial = data[offset];
  var major = initial >> 5;
  var ai = initial & 31;
  var headerLength;
  var argument;

  // Indefinite-length CBOR needs a different parser.
  if (ai === 31) {
    throw new Error("Indefinite-length CBOR is unsupported");
  }

  if (ai < 24) {
    headerLength = 1;
    argument = ai;
  } else if (ai === 24) {
    headerLength = 2;
    if (offset + headerLength > data.length) return null;
    argument = data[offset + 1];
  } else if (ai === 25) {
    headerLength = 3;
    if (offset + headerLength > data.length) return null;

    // Major type 7 uses these bytes as float data, not a length.
    argument = data[offset + 1] * 256 + data[offset + 2];
  } else if (ai === 26) {
    headerLength = 5;
    if (offset + headerLength > data.length) return null;

    argument = 0;
    for (var i = 1; i <= 4; i++) {
      argument = argument * 256 + data[offset + i];
    }
  } else if (ai === 27) {
    headerLength = 9;
    if (offset + headerLength > data.length) return null;

    argument = 0;

    // Float64 is fixed-size data, not an integer length.
    if (major !== 7) {
      for (var j = 1; j <= 8; j++) {
        argument = argument * 256 + data[offset + j];
      }

      if (!Number.isSafeInteger(argument)) {
        throw new Error("CBOR length exceeds JavaScript safe integer range");
      }
    }
  } else {
    throw new Error("Invalid CBOR additional information");
  }

  // Integers, booleans, null, simple values and floating-point values.
  if (major === 0 || major === 1 || major === 7) {
    return headerLength;
  }

  // Byte strings and text strings.
  if (major === 2 || major === 3) {
    var stringLength = headerLength + argument;

    if (!Number.isSafeInteger(stringLength)) {
      throw new Error("CBOR string length is invalid");
    }

    return offset + stringLength <= data.length ? stringLength : null;
  }

  // Tagged value: tag header followed by one CBOR object.
  if (major === 6) {
    var taggedLength = GskSerialGetCborLength(
      data,
      offset + headerLength,
      depth + 1,
    );

    return taggedLength === null ? null : headerLength + taggedLength;
  }

  // Arrays and maps.
  if (major === 4 || major === 5) {
    var count = major === 5 ? argument * 2 : argument;

    if (!Number.isSafeInteger(count) || count > 1000000) {
      throw new Error("CBOR collection length is invalid");
    }

    var cursor = offset + headerLength;

    for (var k = 0; k < count; k++) {
      var itemLength = GskSerialGetCborLength(data, cursor, depth + 1);

      if (itemLength === null) {
        return null;
      }

      cursor += itemLength;
    }

    return cursor - offset;
  }

  throw new Error("Unsupported CBOR major type");
}

function GskSerialConcatBytes(first, second) {
  var result = new Uint8Array(first.length + second.length);
  result.set(first);
  result.set(second, first.length);
  return result;
}

class GskSerialPort {
  constructor() {
    this.friendlyNames = [];
    this.connectedPorts = [];
    this.cellsWithHardware = [];
    this.pinDetails = [];
    this.lastPWMChannel = 0;
    this.missedReads = 0;

    // All exchanges are serialized across simulation calls.
    this._exchangeTail = Promise.resolve();

    this._responseTimeoutMs = 250;
    this._maxReceiveBufferBytes = 1024 * 1024;
    this._maxQueuedFrames = 32;
    this._listenersInstalled = false;
  }

  setValuesFromACell(inCell, value) {
    if (inCell.portDetails) {
      inCell.portDetails.sendValue = value;
    }
  }

  getValuesForACell(inCell) {
    return inCell.portDetails ? inCell.portDetails.recValue : undefined;
  }

  setFriendlyNames(ports) {
    this.friendlyNames = ports;
  }

  async setConnectedPorts() {
    this.connectedPorts = await navigator.serial.getPorts();
    this._installConnectionListeners();
  }

  getAPort(friendlyName) {
    var index = this.friendlyNames.indexOf(friendlyName);

    if (index < 0) {
      return null;
    }

    return this.connectedPorts[index] || null;
  }

  async openAPort(
    friendlyName,
    options = {
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      parity: "none",
    },
  ) {
    var port = this.getAPort(friendlyName);

    if (!port) {
      throw new Error("Port not found: " + friendlyName);
    }

    if (port.readable && port.writable) {
      return;
    }

    if (port.readable || port.writable) {
      throw new Error("Port is partially open: " + friendlyName);
    }

    await port.open(options);
  }

  _installConnectionListeners() {
    if (this._listenersInstalled) {
      return;
    }

    this._listenersInstalled = true;

    navigator.serial.addEventListener("disconnect", (event) => {
      var port = event.target;

      this.pinDetails.forEach((detail) => {
        if (detail.portObject === port) {
          void this._handleDisconnect(detail);
        }
      });
    });

    navigator.serial.addEventListener("connect", (event) => {
      void this._handleConnect(event.target);
    });
  }

  async _handleDisconnect(detail) {
    if (detail.state === "disconnected") {
      return;
    }

    detail.state = "disconnected";
    detail.generation++;
    detail.counters.disconnects++;

    this._rejectAllWaiters(
      detail,
      new Error("Serial port disconnected: " + detail.port),
    );

    detail.rxBuffer = new Uint8Array();
    detail.frames = [];

    await this._releaseStreams(detail, false);
  }

  async _handleConnect(port) {
    await this.setConnectedPorts();

    var detail = this.pinDetails.find((item) => {
      return item.portObject === port || this.getAPort(item.port) === port;
    });

    if (!detail || detail._recoveryPromise) {
      return;
    }

    detail._recoveryPromise = this._reconnectDetail(detail, port).finally(
      () => {
        detail._recoveryPromise = null;
      },
    );

    await detail._recoveryPromise;
  }

  async _reconnectDetail(detail, port) {
    if (detail.state === "connected") {
      return;
    }

    detail.state = "opening";
    detail.generation++;
    detail.rxBuffer = new Uint8Array();
    detail.frames = [];

    try {
      if (!port.readable && !port.writable) {
        await port.open({
          baudRate: 115200,
          dataBits: 8,
          stopBits: 1,
          parity: "none",
        });
      }

      if (!port.readable || !port.writable) {
        throw new Error("Serial streams are unavailable");
      }

      detail.portObject = port;
      detail.reader = port.readable.getReader();
      detail.writer = port.writable.getWriter();
      detail.state = "connected";

      this._startReaderLoop(detail);

      // Restore configuration before resuming simulation exchanges.
      await this._writeConfigurationForPort(detail);
    } catch (error) {
      detail.state = "error";
      console.warn("Serial reconnect failed:", detail.port, error);
      await this._releaseStreams(detail, true);
    }
  }

  _startReaderLoop(detail) {
    var reader = detail.reader;
    var generation = detail.generation;

    detail.readerTask = (async () => {
      try {
        while (detail.reader === reader && detail.generation === generation) {
          var result = await reader.read();

          if (result.done) {
            break;
          }

          if (!result.value || result.value.length === 0) {
            continue;
          }

          detail.counters.bytesReceived += result.value.length;
          detail.rxBuffer = GskSerialConcatBytes(detail.rxBuffer, result.value);

          if (detail.rxBuffer.length > this._maxReceiveBufferBytes) {
            throw new Error("Serial receive buffer limit exceeded");
          }

          this._extractFrames(detail);
        }
      } catch (error) {
        if (detail.generation === generation && detail.state === "connected") {
          console.warn("Serial reader failed:", detail.port, error);
          void this._handleDisconnect(detail);
        }
      } finally {
        if (detail.generation === generation && detail.state === "connected") {
          void this._handleDisconnect(detail);
        }
      }
    })();
  }

  _extractFrames(detail) {
    while (detail.rxBuffer.length > 0) {
      var frameLength;

      try {
        frameLength = GskSerialGetCborLength(detail.rxBuffer);
      } catch (error) {
        detail.counters.malformedFrames++;
        detail.state = "error";

        // Do not guess where the next raw-CBOR object begins.
        this._rejectAllWaiters(detail, error);
        throw error;
      }

      if (frameLength === null) {
        return;
      }

      var frame = detail.rxBuffer.slice(0, frameLength);
      detail.rxBuffer = detail.rxBuffer.slice(frameLength);
      detail.counters.framesReceived++;

      this._deliverFrame(detail, frame);
    }
  }

  _deliverFrame(detail, frame) {
    var waiter = detail.waiters.shift();

    if (waiter) {
      clearTimeout(waiter.timeoutId);
      waiter.resolve(frame);
      return;
    }

    if (detail.frames.length >= this._maxQueuedFrames) {
      detail.counters.malformedFrames++;
      detail.state = "error";

      this._rejectAllWaiters(
        detail,
        new Error("Unexpected serial frame queue overflow"),
      );

      return;
    }

    detail.frames.push(frame);
  }

  _nextFrame(detail, timeoutMs) {
    if (detail.frames.length > 0) {
      return Promise.resolve(detail.frames.shift());
    }

    if (detail.state !== "connected") {
      return Promise.reject(new Error("Port is not connected: " + detail.port));
    }

    return new Promise((resolve, reject) => {
      var waiter = {
        resolve,
        reject,
        timeoutId: null,
      };

      waiter.timeoutId = setTimeout(() => {
        var index = detail.waiters.indexOf(waiter);

        if (index >= 0) {
          detail.waiters.splice(index, 1);
        }

        detail.counters.timeouts++;
        this.missedReads++;

        reject(new Error("Serial response timeout: " + detail.port));
      }, timeoutMs);

      detail.waiters.push(waiter);
    });
  }

  _rejectAllWaiters(detail, error) {
    detail.waiters.splice(0).forEach((waiter) => {
      clearTimeout(waiter.timeoutId);
      waiter.reject(error);
    });
  }

  async _exchange(detail, payload, timeoutMs) {
    if (detail.state !== "connected" || !detail.writer) {
      throw new Error("Port unavailable: " + detail.port);
    }

    // A queued unsolicited/late frame makes response ownership ambiguous.
    if (detail.frames.length > 0) {
      throw new Error(
        "Unexpected old response; port must be reinitialized: " + detail.port,
      );
    }

    // Install the waiter before writing so a fast response is not lost.
    var responsePromise = this._nextFrame(detail, timeoutMs);

    try {
      await detail.writer.write(payload);
    } catch (error) {
      this._rejectAllWaiters(detail, error);
      await responsePromise.catch(() => undefined);
      throw error;
    }

    var frame;

    try {
      frame = await responsePromise;
    } catch (error) {
      // With raw CBOR, a late response cannot be matched to its command.
      // Stop this port instead of silently shifting the simulation data.
      detail.state = "error";
      throw error;
    }

    try {
      return cbor.decode(frame);
    } catch (error) {
      detail.counters.decodeErrors++;
      detail.state = "error";
      throw new Error("Invalid CBOR response: " + detail.port);
    }
  }

  async _releaseStreams(detail, closePort) {
    var reader = detail.reader;
    var writer = detail.writer;
    var port = detail.portObject;

    detail.reader = null;
    detail.writer = null;
    detail.generation++;

    if (reader) {
      try {
        await reader.cancel();
      } catch (error) {}

      try {
        reader.releaseLock();
      } catch (error) {}
    }

    if (writer) {
      try {
        await writer.abort();
      } catch (error) {}

      try {
        writer.releaseLock();
      } catch (error) {}
    }

    if (closePort && port) {
      try {
        if (port.readable || port.writable) {
          await port.close();
        }
      } catch (error) {}
    }
  }

  async clearBuffers() {
    // The persistent reader owns all reads. Never drain the reader here.
    this.pinDetails.forEach((detail) => {
      detail.frames = [];
    });
  }

  async prepareReadersAndWriters() {
    for (var detail of this.pinDetails) {
      if (detail.state === "connected" && detail.reader && detail.writer) {
        continue;
      }

      var port = this.getAPort(detail.port);

      if (!port) {
        detail.state = "disconnected";
        continue;
      }

      if (!port.readable && !port.writable) {
        await port.open({
          baudRate: 115200,
          dataBits: 8,
          stopBits: 1,
          parity: "none",
        });
      }

      if (!port.readable || !port.writable) {
        throw new Error("Cannot acquire serial streams: " + detail.port);
      }

      detail.portObject = port;
      detail.reader = port.readable.getReader();
      detail.writer = port.writable.getWriter();
      detail.rxBuffer = new Uint8Array();
      detail.frames = [];
      detail.state = "connected";

      this._startReaderLoop(detail);
    }
  }

  async _writeConfigurationForPort(detail) {
    var config = detail.config.map((cfg) => {
      var copy = {};
      Object.keys(cfg).forEach((key) => {
        if (key !== "sendValue" && key !== "recValue") {
          copy[key] = cfg[key];
        }
      });
      return copy;
    });

    await this._exchange(detail, cbor.encode(config), 1000);
  }

  async writeAllConfiguration() {
    for (var detail of this.pinDetails) {
      await this._writeConfigurationForPort(detail);
    }
  }

  async initHardwareForSimulation() {
    try {
      await this.setConnectedPorts();
      await this.openRequiredPorts();
      await this.prepareReadersAndWriters();
      await this.clearBuffers();
      await this.writeAllConfiguration();

      return { isError: false };
    } catch (error) {
      return {
        isError: true,
        message: error,
        cid:
          this.cellsWithHardware.length > 0
            ? this.cellsWithHardware[0].cid
            : null,
      };
    }
  }

  async openRequiredPorts() {
    await this.setConnectedPorts();

    for (var detail of this.pinDetails) {
      var port = this.getAPort(detail.port);

      if (!port) {
        detail.state = "disconnected";
        continue;
      }

      detail.portObject = port;

      if (!port.readable && !port.writable) {
        await port.open({
          baudRate: 115200,
          dataBits: 8,
          stopBits: 1,
          parity: "none",
        });
      }
    }
  }

  async closeRequiredPorts() {
    for (var detail of this.pinDetails) {
      detail.state = "closed";
      this._rejectAllWaiters(detail, new Error("Serial port closed"));
      await this._releaseStreams(detail, true);
    }
  }

  async releaseAllWritersNReaders() {
    for (var detail of this.pinDetails) {
      await this._releaseStreams(detail, false);
    }
  }

  async closeAPort(friendlyName) {
    var port = this.getAPort(friendlyName);

    if (!port) {
      throw new Error("Port not found: " + friendlyName);
    }

    await port.close();
  }

  findCellsWithHardware(cells) {
    this.cellsWithHardware = cells.filter((cell) => cell.isSerial);
  }

  initializeHardwareForUpdatedCells(cells) {
    this.findCellsWithHardware(cells);

    this.pinDetails = [];
    this.lastPWMChannel = 0;
    this.missedReads = 0;

    this.cellsWithHardware.forEach((cell) => {
      var pinConfig = this.getPinConfig(cell);

      if (!pinConfig) {
        return;
      }

      cell.portDetails = pinConfig;

      var portName = cell.Parameters.port.Value[0][0];
      var detail = this.pinDetails.find((item) => item.port === portName);

      if (!detail) {
        detail = {
          port: portName,
          config: [],
          state: "closed",
          portObject: null,
          reader: null,
          writer: null,
          readerTask: null,
          generation: 0,
          rxBuffer: new Uint8Array(),
          frames: [],
          waiters: [],
          _recoveryPromise: null,
          counters: {
            bytesReceived: 0,
            framesReceived: 0,
            malformedFrames: 0,
            timeouts: 0,
            decodeErrors: 0,
            disconnects: 0,
            reconnects: 0,
          },
        };

        this.pinDetails.push(detail);
      }

      detail.config.push(pinConfig);
    });

    var order = ["DO", "PM", "DI", "AI", "EN"];

    this.pinDetails.forEach((detail) => {
      detail.config.sort(
        (a, b) => order.indexOf(a.type) - order.indexOf(b.type),
      );
    });
  }

  getPinConfig(cell) {
    try {
      var pin;
      var pins;

      try {
        pin = parseInt(cell.Parameters.pin.Value[0][0]);
      } catch (error) {}

      try {
        pins = [
          parseInt(cell.Parameters.pin_A.Value[0][0]),
          parseInt(cell.Parameters.pin_B.Value[0][0]),
        ];
      } catch (error) {}

      switch (cell.id) {
        case "umk_1774369913335":
          return { type: "DI", pin: pin, sendValue: 0 };

        case "umk_1774706876440": {
          var doInit = math.matrix(cell.Parameters.ic.Value).get([0, 0]);
          return {
            type: "DO",
            pin: pin,
            initVal: doInit,
            sendValue: doInit,
          };
        }

        case "umk_1774714186082":
          return { type: "AI", pin: pin, sendValue: 0 };

        case "umk_1774714197073": {
          var pwmInit = math.matrix(cell.Parameters.ic.Value).get([0, 0]);
          return {
            type: "PM",
            pin: pin,
            initVal: pwmInit,
            freq: math.matrix(cell.Parameters.freq.Value).get([0, 0]),
            res: math.matrix(cell.Parameters.res.Value).get([0, 0]),
            ch: this.lastPWMChannel++,
            sendValue: pwmInit,
          };
        }

        case "umk_1774714206020":
          return { type: "EN", pins: pins, sendValue: 0 };

        default:
          return null;
      }
    } catch (error) {
      console.warn("Could not create pin configuration:", error);
      return null;
    }
  }

  async applyReadWrite() {
    var run = async () => {
      for (var detail of this.pinDetails) {
        try {
          if (detail.state !== "connected" || !detail.writer) {
            throw new Error("Port is not ready: " + detail.port);
          }

          var sendValues = detail.config.map((config) => config.sendValue);

          var response = await this._exchange(
            detail,
            cbor.encode(sendValues),
            this._responseTimeoutMs,
          );

          if (
            !Array.isArray(response) ||
            response.length !== detail.config.length
          ) {
            detail.state = "error";
            throw new Error("Unexpected response size from " + detail.port);
          }

          detail.config.forEach((config, index) => {
            config.recValue = response[index];
          });
        } catch (error) {
          this.missedReads++;
          console.warn("Hardware exchange failed for " + detail.port, error);

          // Do not reinitialize all ports inside this loop.
          // A failed raw-CBOR exchange must be explicitly recovered.
          if (detail.state === "connected") {
            detail.state = "error";
          }
        }
      }
    };

    var current = this._exchangeTail.then(run, run);

    this._exchangeTail = current.then(
      () => undefined,
      () => undefined,
    );

    await current;
  }

  getMissedReads() {
    return this.missedReads;
  }

  getDiagnostics() {
    return {
      missedReads: this.missedReads,
      ports: this.pinDetails.map((detail) => ({
        port: detail.port,
        state: detail.state,
        bytesReceived: detail.counters.bytesReceived,
        framesReceived: detail.counters.framesReceived,
        malformedFrames: detail.counters.malformedFrames,
        timeouts: detail.counters.timeouts,
        decodeErrors: detail.counters.decodeErrors,
        disconnects: detail.counters.disconnects,
        reconnects: detail.counters.reconnects,
        bufferedBytes: detail.rxBuffer.length,
        queuedFrames: detail.frames.length,
      })),
    };
  }
}

const gskSerialPort = new GskSerialPort();
