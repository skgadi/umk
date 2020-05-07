class umk_1588715754701 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp(TeX.frmArray(this.Parameters.gain.Value)),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    //console.log(this.Parameters.mtype.Value[0][0]);
    //console.log(this.Parameters.gain.Value);
    if (this.Parameters.mtype.Value[0][0] === "lMul") {
      this.outputs[0] = math.multiply(this.Parameters.gain.Value, this.inputs[0]);
    } else if (this.Parameters.mtype.Value[0][0] === "rMul") {
      this.outputs[0] = math.multiply(this.inputs[0], this.Parameters.gain.Value);
    } else {
      //console.log(this.Parameters.gain.Value);
      let gSize = this.Parameters.gain.Value.size();
      if (gSize[0]===1 && gSize[1]===1) {
        this.outputs[0] = math.dotMultiply(math.squeeze(this.Parameters.gain.Value), this.inputs[0]);
      } else {
        this.outputs[0] = math.dotMultiply(this.Parameters.gain.Value, this.inputs[0]);
      }
    }
  }
  Details() {
    if (this.Parameters.mtype.Value[0][0] === "lMul") {
      return TeX.prepDisp("y = G\\times u(t)");
    } else if (this.Parameters.mtype.Value[0][0] === "rMul") {
      return TeX.prepDisp("y = u(t)\\times G");
    } else {
      return TeX.prepDisp("y_{[i,j]} = G_{[i,j]} \\times u(t)_{[i,j]},") + "<br>" + TeX.prepInline("i\\in" +
          TeX.prepSetWithRange(this.Parameters.gain.Value.length)) + "<br>" +
        TeX.prepInline("j\\in" + TeX.prepSetWithRange(this.Parameters.gain.Value[0].length));
    }
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "gain": {
          "Name": {
            "en-us": "Gain $(G)$",
            "es-mx": "Ganancia $(G)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [1]
          ]
        },
        "mtype": {
          "Name": {
            "en-us": "Type of multiplication",
            "es-mx": "Tipo de multiplicación"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options": {
            dot: {
              "en-us": "Dot product",
              "es-mx": "Producto escalar"
            },
            lMul: {
              "en-us": "Matrix multiplication ($Gu(t)$)",
              "es-mx": "Multiplicación de matrices ($Gu(t)$)"
            },
            rMul: {
              "en-us": "Matrix multiplication ($u(t)G$)",
              "es-mx": "Multiplicación de matrices ($u(t)G$)"
            }
          },
          "Value": [
            ["dot"]
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