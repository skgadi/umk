class umk_1694403449663 extends umk_model {
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
    this.getInputIfRequired();
  }
  getInputIfRequired() {
    //console.log("testing");
    if (this.CompParams.addInput){
      if (!!this.inputs[0] && !!this.inputs[1] && !!this.inputs[2] && !!this.inputs[3] && !!this.inputs[4]) {
        this.CompParams.matInp = this.inputs[4];
        for (let i=0; i<4; i++) {
          this.CompParams.inputs[i] = this.inputs[i];
        }
        this.CompParams.addInput = false;
        //console.log("passed");
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
    

    this.CompParams.inputs=[];


    //console.log("this.Parameters.ic: " + JSON.stringify(this.Parameters.ic.Value));
    //this.CompParams.x = math.zeros(this.Parameters.ic.Value._data.length, this.Parameters.ic.Value._data[0].length); // states
    this.CompParams.x = this.Parameters.ic.Value;
    //console.log(this.CompParams.x);
    this.CompParams.addInput = true;
    this.CompParams.matInp = math.zeros(this.CompParams.inDims[0], this.CompParams.inDims[1]);
    //console.log(this.CompParams.matInp);
  }
  Evaluate(t, k, simSettings) {
    //console.log("this.CompParams: " + JSON.stringify(this.CompParams));
    this.getInputIfRequired();

    //console.log("this.CompParams: " + JSON.stringify(this.CompParams));
    let tempX = this.CompParams.x;
    //console.log("this.CompParams: " + JSON.stringify(this.CompParams));
    if (!!this.CompParams.inputs) {
      tempX = math.add(math.multiply(this.CompParams.inputs[0], this.CompParams.x),
        math.multiply(this.CompParams.inputs[1], this.CompParams.matInp));
    }
    this.CompParams.x = tempX;
    let tempY = math.zeros(this.CompParams.outDims[0], this.CompParams.outDims[1]);
    if (!!this.CompParams.inputs) {
      tempY = math.add(math.multiply(this.CompParams.inputs[2], this.CompParams.x),
        math.multiply(this.CompParams.inputs[3], this.CompParams.matInp));
    }
    this.outputs[0] = tempY;
  }

  afterEC(t, k, simSettings) {
    this.getInputIfRequired();
  }

  Details(short = false) {
    if (short) {
      return TeX.prepInline(" x(k+1) = A(k) x(k) + B(k) u(k)") +
        "<br/>" +
        TeX.prepInline("y(k) = C(k) x(k) + D(k) u(k)");
    } else {
      return TeX.prepDisp("x(k+1) = A(k) x(k) + B(k) u(k)") +
        "<br/>" +
        TeX.prepDisp("y(k) = C(k) x(k) + D(k) u(k)");
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