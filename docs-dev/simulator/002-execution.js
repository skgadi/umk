const exec = {
  cells: [],
  simSettings: {
    h: 5,
    T: 5,
    realtime: false,
    steps: 1
  },
  t: 0, //Current simulation time
  isCont: true, // Is it set to run continously?
  inPrg: false, // Is simulation in progress? 
  rSteps: 0, // Number of steps remaining to run
  setSimSettings: function (settings) {
    this.simSettings.h = settings.h/1000;
    this.simSettings.T = (settings.T < 0) ? Infinity : settings.T;
    this.simSettings.realtime = settings.realtime;
    this.simSettings.steps = settings.steps;
    if (this.inPrg) {
      this.setRemainingSteps();
    }
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
    //console.log(vals);
    this.cells = vals.map((ele) => {
      eval("var tempModel = new " + ele.id + "(ele);");
      this.setParams(tempModel);
      return tempModel;
    });
  },
  updCell: function (value, index) {
    eval("var tempModel = new " + value.id + "(value);");
    this.setParams(tempModel);
    this.cells[index] = tempModel;
  },
  simulate: function () {
    this.tempVar++;
    /*try {
      this.cells.forEach(function (model) {
        for (let i = 0; i < model.TerminalsIn.value; i++) {
          model.inputs[i] = this.cells[model.sIndexes[i].cell].outputs[model.sIndexes[i].index];
        }
        model.Evaluate();
        if (model.saveOut) {
          // do something to save the output
        }
      });

    } catch (e) {
      console.log(e);
      postMessage({
        error: {
          desc: "Simulation",
          log: e
        }
      });
    }*/
    this.t += this.simSettings.h;
  },
  Init: function () {
    this.cells.forEach(function (model) {
      model.Init();
    });
    this.inPrg = true;
  },
  End: function () {
    this.cells.forEach(function (model) {
      model.End();
    });
    this.inPrg = false;
    console.log(this.t);
  },
  loop: function (N = null) {
    if (!N) {
      let maxStepsPerSecond = 1 / this.simSettings.h;
      N = Math.max(0, Math.min(maxStepsPerSecond, this.rSteps));
    }
    for (let i = 0; i < N; i++) {
      this.simulate();
      this.rSteps--;
    }
    if (this.rSteps <= 0) {
      this.End();
    } else {
      if (this.isCont) {
        setTimeout(() => {
          this.loop();
        }, 0);
      }
    }
  },
  setRemainingSteps: function () {
    this.rSteps = Math.ceil((this.simSettings.T - this.t) / this.simSettings.h) + 1;
    console.log(this.simSettings);
    console.log(this.rSteps);
  },
  start: function () {
    if (!this.inPrg) {
      this.Init();
      this.t = 0;
      this.setRemainingSteps();
    }
    this.isCont = true;
    this.loop();
  },
  stop: function () {
    this.rSteps = 0;
  },
  pause: function () {
    this.isCont = false;
  },
  steps: function () {
    this.isCont = false;
    this.loop(this.simSettings.steps);
  }
};








/*
prepareVariableLinks: function () {
  //sets some array if nothing exists for inputs and outputs
  this.cells.forEach(function (model) {
    model.inputs = [];
    model.outputs = new Array(model.TerminalsOut.value);
    //displayOut.push(model.outputs);
  });
  //prepare inputs
  for (let i = 0; i < this.cells.length; i++) {
    for (let j = 0; j < this.cells[i].sIndexes.length; j++) {
      let sItem = this.cells[i].sIndexes[j];
      this.cells[i].inputs.push(this.cells[sItem.cell].outputs[sItem.index]);
    }
  }
  //test
  this.cells.forEach(function (model) {
    for (let i = 0; i < model.outputs.length; i++) {
      model.outputs[i] =  math.evaluate("[1+i,2;3+i,4]");
    }
  });


},
*/