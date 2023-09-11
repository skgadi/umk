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
    this.genCompParams();
    this.CompParams.isFr = [0];
  }
  beforeEC(t, k, simSettings) {
    //this.outputs[0] = this.CompParams.out[0];
    this.CompParams.addInput = true;
    //this.getInputIfRequired();
    //console.log("input after beforeEC = " + JSON.stringify(this.CompParams.matInp._data));
  }
  getInputIfRequired() {
    if (this.CompParams.addInput){
      //console.log("this.inputs[0] = " + JSON.stringify(this.inputs[0]));
      if (!!this.inputs[0]) {
        this.CompParams.matInp = this.inputs[0];
        //console.log("input = " + JSON.stringify(this.CompParams.matInp._data));
        this.CompParams.addInput = false;
      }
    }
  }
  genCompParams() {

    this.CompParams.addInput = true;
    




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
    if (this.CompParams.maxNum > this.CompParams.maxDen) {
      let err = {
        "en-us": "Not a proper transfer function.", // strictly
        "es-mx": "No es una función de transferencia adecuada." //estrictamente
      };
      this.err = err[settings.lang];
      throw err[settings.lang];
    }
    //Calculate A, B, C, D matrices from the transfer function using observable canonical form give
    //in Ingeniería de control moderna by Ogata 5th edition page 650 (Forma canónica observable)
    //Calculating A
    this.CompParams.A = math.zeros(this.CompParams.maxDen-1, this.CompParams.maxDen-1);
    for (let i = 0; i < (this.CompParams.maxDen-1 ); i++) {
      if (!!i) {
        this.CompParams.A._data[i][i-1] = 1;
      }
      this.CompParams.A._data[i][this.CompParams.maxDen-2] = -this.Parameters.d.Value._data[i][0]/(this.Parameters.d.Value._data[this.CompParams.maxDen - 1][0]);
    }
    //Calculating B
    this.CompParams.B = math.zeros(this.CompParams.maxDen-1, 1);
    let b0 = this.Parameters.n.Value._data[this.CompParams.maxDen - 1];
    if (!b0) {
      b0 = 0;
    } else {
      b0 = b0[0]/this.Parameters.d.Value._data[this.CompParams.maxDen - 1][0];
    }
    for (let i = 0; i < (this.CompParams.maxDen-1); i++) {
      let temp = this.Parameters.n.Value._data[i];
      if (!temp) {
        temp = 0;
      } else {
        temp = temp[0];
      }
      this.CompParams.B._data[i][0] = temp/(this.Parameters.d.Value._data[this.CompParams.maxDen - 1][0])+b0*this.CompParams.A._data[i][this.CompParams.maxDen-2];
    }
    //Calculating C
    this.CompParams.C = math.zeros(1, this.CompParams.maxDen-1);
    this.CompParams.C._data[0][this.CompParams.maxDen-2] = 1;

    //Calculating D
    this.CompParams.D = math.zeros(1, 1);
    this.CompParams.D._data[0][0] = b0;

    this.CompParams.matInp = math.zeros(this.CompParams.dims[0], this.CompParams.dims[1]);

    //creating the variables for integration

    this.CompParams.xs = [[[]]]; //Output of int
    this.CompParams.pts = [[]]; // previous time
    this.CompParams.mems = [[[]]]; //Memory for integration
    for (let i = 0; i < this.CompParams.dims[0]; i++) {
      this.CompParams.xs[i] = [];
      this.CompParams.pts[i] = [];
      this.CompParams.mems[i] = [];
      for (let j = 0; j < this.CompParams.dims[1]; j++) {
        this.CompParams.xs[i][j] = [];
        this.CompParams.pts[i][j] = [0];
        this.CompParams.mems[i][j] = [];
      }
    }

    //create zero intial conditions
    this.CompParams.initValues = math.zeros(this.CompParams.maxDen - 1, 1);
    
    //console.log("A = " + JSON.stringify(this.CompParams.A));
    //console.log("B = " + JSON.stringify(this.CompParams.B));
    //console.log("C = " + JSON.stringify(this.CompParams.C));
    //console.log("D = " + JSON.stringify(this.CompParams.D));

    
    //console.log(this.CompParams);
  }
  Evaluate(t, k, simSettings) {
    
    this.getInputIfRequired();
    let out = math.zeros(this.CompParams.dims[0], this.CompParams.dims[1]);
    for (let i = 0; i < this.CompParams.dims[0]; i++) {
      for (let j = 0; j < this.CompParams.dims[1]; j++) {
        let dx;

        //console.log("input = " + JSON.stringify(this.CompParams.matInp._data[i][j]));

        let xBefore = this.CompParams.initValues;
        if (!!t) {
          dx = math.add(math.multiply(this.CompParams.A, this.CompParams.xs[i][j][0]),
          math.multiply(this.CompParams.B, this.CompParams.matInp._data[i][j]));
          xBefore = this.CompParams.xs[i][j][0];
        }
        //console.log("t = " + JSON.stringify(t));
        try {
          //console.log("xs before int = " + JSON.stringify(this.CompParams.xs[i][j][0]._data));
        } catch (e) {
          //console.log(e);
        }
        //console.log("dx = " + JSON.stringify(dx));
        let pData = {
          mem: this.CompParams.mems[i][j],
          it: ((this.Parameters.it.Value[0][0] === "default") ? simSettings.it : this.Parameters.it.Value[0][0]),
          iv: this.CompParams.initValues,
          t: t,
          inp: dx,
          out: this.CompParams.xs[i][j],
          pt: this.CompParams.pts[i][j],
          isFr: this.CompParams.isFr
        };
        blockUtils.integrate(pData);
        
        //console.log("xs after int = " + JSON.stringify(this.CompParams.xs[i][j][0]._data));
        
        //console.log("Cx = "+ JSON.stringify(math.multiply(this.CompParams.C, xBefore)._data));
        //console.log("Du = "+ JSON.stringify(math.multiply(this.CompParams.D, this.CompParams.matInp._data[i][j])._data));
        let tempOut = math.add(math.multiply(this.CompParams.C, xBefore), math.multiply(this.CompParams.D, this.CompParams.matInp._data[i][j]));
        
        out._data[i][j] = tempOut._data[0][0];
        //console.log( "out = " + JSON.stringify(out._data));
        
      }
    }
    this.outputs[0] = out;
  }
  afterEC(t, k, simSettings) {
    this.getInputIfRequired();
  }
  Details(short = false) {
    try {
      let n = varManagerVue.getVarValue(this.Parameters.n.Value);
      let d = varManagerVue.getVarValue(this.Parameters.d.Value);
      //console.log(n);
      //console.log(d);
      let out = "(";
      for (let i = (n._data.length - 1); i >= 0; i--) {
        out += "+(" + n._data[i][0] + ")*s^(" + i + ")";
      }
      out += ")/(";
      for (let i = (d._data.length - 1); i >= 0; i--) {
        out += "+(" + d._data[i][0] + ")*s^(" + i + ")";
      }
      out += ")";
      //this.Icon_Temp_Html = TeX.prepDisp(math.simplify(out).toTex(4));
      if (short) {
        return TeX.prepDisp(math.simplify(out).toTex());
      } else {
        return TeX.prepDisp("\\frac{y(s)}{u(s)}:=" + math.simplify(out).toTex());
      }
    } catch (e) {
      if (short) {
        this.Icon_Temp_Html = TeX.prepDisp("\\frac{y(s)}{u(s)}")
      } else {
        this.Icon_Temp_Html = TeX.prepDisp("\\frac{y(s)}{u(s)}")
      }
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