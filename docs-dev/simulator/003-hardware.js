/*
 * UYAMAK SERIAL HARDWARE ACCESS
 * ESP32 / Web Serial / CBOR
 *
 * Requires global:
 *   cbor
 *   math
 */

// ============================================================
// 1. CBOR FRAME LENGTH
// ============================================================

function GskSerialGetCborLength(data, offset, depth) {
  offset = offset || 0;
  depth = depth || 0;

  if (depth > 32) {
    throw new Error("CBOR nesting limit exceeded");
  }

  if (offset >= data.length) return null;

  var initial = data[offset];
  var major = initial >> 5;
  var ai = initial & 31;

  if (ai === 31) {
    throw new Error("Indefinite-length CBOR unsupported");
  }

  var header;

  if (ai < 24) header = 1;
  else if (ai === 24) header = 2;
  else if (ai === 25) header = 3;
  else if (ai === 26) header = 5;
  else if (ai === 27) header = 9;
  else throw new Error("Invalid CBOR header");

  if (offset + header > data.length) return null;

  if (major === 0 || major === 1 || major === 7) {
    return header;
  }

  var arg = ai < 24 ? ai : 0;

  if (ai >= 24) {
    for (var i = 1; i < header; i++) {
      arg = arg * 256 + data[offset + i];
    }

    if (!Number.isSafeInteger(arg)) {
      throw new Error("CBOR length exceeds safe integer range");
    }
  }

  if (major === 2 || major === 3) {
    if (arg > 131072) {
      throw new Error("CBOR string exceeds size limit");
    }

    var total = header + arg;

    return offset + total <= data.length ? total : null;
  }

  if (major === 6) {
    var tagged = GskSerialGetCborLength(data, offset + header, depth + 1);

    return tagged === null ? null : header + tagged;
  }

  if (major !== 4 && major !== 5) {
    throw new Error("Unsupported CBOR major type");
  }

  var count = major === 5 ? arg * 2 : arg;

  if (!Number.isSafeInteger(count) || count > 100000) {
    throw new Error("CBOR collection exceeds limit");
  }

  var cursor = offset + header;

  for (var k = 0; k < count; k++) {
    var len = GskSerialGetCborLength(data, cursor, depth + 1);

    if (len === null) return null;

    cursor += len;

    if (cursor - offset > 131072) {
      throw new Error("CBOR frame exceeds size limit");
    }
  }

  return cursor - offset;
}

// ============================================================
// 2. BYTE UTILITIES
// ============================================================

function GskSerialConcatBytes(a, b) {
  var result = new Uint8Array(a.length + b.length);

  result.set(a);
  result.set(b, a.length);

  return result;
}

function GskSerialHex(data, limit) {
  return Array.from(data.slice(0, limit || 24))
    .map(function (b) {
      return b.toString(16).padStart(2, "0");
    })
    .join(" ");
}

// ============================================================
// 3. SERIAL PORT CLASS
// ============================================================

class GskSerialPort {
  constructor() {
    this.friendlyNames = [];
    this.connectedPorts = [];

    this.cellsWithHardware = [];
    this.pinDetails = [];

    this.lastPWMChannel = 0;
    this.missedReads = 0;

    this._runtimeBusy = false;

    this._responseTimeoutMs = 1500;
    this._configurationTimeoutMs = 3000;

    this._maxReceiveBytes = 256 * 1024;

    this._startupQuietMs = 500;
    this._startupMaxWaitMs = 3000;

    this._recoveryQuietMs = 500;
    this._recoveryMaxWaitMs = 3000;

    this._reconnectInitialDelayMs = 500;
    this._reconnectMaxDelayMs = 5000;

    this._listenersInstalled = false;
    this._shuttingDown = false;
  }

  // ==========================================================
  // 4. PUBLIC VALUE METHODS
  // ==========================================================

  setValuesFromACell(cell, value) {
    if (cell && cell.portDetails) {
      cell.portDetails.sendValue = value;
    }
  }

  getValuesForACell(cell) {
    return cell && cell.portDetails ? cell.portDetails.recValue : undefined;
  }

  setFriendlyNames(ports) {
    this.friendlyNames = ports || [];
  }

  async setConnectedPorts() {
    if (!navigator.serial) {
      throw new Error("Web Serial API unavailable");
    }

    this.connectedPorts = await navigator.serial.getPorts();

    this._installConnectionListeners();
  }

  getAPort(name) {
    var index = this.friendlyNames.indexOf(name);

    return index < 0 ? null : this.connectedPorts[index] || null;
  }

  async openAPort(name, options) {
    var port = this.getAPort(name);

    if (!port) {
      throw new Error("Port not found: " + name);
    }

    if (port.readable && port.writable) return;

    if (port.readable || port.writable) {
      throw new Error("Port partially open: " + name);
    }

    await port.open(
      options || {
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
      },
    );
  }

  // ==========================================================
  // 5. SERIAL CONNECTION EVENTS
  // ==========================================================

  _installConnectionListeners() {
    if (this._listenersInstalled || !navigator.serial) return;

    this._listenersInstalled = true;

    navigator.serial.addEventListener(
      "disconnect",
      function (event) {
        this.pinDetails.forEach(
          function (detail) {
            if (detail.portObject === event.target) {
              this._stopPort(
                detail,
                new Error("Serial disconnected: " + detail.port),
                true,
              );
            }
          }.bind(this),
        );
      }.bind(this),
    );

    navigator.serial.addEventListener(
      "connect",
      function (event) {
        this.pinDetails.forEach(
          function (detail) {
            if (
              detail.portObject === event.target &&
              detail.state === "error" &&
              !this._shuttingDown
            ) {
              this._scheduleReconnect(detail);
            }
          }.bind(this),
        );
      }.bind(this),
    );
  }

  // ==========================================================
  // 6. STOP AND RECOVER PORT
  // ==========================================================

  _stopPort(detail, error, reconnect) {
    if (this._shuttingDown || detail.state === "closed") {
      detail.state = "closed";

      return;
    }

    var wasConnected = detail.state === "connected";

    detail.state = "error";
    detail.readyForRuntime = false;

    detail.flushing = true;
    detail.rxBuffer = new Uint8Array(0);

    detail.lastError = String(error && (error.message || error));

    if (wasConnected) {
      detail.generation++;
    }

    detail.waiters.splice(0).forEach(function (waiter) {
      clearTimeout(waiter.timeoutId);

      waiter.reject(error);
    });

    if (reconnect !== false) {
      this._scheduleReconnect(detail);
    }
  }

  _scheduleReconnect(detail) {
    if (this._shuttingDown || detail.reconnectTask) return;

    detail.reconnectTask = this._reconnectPort(detail)
      .catch(function (error) {
        detail.lastError = String(error && (error.message || error));

        console.warn("[UYAMAK] Reconnection loop ended:", detail.port, error);
      })
      .finally(function () {
        detail.reconnectTask = null;
      });
  }

  async _delay(ms) {
    await new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  // ==========================================================
  // 7. RELEASE SERIAL STREAMS
  // ==========================================================

  async _releaseDetailStreams(detail) {
    var reader = detail.reader;
    var writer = detail.writer;
    var readerTask = detail.readerTask;

    detail.reader = null;
    detail.writer = null;
    detail.readerTask = null;

    if (reader) {
      try {
        await reader.cancel();
      } catch (error) {}

      if (readerTask) {
        try {
          await readerTask;
        } catch (error) {}
      }

      try {
        reader.releaseLock();
      } catch (error) {}
    }

    if (writer) {
      try {
        writer.releaseLock();
      } catch (error) {}
    }
  }

  // ==========================================================
  // 8. RECEIVE STREAM PURGING
  // ==========================================================

  async _purgeReceiveStream(detail, quietMs, maxWaitMs) {
    if (detail.state !== "connected" || !detail.reader) {
      throw new Error("Cannot purge unavailable port: " + detail.port);
    }

    var generation = detail.generation;
    var start = Date.now();

    detail.flushing = true;
    detail.rxBuffer = new Uint8Array(0);
    detail.flushLastByteAt = Date.now();

    while (true) {
      if (
        this._shuttingDown ||
        detail.state !== "connected" ||
        detail.generation !== generation ||
        !detail.reader
      ) {
        throw new Error("Port changed during receive purge: " + detail.port);
      }

      var now = Date.now();

      if (now - detail.flushLastByteAt >= quietMs) {
        break;
      }

      if (now - start >= maxWaitMs) {
        throw new Error("Serial stream did not become quiet: " + detail.port);
      }

      await this._delay(20);
    }

    detail.rxBuffer = new Uint8Array(0);

    detail.counters.purgeOperations++;

    detail.flushing = false;

    return {
      success: true,
      durationMs: Date.now() - start,
    };
  }

  async _flushStartupData(detail) {
    return await this._purgeReceiveStream(
      detail,
      this._startupQuietMs,
      this._startupMaxWaitMs,
    );
  }

  // ==========================================================
  // 9. RECONNECTION PROCEDURE
  // ==========================================================

  async _reconnectPort(detail) {
    var delay = this._reconnectInitialDelayMs;

    while (!this._shuttingDown) {
      try {
        await this._delay(delay);

        if (this._shuttingDown) return;

        this.connectedPorts = await navigator.serial.getPorts();

        var port = detail.portObject;

        if (!port || !this.connectedPorts.includes(port)) {
          var index = this.friendlyNames.indexOf(detail.port);

          port = index >= 0 ? this.connectedPorts[index] : null;
        }

        if (!port || !this.connectedPorts.includes(port)) {
          throw new Error(
            "Authorized serial port unavailable; reconnect device",
          );
        }

        await this._releaseDetailStreams(detail);

        if (this._shuttingDown) return;

        if (port.readable || port.writable) {
          await port.close();
        }

        await this._delay(200);

        if (this._shuttingDown) return;

        await port.open({
          baudRate: 115200,
          dataBits: 8,
          stopBits: 1,
          parity: "none",
        });

        if (!port.readable || !port.writable) {
          throw new Error("Serial streams unavailable after reopening");
        }

        detail.portObject = port;

        detail.reader = port.readable.getReader();
        detail.writer = port.writable.getWriter();

        detail.generation++;

        detail.state = "connected";
        detail.readyForRuntime = false;

        detail.rxBuffer = new Uint8Array(0);
        detail.waiters = [];

        detail.flushing = true;
        detail.flushLastByteAt = Date.now();

        this._startReader(detail);

        await this._purgeReceiveStream(
          detail,
          this._recoveryQuietMs,
          this._recoveryMaxWaitMs,
        );

        if (this._shuttingDown || detail.state !== "connected") {
          throw new Error("Port unavailable after receive purge");
        }

        await this._writeConfigurationForPort(detail);

        if (this._shuttingDown || detail.state !== "connected") {
          throw new Error("Port unavailable while restoring configuration");
        }

        detail.readyForRuntime = true;

        detail.reconnectAttempts = 0;
        detail.counters.reconnectSuccesses++;

        console.info("[UYAMAK] Serial port recovered:", detail.port);

        return;
      } catch (error) {
        if (this._shuttingDown) return;

        detail.lastError = String(error && (error.message || error));

        detail.state = "error";
        detail.readyForRuntime = false;
        detail.flushing = true;

        detail.rxBuffer = new Uint8Array(0);

        detail.counters.reconnectAttempts++;

        await this._releaseDetailStreams(detail);

        var failedPort = detail.portObject;

        if (failedPort) {
          try {
            if (failedPort.readable || failedPort.writable) {
              await failedPort.close();
            }
          } catch (closeError) {
            console.warn("[UYAMAK] Could not close failed port:", closeError);
          }
        }

        console.warn(
          "[UYAMAK] Retrying serial connection:",
          detail.port,
          detail.lastError,
        );

        await this._delay(delay);

        delay = Math.min(delay * 2, this._reconnectMaxDelayMs);
      }
    }
  }

  // ==========================================================
  // 10. CONTINUOUS SERIAL READER
  // ==========================================================

  _startReader(detail) {
    var reader = detail.reader;
    var generation = detail.generation;

    detail.readerTask = async function () {
      try {
        while (detail.reader === reader && detail.generation === generation) {
          var result = await reader.read();

          if (result.done) break;

          if (!result.value || !result.value.length) {
            continue;
          }

          detail.counters.bytesReceived += result.value.length;

          if (detail.flushing) {
            detail.flushLastByteAt = Date.now();

            detail.counters.purgedBytes += result.value.length;

            continue;
          }

          if (
            detail.rxBuffer.length + result.value.length >
            this._maxReceiveBytes
          ) {
            throw new Error("Serial receive buffer limit exceeded");
          }

          detail.rxBuffer = GskSerialConcatBytes(detail.rxBuffer, result.value);

          this._extractFrames(detail);
        }
      } catch (error) {
        if (detail.generation === generation && !this._shuttingDown) {
          detail.counters.readerErrors++;

          detail.lastError = String(error && (error.message || error));

          console.error("[UYAMAK] Serial reader stopped:", detail.port, error);

          this._stopPort(detail, error, true);
        }
      } finally {
        if (
          detail.reader === reader &&
          detail.generation === generation &&
          detail.state === "connected" &&
          !this._shuttingDown
        ) {
          this._stopPort(
            detail,
            new Error("Serial reader ended: " + detail.port),
            true,
          );
        }
      }
    }.call(this);
  }

  // ==========================================================
  // 11. CBOR FRAME EXTRACTION
  // ==========================================================

  _extractFrames(detail) {
    while (detail.rxBuffer.length > 0) {
      var length;

      try {
        length = GskSerialGetCborLength(detail.rxBuffer, 0, 0);
      } catch (error) {
        detail.counters.malformedFrames++;

        detail.lastError = error.message;

        detail.lastBadHex = GskSerialHex(detail.rxBuffer);

        console.error("[UYAMAK] Invalid bytes on CBOR UART.", {
          port: detail.port,
          error: error.message,
          bytes: detail.lastBadHex,
        });

        throw error;
      }

      if (length === null) return;

      var frame = detail.rxBuffer.slice(0, length);

      detail.rxBuffer = detail.rxBuffer.slice(length);

      detail.counters.framesReceived++;

      var decoded;

      try {
        decoded = cbor.decode(frame);
      } catch (error) {
        detail.counters.decodeErrors++;

        throw new Error("CBOR decode failed: " + error.message);
      }

      var waiter = detail.waiters[0];

      if (!waiter) {
        detail.counters.unsolicitedFrames++;

        detail.lastUnexpected = decoded;
        detail.lastUnexpectedHex = GskSerialHex(frame);

        continue;
      }

      var accepted = false;

      try {
        accepted = waiter.accept(decoded);
      } catch (error) {
        detail.lastError = "Response validator failed: " + error.message;
      }

      if (!accepted) {
        detail.counters.unexpectedFrames++;

        detail.lastUnexpected = decoded;
        detail.lastUnexpectedHex = GskSerialHex(frame);

        continue;
      }

      detail.waiters.shift();

      clearTimeout(waiter.timeoutId);

      waiter.resolve(decoded);
    }
  }

  // ==========================================================
  // 12. RESPONSE WAITING
  // ==========================================================

  _nextResponse(detail, timeoutMs, accept, label) {
    if (detail.state !== "connected") {
      return Promise.reject(new Error("Port not ready: " + detail.port));
    }

    return new Promise(function (resolve, reject) {
      var waiter = {
        resolve: resolve,
        reject: reject,
        accept: accept,
        timeoutId: null,
      };

      waiter.timeoutId = setTimeout(function () {
        var index = detail.waiters.indexOf(waiter);

        if (index >= 0) {
          detail.waiters.splice(index, 1);
        }

        detail.counters.timeouts++;

        reject(
          new Error(
            "Timeout waiting for " +
              label +
              " on " +
              detail.port +
              "; last unexpected value=" +
              JSON.stringify(detail.lastUnexpected) +
              "; bytes=" +
              (detail.lastUnexpectedHex || detail.lastBadHex || "none"),
          ),
        );
      }, timeoutMs);

      detail.waiters.push(waiter);
    });
  }

  // ==========================================================
  // 13. SERIAL EXCHANGE
  // ==========================================================

  async _exchange(detail, payload, timeoutMs, accept, label) {
    var run = async function () {
      if (
        detail.state !== "connected" ||
        !detail.writer ||
        !detail.reader ||
        detail.flushing
      ) {
        throw new Error("Port unavailable: " + detail.port);
      }

      var generation = detail.generation;

      var responsePromise = this._nextResponse(
        detail,
        timeoutMs,
        accept,
        label,
      );

      try {
        await detail.writer.write(payload);
      } catch (error) {
        responsePromise.catch(function () {});

        this._stopPort(detail, error, true);

        throw error;
      }

      try {
        var response = await responsePromise;

        if (generation !== detail.generation || detail.state !== "connected") {
          throw new Error("Stale serial response: " + detail.port);
        }

        return response;
      } catch (error) {
        if (detail.state === "connected") {
          this._stopPort(detail, error, true);
        }

        throw error;
      }
    }.bind(this);

    var current = detail.exchangeTail.then(run, run);

    detail.exchangeTail = current.then(
      function () {},
      function () {},
    );

    return current;
  }

  // ==========================================================
  // 14. PREPARE READERS AND WRITERS
  // ==========================================================

  async prepareReadersAndWriters() {
    for (var detail of this.pinDetails) {
      var port = this.getAPort(detail.port);

      if (!port) {
        throw new Error("Port not found: " + detail.port);
      }

      if (detail.reader && detail.writer && detail.state === "connected") {
        continue;
      }

      if (detail.reader || detail.writer) {
        detail.state = "error";
        detail.generation++;

        await this._releaseDetailStreams(detail);
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
        throw new Error("Port streams unavailable: " + detail.port);
      }

      detail.portObject = port;

      detail.reader = port.readable.getReader();
      detail.writer = port.writable.getWriter();

      detail.state = "connected";
      detail.readyForRuntime = false;

      detail.generation++;

      detail.flushing = true;
      detail.flushLastByteAt = Date.now();

      detail.rxBuffer = new Uint8Array(0);
      detail.waiters = [];

      this._startReader(detail);

      await this._flushStartupData(detail);
    }
  }

  // ==========================================================
  // 15. OPEN REQUIRED PORTS
  // ==========================================================

  async openRequiredPorts() {
    await this.setConnectedPorts();

    for (var detail of this.pinDetails) {
      await this.openAPort(detail.port);

      detail.portObject = this.getAPort(detail.port);
    }
  }

  // ==========================================================
  // 16. CLEAR BUFFERS
  // ==========================================================

  async clearBuffers() {
    for (var detail of this.pinDetails) {
      if (detail.state !== "connected" || !detail.reader) {
        continue;
      }

      await this._purgeReceiveStream(
        detail,
        this._startupQuietMs,
        this._startupMaxWaitMs,
      );

      detail.lastUnexpected = undefined;
      detail.lastUnexpectedHex = undefined;
      detail.lastBadHex = undefined;
    }
  }

  // ==========================================================
  // 17. CONFIGURATION
  // ==========================================================

  async _writeConfigurationForPort(detail) {
    var config = detail.config.map(function (item) {
      var copy = {};

      Object.keys(item).forEach(function (key) {
        if (key !== "sendValue" && key !== "recValue") {
          copy[key] = item[key];
        }
      });

      return copy;
    });

    await this._exchange(
      detail,
      cbor.encode(config),
      this._configurationTimeoutMs,
      function () {
        return true;
      },
      "configuration response",
    );
  }

  async writeAllConfiguration() {
    for (var detail of this.pinDetails) {
      await this._writeConfigurationForPort(detail);

      detail.readyForRuntime = true;
    }
  }

  // ==========================================================
  // 18. INITIALIZE HARDWARE
  // ==========================================================

  async initHardwareForSimulation() {
    this._shuttingDown = false;

    try {
      await this.openRequiredPorts();

      await this.prepareReadersAndWriters();

      await this.clearBuffers();

      await this.writeAllConfiguration();

      return {
        isError: false,
      };
    } catch (error) {
      for (var detail of this.pinDetails) {
        if (detail.state === "connected") {
          this._stopPort(detail, error, true);
        }
      }

      return {
        isError: true,
        message: error,
        cid: this.cellsWithHardware.length
          ? this.cellsWithHardware[0].cid
          : null,
      };
    }
  }

  // ==========================================================
  // 19. FIND CELLS WITH HARDWARE
  // ==========================================================

  findCellsWithHardware(cells) {
    this.cellsWithHardware = (cells || []).filter(function (cell) {
      return cell && cell.isSerial;
    });
  }

  // ==========================================================
  // 20. INITIALIZE UPDATED CELLS
  // ==========================================================

  initializeHardwareForUpdatedCells(cells) {
    this.findCellsWithHardware(cells);

    this.pinDetails = [];

    this.lastPWMChannel = 0;
    this.missedReads = 0;
    this._runtimeBusy = false;
    this._shuttingDown = false;

    this.cellsWithHardware.forEach(
      function (cell) {
        var pinConfig = this.getPinConfig(cell);

        if (!pinConfig) {
          console.warn("[UYAMAK] Unsupported hardware cell:", cell.id);
          return;
        }

        cell.portDetails = pinConfig;

        var name = cell.Parameters.port.Value[0][0];

        var detail = this.pinDetails.find(function (item) {
          return item.port === name;
        });

        if (!detail) {
          detail = {
            port: name,
            config: [],

            state: "closed",
            readyForRuntime: false,

            portObject: null,
            reader: null,
            writer: null,
            readerTask: null,

            generation: 0,

            rxBuffer: new Uint8Array(0),
            waiters: [],

            exchangeTail: Promise.resolve(),

            flushing: false,
            flushLastByteAt: 0,

            reconnectTask: null,
            reconnectAttempts: 0,

            lastUnexpected: undefined,
            lastUnexpectedHex: undefined,
            lastBadHex: undefined,

            lastError: null,

            counters: {
              bytesReceived: 0,
              framesReceived: 0,

              unsolicitedFrames: 0,
              unexpectedFrames: 0,

              malformedFrames: 0,
              timeouts: 0,
              decodeErrors: 0,
              readerErrors: 0,

              responseShapeErrors: 0,
              nullResponses: 0,

              reconnectAttempts: 0,
              reconnectSuccesses: 0,

              purgedBytes: 0,
              purgeOperations: 0,
            },
          };

          this.pinDetails.push(detail);
        }

        detail.config.push(pinConfig);
      }.bind(this),
    );

    var order = ["DO", "PM", "DI", "AI", "EN"];

    this.pinDetails.forEach(function (detail) {
      detail.config.sort(function (a, b) {
        return order.indexOf(a.type) - order.indexOf(b.type);
      });
    });
  }

  // ==========================================================
  // 21. HARDWARE PIN CONFIGURATION
  // ==========================================================

  getPinConfig(cell) {
    try {
      var pin;
      var pins;

      try {
        pin = parseInt(cell.Parameters.pin.Value[0][0], 10);
      } catch (error) {}

      try {
        pins = [
          parseInt(cell.Parameters.pin_A.Value[0][0], 10),

          parseInt(cell.Parameters.pin_B.Value[0][0], 10),
        ];
      } catch (error) {}

      switch (cell.id) {
        case "umk_1774369913335":
          return {
            type: "DI",
            pin: pin,
            sendValue: 0,
          };

        case "umk_1774706876440": {
          var initialDO = math.matrix(cell.Parameters.ic.Value).get([0, 0]);

          return {
            type: "DO",
            pin: pin,
            initVal: initialDO,
            sendValue: initialDO,
          };
        }

        case "umk_1774714186082":
          return {
            type: "AI",
            pin: pin,
            sendValue: 0,
          };

        case "umk_1774714197073": {
          var initialPWM = math.matrix(cell.Parameters.ic.Value).get([0, 0]);

          return {
            type: "PM",
            pin: pin,

            initVal: initialPWM,

            freq: math.matrix(cell.Parameters.freq.Value).get([0, 0]),

            res: math.matrix(cell.Parameters.res.Value).get([0, 0]),

            ch: this.lastPWMChannel++,

            sendValue: initialPWM,
          };
        }

        case "umk_1774714206020":
          return {
            type: "EN",
            pins: pins,
            sendValue: 0,
          };

        default:
          return null;
      }
    } catch (error) {
      console.warn("[UYAMAK] Could not create pin configuration:", error);

      return null;
    }
  }

  // ==========================================================
  // 22. RUNTIME READ / WRITE
  // ==========================================================

  async applyReadWrite() {
    if (this._runtimeBusy) {
      this.missedReads++;

      return;
    }

    this._runtimeBusy = true;

    try {
      for (var detail of this.pinDetails) {
        try {
          if (
            detail.state !== "connected" ||
            !detail.readyForRuntime ||
            !detail.writer ||
            !detail.reader
          ) {
            this.missedReads++;

            continue;
          }

          var values = detail.config.map(function (item) {
            return item.sendValue;
          });

          var response = await this._exchange(
            detail,

            cbor.encode(values),

            this._responseTimeoutMs,

            function (decoded) {
              // A CBOR null (F6) is treated as an empty
              // hardware sample, not as a connection failure.
              if (decoded === null) {
                return true;
              }

              return (
                Array.isArray(decoded) &&
                decoded.length === detail.config.length
              );
            },

            "runtime array response (" + detail.config.length + " values)",
          );

          // A null response means no new sample is available.
          // Preserve the previous values instead of replacing
          // them with null or zero.
          if (response === null) {
            detail.counters.nullResponses++;

            continue;
          }

          // Update only when a complete valid array is received.
          detail.config.forEach(function (config, index) {
            config.recValue = response[index];
          });
        } catch (error) {
          this.missedReads++;

          detail.counters.responseShapeErrors++;

          console.error(
            "[UYAMAK] Hardware exchange failed for " + detail.port,
            error,
          );

          if (detail.state === "connected") {
            this._stopPort(detail, error, true);
          }
        }
      }
    } finally {
      this._runtimeBusy = false;
    }
  }

  // ==========================================================
  // 23. RELEASE READERS AND WRITERS
  // ==========================================================

  async releaseAllWritersNReaders() {
    this._shuttingDown = true;

    for (var detail of this.pinDetails) {
      this._stopPort(detail, new Error("Serial streams released"), false);

      detail.generation++;

      detail.readyForRuntime = false;

      await this._releaseDetailStreams(detail);

      detail.state = "closed";

      detail.flushing = false;

      detail.rxBuffer = new Uint8Array(0);
    }
  }

  // ==========================================================
  // 24. CLOSE REQUIRED PORTS
  // ==========================================================

  async closeRequiredPorts() {
    await this.releaseAllWritersNReaders();

    for (var detail of this.pinDetails) {
      var port = detail.portObject;

      if (!port) continue;

      try {
        if (port.readable || port.writable) {
          await port.close();
        }
      } catch (error) {
        console.warn("[UYAMAK] Could not close " + detail.port, error);
      }
    }
  }

  async closeAPort(name) {
    var port = this.getAPort(name);

    if (!port) {
      throw new Error("Port not found: " + name);
    }

    await port.close();
  }

  // ==========================================================
  // 25. DIAGNOSTICS
  // ==========================================================

  getMissedReads() {
    return this.missedReads;
  }

  getDiagnostics() {
    return {
      missedReads: this.missedReads,

      runtimeBusy: this._runtimeBusy,

      ports: this.pinDetails.map(function (detail) {
        return {
          port: detail.port,

          state: detail.state,

          readyForRuntime: !!detail.readyForRuntime,

          reconnecting: !!detail.reconnectTask,

          flushing: !!detail.flushing,

          counters: Object.assign({}, detail.counters),

          bufferedBytes: detail.rxBuffer.length,

          lastUnexpected: detail.lastUnexpected,

          lastUnexpectedHex: detail.lastUnexpectedHex,

          lastBadHex: detail.lastBadHex,

          lastError: detail.lastError,
        };
      }),
    };
  }
}

// ============================================================
// 26. GLOBAL INSTANCE
// ============================================================

const gskSerialPort = new GskSerialPort();
