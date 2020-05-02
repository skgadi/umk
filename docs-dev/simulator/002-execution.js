const exec = {
  cells: [],
  simSettings: {
    hs: 5,
    h: 5000,
    T: 5,
    realtime: false,
    steps: 1
  },
  t: 0, //Current simulation time
  prevT: 0, // time in milliseconds
  isCont: true, // Is it set to run continously?
  inPrg: false, // Is simulation in progress? 
  rSteps: 0, // Number of steps remaining to run
  db: null,
  results: [], // results are stored temporarily here
  //results: null, // This handler is link to db to save the results
  setSimSettings: function (settings) {
    this.simSettings.hs = settings.h / 1000;
    this.simSettings.h = settings.h;
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
    //console.log(this.cells);
  },
  updCell: function (value, index) {
    eval("var tempModel = new " + value.id + "(value);");
    this.setParams(tempModel);
    this.cells[index] = tempModel;
  },
  simulate: function () {
    let model;
    try {
      for (let i = 0; i < this.cells.length; i++) {
        model = this.cells[i];
        for (let j = 0; j < model.TerminalsIn.value; j++) {
          //console.log(this.cells);
          model.inputs[j] = this.cells[model.sIndexes[j].cell].outputs[model.sIndexes[j].index];
        }
        model.Evaluate();
        //console.log(this.t);
        if (model.isOut) {
          this.results.push({
            t: this.t,
            b: model.cid,
            v: model.inputs[0].toString()
          });
        }
      }
    } catch (e) {
      console.log(e);
      postMessage({
        error: {
          desc: "simErr",
          log: e,
          cid: model.cid
        }
      });
      this.End();
    } /**/
    this.t += this.simSettings.hs;
  },
  Init: function () {
    this.cells.forEach(function (model) {
      model.Init();
    });
    this.inPrg = true;
    this.t = 0;
    this.prevT = performance.now();
    //console.log("Init");
    this.setRemainingSteps();
  },
  End: function () {
    this.cells.forEach(function (model) {
      model.End();
    });
    this.inPrg = false;
    //console.log(this.t);
    postMessage({
      ended: true
    });
  },
  loop: function (N = null) {
    if (!N) {
      if (this.t === 0) {
        N = 1;
      } else {
        let maxStepsPerSecond = 1 / this.simSettings.hs;
        N = Math.max(0, Math.min(maxStepsPerSecond, this.rSteps, 1000));
      }
    } else {
      N = Math.min(N, this.rSteps);
    }
    //console.log("N: " + N);
    for (let i = 0; i < N; i++) {
      if (this.simSettings.realtime) {
        while ((performance.now() - this.prevT) < this.simSettings.h) {}
        this.prevT = performance.now();
        //console.log(this.prevT);
      }
      this.simulate();
      this.rSteps--;
    }
    if (!!this.results.length) {
      postMessage({
        put: this.results
      });
      this.results = [];
    }
    if (this.rSteps <= 0) {
      this.End();
    } else {
      if (this.isCont) {
        setTimeout(() => {
          this.loop();
        });
      }
    }
  },
  setRemainingSteps: function () {
    this.rSteps = Math.ceil((this.simSettings.T - this.t) / this.simSettings.hs) + 1;
    //console.log(this.simSettings);
    //console.log(this.rSteps);
  },
  start: function () {
    if (!this.inPrg) {
      this.Init();
    }
    this.isCont = true;
    setTimeout(this.loop());
  },
  stop: function () {
    this.rSteps = 0;
  },
  pause: function () {
    this.isCont = false;
    postMessage({
      paused: true
    });
  },
  steps: function () {
    if (!this.inPrg) {
      this.Init();
    }
    this.isCont = false;
    postMessage({
      paused: true
    });
    setTimeout(this.loop(this.simSettings.steps));
    //this.loop(this.simSettings.steps);
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