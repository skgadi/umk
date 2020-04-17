const varManagerVue = new Vue({
  el: "#varManager",
  data: {
    constants: ["e", "E", "i", "Infinity", "LN2", "LN10", "LOG2E", "LOG10E", "phi", "pi", "PI", "SQRT1_2", "SQRT2", "tau"],
    keywords: ["NaN", "null", "undefined", "mod", "to", "in", "and", "xor", "or", "not", "end"],
    display: false,
    variables: {},
    showAddVar: false,
    newVar: {
      name: "",
      value: [
        [1]
      ]
    }
  },
  watch: {
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
      let varToModify = this.newVar.value;
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
    showGUI: function (show = true) {
      this.display = show;
    },
    getConst: function (Constant) {
      if (Constant === "Infinity") return "\\infty";
      if (math.typeOf(math.evaluate(Constant)) === "number") return math.evaluate(Constant);
      else return Constant;
    }
  }
});