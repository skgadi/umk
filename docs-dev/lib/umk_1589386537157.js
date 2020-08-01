class umk_1589386537157 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    //console.log(this.inputs[0]);
    //console.log(this.inputs[1]);

    if (this.Parameters.mtype.Value[0][0] === "mm") {
      //console.log(JSON.stringify(this.inputs[0]));
      //console.log(JSON.stringify(this.inputs[1]));
      this.outputs[0] = math.multiply(this.inputs[0], this.inputs[1]);
      for (let i = 2; i < this.TerminalsIn.value; i++) {
        this.outputs[0] = math.multiply(this.outputs[0], this.inputs[i]);
      }
    } else {
      let inSize = this.inputs[0].size();
      if (inSize[0] === 1 && inSize[1] === 1) {
        this.outputs[0] = math.dotMultiply(math.squeeze(this.inputs[0]), this.inputs[1]);
      } else {
        let inSize = this.inputs[1].size();
        if (inSize[0] === 1 && inSize[1] === 1) {
          this.outputs[0] = math.dotMultiply(this.inputs[0], math.squeeze(this.inputs[1]));
        } else {
          //console.log("hey");
          this.outputs[0] = math.dotMultiply(this.inputs[0], this.inputs[1]);
        }
      }
      for (let i = 2; i < this.TerminalsIn.value; i++) {
        //console.log(i);
        let inSize = this.inputs[i].size();
        if ((inSize[0] === 1) && (inSize[1] === 1)) {
          this.outputs[0] = math.dotMultiply(this.outputs[0], this.inputs[i]._data[0][0]);
        } else {
          this.outputs[0] = math.dotMultiply(this.outputs[0], this.inputs[i]);
        }
      }
    }
  }
  Details() {
    if (this.Parameters.mtype.Value[0][0] === "mm") {
      return TeX.prepDisp("y(t) = u_1(t)\\times u_2(t)");
    } else {
      return TeX.prepDisp("y_{[i,j]} (t) = u_{1_{i,j}} (t) \\times u_{2_{i,j}} (t)");
    }
  }
  invalidParams() {
    return !(this.TerminalsIn.value > 1);
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "mtype": {
          "Name": {
            "en-us": "Type of multiplication",
            "es-mx": "Tipo de multiplicación"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options": {
            sl: {
              "en-us": "Scalar product $(u_{1_{i,j}} u_{2_{i,j}})$",
              "es-mx": "Producto escalar $(u_{1_{i,j}} u_{2_{i,j}})$"
            },
            mm: {
              "en-us": "Matrix multiplication $(u_1 u_2)$",
              "es-mx": "Multiplicación de matrices $(u_1 u_2)$"
            }
          },
          "Value": [
            ["mm"]
          ]
        }
      },
      TerminalsIn: {
        min: 2,
        max: 100,
        value: 2,
        editable: true
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