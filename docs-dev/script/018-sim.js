const simVue = new Vue({
  el: "#sim-menu",
  data: {
    mode: "mDesign",
    disp: {
      "run": true,
      "endTime": true,
      "endTime": true,
      "stop": true,
      "pause": true,
      "forward": true,
      "noOfSteps": true
    },
    simSettings: {
      h: 100, //Step size
      T: 5, // Total simulation time
      realtime: false,
      steps: 1
    },
    results: null,
    simWorker: null,
    exeOrder: []
  },
  watch: {
    simSettings: {
      deep: true,
      handler: function () {
        footerVue.$set(footerVue.$data, "totalTime", this.simSettings.T);
      }
    },
    mode: function () {
      footerVue.$set(footerVue.$data, "mode", this.mode);
      switch (this.mode) {
        case 'mDesign': {
          console.log("Hey")
          break;
        }
        case 'mSim': {
          console.log('sim');
          break;
        }
        case 'mSimPause': {

          break;
        }
      }
    }
  },

  methods: {

    informSim: function (abt, option) {
      if (window.Worker) {
        let out = {};
        switch (abt) {
          case 'cells':
            out = {
              cells: this.exeOrder.map((ele) => {
                let out = JSON.parse2(JSON.stringify2(ele.value));
                out.cid = ele.id;
                return out;
              })
            };
            break;
          case 'simSettings':
            out = {
              simSettings: this.simSettings
            };
            break;
          case 'updateCell':
            let idx = this.exeOrder.findIndex(function (ele) {
              return option === ele.id;
            })
            if (idx >= 0) {
              let cellValue = JSON.parse2(JSON.stringify2(this.exeOrder[idx].value));
              cellValue.cid = this.exeOrder[idx].id;
              out = {
                updateCell: {
                  v: cellValue, //value
                  i: idx //index
                }
              }
            };
          default:
            break;
        }
        if (!!Object.keys(out).length) {
          this.simWorker.postMessage(out);
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

    initSim: function () {
      if (window.Worker) {
        this.exeOrder = this.getExecutionOrder().eo;
        if (this.exeOrder.length > 0) {
          this.simWorker = new Worker('simulator.min.js?date=' + Date.now());
          this.results = new Dexie('res_' + Date.now());
          this.results.version(1).stores({
            outs: 'cid, time, value'
          });
        } else {
          new Noty({
            text: GUIText[settings.lang].k170,
            timeout: 5000,
            theme: "nest",
            type: 'warning'
          }).show();
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
        this.results.delete().then(() => {
          console.log("Database successfully deleted");
        }).catch((err) => {
          console.log(err);
          console.error("Could not delete database");
        }).finally(() => {
          // Do what should be done next...
        });
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
        mainSystem.graph.setCellWarning(cells[i], warning);
      }
    },

    arrayRemove: function (arr, value) {
      return arr.filter(function (ele) {
        return ele != value;
      });
    }
  }
});