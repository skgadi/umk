importScripts("augmented-json-serialization-functions.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.0.4/math.min.js");

var ExecutingModels = [];
var recEM;
var T_E=0;
var t=0;
var Ts = 0.001
var secondsToRun = -1;
var displayOut =[];
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
      tempModel.Init();
      ExecutingModels.push(tempModel);
    }
    prepareVariableLinks();
  }
  if (!!m.data.resetTime) t=0;
  if (typeof m.data.endAt !== "undefined") {
    if (typeof m.data.endAt !== "number") T_E=-1; else T_E= m.data.endAt;
  }

  simulate ();
  
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
function simulate () {
  if (!simulating) {
    simulating = true;
    for (var i=0; i<recEM.length;i++) {
      for (var j=0; j<recEM[i].s.length; j++) {
        //throw ExecutingModels[recEM[i].s[j][0]].outputs[recEM[i].s[j][1]];
        ExecutingModels[i].inputs[j] = ExecutingModels[recEM[i].s[j][0]].outputs[recEM[i].s[j][1]];
      }
      ExecutingModels[i].Evaluate();
    }
    t += Ts;
    simulating = false;
    postMessage({"out":displayOut});
  }
}

var simulationLoop;
var minTs;
function setSimulationLoop(timeInterval) {
  simulationLoop = setInterval (simulate, (timeInterval>=minTs ? timeInterval : minTs));
}