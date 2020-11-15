class umk_1589386555683 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp("\\Large \\div"),
      inLabels: ["1", "2"],
      outLabels: null,
      splStyle: null
    };
  }
  Evaluate() {
    if (this.Parameters.dtype.Value[0][0] === "fd") {
      this.outputs[0] = math.divide(this.inputs[0], this.inputs[1]);
    } else {
      if (this.Parameters.dtype.Value[0][0] === "bd") {
        this.outputs[0] = math.multiply(math.inv(this.inputs[0]), this.inputs[1]);
      } else {
        let inpSize = this.inputs[0].size();
        if (inpSize[0] === 1 && inpSize[1] === 1) {
          this.outputs[0] = math.dotDivide(this.inputs[0]._data[0][0], this.inputs[1]);
        } else {
          let inpSize = this.inputs[1].size();
          if (inpSize[0] === 1 && inpSize[1] === 1) {
            this.outputs[0] = math.dotDivide(this.inputs[0], this.inputs[1]._data[0][0]);
          } else {
            this.outputs[0] = math.dotDivide(this.inputs[0], this.inputs[1]);
          }
        }
      }
    }
  }
  Details() {
    if (this.Parameters.dtype.Value[0][0] === "fd") {
      return TeX.prepDisp("y(t) = u_1 \\left( u_2\\right)^{-1}");
    } else if (this.Parameters.dtype.Value[0][0] === "bd") {
      return TeX.prepDisp("y(t) = \\left( u_1\\right)^{-1} u_2");
    } else {
      return TeX.prepDisp("y_{[i,j]} (t) = u_{1_{i,j}} (t) / u_{2_{i,j}} (t)");
    }
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "dtype": {
          "Name": {
            "en-us": "Type of division",
            "es-mx": "Tipo de división"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options": {
            sl: {
              "en-us": "Scalar division $(u_{1_{i,j}} / u_{2_{i,j}})$",
              "es-mx": "División escalar $(u_{1_{i,j}} / u_{2_{i,j}})$"
            },
            fd: {
              "en-us": "Forward matrix division (u1 inv(u2))",
              "es-mx": "División de matriz directa (u1 inv(u2))"
            },
            bd: {
              "en-us": "Backward matrix division (inv(u1) u2)",
              "es-mx": "División de matriz hacia atrás (inv(u1) u2)"
            }
          },
          "Value": [
            ["fd"]
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