const editorVue = new Vue({
  el: "#rp-content",
  data: {
    rpSettings: Object.assign({
      hideGraphText: false,
      fEditMode: true
    }, settings),
    uyamakModel: null,
    modelValue: null,
    bunchOfItems: false,
    parametersDisplay: null,
    updatingCounter: 0
  },
  computed: {
    getBlockDetails: function () {
      try {
        return this.uyamakModel.Details();
      } catch (e) {
        console.log(e);
        return GUIText[settings.lang].errDetails;
      }
    },
    isBlockValid: function () {
      try {
        return !this.uyamakModel.invalidParams();
      } catch (e) {
        console.log(e);
        return
      }
    }
  },
  mounted: function () {
    this.refreshGraph();
  },
  updated: function () {
    mathEqn.update();
  },
  watch: {
    rpSettings: {
      deep: true,
      handler: function (a) {
        if (!a.gridSize || a.gridSize <= 0) a.gridSize = 1;
        settingsVue.$set(settingsVue.$data.stings, 'gLinesMinor', a.gLinesMinor);
        settingsVue.$set(settingsVue.$data.stings, 'gLinesMajor', a.gLinesMajor);
        settingsVue.$set(settingsVue.$data.stings, 'gLinesMega', a.gLinesMega);
        settingsVue.$set(settingsVue.$data.stings, 'showOutline', a.showOutline);
        settingsVue.$set(settingsVue.$data.stings, 'gridSize', a.gridSize);
        settingsVue.$set(settingsVue.$data.stings, 'guidesEnabled', a.guidesEnabled);
        settingsVue.$set(settingsVue.$data.stings, 'showLabels', a.showLabels);
        settingsVue.$set(settingsVue.$data.stings, 'showExeOrder', a.showExeOrder);
        settingsVue.$set(settingsVue.$data.stings, 'snapToGrid', a.snapToGrid);
        //console.log(a.snapToGrid);


        mainSystem.graph.hideGraphText = editorVue.rpSettings.hideGraphText;
        this.refreshGraph();
      }
    }
  },
  methods: {
    refreshGraph() {
      mainSystem.graph.grid.minorStroke.show = this.rpSettings.fEditMode && this.rpSettings.gLinesMinor;
      mainSystem.graph.grid.majorStroke.show = this.rpSettings.fEditMode && this.rpSettings.gLinesMajor;
      mainSystem.graph.grid.megaStroke.show = this.rpSettings.fEditMode && this.rpSettings.gLinesMega;
      mainSystem.outline.visibility = this.rpSettings.showOutline;
      mainSystem.graph.graphHandler.guidesEnabled = this.rpSettings.guidesEnabled;
      mainSystem.graph.gridSize = this.rpSettings.gridSize;
      mainSystem.graph.showCaptions = this.rpSettings.showLabels;
      mainSystem.graph.showExeOrder = this.rpSettings.showExeOrder;
      mainSystem.graph.gridEnabled = this.rpSettings.snapToGrid;
      mainSystem.refresh();
    },
    rotateAll: function (cw = true) {
      let selectedCells = mainSystem.graph.getSelectionCells();
      for (let i = 0; i < selectedCells.length; i++) {
        if (!!selectedCells[i] && !!selectedCells[i].style && selectedCells[i].style.search("umk_model") >= 0) {
          let angle = this.getAngle(selectedCells[i]);
          if (cw) {
            angle += 90;
            angle = angle % 360;
          } else {
            angle -= 90;
            if (angle < 0) angle += 360;
          }
          this.rotate(angle, selectedCells[i], false);
        }
      }
    },
    getAngle: function (cell = null) {
      if (cell === null) {
        cell = mainSystem.graph.getSelectionCell();
      }
      for (let i = 0; i < cell.children.length; i++) {
        if (!!cell.children[i].style && cell.children[i].style.search("umk_caption") >= 0) {
          let styleSplit = cell.children[i].style.split("_");
          try {
            return parseInt(styleSplit[styleSplit.length - 1])
          } catch (e) {
            return 0;
          }
        }
      }
    },
    rotate: function (ang, cell = null, refresh = true) {
      if (cell === null) {
        cell = mainSystem.graph.getSelectionCell();
      }
      let model = mainSystem.graph.getModel();
      model.beginUpdate();
      try {

        if (ang === 180 || ang === 90) {
          cell.value.rotateHTML = 180;
        } else {
          cell.value.rotateHTML = 0;
        }
        const pConstarins = [];
        pConstarins[0] = {
          in: "west",
          out: "east"
        };
        pConstarins[90] = {
          in: "north",
          out: "south"
        };
        pConstarins[180] = {
          in: "east",
          out: "west"
        };
        pConstarins[270] = {
          in: "south",
          out: "north"
        };
        const geos = [];
        geos[0] = {
          "umk_caption": {
            x: 0.5,
            y: 1
          },
          "umk_EO": {
            x: 0.5,
            y: 0
          },
        };
        geos[90] = {
          "umk_caption": {
            x: 0.5,
            y: 0
          },
          "umk_EO": {
            x: 0.5,
            y: 1
          },
        };
        geos[180] = {
          "umk_caption": {
            x: 0.5,
            y: 0
          },
          "umk_EO": {
            x: 0.5,
            y: 1
          },
        };
        geos[270] = {
          "umk_caption": {
            x: 0.5,
            y: 1
          },
          "umk_EO": {
            x: 0.5,
            y: 0
          },
        };
        mainSystem.graph.setCellStyles(
          "rotation",
          ang,
          [cell].concat(
            cell.children
          )
        );
        for (let i = 0; i < cell.children.length; i++) {
          if (!!cell.children[i].style) {
            if (
              cell.children[i].style.search("umk_input") >= 0
            ) {
              mainSystem.graph.setCellStyles("portConstraint", pConstarins[ang].in, [
                cell.children[i]
              ]);
            } else if (
              cell.children[i].style.search("umk_output") >= 0
            ) {
              mainSystem.graph.setCellStyles("portConstraint", pConstarins[ang].out, [
                cell.children[i]
              ]);
            } else if (
              cell.children[i].style.search("umk_caption") >= 0
            ) {
              cell.children[i].setStyle("umk_caption_" + ang);
              let tempGeo = new mxGeometry(geos[ang]["umk_caption"].x, geos[ang]["umk_caption"].y, 0, 0);
              tempGeo.relative = true;
              cell.children[i].setGeometry(tempGeo);
            } else if (
              cell.children[i].style.search("umk_EO") >= 0
            ) {
              cell.children[i].setStyle("umk_EO_" + ang);
              let tempGeo = new mxGeometry(geos[ang]["umk_EO"].x, geos[ang]["umk_EO"].y, 0, 0);
              tempGeo.relative = true;
              cell.children[i].setGeometry(tempGeo);
            }
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        model.endUpdate();
        mainSystem.undoManager.history.pop();
        mainSystem.undoManager.indexOfNextAdd--;
        if (refresh) {
          mainSystem.refresh();
        }
      }

    },
    applyModelValue: function (cell = null) {
      if (cell === null) {
        cell = mainSystem.graph.getSelectionCell();
      }
      cell.value = this.modelValue;
      mainSystem.refresh();
      //mainSystem.graph.refresh(cell);
    },
    saveModel: function (cell = null) {
      if (cell === null) {
        cell = mainSystem.graph.getSelectionCell();
      }
      mainSystem.graph.getModel().beginUpdate();
      try {
        //Adding model to the Block
        eval(
          "var tempModel = new " +
          this.uyamakModel.id +
          "(this.uyamakModel);"
        );
        cell.setValue(tempModel);
        setTermianls(mainSystem.graph, cell, "umk_input");
        setTermianls(mainSystem.graph, cell, "umk_output");
      } catch (e) {
        console.log(e);
      }
      //mainSystem.graph.refresh(mainSystem.graph.getSelectionCell());
      mainSystem.graph.getModel().endUpdate();
      mainSystem.refresh();
      mainSystem.undoManager.history.pop();
      mainSystem.undoManager.indexOfNextAdd--;
      this.rotate(this.getAngle());
      varManagerVue.checkCellParams(cell);
      if (simVue.mode !== "mDesign") {
        simVue.informSim('updateCell', cell.id)
      }
      mainSystem.graph.setSelectionCells([]);
    },
    toggleParamDisplay: function (index) {
      //console.log(this.parametersDisplay);
      this.updatingCounter++;
      this.parametersDisplay[index] = !this.parametersDisplay[index];
    },
    valueDimensionsModify: function (func, index) {
      let tempItem;
      switch (this.uyamakModel.Parameters[index].Type) {
        case "Integer":
        case "Real":
        case "Complex":
          tempItem = 0;
          break;
        case "Text":
          tempItem = "";
          break;
        case "Color":
          tempItem = "#000";
          break;
        case "Options":
          tempItem = Object.keys(this.uyamakModel.Parameters[index].Options)[0];
          //console.log(index);
          break;
        case "Checkbox":
          tempItem = false;
          break;
      }
      switch (func) {
        case 0:
          this.uyamakModel.Parameters[index].Value.push(
            new Array(
              this.uyamakModel.Parameters[index].Value[0].length
            ).fill(tempItem)
          );
          break;
        case 1:
          if (this.uyamakModel.Parameters[index].Value.length > 1) {
            this.uyamakModel.Parameters[index].Value.pop();
          }
          break;
        case 2:
          this.uyamakModel.Parameters[index].Value.map(function (val) {
            return val.push(tempItem);
          });
          break;
        case 3:
          if (this.uyamakModel.Parameters[index].Value[0].length > 1) {
            this.uyamakModel.Parameters[index].Value.map(function (val) {
              return val.pop();
            });
          }
          break;
      }
      this.updatingCounter++;
    },
    getComputedValueText: function (Parameter) {
      try {
        return math.parse(varManagerVue.getVarValue(Parameter.Value).toString()).toTex(4);
      } catch (e) {
        console.log(e);
        return '<i class="fas fa-exclamation-triangle fa-fw"></i><span>' + GUIText[settings.lang].k172 + '</span>';
      }
    },
    toggleParamCheckVal: function (index, index1, index2) {
      this.uyamakModel.Parameters[index]['Value'][index1][index2] = !this.uyamakModel.Parameters[index]['Value'][index1][index2];
      this.updatingCounter++;
    }
  }
})