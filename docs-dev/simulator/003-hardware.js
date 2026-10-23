/*
 * Uyamak serial hardware access.
 *
 * - Preserves existing CBOR payloads and pin configuration.
 * - Flushes ESP32 startup/boot messages before configuration.
 * - Uses one continuous reader per port.
 * - Automatically retries connection recovery.
 * - Resends configuration after reconnection.
 * - Never blindly replays a failed runtime command.
 *
 * Requires global `cbor` and `math` libraries.
 */

function GskSerialGetCborLength(data, offset, depth) {
  offset = offset || 0;
  depth = depth || 0;

  if (depth > 32) throw new Error("CBOR nesting limit exceeded");
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

class GskSerialPort {
  constructor() {
    this.friendlyNames = [];
    this.connectedPorts = [];
    this.cellsWithHardware = [];
    this.pinDetails = [];
    this.lastPWMChannel = 0;
    this.missedReads = 0;

    this._exchangeTail = Promise.resolve();
    this._responseTimeoutMs = 250;
    this._configurationTimeoutMs = 1000;
    this._maxReceiveBytes = 256 * 1024;
    this._listenersInstalled = false;
    this._shuttingDown = false;

    this._startupQuietMs = 300;
    this._startupMaxWaitMs = 2500;
    this._reconnectInitialDelayMs = 500;
    this._reconnectMaxDelayMs = 5000;
  }

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

    if (!port) throw new Error("Port not found: " + name);

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

  _stopPort(detail, error, reconnect) {
    if (this._shuttingDown || detail.state === "closed") {
      detail.state = "closed";
      return;
    }

    var wasConnected = detail.state === "connected";

    detail.state = "error";
    detail.readyForRuntime = false;
    detail.lastError = String(error && (error.message || error));

    if (wasConnected) detail.generation++;

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
        console.warn("[Uyamak] Reconnection loop ended:", detail.port, error);
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

  async _releaseDetailStreams(detail) {
    var reader = detail.reader;
    var writer = detail.writer;

    detail.reader = null;
    detail.writer = null;

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
        writer.releaseLock();
      } catch (error) {}
    }
  }

  async _reconnectPort(detail) {
    var delay = this._reconnectInitialDelayMs;

    while (!this._shuttingDown) {
      try {
        await this._delay(delay);
        if (this._shuttingDown) return;

        // Refresh the authorized device list on every attempt.
        this.connectedPorts = await navigator.serial.getPorts();

        var port = detail.portObject;

        if (!port || !this.connectedPorts.includes(port)) {
          var index = this.friendlyNames.indexOf(detail.port);
          port = index >= 0 ? this.connectedPorts[index] : null;
        }

        if (!port || !this.connectedPorts.includes(port)) {
          throw new Error(
            "Authorized serial port unavailable; reconnect the device",
          );
        }

        await this._releaseDetailStreams(detail);

        if (!port.readable && !port.writable) {
          await port.open({
            baudRate: 115200,
            dataBits: 8,
            stopBits: 1,
            parity: "none",
          });
        }

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
        await this._flushStartupData(detail);

        if (this._shuttingDown || detail.state !== "connected") {
          throw new Error("Port became unavailable during startup flush");
        }

        // The port is not exposed to runtime ticks until configuration
        // has been sent and acknowledged.
        await this._writeConfigurationForPort(detail);

        if (this._shuttingDown || detail.state !== "connected") {
          throw new Error("Port became unavailable while restoring config");
        }

        detail.readyForRuntime = true;
        detail.reconnectAttempts = 0;
        detail.counters.reconnectSuccesses++;

        console.info("[Uyamak] Serial port recovered:", detail.port);
        return;
      } catch (error) {
        if (this._shuttingDown) return;

        detail.lastError = String(error && (error.message || error));
        detail.state = "error";
        detail.readyForRuntime = false;
        detail.counters.reconnectAttempts++;

        await this._releaseDetailStreams(detail);

        console.warn(
          "[Uyamak] Retrying serial connection:",
          detail.port,
          detail.lastError,
        );

        await this._delay(delay);
        delay = Math.min(delay * 2, this._reconnectMaxDelayMs);
      }
    }
  }

  _resetBuffer(detail) {
    detail.rxBuffer = new Uint8Array(0);
  }

  async _flushStartupData(detail) {
    var start = Date.now();

    while (!this._shuttingDown && detail.state === "connected") {
      var quietFor = Date.now() - detail.flushLastByteAt;
      var elapsed = Date.now() - start;

      if (quietFor >= this._startupQuietMs) break;
      if (elapsed >= this._startupMaxWaitMs) break;

      await this._delay(25);
    }

    if (detail.state !== "connected") {
      throw new Error("Port disconnected during startup flush");
    }

    detail.rxBuffer = new Uint8Array(0);
    detail.flushing = false;
  }

  _startReader(detail) {
    var reader = detail.reader;
    var generation = detail.generation;

    detail.readerTask = async function () {
      try {
        while (detail.reader === reader && detail.generation === generation) {
          var result = await reader.read();

          if (result.done) break;
          if (!result.value || !result.value.length) continue;

          detail.counters.bytesReceived += result.value.length;

          if (detail.flushing) {
            detail.flushLastByteAt = Date.now();
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

          console.error("[Uyamak] Serial reader stopped:", detail.port, error);

          this._stopPort(detail, error, true);
        }
      } finally {
        if (
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

  _extractFrames(detail) {
    while (detail.rxBuffer.length > 0) {
      var length;

      try {
        length = GskSerialGetCborLength(detail.rxBuffer, 0, 0);
      } catch (error) {
        detail.counters.malformedFrames++;
        detail.lastError = error.message;
        detail.lastBadHex = GskSerialHex(detail.rxBuffer);

        console.error(
          "[Uyamak] Invalid bytes on CBOR UART. Reconnecting to " +
            "resynchronize the stream.",
          {
            port: detail.port,
            error: error.message,
            bytes: detail.lastBadHex,
          },
        );

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
        if (index >= 0) detail.waiters.splice(index, 1);

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

  async _exchange(detail, payload, timeoutMs, accept, label) {
    var run = async function () {
      if (detail.state !== "connected" || !detail.writer) {
        throw new Error("Port unavailable: " + detail.port);
      }

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
        return await responsePromise;
      } catch (error) {
        // A timeout can leave the byte stream out of sync. Recover by
        // flushing/reopening instead of blindly retrying the same command.
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

      this._resetBuffer(detail);
      this._startReader(detail);
      await this._flushStartupData(detail);
    }
  }

  async openRequiredPorts() {
    await this.setConnectedPorts();

    for (var detail of this.pinDetails) {
      await this.openAPort(detail.port);
      detail.portObject = this.getAPort(detail.port);
    }
  }

  async clearBuffers() {
    // The continuous reader performs the flush. Never create a second
    // reader and never send dummy bytes to clear the stream.
    this.pinDetails.forEach(function (detail) {
      detail.lastUnexpected = undefined;
      detail.lastUnexpectedHex = undefined;
    });
  }

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

  async initHardwareForSimulation() {
    this._shuttingDown = false;

    try {
      await this.openRequiredPorts();
      await this.prepareReadersAndWriters();
      await this.clearBuffers();
      await this.writeAllConfiguration();

      return { isError: false };
    } catch (error) {
      return {
        isError: true,
        message: error,
        cid: this.cellsWithHardware.length
          ? this.cellsWithHardware[0].cid
          : null,
      };
    }
  }

  findCellsWithHardware(cells) {
    this.cellsWithHardware = (cells || []).filter(function (cell) {
      return cell.isSerial;
    });
  }

  initializeHardwareForUpdatedCells(cells) {
    this.findCellsWithHardware(cells);

    this.pinDetails = [];
    this.lastPWMChannel = 0;
    this.missedReads = 0;
    this._shuttingDown = false;

    this.cellsWithHardware.forEach(
      function (cell) {
        var pinConfig = this.getPinConfig(cell);
        if (!pinConfig) return;

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
              reconnectAttempts: 0,
              reconnectSuccesses: 0,
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
          return { type: "DI", pin: pin, sendValue: 0 };

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
          return { type: "AI", pin: pin, sendValue: 0 };

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
    var run = async function () {
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
              return (
                Array.isArray(decoded) &&
                decoded.length === detail.config.length
              );
            },
            "runtime array response (" + detail.config.length + " values)",
          );

          detail.config.forEach(function (config, index) {
            config.recValue = response[index];
          });
        } catch (error) {
          this.missedReads++;
          detail.counters.responseShapeErrors =
            (detail.counters.responseShapeErrors || 0) + 1;

          console.error("Hardware exchange failed for " + detail.port, error);

          if (detail.state === "connected") {
            this._stopPort(detail, error, true);
          }
        }
      }
    }.bind(this);

    var current = this._exchangeTail.then(run, run);

    this._exchangeTail = current.then(
      function () {},
      function () {},
    );

    return current;
  }

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
        console.warn("Could not close " + detail.port, error);
      }
    }
  }

  async closeAPort(name) {
    var port = this.getAPort(name);
    if (!port) throw new Error("Port not found: " + name);
    await port.close();
  }

  getMissedReads() {
    return this.missedReads;
  }

  getDiagnostics() {
    return {
      missedReads: this.missedReads,
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

const gskSerialPort = new GskSerialPort();
