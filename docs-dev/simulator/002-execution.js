const exec = {
  cells: [],
  simSettings: {
    h: 5000,
    T: 5,
    realtime: false,
    steps: 1
  },
  setSimSettings: function (settings) {
    this.simSettings.h = settings.h;
    this.simSettings.T = settings.T;
    this.simSettings.realtime = settings.realtime;
    this.simSettings.steps = settings.steps;
  },
  setParams: function (cellVal) {
    try {
      if (!!cellVal.Parameters) {
        let params = Object.keys(cellVal.Parameters);
        for (let i = 0; i < params.length; i++) {
          if (cellVal.Parameters[params[i]].Type === "Complex" ||
            cellVal.Parameters[params[i]].Type === "real" ||
            cellVal.Parameters[params[i]].Type === "Integer") {
            cellVal.Parameters[params[i]].Value = math.evaluate(cellVal.Parameters[params[i]].Value);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
  setCells: function (vals) {
    console.log(vals);
    this.cells = vals.map((ele) => {
      eval("var tempModel = new " + ele.id + "(ele);");
      this.setParams(tempModel);
      return tempModel;
    });
  },
  prepareVariableLinks: function () {
    let ExecutingModels = this.cells;
    //sets some array if nothing exists for inputs and outputs
    ExecutingModels.forEach(function (model) {
      model.inputs = new Array(model.TerminalsIn.value);
      model.outputs = new Array(model.TerminalsOut.value || 1);
      displayOut.push(model.outputs);
    });
    //prepare inputs
    for (var i = 0; i < recEM.length; i++) {
      for (var j = 0; j < recEM[i].s.length; j++) {
        ExecutingModels[i].inputs[j] = ExecutingModels[recEM[i].s[j][0]].outputs[recEM[i].s[j][1]];
      }
    }
  },
  updCell: function (value, index) {
    eval("var tempModel = new " + value.id + "(value);");
    this.setParams(tempModel);
    this.cells[index] = tempModel;
  },
  start: function () {
    setInterval(function () {
      console.log(exec);
    }, exec.simSettings.h);
  },
  timerHandler: null,
  simFunc: null,
  isRunning: false,
  reset: function () {
    if (!!timerHandler) {
      clearInterval(this.timerHandler);
    }
    if (!!this.simFunc) {
      this.timerHandler = setInterval(this.simFunc, this.simSettings.h);
      this.isRunning = true;
    }
  },
  pause: function () {
    if (!!timerHandler) {
      clearInterval(this.timerHandler);
    }
  }
};