class umk_1590074849722 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp("\\frac{1}{z}"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Init() {
    /*this.Evaluate_out = []; //Output of int
    this.Evaluate_pt = [0]; // previous time
    this.Evaluate_mem = []; //Memory for integration*/
    this.genCompParams();
    this.CompParams.isForward = 0;
  }
  genCompParams() {
    this.CompParams.pOut = this.Parameters.ic.Value;
  }
  Evaluate() {
    if (this.CompParams.isForward === 0) {
      if (!!this.inputs[0]) {
        this.CompParams.isForward = true;
      } else {
        this.CompParams.isForward = false;
      }
    }
    if (this.CompParams.isForward) {
      this.outputs[0] = this.CompParams.pOut;
      this.CompParams.pOut = this.inputs[0];
    } else {
      if (!!this.inputs[0]) {
        this.CompParams.pOut = this.inputs[0];
      }
      this.outputs[0] = this.CompParams.pOut;
    }
  }
  Details() {
    return TeX.prepDisp("y(t+h) = y(t)");
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
            "en-us": "Initial conditions $(y_0)$",
            "es-mx": "Condiciones iniciales $(y_0)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
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