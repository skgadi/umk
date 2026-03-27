class GskSerialPort {
  constructor() {
    this.friendlyNames = [];
    this.connectedPorts = [];
    this.cellsWithHardware = [];
    this.usefulPorts = [];
  }
    setFriendlyNames(ports) {
    this.friendlyNames = ports;
  }
  async setConnectedPorts() {
    this.connectedPorts = await navigator.serial.getPorts();
    //console.log("Connected ports:", this.connectedPorts);
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
  getUsefulPorts() {
    this.usefulPorts = [...new Set(this.cellsWithHardware.map(cell => cell.Parameters.port.Value[0][0]))];
  }
  initializeHardwareForUpdatedCells(cells) {
    try {
      this.findCellsWithHardware(cells);
      this.getUsefulPorts();
    } catch (error) {
      console.error("Error initializing hardware for updated cells:", error);
    }
  }
  async openRequiredPorts() {
    //console.log("Opening required ports:", this.usefulPorts);
    try {
      await this.setConnectedPorts();
    } catch (error) {
      console.error("Error setting connected ports:", error);
    }
    for (const portName of this.usefulPorts) {
      try {
        await this.openAPort(portName);
        //console.log(`Port ${portName} opened successfully.`);
      } catch (error) {
        console.error(`Error opening port ${portName}:`, error);
      }
    }
  }
  async closeRequiredPorts() {
    for (const portName of this.usefulPorts) {
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