const hardwareVue = new Vue({
  el: "#hardware",
  data: {
    display: false,
    isSerialSupported: false,
    selectedPorts: [],
    editFriendlyName: {
      idx: -1,
      val: ""
    },

  },
  mounted() {
    this.isSerialSupported = "serial" in navigator;
    // get all the connected ports
    if (this.isSerialSupported) {
      navigator.serial.getPorts().then(ports => {
        ports.forEach(port => {
          const friendlyName = this.getANameForPort('Port ' + (this.selectedPorts.length + 1));
          this.selectedPorts.push({portDetails: port, friendlyName: friendlyName});
        });
      });
    }

  },
  methods: {
    toggleDisplay() {
      this.display = !this.display;
    },
    async addANewPort() {
      try {
        const port = await navigator.serial.requestPort();
        if (port) {
          const friendlyName = this.getANameForPort('Port ' + (this.selectedPorts.length + 1));
          this.selectedPorts.push({portDetails: port, friendlyName: friendlyName});
        }
      } catch (err) {
        console.log("No port selected or permission denied", err);
      }
    },
    getANameForPort(nameSuggestion) {
      // if the suggested name is already used, add a number to it
      let name = nameSuggestion;
      let counter = 1;
      while (this.selectedPorts.some(p => p.friendlyName === name)) {
        console.log(`Name ${name} already exists, trying a new one...`);
        name = `${nameSuggestion} (${counter++})`;
      }
      return name;
    },
    editFriendlyNameByIdx(idx) {
      this.editFriendlyName.idx = idx;
      if (this.selectedPorts && this.selectedPorts[idx] && this.selectedPorts[idx].friendlyName) {
        this.editFriendlyName.val = this.selectedPorts[idx].friendlyName;
      } else {
        this.editFriendlyName.val = "";
      }
    },
    setFriendlyName(idx) {
      const textToAdd = this.editFriendlyName.val.trim();
      if ( textToAdd !== "") {
        this.selectedPorts[idx].friendlyName = this.getANameForPort(textToAdd);
      }
      this.editFriendlyName.idx = -1;
    },
    allConnectedPorts() {
      return this.selectedPorts.map(p => p.friendlyName);
    },

    pinConfigurations (cells) {
      const out =  cells.filter(cell => cell.isSerial).reduce((acc, cell) => {
        const portName = cell.Parameters.port.Value[0][0];
        const allPins = Object.keys(cell.Parameters).filter(param => param.startsWith("pin"));
        const pinCombinations = allPins.reduce((combos, pin) => {
          const pinValue = cell.Parameters[pin].Value[0][0];
          // check duplicate combinations
          if (acc.portsPinCombinations.some(c => c.port === portName && c.pin === pinValue) || combos.some(c => c.port === portName && c.pin === pinValue)) {
            acc.duplicatePinCombinations.push({port: portName, pin: pinValue, cell: cell});
          }

          combos.push({port: portName, pin: pinValue});
          return combos;
        }, []);
        acc.portsPinCombinations.push(...pinCombinations);
        return acc;
      }, {
        portsPinCombinations:[],
        duplicatePinCombinations: []
      })
      // put warning on cells with duplicate pin combinations
      out.duplicatePinCombinations.forEach(combo => {
        mainSystem.graph.setCellWarning(combo.cell, "Duplicate pin combination");
      });
      return out;
    },
    checkIfAllPortsAreConnected(cells) {
      const allConnectedPorts = hardwareVue.allConnectedPorts();
      return cells.reduce((acc, cell) => {
        if (!cell.value.isSerial){
          return acc;
        }
        if (allConnectedPorts.includes(cell.value.Parameters.port.Value[0][0])) {
          return acc;
        } else {
          mainSystem.graph.setCellWarning(cell, "Port not connected");
          acc.push(cell);
          return acc;
        }
      }, []);
    },
    checkIsReadyToSimulate(cells) {
      const cellsWithHardware = cells.filter(cell => cell.value.isSerial);
      const areAllPortsConnected = this.checkIfAllPortsAreConnected(cells);
      const anyDuplicatePinCombinations = this.pinConfigurations(cells).duplicatePinCombinations.length > 0;
      if (cellsWithHardware.length > 0 && (areAllPortsConnected.length > 0 || anyDuplicatePinCombinations)) {
        return false;
      }
      return true;
    }
  },
});
