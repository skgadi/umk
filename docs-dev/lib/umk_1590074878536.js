class umk_1590074878536 extends umk_model {
  Icon() {
    return {
      html: this.Details(true),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  /*  Icon_Temp_Html() {
      try {
        
      } catch (e) {
        console.log(e);
      }
      return TeX.prepDisp("\\int");
    }*/
  Init() {
    this.genCompParams();
    this.CompParams.isForward = 0;
  }
  genCompParams() {
    // Check for the valid dimensions
    this.CompParams.dims = JSON.parse(this.Parameters.dim.Value[0][0]);
    if (this.CompParams.dims.length !== 2) {
      throw "Error in Dimensions entry";
    }
    for (let i = 0; i < 2; i++) {
      if ((!math.isPositive(this.CompParams.dims[i])) || (!math.isInteger(this.CompParams.dims[i]))) {
        throw "Invalid values for the dimentions";
      }
    }

    //Den max degree
    for (let i = (this.Parameters.d.Value._data.length - 1); i >= 0; i--) {
      if (!!this.Parameters.d.Value._data[i][0]) {
        this.CompParams.maxDen = i + 1;
        break;
      }
    }
    for (let i = (this.Parameters.n.Value._data.length - 1); i >= 0; i--) {
      if (!!this.Parameters.n.Value._data[i][0]) {
        this.CompParams.maxNum = i + 1;
        break;
      }
    }
    if (!(this.CompParams.maxDen >= this.CompParams.maxNum)) {
      let err = {
        "en-us": "Not a proper transfer function.", // strictly
        "es-mx": "No es una función de transferencia adecuada." //estrictamente
      };
      this.err = err[settings.lang];
      throw err[settings.lang];
    }
    this.CompParams.InCoeff = math.zeros(this.CompParams.maxDen, 1);
    this.CompParams.OutCoeff = math.zeros(this.CompParams.maxDen, 1);
    for (let i = 0; i < this.CompParams.maxDen; i++) {
      if (!!this.Parameters.n.Value._data[i]) {
        this.CompParams.InCoeff._data[i][0] = this.Parameters.n.Value._data[i][0];
      }
      if (!!this.Parameters.d.Value._data[i]) {
        this.CompParams.OutCoeff._data[i][0] = this.Parameters.d.Value._data[i][0];
      }
    }
    this.CompParams.InCoeff = math.dotDivide(this.CompParams.InCoeff, this.CompParams.OutCoeff._data[this.CompParams.maxDen-1][0]);
    this.CompParams.OutCoeff = math.dotDivide(this.CompParams.OutCoeff, this.CompParams.OutCoeff._data[this.CompParams.maxDen-1][0]);

    this.CompParams.Ins = [];
    for (let i = this.CompParams.Ins.length; i < this.CompParams.maxDen; i++) {
      this.CompParams.Ins.push(math.zeros(this.CompParams.dims[0], this.CompParams.dims[1]));
    }

    this.CompParams.Outs = [];
    for (let i = this.CompParams.Outs.length; i < this.CompParams.maxDen; i++) {
      this.CompParams.Outs.push(math.zeros(this.CompParams.dims[0], this.CompParams.dims[1]));
    }
  }
  Evaluate() {
    const that = this;

    function putOuts() {
      //console.log(JSON.stringify(that.CompParams.Outs));
      //console.log(JSON.stringify(that.CompParams.Ins));
      //console.log(JSON.stringify(that.CompParams.InCoeff));
      //console.log(JSON.stringify(that.CompParams.OutCoeff));
      let out = math.dotMultiply(that.CompParams.Ins[that.CompParams.maxDen - 1], that.CompParams.InCoeff._data[that.CompParams.maxDen - 1][0]);
      //console.log("Hey");
      //console.log(JSON.stringify(out._data));
      //console.log(JSON.stringify(out._data));
      for (let i = (that.CompParams.maxDen - 2); i >= 0; i--) {
        out = math.add(out, math.dotMultiply(that.CompParams.Ins[i], that.CompParams.InCoeff._data[i][0]));
        //console.log(JSON.stringify(out._data));
        out = math.subtract(out, math.dotMultiply(that.CompParams.Outs[i+1], that.CompParams.OutCoeff._data[i][0]));
        //console.log(JSON.stringify(out._data));
      }
      that.outputs[0] = out;
      that.CompParams.Outs.push(out);
      that.CompParams.Outs.shift();
    }

    function getIns() {
      if (!!that.inputs[0]) {
        that.CompParams.Ins.push(that.inputs[0]);
        that.CompParams.Ins.shift();
      }
    }
    if (this.CompParams.isForward === 0) {
      if (!!this.inputs[0]) {
        this.CompParams.isForward = true;
      } else {
        this.CompParams.isForward = false;
      }
    }
    if (this.CompParams.isForward) {
      getIns();
      putOuts();
    } else {
      getIns();
      putOuts();
    }
  }
  Details(short = false) {
    try {
      let n = varManagerVue.getVarValue(this.Parameters.n.Value);
      let d = varManagerVue.getVarValue(this.Parameters.d.Value);
      //console.log(n);
      //console.log(d);
      let out = "(";
      for (let i = (n._data.length - 1); i >= 0; i--) {
        out += "+(" + n._data[i][0] + ")*z^(" + i + ")";
      }
      out += ")/(";
      for (let i = (d._data.length - 1); i >= 0; i--) {
        out += "+(" + d._data[i][0] + ")*z^(" + i + ")";
      }
      out += ")";
      //console.log(out);
      //this.Icon_Temp_Html = TeX.prepDisp(math.simplify(out).toTex(4));
      if (short) {
        return TeX.prepDisp(math.simplify(out).toTex(4));
      } else {
        return TeX.prepDisp("\\frac{y(z)}{u(z)}:=" + math.simplify(out).toTex(4));
      }
    } catch (e) {
      this.Icon_Temp_Html = TeX.prepDisp("\\frac{y(z)}{u(z)}")
      return this.Icon_Temp_Html;
    }
  }
  constructor(obj) {
    let tempIntTypes = {
      "default": {
        "en-us": "Default",
        "es-mx": "Defecto"
      }
    };
    Object.keys(intTypes).forEach(function (key) {
      tempIntTypes[key] = intTypes[key].desc;
    });
    super(Object.assign({
      fInEO: true,
      Parameters: {
        "n": {
          "Name": {
            "en-us": "Numerator $(N)$",
            "es-mx": "Numerador $(N)$"
          },
          "Dimension": "Vector",
          "Type": "Complex",
          "Value": [
            [1]
          ]
        },
        "d": {
          "Name": {
            "en-us": "Denominator $(D)$",
            "es-mx": "Denominador $(D)$"
          },
          "Dimension": "Vector",
          "Type": "Complex",
          "Value": [
            [1],
            [1]
          ]
        },
        "dim": {
          "Name": {
            "en-us": "Input dimensions",
            "es-mx": "Dimensiones de entrada"
          },
          "Dimension": "Scalar",
          "Type": "Text",
          "Value": [
            ["[1,1]"]
          ]
        }
      },
      TerminalsIn: {
        min: 1,
        max: 1,
        value: 1,
        editable: false
      },
      TerminalsOut: {
        min: 1,
        max: 1,
        value: 1,
        editable: false
      }
    }, obj));
  }
}