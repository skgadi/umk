class umk_1589386524463 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp((this.Parameters.typ.Value[0][0] === "ew") ? "u_{i,j}^3" : "u^3"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    if (this.Parameters.typ.Value[0][0] === "ew") {
      this.outputs[0] = math.cube(this.inputs[0]);
    } else {
      this.outputs[0] = math.multiply(this.inputs[0], math.multiply(this.inputs[0], this.inputs[0]));
    }
  }
  Details() {
    if (this.Parameters.typ.Value[0][0] === "ew") {
      return TeX.prepDisp("y_{i,j}(t) = u_{i,j}^{3}(t)");
    } else {
      return TeX.prepDisp("y(t) = u^{3}(t)");
    }
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "typ": {
          "Name": {
            "en-us": "Type of operation",
            "es-mx": "Tipo de operación"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options": {
            ew: {
              "en-us": "Elementwise operation",
              "es-mx": "Operación por elementos"
            },
            mt: {
              "en-us": "Matrix operation",
              "es-mx": "Operación matricial"
            }
          },
          "Value": [
            ["ew"]
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