class umk_1590046975775 extends umk_model {
  Icon() {
    return {
      html: this.Details(true),
      inLabels: ["$A$", "$B$", "$C$", "$D$", "$u$"],
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
    this.CompParams.addInputMat = true;
    this.getInputIfRequired();
  }
  getInputIfRequired() {

    //console.log("testing");
    if (this.CompParams.addInputMat){
      if (!!this.inputs[0] && !!this.inputs[1] && !!this.inputs[2] && !!this.inputs[3]) {
        for (let i=0; i<4; i++) {
          this.CompParams.inputs[i] = this.inputs[i];
        }
        this.CompParams.addInputMat = false;

        //console.log("passed");
      }
    }
    if(this.CompParams.addInput){
      if (!!this.inputs[4]) {
        this.CompParams.matInp = this.inputs[4];
        this.CompParams.addInput = false;
      }
    }
  }
  genCompParams() {
    // Check for the valid input dimensions
    this.CompParams.inDims = JSON.parse(this.Parameters.dimIn.Value[0][0]);
    if (this.CompParams.inDims.length !== 2) {
      throw "Error in input dimensions entry";
    }
    for (let i = 0; i < 2; i++) {
      if ((!math.isPositive(this.CompParams.inDims[i])) || (!math.isInteger(this.CompParams.inDims[i]))) {
        throw "Invalid values for the input dimentions";
      }
    }
    // Check for the valid output dimensions
    this.CompParams.outDims = JSON.parse(this.Parameters.dimOut.Value[0][0]);
    if (this.CompParams.outDims.length !== 2) {
      throw "Error in input dimensions entry";
    }
    for (let i = 0; i < 2; i++) {
      if ((!math.isPositive(this.CompParams.outDims[i])) || (!math.isInteger(this.CompParams.outDims[i]))) {
        throw "Invalid values for the input dimentions";
      }
    }
    this.CompParams.x = []; //Output of int
    this.CompParams.pt = [0]; // previous time
    this.CompParams.mem = []; //Memory for integration
    this.CompParams.addInput = true;
    this.CompParams.addInputMat = true;
    this.CompParams.inputs=[];
    this.CompParams.matInp = math.zeros(this.CompParams.inDims[0], this.CompParams.inDims[1]);
  }
  Evaluate(t, k, simSettings) {
    this.getInputIfRequired();
    let dx;
    //let xBefore = this.Parameters.ic.Value;
    let xBefore;
    //console.log("this.CompParams.inputs: " + JSON.stringify(this.CompParams.inputs));
    //console.log("this.CompParams.x: " + JSON.stringify(this.CompParams.x));
    if (!!t) {
      xBefore = this.CompParams.x[0];
    } else {
      xBefore = this.Parameters.ic.Value;
      this.CompParams.x[0] = this.Parameters.ic.Value;
    }
    
    dx = math.add(math.multiply(this.CompParams.inputs[0], this.CompParams.x[0]),
      math.multiply(this.CompParams.inputs[1], this.CompParams.matInp));
    //console.log(JSON.stringify(matInp));
    //console.log(this.CompParams.x[0]);
    let pData = {
      mem: this.CompParams.mem,
      it: ((this.Parameters.it.Value[0][0] === "default") ? simSettings.it : this.Parameters.it.Value[0][0]),
      iv: this.Parameters.ic.Value,
      t: t,
      inp: dx,
      out: this.CompParams.x,
      pt: this.CompParams.pt,
      isFr: this.CompParams.isFr,
      isMovedFirstInEO: true || this.isMovedFirstInEO
    };
    blockUtils.integrate(pData);
    //console.log("Test item");
    this.outputs[0] = math.add(math.multiply(this.CompParams.inputs[2], this.CompParams.x[0]),
    math.multiply(this.CompParams.inputs[3], this.CompParams.matInp));
    /*if (!t) {
      this.outputs[0] = math.zeros(this.CompParams.outDims[0], this.CompParams.outDims[1]);
    } else {
    }*/
  }
  afterEC(t, k, simSettings) {
    this.getInputIfRequired();
  }

  Details(short = false) {
    if (short) {
      return TeX.prepInline("\\dot x(t) = A(t) x(t) + B(t) u(t)") +
        "<br/>" +
        TeX.prepInline("y(t) = C(t) x(t) + D(t) u(t)");
    } else {
      return TeX.prepDisp("\\dot x(t) = A(t) x(t) + B(t) u(t)") +
        "<br/>" +
        TeX.prepDisp("y(t) = C(t) x(t) + D(t) u(t)");
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
        "ic": {
          "Name": {
            "en-us": "Initial conditions for the state $(x_0)$",
            "es-mx": "Condiciones iniciales para el estado $(x_0)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [0],
            [0]
          ]
        },
        "dimIn": {
          "Name": {
            "en-us": "Input dimensions",
            "es-mx": "Dimensiones de entrada"
          },
          "Dimension": "Scalar",
          "Type": "Text",
          "Value": [
            ["[1,1]"]
          ]
        },
        "dimOut": {
          "Name": {
            "en-us": "Output dimensions",
            "es-mx": "Dimensiones de salida"
          },
          "Dimension": "Scalar",
          "Type": "Text",
          "Value": [
            ["[1,1]"]
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
        min: 5,
        max: 5,
        value: 5,
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