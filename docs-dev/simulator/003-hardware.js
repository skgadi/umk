class GskSerialPort {
  constructor() {
    this.friendlyNames = [];
    this.connectedPorts = [];
    this.cellsWithHardware = [];
    this.pinDetails = [];
  }

  preparePinDetails() {
    this.cellsWithHardware.forEach(cell => {
      const thisPinConfig = this.getPinConfig(cell);
      // If port doesn't exist add a new entry
      const existingPort = this.findOrCreatePortFromPinDetails(cell.Parameters.port.Value[0][0]);
      // If the pin config is already not in the config array, add it
      if (thisPinConfig && !existingPort.config.some(config => JSON.stringify(config) === JSON.stringify(thisPinConfig))) {
        existingPort.config.push(thisPinConfig);
      }
    });

    // sort such that the order is DO, PM, DI, AI, EN
    this.pinDetails.forEach(portDetail => {
      portDetail.config.sort((a, b) => {
        const order = ["DO", "PM", "DI", "AI", "EN"];
        return order.indexOf(a.type) - order.indexOf(b.type);
      });
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
    switch (cell.id) {
      case "umk_1774369913335":
        return {type:"DI", pin: cell.Parameters.pin.Value[0][0]};
      case "umk_1774706876440":
        return {type:"DO", pin: cell.Parameters.pin.Value[0][0]};
      case "umk_1774714186082":
        return {type:"AI", pin: cell.Parameters.pin.Value[0][0]};
      case "umk_1774714197073":
        return {type:"PM", pin: cell.Parameters.pin.Value[0][0]};
      case "umk_1774714206020":
        return {type:"EN", pins: [cell.Parameters.pin_A.Value[0][0], cell.Parameters.pin_B.Value[0][0]]};
      default:
        return null;     
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
  }
  initializeHardwareForUpdatedCells(cells) {
    try {
      this.findCellsWithHardware(cells);
      this.preparePinDetails();
      console.log("Pin details prepared:", JSON.stringify(this.pinDetails));
    } catch (error) {
      console.error("Error initializing hardware for updated cells:", error);
    }
  }
  async openRequiredPorts() {
    try {
      await this.setConnectedPorts();
    } catch (error) {
      console.error("Error setting connected ports:", error);
    }
    for (const portName of this.pinDetails.map(detail => detail.port)) {
      try {
        await this.openAPort(portName);
        //console.log(`Port ${portName} opened successfully.`);
      } catch (error) {
        console.error(`Error opening port ${portName}:`, error);
      }
    }
  }
  async closeRequiredPorts() {
    for (const portName of this.pinDetails.map(detail => detail.port)) {
      try {
        await this.closeAPort(portName);
        //console.log(`Port ${portName} closed successfully.`);
      } catch (error) {
        console.error(`Error closing port ${portName}:`, error);
      }
    }
  }
}

const gskSerialPort = new GskSerialPort();