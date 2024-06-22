class umk_1694398255523 extends umk_model {
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
    this.getInputIfRequired();
  }
  getInputIfRequired() {
    if (this.CompParams.addInput){
      if (!!this.inputs[0]) {
        this.CompParams.matInp = this.inputs[0];
        this.CompParams.addInput = false;
        //console.log(JSON.stringify(this.CompParams.mem));
      }
    }
  }
  genCompParams() {
    //console.log("this.Parameters.ic: " + JSON.stringify(this.Parameters.ic.Value));
    //this.CompParams.x = math.zeros(this.Parameters.ic.Value._data.length, this.Parameters.ic.Value._data[0].length); // states
    //console.log(this.CompParams.x);
    this.CompParams.x = this.Parameters.ic.Value;
    this.CompParams.addInput = true;
    this.CompParams.matInp = math.zeros(this.Parameters.b.Value._data[0].length, this.Parameters.ic.Value._data[0].length);
    //console.log(this.CompParams.matInp);
  }
  Evaluate(t, k, simSettings) {
    this.getInputIfRequired();
    let tempX = math.add(math.multiply(this.Parameters.a.Value, this.CompParams.x), math.multiply(this.Parameters.b.Value, this.CompParams.matInp));
    this.CompParams.x = tempX;
    let tempY = math.add(math.multiply(this.Parameters.c.Value, this.CompParams.x),
    math.multiply(this.Parameters.d.Value, this.CompParams.matInp));
    this.outputs[0] = tempY;
  }
  afterEC(t, k, simSettings) {
    this.getInputIfRequired();
  }

  Details(short = false) {
    if (short) {
      return TeX.prepInline("\\dot x(k+1) = A x(k) + B u(k)") +
      "<br/>" +
      TeX.prepInline("y(k) = C x(k) + D u(k)");
    } else {
      return TeX.prepDisp("\\dot x(k+1) = " + TeX.frmArray(this.Parameters.a.Value) + " x(k) + " + TeX.frmArray(this.Parameters.b.Value) + " u(k)") +
        "<br/>" +
        TeX.prepDisp("y(k) = " + TeX.frmArray(this.Parameters.c.Value) + " x(k) + " + TeX.frmArray(this.Parameters.d.Value, undefined, true) + " u(k)");
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
        "a": {
          "Name": {
            "en-us": "$A$",
            "es-mx": "$A$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [0, 1],
            [-1, -1]
          ]
        },
        "b": {
          "Name": {
            "en-us": "$B$",
            "es-mx": "$B$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [0],
            [1]
          ]
        },
        "c": {
          "Name": {
            "en-us": "$C$",
            "es-mx": "$C$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [1, 0]
          ]
        },
        "d": {
          "Name": {
            "en-us": "$D$",
            "es-mx": "$D$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [0]
          ]
        },
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