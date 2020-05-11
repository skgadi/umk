const varManagerVue = new Vue({
  el: "#varManager",
  data: {
    constants: ["e", "E", "i", "Infinity", "LN2", "LN10", "LOG2E", "LOG10E", "phi", "pi", "PI", "SQRT1_2", "SQRT2", "tau"],
    keywords: ["NaN", "null", "undefined", "mod", "to", "in", "and", "xor", "or", "not", "end"],
    display: false,
    variables: [],
    varValidValues: [],
    showEdtVar: false,
    edtVar: {
      name: "",
      value: [
        [1]
      ],
      index: -1
    },
    parser: null
  },
  updated: function () {
    mathEqn.update();
  },
  watch: {
    /*variables: {
      deep: true,
      handler: function () {
        this.clearAndparseAll();
      }
    },*/
    /*    "edtVar": {
          deep: true,
          handler: function () {
          }
        },*/
    "display": function () {
      kbshort.suspend(this.display, function (evt) {
        if (evt.keyCode === 27) {
          varManagerVue.showGUI(false);
        }
      });
    },
  },
  methods: {
    cngVarDim: function (optn) {
      let varToModify = this.edtVar.value;
      switch (optn) {
        case 0: // add row
          varToModify.push(new Array(varToModify[0].length).fill(0));
          break;
        case 1: // remove row
          if (varToModify.length > 1) {
            varToModify.pop();
          }
          break;
        case 2: // add column
          varToModify = varToModify.map((e) => {
            e.push(0);
          });
          break;
        case 3: // remove column
          if (varToModify[0].length > 1) {
            varToModify = varToModify.map((ele) => {
              ele.pop();
            });
          }
          break;

        default:
          break;
      }
    },
    addVar: function () {
      let varName = "x";
      let count = -1;
      while (true) {
        if (this.variables.findIndex(function (ele) {
            return ele.name === varName + ((count >= 0) ? count : "");
          }) < 0) {
          break;
        }
        count++;
      }
      this.edtVar = {
        name: varName + ((count >= 0) ? count : ""),
        value: [
          [1]
        ],
        index: -1
      }
      this.showEdtVar = true;
    },
    saveVar: function () {
      let item = {
        value: JSON.parse2(JSON.stringify2(this.edtVar.value)),
        name: this.edtVar.name
      };
      let validity = this.checkValidVar(this.edtVar.name, this.edtVar.index);
      if (validity.vld) {
        if (this.edtVar.index < 0) {
          this.variables.push(item);
        }
        if (this.edtVar.index >= 0 && this.edtVar.index < this.variables.length) {
          this.variables[this.edtVar.index] = item;
        }
        this.showEdtVar = false;
      } else {
        new Noty({
          text: validity.msg,
          timeout: 5000,
          theme: "nest",
          type: 'error'
        }).show();

      }
      this.clearAndparseAll();
    },
    checkValidVar: function (name, ignore = -1) {
      if (!isNaN(parseInt(name.charAt(0)))) {
        return {
          vld: false,
          msg: "Error: name cannot start with a number"
        };
      }
      if (!name) {
        return {
          vld: false,
          msg: "Error: name cannot be empty"
        };
      }
      if (this.keywords.indexOf(name) >= 0) {
        return {
          vld: false,
          msg: "Error: this is a keyword"
        };
      }
      if (this.constants.indexOf(name) >= 0) {
        return {
          vld: false,
          msg: "Error: this is a constant"
        };
      }
      if (this.variables.findIndex(function (ele, i) {
          return i !== ignore && ele.name === name;
        }) >= 0) {
        return {
          vld: false,
          msg: "Error: this variable name is already in use"
        };
      }
      return {
        vld: true,
        msg: ""
      };
    },
    showGUI: function (show = true) {
      this.display = show;
      if (!show) {
        this.showEdtVar = false;
        this.clearAndparseAll();
        this.checkAllCellsParams();
      }
    },
    moveVar: function (up = true, index = 0) {
      if (index >= 0 && index < this.variables.length) {
        let to = up ? index - 1 : index + 1;
        if (to >= 0 && to < this.variables.length) {
          this.variables.splice(to, 0, this.variables.splice(index, 1)[0]);
        }
        this.clearAndparseAll();
      }
    },
    editVar: function (index) {
      if (index >= 0 && index < this.variables.length) {
        this.edtVar = {
          index: index,
          name: this.variables[index].name,
          value: JSON.parse(JSON.stringify(this.variables[index].value))
        };
        this.showEdtVar = true;
      }
    },
    delVar: function (index) {
      this.variables.splice(index, 1);
      this.clearAndparseAll();
    },
    getVariable: function (variable) {
      return TeX.frmArray(variable.value);
      //return JSON.stringify(variable.value);
    },
    clearAndparseAll: function () {
      this.startParser();
      this.processAllVars();
    },
    startParser: function () {
      try {
        this.parser = math.parser();
      } catch (e) {
        console.log(e);
      }
      //return true;
    },
    processAllVars: function () {
      for (let i = 0; i < this.variables.length; i++) {
        let varVal = this.processVar(this.variables[i]);
        if (!!varVal) {
          this.varValidValues[i] = math.parse(varVal.toString()).toTex(4);
        } else {
          this.varValidValues[i] = "\\bigotimes"
        }
      }
    },
    processVar: function (variable) {
      try {
        let tempData = this.getVarValue(variable.value)
        //console.log(tempData);
        return this.parser.evaluate(variable.name + "=" + tempData.toString());
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    isValidMathNum: function (num) {
      if (math.isNumeric(num) || math.isMatrix(num) || math.isComplex(num)) {
        return true;
      } else {
        return false;
      }
    },
    getVarValue: function (varValue) {
      if (!this.parser) {
        this.clearAndparseAll();
      }
      let tempData;
      let tempRow;
      for (let i = 0; i < varValue.length; i++) {
        for (let j = 0; j < varValue[0].length; j++) {
          let tVar = this.parser.evaluate(String(varValue[i][j]));
          if (!this.isValidMathNum(tVar)) {
            throw ("Found a math item but not a number.");
          }
          //console.log(tVar);
          if (!math.isMatrix(tVar)) {
            tVar = math.matrix([
              [tVar]
            ]);
          }
          if (j === 0) {
            tempRow = tVar;
          } else {
            tempRow = math.concat(tempRow, tVar);
          }
        }
        if (i === 0) {
          tempData = tempRow;
        } else {
          tempData = math.transpose(math.concat(math.transpose(tempData), math.transpose(tempRow)));
        }
      }
      return tempData;
    },

    getConst: function (Constant) {
      if (Constant === "Infinity") return "\\infty";
      if (math.typeOf(math.evaluate(Constant)) === "number") return math.evaluate(Constant);
      else return Constant;
    },

    checkAllCellsParams: function (allCells = null) {
      if (!allCells) {
        allCells = Object.values(mainSystem.graph.getModel().cells);
      }
      let allGood = true;
      for (let i = 0; i < allCells.length; i++) {
        if (!!allCells[i].style && allCells[i].style.indexOf('umk_model') >= 0) {
          if (!this.checkCellParams(allCells[i])) {
            allGood = false;
          }
        }
      }
      return allGood;
    },
    checkCellParams: function (cell) {
      if (!this.parser) {
        this.clearAndparseAll();
      }
      if (!!cell.value.Parameters) {
        let params = Object.keys(cell.value.Parameters);
        for (let i = 0; i < params.length; i++) {
          if (cell.value.Parameters[params[i]].Type === "Complex" ||
            cell.value.Parameters[params[i]].Type === "Real" ||
            cell.value.Parameters[params[i]].Type === "Integer") {
            let pVal = cell.value.Parameters[params[i]].Value;
            //console.log(pVal);
            try {
              this.getVarValue(pVal);
            } catch (e) {
              console.log(e);
              mainSystem.graph.setCellWarning(cell, "<b>" + GUIText[settings.lang].errParamEntry + "</b><br/>" + GUIText[settings.lang].errorParsing);
              return false;
            }
          }
        }
        mainSystem.graph.setCellWarning(cell);
        return true;
      } else {
        return true;
      }
    },
    toLocal: function() {

    },
    frmLocal: function() {

    }
  }
});