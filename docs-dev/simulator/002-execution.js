const exec = {
  cells: [],
  simSettings: {
    hs: 5,
    h: 5000,
    T: 5,
    realtime: true,
    steps: 1,
    sOEvery: 1,
    pckSize: 2000
  },
  t: 0, //Current simulation time
  s4Out: 0, //Steps for out
  prevT: 0, // time in milliseconds
  isCont: true, // Is it set to run continously?
  inPrg: false, // Is simulation in progress? 
  rSteps: 0, // Number of steps remaining to run
  results: [], // results are stored temporarily here
  setSimSettings: function (settings) {
    this.simSettings.hs = settings.h / 1000;
    this.simSettings.h = settings.h;
    this.simSettings.T = (settings.T < 0) ? Infinity : settings.T;
    this.simSettings.realtime = settings.realtime;
    this.simSettings.steps = settings.steps;
    this.simSettings.sOEvery = settings.sOEvery - 1;
    this.pckSize = settings.mHis * settings.sOEvery;
    //console.log(this.pckSize);
    this.s4Out = this.simSettings.sOEvery;
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
    //console.log(index);
  },
  simulate: function () {
    let model;
    let store = false;
    let tempOut = {};
    try {
      if (this.s4Out++ >= this.simSettings.sOEvery) {
        store = true;
        this.s4Out = 0;
      }
      //console.log(this.cells.length);
      for (let i = 0; i < this.cells.length; i++) {
        model = this.cells[i];
        //console.log(model.cid);
        for (let j = 0; j < model.TerminalsIn.value; j++) {
          //console.log(model.sIndexes);
          model.inputs[j] = this.cells[model.sIndexes[j].cell].outputs[model.sIndexes[j].index];
        }
        //console.log(model.cid);
        model.Evaluate(this.t);
        //console.log(this.t);
        if (model.isOut && store) {
          tempOut[model.cid] = model.inputs[0].toString();
        }
      }
      //console.log(store);
      //console.log(model.id);
      //console.log(model.isOut);
      if (store) {
        this.results.push({
          t: this.t,
          o: tempOut
        });
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
      throw ("Error in simulation");
    } /**/
    this.t += this.simSettings.hs;
    //console.log(this.t);
  },
  Init: function () {
    this.cells.forEach(function (model) {
      model.Init();
      //console.log(model.id);
      //console.log(model.isOut);
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
    let w = 1; //wait time in milli seconds;
    if (!N) {
      if (this.t === 0) {
        N = 1;
        w = 1;
      } else {
        if (this.simSettings.realtime) {
          let maxStepsPerSecond = 1 / this.simSettings.hs;
          N = Math.max(0, Math.min(maxStepsPerSecond, this.rSteps));
          w = this.simSettings.h;
        } else {
          N = Math.min(this.simSettings.pckSize, this.rSteps);
          w = 1000 / N;
        }
      }
    } else {
      N = Math.min(N, this.rSteps);
      w = this.simSettings.h;
    }
    //console.log("N: " + N);
    for (let i = 0; i < N; i++) {
      //if (this.simSettings.realtime) {
      while ((performance.now() - this.prevT) < w) {}
      this.prevT = performance.now();
      //console.log(this.prevT);
      //}
      this.simulate();
      this.rSteps--;
    }
    //console.log(this.results.length);
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