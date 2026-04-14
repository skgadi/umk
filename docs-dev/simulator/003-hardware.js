class GskSerialPort {
  constructor() {
    this.friendlyNames = [];
    this.connectedPorts = [];
    this.cellsWithHardware = [];
    this.pinDetails = [];
    this.lastPWMChannel = 0; // To keep track of the last assigned PWM channel
  }

  setValuesFromACell(inCell, value) {
    inCell.portDetails.sendValue = value;
  }

  getValuesForACell(inCell) {
    return inCell.portDetails.recValue;
  }


async clearBuffers() {
  // Create an array of promises, one for each port
  const clearPromises = this.pinDetails.map(async (portDetail) => {
    try {
      // 1. Trigger write
      portDetail.writer.write(new Uint8Array([0]));

      let nullCount = 0;
      while (nullCount < 5) {
        const result = await this.readWithTimeout(portDetail.reader, 100);
        if (result === null) {
          nullCount++;
        } else {
          nullCount = 0; 
        }
      }
      //console.log(`Finished clearing buffer for port ${portDetail.port}`);
    } catch (error) {
      console.error(`Error clearing buffers for port ${portDetail.port}:`, error);
    }
  });

  // Execute all clear operations in parallel and wait for all to finish
  await Promise.all(clearPromises);
}
  
  async readWithTimeout(reader, timeoutMs) {
    let timeoutId;

    // 1. Create a promise that rejects after the timeout
    const timeoutPromise = new Promise((resolve) => {
      timeoutId = setTimeout(() => resolve(null), timeoutMs);
    });

    try {
      // 2. Race the reader against the timeout
      const result = await Promise.race([reader.read(), timeoutPromise]);

      // 3. Check if we got a result object or the null from timeout
      if (result && !result.done) {
        return result.value; 
      }
      
      return null; // Returns null if timeout reached or stream is done
    } catch (error) {
      return null; // Returns null if an actual read error occurs
    } finally {
      clearTimeout(timeoutId);
    }
  }



  async applyReadWrite(){
    //console.log(JSON.stringify(this.pinDetails));
    for (const pinDetailsPerPort of this.pinDetails) {
      try {
        const sendValue = pinDetailsPerPort.config.map(config => config.sendValue);
        const binToSend = cbor.encode(sendValue);
        //console.log("Binary to send for port " + pinDetailsPerPort.port + ": ", binToSend.toHex());
        await pinDetailsPerPort.writer.write(binToSend);
        const value = await this.readWithTimeout(pinDetailsPerPort.reader, 1000); // Attempt to read with a timeout to avoid hanging
        //console.log("Received value from port " + pinDetailsPerPort.port + ": ", value.toHex());
        const decodedValue = cbor.decode(value); // error may occur here if value is null or not properly formatted, which is why we have the try-catch
        // Assuming the decoded value is an array of values corresponding to the config order
        if (decodedValue) {
          //console.log("Decoded value for port " + pinDetailsPerPort.port + ": ", decodedValue);
          pinDetailsPerPort.config.forEach((config, index) => {
            config.recValue = decodedValue[index];
          });
        }        
      } catch (error) {
        //console.log(`Error applying read/write for cell with port ${pinDetailsPerPort.port}:`, error);
      }
    }
  }

  preparePinDetails() {
    // Resetting the PWM channel count before preparing pin details to ensure correct channel assignment on each preparation
    this.lastPWMChannel = 0;
    this.cellsWithHardware.forEach(cell => {
      //console.log(`Preparing pin details for cell ${cell.id} with port ${cell.Parameters.port.Value[0][0]}`);
      const thisPinConfig = this.getPinConfig(cell);
      //console.log(`Pin config for cell ${cell.id}:`, thisPinConfig);
      cell.portDetails = thisPinConfig; // Store the port details reference in the cell for later use
      //console.log(`Port details for cell ${cell.id} after assignment:`, cell.portDetails);
      // If port doesn't exist add a new entry
      const existingPort = this.findOrCreatePortFromPinDetails(cell.Parameters.port.Value[0][0]);
      // If the pin config is already not in the config array, add it
      if (thisPinConfig && !existingPort.config.some(config => JSON.stringify(config) === JSON.stringify(thisPinConfig))) {
        existingPort.config.push(thisPinConfig);
      }
      //console.log(`Updated pin details for port ${existingPort.port}:`, existingPort.config);
    });
    //console.log("Pin details before sorting:", JSON.stringify(this.pinDetails));

    // sort such that the order is DO, PM, DI, AI, EN
    this.pinDetails.forEach(portDetail => {
      portDetail.config = portDetail.config.sort((a, b) => {
        const order = ["DO", "PM", "DI", "AI", "EN"];
        return order.indexOf(a.type) - order.indexOf(b.type);
      });
      //console.log ("from preparePinDetails: " + JSON.stringify(portDetail));
    });

  }

  findOrCreatePortFromPinDetails(port) {
      const portDetail = this.pinDetails.find(detail => detail.port === port);
      if (portDetail) {
        return portDetail;
      }
      this.pinDetails.push({
        port: port,
        config: []
      });
      return this.pinDetails[this.pinDetails.length - 1];
  }

  getPinConfig(cell) {
    try {
      let pin;
      let pins;
      try {
        pin = parseInt(cell.Parameters.pin.Value[0][0]);
      } catch (error) {
        //console.error(`Error parsing pin for cell ${cell.id}:`, error);
      }
      try {
        pins = [parseInt(cell.Parameters.pin_A.Value[0][0]), parseInt(cell.Parameters.pin_B.Value[0][0])];
      } catch (error) {
        //console.error(`Error parsing pins for cell ${cell.id}:`, error);
      }
      console.log(`Getting pin config for cell ${cell.id} with type ${cell.constructor.name}, pin: ${pin}, pins: ${pins}`);

      switch (cell.id) {
        case "umk_1774369913335":
          return {type:"DI", pin, sendValue:0};
        case "umk_1774706876440":
          return {type:"DO", pin, initVal: math.matrix(cell.Parameters.ic.Value).get([0,0]), sendValue: math.matrix(cell.Parameters.ic.Value).get([0,0])};
        case "umk_1774714186082":
          return {type:"AI", pin, sendValue:0};
        case "umk_1774714197073":
          return {
            type:"PM",
            pin,
            initVal: math.matrix(cell.Parameters.ic.Value).get([0,0]),
            freq: math.matrix(cell.Parameters.freq.Value).get([0,0]),
            res: math.matrix(cell.Parameters.res.Value).get([0,0]),
            ch: this.lastPWMChannel++,
            sendValue: math.matrix(cell.Parameters.ic.Value).get([0,0])
          };
        case "umk_1774714206020":
          return {type:"EN", pins, sendValue:0};
        default:
          return null;     
      }
    } catch (error) {
      console.error(`Error getting pin config for cell ${cell.id}:`, error);
      return null;
    }
  }

  prepareReadersAndWriters () {
    this.pinDetails.forEach(portDetail => {
      const port = this.getAPort(portDetail.port);
      if (!port) {
        console.error(`Port ${portDetail.port} not found among connected ports.`);
        return;
      }
      portDetail.writer = port.writable.getWriter();
      portDetail.reader = port.readable.getReader();
    });
  }

  async writeAllConfiguration() {
    for (const portDetail of this.pinDetails) {
      const config = portDetail.config.map(cfg => {
        const { sendValue, recValue, ...rest } = cfg;
        return rest;
      });
      console.log("Configuration to send for port " + portDetail.port + ": ", config);
      const binToSend = cbor.encode(config);
      console.log("Binary to send for port " + portDetail.port + ": ", binToSend.toHex());
      await portDetail.writer.write(binToSend);
      const readValue = await this.readWithTimeout(portDetail.reader, 1000); // Attempt to read with a timeout to avoid hanging
      console.log("Received value from port " + portDetail.port + ": ", readValue);
    }
  }

  setFriendlyNames(ports) {
    this.friendlyNames = ports;
  }
  async setConnectedPorts() {
    this.connectedPorts = await navigator.serial.getPorts();
  }
  getAPort(friendlyName) {
    const idx = this.friendlyNames.findIndex(p => p === friendlyName);
    if (idx === -1) {
      //console.log("Port not found: " + friendlyName);
      return null;
    }
    return this.connectedPorts[idx];
  }
  async openAPort(friendlyName, options={ baudRate: 115200, dataBits: 8, stopBits: 1, parity: "none" }) {
    const port = this.getAPort(friendlyName);
    if (port) {
      return await port.open(options);
    } else {
      return Promise.reject(new Error("Port not found: " + friendlyName));
    }
  }
  async releaseAllWritersNReaders() {
    for (const portDetail of this.pinDetails) {
      if (portDetail.writer) {
        await portDetail.writer.releaseLock();
        portDetail.writer = null;
      }
      if (portDetail.reader) {
        await portDetail.reader.releaseLock();
        portDetail.reader = null;
      }
    }
  }
  async closeAPort(friendlyName) {
    const port = this.getAPort(friendlyName);
    if (port) {
      return await port.close();
    } else {
      return Promise.reject(new Error("Port not found: " + friendlyName));
    }
  }
  findCellsWithHardware(cells) {
    this.cellsWithHardware = cells.filter(cell => cell.isSerial);
    //console.log("Cells with hardware:", JSON.stringify(this.cellsWithHardware.map(cell => cell.id)));
  }
  initializeHardwareForUpdatedCells(cells) {
    try {
      this.findCellsWithHardware(cells);
      this.preparePinDetails();
      //console.log("Pin details prepared:", JSON.stringify(this.pinDetails));
    } catch (error) {
      console.error("Error initializing hardware for updated cells:", error);
    }
  }
  async initHardwareForSimulation() {
    await this.openRequiredPorts();
    this.prepareReadersAndWriters();
    await this.clearBuffers();
    console.log("Initializing hardware for simulation...");
    await this.writeAllConfiguration();
  }
  async openRequiredPorts() {
    try {
      await this.setConnectedPorts();
    } catch (error) {
      console.error("Error setting connected ports:", error);
    }
    for (const portDetails of this.pinDetails) {
      try {
        await this.openAPort(portDetails.port);
      } catch (error) {
        console.error(`Error opening port ${portDetails.port}:`, error);
      }
    }
  }
  async closeRequiredPorts() {
    await this.releaseAllWritersNReaders();
    for (const portDetails of this.pinDetails) {
      try {
        await this.closeAPort(portDetails.port);
        //console.log(`Port ${portDetails.port} closed successfully.`);
      } catch (error) {
        console.error(`Error closing port ${portDetails.port}:`, error);
      }
    }
  }
}

const gskSerialPort = new GskSerialPort();