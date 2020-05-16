class umk_1589386600865 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      //html: TeX.prepDisp("u_{1" + ((this.Parameters.typ.Value[0][0] === "ew") ? "_{i,j}}^{u_{2_{i,j}}}" : "}^{u{_2}}")),
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  Evaluate() {
    if (this.Parameters.typ.Value[0][0] === "ew") {
      if (this.CompParams["aS"]) {
        this.outputs[0] = math.dotPow(this.Parameters.a.Value._data[0][0], this.inputs[0]);
      } else {
        if ((this.inputs[0]._data.length == 1) && (this.inputs[0]._data[0].length == 1)) {
          this.outputs[0] = math.dotPow(this.Parameters.a.Value, this.inputs[0]._data[0][0]);
        } else {
          this.outputs[0] = math.dotPow(this.Parameters.a.Value, this.inputs[0]);
        }
      }
    } else {
      this.outputs[0] = math.pow(this.Parameters.a.Value, this.inputs[0]._data[0][0]);
    }
  }
  Details() {
    if (this.Parameters.typ.Value[0][0] === "ew") {
      if ((this.Parameters.a.Value.length === 1) && (this.Parameters.a.Value[0].length === 1)) {
        return TeX.prepDisp("y_{i,j}(t) = " + this.Parameters.a.Value[0][0] + "^{u_{i,j}(t)}");
      } else {
        return TeX.prepDisp("y_{i,j}(t) = a_{i,j}^{u_{i,j}(t)}");
      }
    } else {
      return TeX.prepDisp("y(t)=a^{u_{1,1}}");
    }
  }
  genCompParams() {
    this.CompParams["aS"] = (this.Parameters.a.Value._data.length === 1) && (this.Parameters.a.Value._data[0].length === 1);
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "a": {
          "Name": {
            "en-us": "Base $(a)$",
            "es-mx": "Base $(a)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [2]
          ]
        },
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