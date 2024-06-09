const simVue = new Vue({
  el: "#sim-menu",
  data: {
    mode: "mDesign",
    disp: {
      "oneRun": true,
      "run": true,
      //"endTime": true,
      //"endTime": true,
      "stop": false,
      "pause": false,
      //"noOfSteps": true,
      "forward": true,
    },
    simSettings: {
      h: 1, //Step size
      T: 10, // Total simulation time
      realtime: false,
      steps: 1,
      sOEvery: 1,
      mHis: 1000,
      it: "fe" //Integreation type
    },
    results: {},
    lastItem: {},
    cellsWithSInfo: [],
    simWorker: null,
    exeOrder: [],
    updScreen: null,
    dispCells: [],
    dispExecOrdInProg: false
  },
  mounted: function () {
    footerVue.$set(footerVue.$data, "totalTime", this.simSettings.T);
  },
  watch: {
    simSettings: {
      deep: true,
      handler: function () {
        if (!this.simSettings.T) {
          this.simSettings.T = 10;
        }
        if (this.simSettings.h < 0) {
          this.simSettings.h = -this.simSettings.h;
        } else if (!this.simSettings.h) {
          this.simSettings.h = 100;
        }
        if (this.simSettings.steps < 0) {
          this.simSettings.steps = -this.simSettings.steps;
        } else if (!this.simSettings.steps) {
          this.simSettings.steps = 1;
        }
        if (this.simSettings.steps === Math.round(this.simSettings.steps)) {
          this.simSettings.steps = Math.round(this.simSettings.steps);
        }
        if (this.simSettings.sOEvery < 0) {
          this.simSettings.sOEvery = -this.simSettings.sOEvery;
        } else if (!this.simSettings.sOEvery) {
          this.simSettings.sOEvery = 2;
        }
        if (this.simSettings.sOEvery === Math.round(this.simSettings.sOEvery)) {
          this.simSettings.sOEvery = Math.round(this.simSettings.sOEvery);
        }
        if (this.simSettings.mHis < 0) {
          this.simSettings.mHis = -this.simSettings.mHis;
        } else if (!this.simSettings.mHis) {
          this.simSettings.mHis = 1000;
        }
        this.simSettings.mHis = Math.round(this.simSettings.mHis);
        /*if (this.simSettings.mHis === Math.round(this.simSettings.mHis)) {
          this.simSettings.mHis = Math.round(this.simSettings.mHis);
        }*/

        footerVue.$set(footerVue.$data, "totalTime", this.simSettings.T);
        if (!!this.simWorker) {
          this.informSim("simSettings");
        }
      }
    },
    mode: function () {
      footerVue.$set(footerVue.$data, "mode", this.mode);
      switch (this.mode) {
        case 'mDesign': {
          this.disp = {
            "oneRun": true,
            "run": true,
            "stop": false,
            "pause": false,
            "forward": true
          };
          editorVue.rpSettings.fEditMode = true;
          break;
        }
        case 'mSim': {
          this.disp = {
            "oneRun": false,
            "run": false,
            "stop": true,
            "pause": true,
            "forward": false
          };
          editorVue.rpSettings.fEditMode = false;
          break;
        }
        case 'mSimPause': {
          this.disp = {
            "oneRun": false,
            "run": true,
            "stop": true,
            "pause": false,
            "forward": true
          };
          editorVue.rpSettings.fEditMode = false;
          break;
        }
      }
    }
  },

  methods: {
    resStr2Math: function () {
      for (let i = 0; i < this.results.length; i++) {
        let keys = Object.keys(this.results[i].o);
        for (let j = 0; j < keys.length; j++) {
          if (this.dispCells)
            try {
              this.results[i].o[keys[j]] = math.evaluate(this.results[i].o[keys[j]]);
            } catch (e) {
              console.log(keys);
              console.log(i);
              console.log(j);
              console.log(this.results[i].o[keys[j]]);
              console.log(e);
            }
        }
      }
    },
    updateSources: function (inCells) {
      for (let i = 0; i < inCells.length; i++) {
        let sModels = this.getSourcesWithIndexes(mainSystem.graph.getModel().cells[inCells[i].cid]);
        //let Sources = [];
        let sIndexes = [];
        /*for (let j = 0; j < sModels.length; j++) {
          Sources.push(sModels[j].model.id);
        }*/
        for (let j = 0; j < sModels.length; j++) {
          sIndexes.push({
            cell: inCells.findIndex(function (ele) {
              return sModels[j].model.id === ele.cid;
            }),
            index: sModels[j].index
          });
        }
        inCells[i].sIndexes = sIndexes;
      }
      return inCells;
    },
    pCell4Exp: function (inCell) { //Prepare cell for export
      try {
        let cellVal = JSON.parse2(JSON.stringify2(inCell.value));
        cellVal.cid = inCell.id;
        eval("var tempModel = new " + cellVal.id + "(cellVal)");
        //console.log(tempModel);
        cellVal = tempModel;
        if (!!cellVal.Parameters) {
          let params = Object.keys(cellVal.Parameters);
          for (let i = 0; i < params.length; i++) {
            if (cellVal.Parameters[params[i]].Type === "Complex" ||
              cellVal.Parameters[params[i]].Type === "Real" ||
              cellVal.Parameters[params[i]].Type === "Integer") {
              cellVal.Parameters[params[i]].Value =
                varManagerVue.getVarValue(cellVal.Parameters[params[i]].Value);
            }
          }
        }
        cellVal.genCompParams();
        if (!!cellVal.Parameters) {
          let params = Object.keys(cellVal.Parameters);
          for (let i = 0; i < params.length; i++) {
            if (cellVal.Parameters[params[i]].Type === "Complex" ||
              cellVal.Parameters[params[i]].Type === "Real" ||
              cellVal.Parameters[params[i]].Type === "Integer") {
              cellVal.Parameters[params[i]].Value = cellVal.Parameters[params[i]].Value.toString();
            }
          }
        }
        if (!!cellVal.CompParams) {
          let params = Object.keys(cellVal.CompParams);
          for (let i = 0; i < params.length; i++) {
            cellVal.CompParams[params[i]] = cellVal.CompParams[params[i]].toString();
          }
        }
        //check if it ia display cell
        if (cellVal.showInpOnHtml) {
          this.dispCells.push(cellVal.cid);
        }
        return cellVal;
      } catch (e) {
        console.log(e);
        throw {
          cell: inCell,
          errM: String(e)
        };
      }
    },
    informSim: function (abt, option) {
      umk_audio.play("sim_btnPress");
      try {
        if (window.Worker) {
          let out = {};
          switch (abt) {
            case 'cells':
              try {
                this.dispCells = [];
                let tempCells = this.exeOrder.map((ele) => {
                  //console.log(ele);
                  let prepCell = this.pCell4Exp(ele)
                  if (prepCell.isPopup) {
                    popup.sendParams(prepCell);
                  }
                  return prepCell;
                });
                //console.log(tempCells);
                this.cellsWithSInfo = this.updateSources(tempCells);
                out = {
                  cells: this.cellsWithSInfo
                };
                //console.log(this.cellsWithSInfo);
              } catch (e) {
                console.log(e);
                out = {};
                throw (e);
              }
              break;
            case 'updateCell':
              try {
                let idx = this.exeOrder.findIndex(function (ele) {
                  return option === ele.id;
                })
                if (idx >= 0) {
                  let prepCell = this.pCell4Exp(this.exeOrder[idx]);
                  if (prepCell.isPopup) {
                    popup.sendParams(prepCell);
                  }
                  //console.log(prepCell);
                  prepCell.sIndexes = this.cellsWithSInfo[idx].sIndexes; //Prepared cell with updated sources
                  //console.log(prepCell);
                  out = {
                    updateCell: {
                      v: prepCell, //value
                      i: idx //index
                    }
                  }
                };
              } catch (e) {
                console.log(e);
                out = {};
                throw (e);
              }
              break;
            case 'simSettings':
              out = {
                simSettings: this.simSettings
              };
              break;
            case "oneRun":
              if (!this.simWorker) {
                this.initSim();
              }
              out = {
                oneRun: 0
              };
              this.mode = "mSim";
              break;
            case "start":
              if (!this.simWorker) {
                this.initSim();
              }
              out = {
                start: 0
              };
              this.mode = "mSim";
              break;
            case "stop":
              if (!!this.simWorker) {
                out = {
                  stop: 0
                };
              }
              this.endSim();
              break;
            case "pause":
              //this.mode = "mSimPause";
              if (!!this.simWorker) {
                out = {
                  pause: 0
                };
              }
              break;
            case "steps":
              if (!this.simWorker) {
                this.initSim();
              }
              out = {
                steps: 0
              };
              break;
            default:
              break;
          }
          if (!!Object.keys(out).length) {
            if (!!this.simWorker) {
              this.simWorker.postMessage(out);
            }
          }
        } else {
          new Noty({
            text: GUIText[settings.lang].k169,
            timeout: 5000,
            theme: "nest",
            type: 'warning'
          }).show();
        }
      } catch (e) {
        if (!!e.cell) {
          mainSystem.graph.setCellWarning(e.cell, e.errM);
          console.log(e.errM);
        }
        console.log(e);
        throw e;
      }
    },
    propOuts: function () { // propagate the outputs
      this.setAllDisplays();
      //this.resStr2Math();
      const keys = Object.keys(popup.refsForSinks);
      for (let i = 0; i < keys.length; i++) {
        setTimeout(popup.sendData(keys[i]));
      }
    },
    setAllDisplays: function () {
      //let lastItem = this.results[this.results.length - 1];
      footerVue.presTime = this.lastItem.t;
      for (let i = 0; i < this.dispCells.length; i++) {
        let cell = mainSystem.graph.getModel().getCell(this.dispCells[i]);
        const limitDecimals = parseInt(cell.value.Parameters.decPlaces.Value[0][0]);
        cell.value.Icon(TeX.prepDisp(TeX.frmStr(this.lastItem.o[this.dispCells[i]][0], limitDecimals)));
        mainSystem.graph.refresh(cell);
      }
    },
    updateResults: function () {
      const AllTheOutCells = Object.keys(popup.preparedData);
      for (let i = 0; i < AllTheOutCells.length; i++) {
        const cid = AllTheOutCells[i];
        if (!this.results[cid]) {
          this.results[cid] = [];
        }
        this.results[cid] = (this.results[cid].concat(popup.preparedData[cid])).slice(-settings.maxTotalHistory);
      }
    },
    initSim: function () {
      if (window.Worker) {
        this.exeOrder = this.getExecutionOrder().eo;
        if (this.exeOrder.length > 0) {
          if (varManagerVue.checkAllCellsParams()) {
            if (!this.simWorker) {
              this.simWorker = new Worker('simulator.min.js?date=' + Date.now());
            }
            this.simWorker.onmessage = function (event) {
              //console.log(event.data);
              if (event.data.put) {
                //console.log(event.data.put);
                //simVue.results = simVue.results.concat(event.data.put);
                popup.prepareData(event.data.put);
                simVue.lastItem = event.data.put[event.data.put.length - 1];
                simVue.updateResults();
                //console.log(simVue.lastItem);


                //simVue.results = event.data.put;
                //simVue.results = simVue.results.slice(-settings.maxTotalHistory);
                setTimeout(function () {
                  simVue.propOuts();
                });
                setTimeout(() => {
                  if (simVue.simWorker) {
                    simVue.simWorker.postMessage({
                      "recData": true
                    });
                  }
                }, settings.waitUpdGraphs);
                umk_audio.play("sim_recPacket", 0.10);
              } else if (event.data.ended) {
                simVue.endSim();
                umk_audio.play("sim_finished", 0.5);
              } else if (event.data.paused) {
                simVue.mode = "mSimPause";
              } else if (event.data.error) {
                //console.log(event.data.error.cid);
                mainSystem.graph.setCellWarning(mainSystem.graph.getModel().getCell(event.data.error.cid), "<b>" + GUIText[settings.lang][event.data.error.desc] + "</b>\n" + event.data.error.log.message);
              }
            }
            this.results = {};
            popup.resetAll();

            //set time =0
            footerVue.presTime = 0;


            this.informSim("cells");
            this.informSim("simSettings");
          } else {
            new Noty({
              text: GUIText[settings.lang].k173,
              timeout: 5000,
              theme: "nest",
              type: 'warning'
            }).show();
          }
        } else {
          new Noty({
            text: GUIText[settings.lang].k170,
            timeout: 5000,
            theme: "nest",
            type: 'warning'
          }).show();
          throw ("Nothing to execute");
        }
      } else {
        new Noty({
          text: GUIText[settings.lang].k169,
          timeout: 5000,
          theme: "nest",
          type: 'warning'
        }).show();

      }
    },
    endSim: function () {
      if (!!this.simWorker) {
        this.simWorker.terminate();
      }
      this.simWorker = null;
      this.mode = "mDesign";
    },
    displayExecutionOrder: function () {
      //console.log(this.dispExecOrdInProg);
      if (!this.dispExecOrdInProg) {
        this.dispExecOrdInProg = true;
        setTimeout(() => {
          simVue.dispExecOrdNow();
        }, 200);
      } else {
        //console.log("Unnecessary EO disp blocked");
      }
    },
    dispExecOrdNow: function () {
      this.dispExecOrdInProg = false;
      let allTheModels = this.getAllTheModels();
      this.showExecutionOrderMessage(allTheModels, "<span class='fa-stack eo_icon'><i class='fas fa-ban fa-stack-2x'></i><i class='fas fa-project-diagram fa-stack-1x'></i></span>");
      let executionOrderAndErros = this.getExecutionOrder();
      let executionOrder = executionOrderAndErros.eo;
      for (let i = 0; i < executionOrder.length; i++) {
        this.showExecutionOrderMessage([executionOrder[i]], "&#x2713;&nbsp;" + (i + 1));
      }
      this.showExecutionOrderMessage(
        executionOrderAndErros.al,
        "&times;:&nbsp;&#x21ab;",
        GUIText[settings.lang].aLoop
      );
      this.showExecutionOrderMessage(executionOrderAndErros.ne, "<i class='fas fa-times'></i>");
      this.showExecutionOrderMessage(executionOrderAndErros.pc, "<span class='fa-stack eo_icon'><i class='fas fa-ban fa-stack-2x'></i><i class='fas fa-plug fa-stack-1x'></i></span>");
      this.showExecutionOrderMessage(executionOrderAndErros.sr, "<i class='fas fa-route'></i>");
      mainSystem.refresh();
    },

    getExecutionOrder2: function () {
      let firstModels = [];
      let sourcesModels = [];
      let fInEOModels = [];
      let fInEOModelsOrdered = [];
      let allConnectedModels = this.getAllConnectedModels();
      let fullyConnectedModels = allConnectedModels.fc;
      let aLoopModels = [];

      //Obtaining first executing models
      for (let i = 0; i < fullyConnectedModels.length; i++) {
        if (fullyConnectedModels[i].value.TerminalsIn.max === 0) {
          sourcesModels.push(fullyConnectedModels[i]);
        } else if (!!fullyConnectedModels[i].value.fInEO) {
          fInEOModels.push(fullyConnectedModels[i]);
        }
      }
      firstModels = sourcesModels.slice(); //.concat(fInEOModels);
      //removing first executing models from fullyConnectedModels
      for (let i = 0; i < firstModels.length; i++) {
        fullyConnectedModels = this.arrayRemove(
          fullyConnectedModels,
          firstModels[i]
        );
      }
      let ExecutionOrder = [];
      let i = 0;
      try {
        while (fullyConnectedModels.length > 0) {
          let mSources = this.getSourcesWithIndexes(fullyConnectedModels[i]);
          let addThisToOrder = true;
          for (let j = 0; j < mSources.length; j++) {
            if ((ExecutionOrder.indexOf(mSources[j].model) < 0) &&
              (sourcesModels.indexOf(mSources[j].model) < 0) &&
              (fInEOModels.indexOf(mSources[j].model) < 0)) {
              addThisToOrder = false;
            }
            if ((fInEOModels.indexOf(mSources[j].model) >= 0) &&
              (fInEOModelsOrdered.indexOf(mSources[j].model) < 0)) {
              fInEOModelsOrdered.push(mSources[j].model);
              fInEOModels = this.arrayRemove(fInEOModels, mSources[j].model);
            }
          }
          if (addThisToOrder) {
            if (!fullyConnectedModels[i].value.fInEO) {
              ExecutionOrder.push(fullyConnectedModels[i]);
            }
            fullyConnectedModels = this.arrayRemove(
              fullyConnectedModels,
              fullyConnectedModels[i]
            );
            i = 0;
          } else {
            i++;
          }
          if (
            fullyConnectedModels.length > 0 &&
            i >= fullyConnectedModels.length
          ) {
            for (let j = 0; j < ExecutionOrder.length; j++) {
              let targets = this.getTargetsOfAModel(ExecutionOrder[j]);
              for (let k = 0; k < targets.length; k++) {
                if (fullyConnectedModels.indexOf(targets[k]) >= 0) {
                  aLoopModels.push(targets[k]);
                  fullyConnectedModels = this.arrayRemove(
                    fullyConnectedModels,
                    targets[k]
                  );
                }
              }
            }
            if (aLoopModels.length > 0) {
              throw {
                code: "UMKEOAL",
                message: "arthematic loop(s) found"
              };
            } else {
              throw {
                code: "UMKEOIC",
                message: "Incomplete/improper connections detected"
              };
            }
          }
        }
      } catch (e) {
        //console.log(e);
      }
      console.log(ExecutionOrder);
      return {
        eo: sourcesModels.concat(fInEOModels).concat(fInEOModelsOrdered).concat(ExecutionOrder),
        ne: fullyConnectedModels,
        al: aLoopModels,
        pc: allConnectedModels.pc
      };
    },

    getExecutionOrder1: function () {
      let firstModels = [];
      let allConnectedModels = this.getAllConnectedModels();
      let fullyConnectedModels = allConnectedModels.fc;
      let aLoopModels = [];

      //Obtaining first executing models
      for (let i = 0; i < fullyConnectedModels.length; i++) {
        if (
          fullyConnectedModels[i].value.TerminalsIn.max === 0 ||
          !!fullyConnectedModels[i].value.fInEO
        ) {
          firstModels.push(fullyConnectedModels[i]);
        }
      }
      //removing first executing models from fullyConnectedModels
      for (let i = 0; i < firstModels.length; i++) {
        fullyConnectedModels = this.arrayRemove(
          fullyConnectedModels,
          firstModels[i]
        );
      }

      let ExecutionOrder = firstModels.slice();
      let i = 0;
      try {
        while (fullyConnectedModels.length > 0) {
          let mSources = this.getSourcesWithIndexes(fullyConnectedModels[i]);
          let addThisToOrder = true;
          for (let j = 0; j < mSources.length; j++) {
            if (ExecutionOrder.indexOf(mSources[j].model) < 0) {
              addThisToOrder = false;
            }
          }
          if (addThisToOrder) {
            ExecutionOrder.push(fullyConnectedModels[i]);
            fullyConnectedModels = this.arrayRemove(
              fullyConnectedModels,
              fullyConnectedModels[i]
            );
            i = 0;
          } else {
            i++;
          }
          if (
            fullyConnectedModels.length > 0 &&
            i >= fullyConnectedModels.length
          ) {
            for (let j = 0; j < ExecutionOrder.length; j++) {
              let targets = this.getTargetsOfAModel(ExecutionOrder[j]);
              for (let k = 0; k < targets.length; k++) {
                if (fullyConnectedModels.indexOf(targets[k]) >= 0) {
                  aLoopModels.push(targets[k]);
                  fullyConnectedModels = this.arrayRemove(
                    fullyConnectedModels,
                    targets[k]
                  );
                }
              }
            }
            if (aLoopModels.length > 0) {
              throw {
                code: "UMKEOAL",
                message: "arthematic loop(s) found"
              };
            } else {
              throw {
                code: "UMKEOIC",
                message: "Incomplete/improper connections detected"
              };
            }
          }
        }
      } catch (e) {
        /*if (!!e.message) {
          new Noty({
            text: e.message,
            timeout: 5000,
            theme: "nest",
            type: 'warning'
          }).show();
        } else {
          console.log(e);
          new Noty({
            text: "Unknown error in obtaining the execution order",
            timeout: 5000,
            theme: "nest",
            type: 'warning'
          }).show();
        }*/
        //console.log(e);
      }
      /*
      // Re-organize cells to order in fInEO
      for (let i=(ExecutionOrder.length-1);i>=0; i--) {

      }*/
      return {
        eo: ExecutionOrder,
        ne: fullyConnectedModels,
        al: aLoopModels,
        pc: allConnectedModels.pc
      };
    },

    getExecutionOrder_1: function () {
      let firstModels = [];
      let sourcesModels = [];
      let fInEOModels = [];
      let fInEOModelsOrdered = [];
      let allConnectedModels = this.getAllConnectedModels();
      let fullyConnectedModels = allConnectedModels.fc;
      let aLoopModels = [];

      //Obtain the routing details
      signalRouteVue.updateTags();

      //Obtaining first executing models
      for (let i = 0; i < fullyConnectedModels.length; i++) {
        if (fullyConnectedModels[i].value.TerminalsIn.max === 0 && !fullyConnectedModels[i].value.signalRerouting) {
          sourcesModels.push(fullyConnectedModels[i]);
        } else if (!!fullyConnectedModels[i].value.fInEO) {
          fInEOModels.push(fullyConnectedModels[i]);
        }
      }
      firstModels = sourcesModels.slice(); //.concat(fInEOModels);

      //removing first executing models from fullyConnectedModels
      for (let i = 0; i < firstModels.length; i++) {
        fullyConnectedModels = this.arrayRemove(
          fullyConnectedModels,
          firstModels[i]
        );
      }

      // removing the signal routing blocks
      let tempfullyConnectedModels = [];
      let signalRouteBlocks = [];
      for (let i = 0; i < fullyConnectedModels.length; i++) {
        if (!fullyConnectedModels[i].value.signalRerouting) {
          tempfullyConnectedModels.push(fullyConnectedModels[i]);
        } else {
          signalRouteBlocks.push(fullyConnectedModels[i]);
        }
      }
      fullyConnectedModels = tempfullyConnectedModels;


      let ExecutionOrder = [];
      let i = 0;
      try {
        while (fullyConnectedModels.length > 0) {
          let mSources = this.getSourcesWithIndexes(fullyConnectedModels[i]);
          //console.log("a");
          //console.log(mSources);
          let addThisToOrder = true;
          for (let j = 0; j < mSources.length; j++) {
            if ((ExecutionOrder.indexOf(mSources[j].model) < 0) &&
              (sourcesModels.indexOf(mSources[j].model) < 0)) {
              addThisToOrder = false;
            }
          }
          if (addThisToOrder) {
            if (fInEOModels.indexOf(fullyConnectedModels[i]) >= 0) {
              fInEOModelsOrdered.push(fullyConnectedModels[i]);
            }
            ExecutionOrder.push(fullyConnectedModels[i]);
            //console.log("b");
            //console.log(fullyConnectedModels[i]);
            fInEOModels = this.arrayRemove(fInEOModels, fullyConnectedModels[i]);
            fullyConnectedModels = this.arrayRemove(
              fullyConnectedModels,
              fullyConnectedModels[i]
            );
            i = 0;
          } else {
            i++;
          }
          if (i >= fullyConnectedModels.length && !!fInEOModels.length) {
            let firstCellFromFInEOModels = fInEOModels.shift();
            ExecutionOrder.push(firstCellFromFInEOModels);
            //console.log("c");
            //console.log(firstCellFromFInEOModels);
            fullyConnectedModels = this.arrayRemove(
              fullyConnectedModels,
              firstCellFromFInEOModels
            );
            i = 0;
          } else if (
            fullyConnectedModels.length > 0 &&
            i >= fullyConnectedModels.length
          ) {
            const firstItems = sourcesModels.concat(ExecutionOrder);
            for (let j = 0; j < firstItems.length; j++) {
              let targets = this.getTargetsOfAModel(firstItems[j]);
              for (let k = 0; k < targets.length; k++) {
                if (fullyConnectedModels.indexOf(targets[k]) >= 0) {
                  aLoopModels.push(targets[k]);
                  fullyConnectedModels = this.arrayRemove(
                    fullyConnectedModels,
                    targets[k]
                  );
                }
              }
            }
            if (aLoopModels.length > 0) {
              throw {
                code: "UMKEOAL",
                message: "arthematic loop(s) found"
              };
            } else {
              throw {
                code: "UMKEOIC",
                message: "Incomplete/improper connections detected"
              };
            }
          }
        }
      } catch (e) {
        /*if (!!e.message) {
          new Noty({
            text: e.message,
            timeout: 5000,
            theme: "nest",
            type: 'warning'
          }).show();
        } else {
          console.log(e);
          new Noty({
            text: "Unknown error in obtaining the execution order",
            timeout: 5000,
            theme: "nest",
            type: 'warning'
          }).show();
        }*/
        console.log(e);
      }
      /*
      // Re-organize cells to order in fInEO
      for (let i=(ExecutionOrder.length-1);i>=0; i--) {

      }*/

      //remove all the fInEOModelsOrdered elements from ExecutionOrder
      for (let i = 0; i < fInEOModelsOrdered.length; i++) {
        ExecutionOrder = this.arrayRemove(ExecutionOrder, fInEOModelsOrdered[i]);
      }

      


      //console.log(fInEOModelsOrdered);
      //console.log(sourcesModels);
      //console.log(ExecutionOrder);
      return {
        //eo: sourcesModels.concat(fInEOModelsOrdered).concat(ExecutionOrder),
        eo: sourcesModels.concat(fInEOModelsOrdered).concat(ExecutionOrder),
        ne: fullyConnectedModels,
        al: aLoopModels,
        pc: allConnectedModels.pc,
        sr: signalRouteBlocks
      };
    },

    getExecutionOrder: function () {
      let firstModels = [];
      let sourcesModels = [];
      let fInEOModels = [];
      let fInEOModelsOrdered = [];
      let allConnectedModels = this.getAllConnectedModels();
      let fullyConnectedModels = allConnectedModels.fc;
      let aLoopModels = [];

      //Obtain the routing details
      signalRouteVue.updateTags();

      //iterate through all the fullyConnectedModels and set the isMovedFirstInEO flag to false
      for (let i = 0; i < fullyConnectedModels.length; i++) {
        fullyConnectedModels[i].value.isMovedFirstInEO = false;
      }

      //Obtaining first executing models
      for (let i = 0; i < fullyConnectedModels.length; i++) {
        console.log(fullyConnectedModels[i].value);
        if (fullyConnectedModels[i].value.TerminalsIn.max === 0 && !fullyConnectedModels[i].value.signalRerouting) {
          sourcesModels.push(fullyConnectedModels[i]);
        } else if (!!fullyConnectedModels[i].value.fInEO) {
          fInEOModels.push(fullyConnectedModels[i]);
        }
      }
      firstModels = sourcesModels.slice(); //.concat(fInEOModels);

      //removing first executing models from fullyConnectedModels
      for (let i = 0; i < firstModels.length; i++) {
        fullyConnectedModels = this.arrayRemove(
          fullyConnectedModels,
          firstModels[i]
        );
      }

      // removing the signal routing blocks
      let tempfullyConnectedModels = [];
      let signalRouteBlocks = [];
      for (let i = 0; i < fullyConnectedModels.length; i++) {
        if (!fullyConnectedModels[i].value.signalRerouting) {
          tempfullyConnectedModels.push(fullyConnectedModels[i]);
        } else {
          signalRouteBlocks.push(fullyConnectedModels[i]);
        }
      }
      fullyConnectedModels = tempfullyConnectedModels;


      let ExecutionOrder = [];
      let i = 0;

      //console.log(sourcesModels);
      try {
        while (fullyConnectedModels.length > 0) {
          //console.log(fullyConnectedModels[i].children);
          let mSources = this.getSourcesWithIndexes(fullyConnectedModels[i]);
          //console.log("a");
          //console.log(mSources);
          let addThisToOrder = true;
          for (let j = 0; j < mSources.length; j++) {
            if ((ExecutionOrder.indexOf(mSources[j].model) < 0) &&
              (sourcesModels.indexOf(mSources[j].model) < 0)) {
              addThisToOrder = false;
            } else {
              //console.log(fullyConnectedModels[i].children[fullyConnectedModels[i].children.length - 1].value);
            }
          }
          if (addThisToOrder) {
            /*if (fInEOModels.indexOf(fullyConnectedModels[i]) >= 0) {
              console.log(fullyConnectedModels[i].children[fullyConnectedModels[i].children.length - 1].value);
              fInEOModelsOrdered.push(fullyConnectedModels[i]);
            }*/
            ExecutionOrder.push(fullyConnectedModels[i]);
            //console.log("b");
            //console.log(fullyConnectedModels[i]);
            fInEOModels = this.arrayRemove(fInEOModels, fullyConnectedModels[i]);
            fullyConnectedModels = this.arrayRemove(
              fullyConnectedModels,
              fullyConnectedModels[i]
            );
            i = 0;
          } else {
            i++;
          }
          if (i >= fullyConnectedModels.length && !!fInEOModels.length) {
            let firstCellFromFInEOModels = fInEOModels.shift();
            firstCellFromFInEOModels.value.isMovedFirstInEO = true;
            ExecutionOrder.push(firstCellFromFInEOModels);
            //console.log("c");
            //console.log(firstCellFromFInEOModels);
            fullyConnectedModels = this.arrayRemove(
              fullyConnectedModels,
              firstCellFromFInEOModels
            );
            i = 0;
          } else if (
            fullyConnectedModels.length > 0 &&
            i >= fullyConnectedModels.length
          ) {
            const firstItems = sourcesModels.concat(ExecutionOrder);
            for (let j = 0; j < firstItems.length; j++) {
              let targets = this.getTargetsOfAModel(firstItems[j]);
              for (let k = 0; k < targets.length; k++) {
                if (fullyConnectedModels.indexOf(targets[k]) >= 0) {
                  aLoopModels.push(targets[k]);
                  fullyConnectedModels = this.arrayRemove(
                    fullyConnectedModels,
                    targets[k]
                  );
                }
              }
            }
            if (aLoopModels.length > 0) {
              throw {
                code: "UMKEOAL",
                message: "arthematic loop(s) found"
              };
            } else {
              throw {
                code: "UMKEOIC",
                message: "Incomplete/improper connections detected"
              };
            }
          }
        }
      } catch (e) {
        /*if (!!e.message) {
          new Noty({
            text: e.message,
            timeout: 5000,
            theme: "nest",
            type: 'warning'
          }).show();
        } else {
          console.log(e);
          new Noty({
            text: "Unknown error in obtaining the execution order",
            timeout: 5000,
            theme: "nest",
            type: 'warning'
          }).show();
        }*/
        console.log(e);
      }
      /*
      // Re-organize cells to order in fInEO
      for (let i=(ExecutionOrder.length-1);i>=0; i--) {

      }*/

      //remove all the fInEOModelsOrdered elements from ExecutionOrder
      /*for (let i = 0; i < fInEOModelsOrdered.length; i++) {
        ExecutionOrder = this.arrayRemove(ExecutionOrder, fInEOModelsOrdered[i]);
      }*/

      


      //console.log(fInEOModelsOrdered);
      //console.log(sourcesModels);
      //console.log(ExecutionOrder);
      return {
        //eo: sourcesModels.concat(fInEOModelsOrdered).concat(ExecutionOrder),
        eo: sourcesModels.concat(ExecutionOrder),
        ne: fullyConnectedModels,
        al: aLoopModels,
        pc: allConnectedModels.pc,
        sr: signalRouteBlocks
      };
    },

    getSourcesWithIndexes: function (inModel) {
      let modelSources = [];
      for (let i = 0; i < inModel.children.length; i++) {
        if (inModel.children[i].style.search("umk_input") >= 0) {
          modelSources.push(this.obtainTheSrcAndIdxFor(inModel.children[i]));
        }
      }
      return modelSources;
    },
    obtainTheSrcAndIdxFor: function (childItem) {
      const srcItem = {
        model: null,
        index: null
      };
      let nodeItems = mainSystem.graph.getNodeCells(childItem);
      for (let j = 0; j < nodeItems.length; j++) {
        if (!!nodeItems[j] && !!nodeItems[j].style && nodeItems[j].style.search("umk_output") >= 0) {
          if (!nodeItems[j].value.signalRerouting) {
            srcItem.model = nodeItems[j].parent;
          }
          let outIdx = -1;
          for (let k = 0; k < nodeItems[j].parent.children.length; k++) {
            if (!!nodeItems[j].parent.children[k].style && nodeItems[j].parent.children[k].style.search("umk_output") >= 0) {
              outIdx++;
              if (nodeItems[j] === nodeItems[j].parent.children[k]) {
                if (!nodeItems[j].parent.value.signalRerouting) {
                  srcItem.index = outIdx;
                  //console.log("Not entered to tag");
                } else {
                  //console.log("Entered to tag: "+outIdx);
                  const tempSrc = signalRouteVue.tags[nodeItems[j].parent.value.Parameters.tag.Value[outIdx][0]];
                  srcItem.model = tempSrc.source.model;
                  srcItem.index = tempSrc.source.index;
                }
                break;
              }
            }
          }
          break;
        }
      }
      return srcItem;
    },
    getSourcesOfAModel: function (inModel) {
      let modelSources = [];
      for (let i = 0; i < inModel.children.length; i++) {
        if (inModel.children[i].style.search("umk_input") >= 0) {
          try {
            console.log(inModel.children[i].edges[0].source.style);
            if (
              modelSources.indexOf(
                inModel.children[i].edges[0].source.parent
              ) < 0
            ) {
              //if ( inModel !== inModel.children[i].edges[0].source.parent ) {}
              modelSources.push(inModel.children[i].edges[0].source.parent);
            }
          } catch (e) {
            //console.log(e);
          }
        }
      }
      return modelSources;
    },
    /*
    getSourcesWithIndexes: function (inModel) {
      let indexes = [];
      for (let i = 0; i < inModel.children.length; i++) {
        if (inModel.children[i].style.search("umk_input") >= 0) {
          let index = -1;
          let tempPModel = inModel.children[i].edges[0].source.parent;
          for (j = 0; j < tempPModel.children.length; j++) {
            if (tempPModel.children[j].style.search("umk_output") >= 0) {
              index++;
              if (
                !!tempPModel.children[j].edges &&
                tempPModel.children[j].edges.indexOf(
                  inModel.children[i].edges[0]
                ) >= 0
              ) {
                indexes.push({
                  model: inModel.children[i].edges[0].source.parent,
                  index: index
                });
              }
            }
          }
        }
      }
      return indexes;
    },
    */

    getTargetsOfAModel: function (inModel) {
      let modelTargets = [];
      for (let i = 0; i < inModel.children.length; i++) {
        if ((!!inModel.children[i]) && (!!inModel.children[i].style) && (inModel.children[i].style.search("umk_output") >= 0)) {
          let allNodeCells = mainSystem.graph.getNodeCells(inModel.children[i]);
          //console.log(allNodeCells);
          for (let j = 0; j < allNodeCells.length; j++) {
            if (!!allNodeCells[j] && !!allNodeCells[j].style && !!allNodeCells[j].style.search("umk_input") >= 0)
              if ((modelTargets.indexOf(allNodeCells[j].parent) < 0) && (inModel !== allNodeCells[j].parent)) {
                modelTargets.push(allNodeCells[j].parent);
              }
            try {} catch (e) {}
          }
        }
      }
      return modelTargets;
    },

    getAllTheModels: function () {
      //let parent = mainSystem.graph.getDefaultParent();
      let allTheBlocks = [];
      if (mainSystem.graph.getDefaultParent().children) {
        allTheBlocks = allTheBlocks.concat(mainSystem.graph.getDefaultParent().children);
      }
      for (let i = 0; i < allTheBlocks.length; i++) {
        if (allTheBlocks[i].children) {
          allTheBlocks = allTheBlocks.concat(allTheBlocks[i].children);
        }
      }
      let allTheModels = [];
      for (let i = 0; i < allTheBlocks.length; i++) {
        if (
          allTheBlocks[i].isVertex() &&
          typeof allTheBlocks[i].value == "object"
        ) {
          allTheModels.push(allTheBlocks[i]);
        }
      }
      return allTheModels;
    },

    getAllConnectedModels: function () {
      //let parent = mainSystem.graph.getDefaultParent();
      let allTheBlocks = [];
      if (mainSystem.graph.getDefaultParent().children) {
        allTheBlocks = allTheBlocks.concat(mainSystem.graph.getDefaultParent().children);
      }
      for (let i = 0; i < allTheBlocks.length; i++) {
        if (allTheBlocks[i].children) {
          allTheBlocks = allTheBlocks.concat(allTheBlocks[i].children);
        }
      }

      let allConnectedBlocks = [];
      for (let i = 0; i < allTheBlocks.length; i++) {
        if (allTheBlocks[i].isVertex() &&
          !!allTheBlocks[i].style &&
          ((allTheBlocks[i].style.search("umk_input") >= 0) || (allTheBlocks[i].style.search("umk_output") >= 0)) &&
          (!!allTheBlocks[i].edges) &&
          (allTheBlocks[i].edges.length > 0)
        ) {
          if (allConnectedBlocks.indexOf(allTheBlocks[i].parent) < 0) {
            allConnectedBlocks.push(allTheBlocks[i].parent);
          }
        }
      }

      let allFullyConnectedBlocks = [];
      let allPartiallyConnectedBlocks = [];
      for (let i = 0; i < allConnectedBlocks.length; i++) {
        let isFullyConnected = true;
        for (let j = 0; j < allConnectedBlocks[i].children.length; j++) {
          if (
            (allConnectedBlocks[i].children[j].style.search("umk_input") >= 0) &&
            (!allConnectedBlocks[i].children[j].edges ||
              allConnectedBlocks[i].children[j].edges.length < 1)
          ) {
            isFullyConnected = false;
          }
        }
        if (isFullyConnected) {
          allFullyConnectedBlocks.push(allConnectedBlocks[i]);
        } else {
          allPartiallyConnectedBlocks.push(allConnectedBlocks[i]);
        }
      }

      return {
        ac: allConnectedBlocks,
        fc: allFullyConnectedBlocks,
        pc: allPartiallyConnectedBlocks
      };
    },

    showExecutionOrderMessage: function (cells, message, warning) {
      for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].children.length; j++) {
          if (cells[i].children[j].style.search("umk_EO") >= 0) {
            cells[i].children[j].setValue(message);
          }
        }
        //mainSystem.graph.setCellWarning(cells[i], warning);
      }
    },

    getTagLabelsInfo: function () {

    },

    arrayRemove: function (arr, value) {
      return arr.filter(function (ele) {
        return ele != value;
      });
    }
  }
});