class umk_1589386591230 extends umk_model {
    Icon() {
      return {
        //html: blockUtils.makeIcon(this.id),
        html: TeX.prepDisp("u_{1" + ((this.Parameters.typ.Value[0][0] === "ew") ? "_{i,j}}^{u_{2_{i,j}}}" : "}^{u{_2}}")),
        inLabels: null,
        outLabels: null,
        splStyle: null
      };
    }
    Evaluate() {
      if (this.Parameters.typ.Value[0][0] === "mt") {
        this.outputs[0] = math.pow(this.inputs[0], this.inputs[1]._data[0][0]);
      } else {
        this.outputs[0] = math.dotPow(this.inputs[0], this.inputs[1]);
      }
    }
    Details() {
      if (this.Parameters.typ.Value[0][0] === "mt") {
        return TeX.prepDisp("y(t) = \\left(u_1(t)\\right)^{u_2(t)}");
      } else {
        return TeX.prepDisp("y_{i,j}(t) = \\left(u_{1_{i,j}}(t)\\right)^{u_{2_{i,j}}(t)}");
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
          min: 2,
          max: 2,
          value: 2,
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