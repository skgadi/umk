class umk_1589836016344 extends umk_model {
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
    //console.log("ehsd");
    //console.log("Init");
    /*this.Evaluate_out = []; //Output of int
    this.Evaluate_pt = [0]; // previous time
    this.Evaluate_mem = []; //Memory for integration*/
    this.genCompParams();
  }
  genCompParams() {
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
    this.CompParams.InCoeff = math.zeros(this.Parameters.d.Value._data.length, this.Parameters.d.Value._data[0].length);
    this.CompParams.InInts = {
      outs: [],
      mems: []
    };
    for (let i = 0; i < this.CompParams.maxDen; i++) {
      this.CompParams.InInts.outs[i] = [];
      this.CompParams.InInts.mems[i] = [];
      if (!!this.Parameters.n.Value._data[i]) {
        this.CompParams.InCoeff._data[i][0] = this.Parameters.n.Value._data[i][0];
      }
    }
    this.CompParams.OutInts = {
      outs: [],
      mems: []
    };
    for (let i = 0; i < this.CompParams.maxDen; i++) {
      this.CompParams.OutInts.outs[i] = [];
      this.CompParams.OutInts.mems[i] = [];
    }
    this.CompParams.pt = [0]; // previous time
    this.CompParams.pOut = []; // previous time
  }
  Evaluate(t, k, simSettings) {
    //console.log('started');
    let it = ((this.Parameters.it.Value[0][0] === "default") ? simSettings.it : this.Parameters.it.Value[0][0]);
    this.CompParams.InInts.outs[this.CompParams.maxDen - 1][0] = this.inputs[0];
    let num = math.dotMultiply(this.CompParams.InInts.outs[this.CompParams.maxDen - 1][0], this.CompParams.InCoeff._data[this.CompParams.maxDen - 1][0]);
    for (let i = (this.CompParams.maxDen - 2); i >= 0; i--) {
      let pData = {
        mem: this.CompParams.InInts.mems[i],
        it: it,
        iv: null,
        t: t,
        inp: this.CompParams.InInts.outs[i + 1][0],
        out: this.CompParams.InInts.outs[i],
        pt: [this.CompParams.pt[0]]
      }
      blockUtils.integrate(pData, false);
      num = math.add(num, math.dotMultiply(this.CompParams.InInts.outs[i][0], this.CompParams.InCoeff._data[i][0]));
    }
    http: //localhost:5000/app1.html//console.log(JSON.stringify(this.CompParams.InInts));
      //console.log(num);
      if (!this.CompParams.OutInts.outs[this.CompParams.maxDen - 1].length) {
        this.CompParams.OutInts.outs[this.CompParams.maxDen - 1].push(math.zeros(this.inputs[0]._data.length, this.inputs[0]._data[0].length));
      }
    let den = math.zeros(this.inputs[0]._data.length, this.inputs[0]._data[0].length);
    for (let i = (this.CompParams.maxDen - 2); i >= 0; i--) {
      let pData = {
        mem: this.CompParams.OutInts.mems[i],
        it: it,
        iv: null,
        t: t,
        inp: this.CompParams.OutInts.outs[i + 1][0],
        out: this.CompParams.OutInts.outs[i],
        pt: [this.CompParams.pt[0]]
      }
      //console.log(JSON.stringify(this.CompParams.OutInts));
      blockUtils.integrate(pData, false);
      den = math.add(den, math.dotMultiply(this.CompParams.OutInts.outs[i][0], this.Parameters.d.Value._data[i][0]));
    }
    //console.log(JSON.stringify(this.CompParams.OutInts));
    //console.log(den);
    this.outputs[0] = math.subtract(num, den);
    this.CompParams.pt = [t]; //
    this.CompParams.OutInts.outs[this.CompParams.maxDen - 1][0] = this.outputs[0];
  }
  Details(short = false) {
    try {
      let n = varManagerVue.getVarValue(this.Parameters.n.Value);
      let d = varManagerVue.getVarValue(this.Parameters.d.Value);
      //console.log(n);
      //console.log(d);
      let out = "(";
      for (let i = (n._data.length - 1); i >= 0; i--) {
        out += "+(" + n._data[i][0] + ")*s^" + i;
      }
      out += ")/(";
      for (let i = (d._data.length - 1); i >= 0; i--) {
        out += "+(" + d._data[i][0] + ")*s^" + i;
      }
      out += ")";
      //this.Icon_Temp_Html = TeX.prepDisp(math.simplify(out).toTex(4));
      if (short) {
        return TeX.prepDisp(math.simplify(out).toTex(4));
      } else {
        return TeX.prepDisp("\\frac{y(s)}{u(s)}:=" + math.simplify(out).toTex(4));
      }
    } catch (e) {
      this.Icon_Temp_Html = TeX.prepDisp("\\frac{y(s)}{u(s)}")
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
        "it": {
          "Name": {
            "en-us": "Integration type",
            "es-mx": "Tipo de integración"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options": tempIntTypes,
          "Value": [
            ["default"]
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