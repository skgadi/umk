class umk_1589386565541 extends umk_model {
  Icon() {
    return {
      //html: blockUtils.makeIcon(this.id),
      html: TeX.prepDisp("u" + ((this.Parameters.typ.Value[0][0] === "ew") ? "_{i,j}" : "") + "^{" + this.Parameters.pow.Value[0][0] + "}(t)"),
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  Evaluate() {
    if (this.Parameters.typ.Value[0][0] === "mt") {
      this.outputs[0] = math.pow(this.inputs[0], this.Parameters.pow.Value._data[0][0]);
    } else {
      this.outputs[0] = math.dotPow(this.inputs[0], this.Parameters.pow.Value._data[0][0]);
    }
  }
  Details() {
    if (this.Parameters.typ.Value[0][0] === "mt") {
      return TeX.prepDisp("y(t) = u^{" + this.Parameters.pow.Value[0][0] + "}(t)");
    } else {
      return TeX.prepDisp("y_{i,j}(t) = u_{i,j}^{" + this.Parameters.pow.Value[0][0] + "}(t)");
    }
  }
  invalidParams() {
    try {
      if (this.Parameters.typ.Value[0][0] === "mt") {
        return !math.isInteger(math.evaluate(this.Parameters.pow.Value[0][0]));
      } else {
        return false;
      }
    } catch (e) {
      return true;
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
        },
        "pow": {
          "Name": {
            "en-us": "Raise to the power $(a)$",
            "es-mx": "Elevar al poder $(a)$"
          },
          "Dimension": "Scalar",
          "Type": "Complex",
          "Value": [
            [2]
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