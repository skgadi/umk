class umk_1590046944883 extends umk_model {
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
    this.getInputIfRequired();
    this.CompParams.addInput = true;
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
    this.CompParams.x = []; //Output of int
    this.CompParams.pt = [0]; // previous time
    this.CompParams.mem = []; //Memory for integration
    this.CompParams.addInput = true;
    this.CompParams.matInp = math.zeros(this.Parameters.b.Value._data[0].length, this.Parameters.ic.Value._data[0].length);
  }
  Evaluate(t, k, simSettings) {
    this.getInputIfRequired();
    let dx;
    let xBefore = this.Parameters.ic.Value;
    if (!!t) {
      dx = math.add(math.multiply(this.Parameters.a.Value, this.CompParams.x[0]),
      math.multiply(this.Parameters.b.Value, this.CompParams.matInp));
      xBefore = this.CompParams.x[0];
    }
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
      isFr: this.CompParams.isFr
    };
    blockUtils.integrate(pData);
    this.outputs[0] = math.add(math.multiply(this.Parameters.c.Value, xBefore),
      math.multiply(this.Parameters.d.Value, this.CompParams.matInp));
  }
  afterEC(t, k, simSettings) {
    this.getInputIfRequired();
  }

  Details(short = false) {
    if (short) {
      return TeX.prepInline("\\dot x(t) = A x(t) + B u(t)") +
      "<br/>" +
      TeX.prepInline("y(t) = C x(t) + D u(t)");
    } else {
      return TeX.prepDisp("\\dot x(t) = " + TeX.frmArray(this.Parameters.a.Value) + " x(t) + " + TeX.frmArray(this.Parameters.b.Value) + " u(t)") +
        "<br/>" +
        TeX.prepDisp("y(t) = " + TeX.frmArray(this.Parameters.c.Value) + " x(t) + " + TeX.frmArray(this.Parameters.d.Value, undefined, true) + " u(t)");
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