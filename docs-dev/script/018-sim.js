const simVue = new Vue({
  el: "#sim-menu",
  data: {
    mode: "mDesign",
    disp: {
      "run": true,
      //"endTime": true,
      //"endTime": true,
      "stop": false,
      "pause": false,
      //"noOfSteps": true,
      "forward": true
    },
    simSettings: {
      h: 100, //Step size
      T: 5, // Total simulation time
      realtime: false,
      steps: 1
    },
    dbName: null,
    results: [],
    dbWorker: null,
    simWorker: null,
    exeOrder: []
  },
  watch: {
    simSettings: {
      deep: true,
      handler: function () {
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
            "run": true,
            "stop": false,
            "pause": false,
            "forward": true
          }
          break;
        }
        case 'mSim': {
          this.disp = {
            "run": false,
            "stop": true,
            "pause": true,
            "forward": false
          }
          break;
        }
        case 'mSimPause': {
          this.disp = {
            "run": true,
            "stop": true,
            "pause": false,
            "forward": true
          }
          break;
        }
      }
    }
  },

  methods: {
    updateSources: function (inCells) {
      for (let i = 0; i < inCells.length; i++) {
        let sModels = this.getSourcesWithIndexes(mainSystem.graph.getModel().cells[inCells[i].cid]);
        let Sources = [];
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
      let cellVal = JSON.parse2(JSON.stringify2(inCell.value));
      cellVal.cid = inCell.id;
      if (!!cellVal.Parameters) {
        let params = Object.keys(cellVal.Parameters);
        for (let i = 0; i < params.length; i++) {
          if (cellVal.Parameters[params[i]].Type === "Complex" ||
            cellVal.Parameters[params[i]].Type === "real" ||
            cellVal.Parameters[params[i]].Type === "Integer") {
            cellVal.Parameters[params[i]].Value =
              (varManagerVue.getVarValue(cellVal.Parameters[params[i]].Value)).toString();
          }
        }
      }
      return cellVal;
    },
    informSim: function (abt, option) {
      try {
        if (window.Worker) {
          let out = {};
          switch (abt) {
            case 'cells':
              try {
                let tempCells = this.exeOrder.map((ele) => {
                  //console.log(ele);
                  return this.pCell4Exp(ele);
                });
                //console.log(tempCells);
                out = {
                  cells: this.updateSources(tempCells)
                };
              } catch (e) {
                console.log(e);
                out = {};
              }
              break;
            case 'updateCell':
              try {
                let idx = this.exeOrder.findIndex(function (ele) {
                  return option === ele.id;
                })
                if (idx >= 0) {
                  let cellValue = this.pCell4Exp(this.exeOrder[idx]);
                  out = {
                    updateCell: {
                      v: cellValue, //value
                      i: idx //index
                    }
                  }
                };
              } catch (e) {
                console.log(e);
                out = {};
              }
              break;
            case 'simSettings':
              out = {
                simSettings: this.simSettings
              };
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
        console.log(e);
      }
    },
    createDB: function (name = null) {
      if (!!this.dbWorker) {
        this.dbName = "res_" + name;
        this.dbWorker.postMessage({
          use: this.dbName
        });
      }
    },
    initSim: function () {
      if (window.Worker) {
        this.exeOrder = this.getExecutionOrder().eo;
        if (this.exeOrder.length > 0) {
          if (varManagerVue.checkAllCellsParams()) {
            if (!this.simWorker) {
              this.simWorker = new Worker('/simulator.min.js?date=' + Date.now());
            }
            this.simWorker.onmessage = function (event) {
              console.log(event.data);
              if (event.data.put) {
                console.log(event.data.put);
                simVue.results = simVue.results.concat(event.data.put);
                simVue.dbWorker.postMessage({
                  results: event.data.put
                });
              } else if (event.data.ended) {
                simVue.endSim();
              } else if (event.data.paused) {
                simVue.mode = "mSimPause";
              }
            }
            if (!this.dbWorker) {
              this.dbWorker = new Worker('/db.min.js?date=' + Date.now());
            }
            this.createDB(Date.now());

            this.informSim("cells");
            this.informSim("simSettings");
            this.informSim("db");
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
        this.simWorker = null;
        this.mode = "mDesign";
      }
    },
    displayExecutionOrder: function () {
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
      mainSystem.refresh();
    },

    getExecutionOrder: function () {
      let firstModels = [];
      let allConnectedModels = this.getAllConnectedModels();
      let fullyConnectedModels = allConnectedModels.fc;
      let aLoopModels = [];

      //Obtaining first executing models
      for (let i = 0; i < fullyConnectedModels.length; i++) {
        if (
          fullyConnectedModels[i].value.TerminalsIn.max === 0 ||
          !!fullyConnectedModels[i].value.FirstInExecutionOrder
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
          let mSources = this.getSourcesOfAModel(fullyConnectedModels[i]);
          let addThisToOrder = true;
          for (let j = 0; j < mSources.length; j++) {
            if (ExecutionOrder.indexOf(mSources[j]) < 0) {
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
        console.log(e);
      }
      return {
        eo: ExecutionOrder,
        ne: fullyConnectedModels,
        al: aLoopModels,
        pc: allConnectedModels.pc
      };
    },
    getSourcesOfAModel: function (inModel) {
      let modelSources = [];
      for (let i = 0; i < inModel.children.length; i++) {
        if (inModel.children[i].style.search("umk_input") >= 0) {
          try {
            if (
              modelSources.indexOf(
                inModel.children[i].edges[0].source.parent
              ) < 0
            ) {
              modelSources.push(inModel.children[i].edges[0].source.parent);
            }
          } catch (e) {}
        }
      }
      return modelSources;
    },
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

    getTargetsOfAModel: function (inModel) {
      let modelTargets = [];
      for (let i = 0; i < inModel.children.length; i++) {
        if (inModel.children[i].style.search("umk_output") >= 0) {
          for (let j = 0; j < inModel.children[i].edges.length; j++) {
            try {
              if (
                modelTargets.indexOf(
                  inModel.children[i].edges[j].target.parent
                ) < 0
              ) {
                modelTargets.push(inModel.children[i].edges[j].target.parent);
              }
            } catch (e) {}
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
      let allTheValidEdges = [];
      for (let i = 0; i < allTheBlocks.length; i++) {
        if (
          allTheBlocks[i].isEdge() &&
          typeof allTheBlocks[i].source.parent.value == "object" &&
          typeof allTheBlocks[i].target.parent.value == "object"
        ) {
          allTheValidEdges.push(allTheBlocks[i]);
        }
      }
      let allConnectedBlocks = [];
      for (let i = 0; i < allTheValidEdges.length; i++) {
        if (
          allConnectedBlocks.indexOf(allTheValidEdges[i].source.parent) < 0
        ) {
          allConnectedBlocks.push(allTheValidEdges[i].source.parent);
        }
        if (
          allConnectedBlocks.indexOf(allTheValidEdges[i].target.parent) < 0
        ) {
          allConnectedBlocks.push(allTheValidEdges[i].target.parent);
        }
      }
      let allFullyConnectedBlocks = [];
      let allPartiallyConnectedBlocks = [];
      for (let i = 0; i < allConnectedBlocks.length; i++) {
        let isFullyConnected = true;
        for (let j = 0; j < allConnectedBlocks[i].children.length; j++) {
          if (
            (allConnectedBlocks[i].children[j].style.search("umk_input") >=
              0 ||
              allConnectedBlocks[i].children[j].style.search("umk_input") >=
              0) &&
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

    arrayRemove: function (arr, value) {
      return arr.filter(function (ele) {
        return ele != value;
      });
    }
  }
});