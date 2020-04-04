const varManagerVue = new Vue({
    el: "#varManager",
    data: {
        display: false,
        constants: {},
        uVariables: {},
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
        showGUI: function (show = true) {
            this.display = show;
        }
    }
});


/*
const parser = math.parser();
var variablesManager = new Vue({
  el: "#variablesManager",
  data: {
    selVar: NaN,
    updatingCounter: 0,
    varBanList: ["mod", "to", "in", "and", "xor", "or", "not", "end"],
    editItem: {},
    visible: {
      vars: true,
      uVars: true
    },
    dragSource: null,
    uVars: [{
        id: ["e", "E"],
        desc: "Euler’s number, the base of the natural logarithm.",
        value: "2.718281828459045"
      },
      {
        id: ["i"],
        desc: "Imaginary unit, defined as $i\\times i=-1$. A complex number is described as $a + bi$, where $a$ is the real part, and $b$ is the imaginary part.",
        value: "\\sqrt{-1}"
      },
      {
        id: ["Infinity"],
        desc: "Infinity, a number which is larger than the maximum number that can be handled by a floating point number.",
        value: "\\infty"
      },
      {
        id: ["LN2"],
        desc: "Returns the natural logarithm of 2.",
        value: "0.6931471805599453"
      },
      {
        id: ["LN10"],
        desc: "Returns the natural logarithm of 10.",
        value: "2.302585092994046"
      },
      {
        id: ["LOG2E"],
        desc: "Returns the base-2 logarithm of E.",
        value: "1.4426950408889634"
      },
      {
        id: ["LOG10E"],
        desc: "Returns the base-10 logarithm of E.",
        value: "0.4342944819032518"
      },
      {
        id: ["phi"],
        desc: "Phi is the golden ratio. Two quantities are in the golden ratio if their ratio is the same as the ratio of their sum to the larger of the two quantities. Phi is defined as $\\frac{1 + \\sqrt{5}}{2}$",
        value: "1.618033988749895"
      },
      {
        id: ["pi", "PI"],
        desc: "The number pi is a mathematical constant that is the ratio of a circle's circumference to its diameter.	",
        value: "3.141592653589793"
      },
      {
        id: ["SQRT1\\_2"],
        desc: "Returns the square root of 1/2.",
        value: "0.7071067811865476"
      },
      {
        id: ["SQRT2"],
        desc: "Returns the square root of 2.	",
        value: "1.4142135623730951"
      },
      {
        id: ["tau"],
        desc: "Tau is the ratio constant of a circle's circumference to radius, equal to $2\\times \\pi$",
        value: "6.283185307179586"
      }
    ],
    vars: [{
        id: "g",
        desc: "Acceleration due to gravity",
        value: [
          [9.80665]
        ]
      },
      {
        id: "G",
        desc: "Gravitational constant",
        value: [
          [6.67408e-11]
        ]
      }
    ]
  },
  mounted: function () {
    this.updateParser();
  },
  updated: function () {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    this.updateParser();
  },
  methods: {
    updateParser: function () {
      parser.clear();
      for (var i = 0; i < this.vars.length; i++) {
        try {
          parser.evaluate(
            this.vars[i].id + "=" + JSON.stringify(this.vars[i].value)
          );
        } catch (e) {
          console.log(e);
        }
      }
    },
    changeIndex: function (e) {
      var startID = this.dragSource,
        endID;
      var trg = e.toElement;
      for (var i = 0; i < 100; i++) {
        if (startID !== undefined && endID !== undefined) {
          var tempRow = this.vars[endID];
          this.vars[endID] = this.vars[startID];
          this.vars[startID] = tempRow;
          console.log(e);
          this.updatingCounter++;
          break;
        }
        if (endID === undefined) {
          if (trg.getAttribute("draggable") === "true") {
            endID = parseInt(trg.id.split("_")[1]);
          } else trg = trg.parentElement;
        }
      }
      tempGlobal = e;
    },
    getUVarItem: function (uVarItem) {
      return (
        "$\\mathrm{" +
        uVarItem.id.join("}:=\\mathrm{") +
        "}:=" +
        uVarItem.value +
        "$"
      );
    },
    saveItem: function () {
      if (this.isValidVarID(this.editItem, this.selVar)) {
        this.editItem;
        if (this.selVar < 0) {
          this.vars.push(this.editItem);
        } else {
          this.vars.splice(
            this.selVar,
            1,
            JSON.parse2(JSON.stringify2(this.editItem))
          );
        }
        this.selVar = NaN;
      }
      this.$nextTick(() => {
        this.updatingCounter++;
      });
    },
    valueDimensionsModify: function (val) {
      switch (val) {
        case 0:
          this.editItem.value.push(
            new Array(this.editItem.value[0].length).fill(0)
          );
          break;
        case 1:
          if (this.editItem.value.length > 1) this.editItem.value.pop();
          break;
        case 2:
          this.editItem.value.map(function (val) {
            return val.push(0);
          });
          break;
        case 3:
          if (this.editItem.value[0].length > 1) {
            this.editItem.value.map(function (val) {
              return val.pop(0);
            });
          }
          break;
      }
      //this.updatingCounter++;
    },
    selectAExistingItem: function (index) {
      this.editItem = JSON.parse2(JSON.stringify2(this.vars[index]));
      this.selVar = index;
    },
    removeItem: function (index) {
      this.vars.splice(index, 1);
      this.updatingCounter++;
    },
    isValidVarID: function (item, ignoreIndex) {
      if (!/^\w+$/.test(item.id)) {
        notyf.error(
          'Invalid ID: "<b>' +
          item.id +
          '</b>" contains invalid characters.'
        );
        return false;
      }
      if (!isNaN(item.id.charAt(0))) {
        notyf.error(
          "Invalid ID: Variable name cannot start with a number."
        );
        return false;
      }
      if (item.id === "") {
        notyf.error("Invalid ID: Variable name cannot be blank.");
        return false;
      }
      if (this.varBanList.indexOf(item.id) >= 0) {
        notyf.error(
          'Invalid ID: "<b>' + item.id + "</b>\" is a Uyamak's keyword."
        );
        return false;
      }
      for (var i = 0; i < this.vars.length; i++) {
        if (
          item.id === this.vars[i].id &&
          (ignoreIndex >= 0 ?
            item.id !== this.vars[ignoreIndex].id :
            true)
        ) {
          notyf.error(
            'Invalid ID: "<b>' + item.id + '</b>" is already in use.'
          );
          return false;
        }
      }
      return true;
    },
    genVarView: function (item) {
      if (!!item.value) {
        try {
          return (
            "$" +
            math
            .parse(
              item.id +
              "=" +
              math.parse(
                math
                .matrix(
                  this.global.getTheParameterValueFromEntry(
                    item.value
                  )
                )
                .toString()
              )
            )
            .toTex(4) +
            "$"
          );
        } catch (e) {
          console.log(e);
          return "Possible input error!";
        }
        /*
        var inArray = item.value;
        if (inArray.length === 1 && inArray[0].length === 1) {
          return "$" + inArray[0][0] + "$";
        }
        var StrOut = "$\\begin{bmatrix}\n";
        for (var i = 0; i < inArray.length; i++) {
          for (var j = 0; j < inArray[0].length; j++) {
            if (j !== 0) StrOut += "\t&\t";
            StrOut += inArray[i][j].toString();
          }
          StrOut += "\t\\\\\n";
        }
        StrOut += "\\end{bmatrix}$";
        return StrOut;*/
      }
    }
  }
});
/**/