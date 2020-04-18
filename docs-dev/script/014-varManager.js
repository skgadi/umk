const varManagerVue = new Vue({
  el: "#varManager",
  data: {
    constants: ["e", "E", "i", "Infinity", "LN2", "LN10", "LOG2E", "LOG10E", "phi", "pi", "PI", "SQRT1_2", "SQRT2", "tau"],
    keywords: ["NaN", "null", "undefined", "mod", "to", "in", "and", "xor", "or", "not", "end"],
    display: false,
    variables: [],
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
    updateMathJax();
  },
  watch: {
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
      }
    },
    moveVar: function (up = true, index = 0) {
      if (index >= 0 && index < this.variables.length) {
        let to = up ? index - 1 : index + 1;
        if (to >= 0 && to < this.variables.length) {
          this.variables.splice(to, 0, this.variables.splice(index, 1)[0]);
        }
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
      this.variables.splice(index,1);
    },
    getVariable: function (variable) {
      return TeXTools.makeMatrix(variable.value);
      return JSON.stringify(variable.value);
    },
    getVarValue: function (variable) {
      
    },
    startParser: function () {
      this.parser = math.parser();
      return true;
    },
    getConst: function (Constant) {
      if (Constant === "Infinity") return "\\infty";
      if (math.typeOf(math.evaluate(Constant)) === "number") return math.evaluate(Constant);
      else return Constant;
    }
  }
});