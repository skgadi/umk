importScripts("augmented-json-serialization-functions.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.0.4/math.min.js");

var ExecutingModels = [];
var recEM;
var T_E=0;
var t=0;
var Ts = 0.001
var aTs = 0.01;
var secondsToRun = -1;
var displayOut =[];
var simulationLoop;
var minTs = 5;
var showOuts = false;
var sRealtime = false;
self.onmessage = function (m) {
  if (!!m.data.am) {
    Object.keys(m.data.am).forEach(function (key) {
      eval("self." + m.data.am[key].cs);
      for(var i=0;i<m.data.am[key].ps.length;i++) {
        eval ("self." + m.data.am[key].ps[i]);
      }
    });
  }
  if (!!m.data.em) {
    recEM = m.data.em;
    for (var i=0; i<m.data.em.length; i++) {
      eval ("var tempModel = new umk_"+m.data.em[i].m.bid+"(m.data.em[i].m)");
      for (let param in tempModel.Parameters) {
        //console.log(tempModel.Parameters[param].Value);
        tempModel.Parameters[param].Value = math.evaluate(
          math.matrix(
            tempModel.Parameters[param].Value
            ).toString()
            ).toArray();
        //console.log(tempModel.Parameters[param].Value);
      }
      tempModel.Init();
      ExecutingModels.push(tempModel);
    }
    prepareVariableLinks();
  }
  if (!!m.data.sParams) {
    if (!!m.data.sParams.Ts) Ts = m.data.sParams.Ts;
    if (!!m.data.sParams.T_E) T_E = m.data.sParams.T_E;
    if (!!m.data.sParams.N) N = m.data.sParams.N;
    if (!!m.data.sParams.showOuts) showOuts = m.data.sParams.showOuts;
    if (!!m.data.sParams.sRealtime) ticker.changeInterval(Ts*1000); else ticker.changeInterval(minTs);
  }
  if (!!m.data.state) {
    if (m.data.state === "Run") runSimulationLoop();
    if (m.data.state === "Pause") pauseSimulationLoop();
  }
}

function prepareVariableLinks () {
  //sets some array if nothing exists for inputs and outputs
  ExecutingModels.forEach(function (model) {
    model.inputs = new Array(model.TerminalsIn.value);
    model.outputs = new Array(model.TerminalsOut.value||1);
    displayOut.push(model.outputs);
  });
  //prepare inputs
  for (var i=0; i<recEM.length;i++) {
    for (var j=0; j<recEM[i].s.length; j++) {
      ExecutingModels[i].inputs[j] = ExecutingModels[recEM[i].s[j][0]].outputs[recEM[i].s[j][1]];
    }
  }
}

var simulating = false;
var prevT = 0;
function simulate () {
  if (t <= T_E){
    if (!simulating) {
      simulating = true;
      for (var i=0; i<recEM.length;i++) {
        for (var j=0; j<recEM[i].s.length; j++) {
          //throw ExecutingModels[recEM[i].s[j][0]].outputs[recEM[i].s[j][1]];
          ExecutingModels[i].inputs[j] = ExecutingModels[recEM[i].s[j][0]].outputs[recEM[i].s[j][1]];
          //console.log(ExecutingModels[i].inputs[j]);
        }
        ExecutingModels[i].Evaluate();
        //console.log(ExecutingModels[i].outputs[0]);
      }
      
      if (prevT === 0) aTs = NaN;
      var presT = Date.now();
      aTs = presT - prevT;
      prevT = presT;
      postMessage({"out":displayOut, "t": t, "aTs": aTs});
      t += Ts;
      simulating = false;
    }
  } else {
    pauseSimulationLoop();
  }
}

var ticker = new umkSimulationLoop(simulate, minTs);
function runSimulationLoop() {
  ticker.start();
  postMessage({"status": "running"}); //simulation is running
}

function pauseSimulationLoop() {
  ticker.pause();
  postMessage({"status": "paused"}); //simulation paused
}

/**
 * Designed by Suresh Kumar Gadi
 */
function umkSimulationLoop (simFunc, interval) {
  this.timerHandler = setInterval(simFunc, this.interval);
  var that = this;
  this.simFunc = simFunc;
  this.interval = interval;
  this.isRunning = true;
  this.start = function () {
    clearInterval(this.timerHandler);
    this.timerHandler = setInterval(this.simFunc, this.interval);
  }
  this.changeInterval = function (newInterval) {
    clearInterval(this.timerHandler);
    this.interval = newInterval;
    if (this.isRunning) this.start();
  }
  this.pause = function () {
    clearInterval(this.timerHandler);
    this.isRunning = false;
  }
}



/**
 * Self-adjusting interval to account for drifting
 * 
 * @param {function} workFunc  Callback containing the work to be done
 *                             for each interval
 * @param {int}      interval  Interval speed (in milliseconds) - This 
 * @param {function} errorFunc (Optional) Callback to run if the drift
 *                             exceeds interval
 */
function AdjustingInterval(workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
    }

    function step() {
        var drift = Date.now() - expected;
        if (drift > that.interval) {
            // You could have some default stuff here too...
            if (errorFunc) errorFunc();
        }
        workFunc();
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
}


