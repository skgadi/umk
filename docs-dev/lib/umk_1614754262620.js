class umk_1614754262620 extends umk_model {
  Icon() {
    return {
      html: this.Details(true),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    //console.log(this.Parameters.mtype.Value[0][0]);
    //console.log(this.Parameters.gain.Value);
    if (this.Parameters.mtype.Value[0][0] === "lm") {
      this.outputs[0] = math.multiply(this.Parameters.gain.Value, this.inputs[0]);
    } else if (this.Parameters.mtype.Value[0][0] === "rm") {
      this.outputs[0] = math.multiply(this.inputs[0], this.Parameters.gain.Value);
    } else {
      //console.log(this.Parameters.gain.Value);
      let gSize = this.Parameters.gain.Value.size();
      //console.log(gSize);
      if (gSize[0] === 1 && gSize[1] === 1) {
        this.outputs[0] = math.dotMultiply(this.inputs[0], math.squeeze(this.Parameters.gain.Value));
      } else {
        gSize = this.inputs[0].size();
        if (gSize[0] === 1 && gSize[1] === 1) {
          this.outputs[0] = math.dotMultiply(this.inputs[0]._data[0][0], this.Parameters.gain.Value);
        } else {
          this.outputs[0] = math.dotMultiply(this.inputs[0], this.Parameters.gain.Value);
        }
      }
    }
    const gSize = this.Parameters.offset.Value.size();
    if (gSize[0] === 1 && gSize[1] === 1) {
      this.outputs[0] = math.add(this.outputs[0], math.squeeze(this.Parameters.offset.Value));
    } else {
      const gSize1 = this.outputs[0].size();

      this.outputs[0] = math.add(
        ((gSize1[0] === 1 && gSize1[1] === 1) ? math.squeeze(this.outputs[0]) : this.outputs[0]),
        this.Parameters.offset.Value
      );
    }
    //console.log(this.outputs[0].size());
  }
  Details(short = false) {
    if (!short) {
      if (this.Parameters.mtype.Value[0][0] === "lm") {
        return TeX.prepDisp("y = G\\times u(t)");
      } else if (this.Parameters.mtype.Value[0][0] === "rm") {
        return TeX.prepDisp("y = u(t)\\times G");
      } else {
        return TeX.prepDisp("y_{[i,j]} = G_{[i,j]} \\times u(t)_{[i,j]},") + "<br>" + TeX.prepInline("i\\in" +
            TeX.prepSetWithRange(this.Parameters.gain.Value.length)) + ",<br>" +
          TeX.prepInline("j\\in" + TeX.prepSetWithRange(this.Parameters.gain.Value[0].length));
      }
    } else {
      let gain = TeX.frmArray(this.Parameters.gain.Value);
      if (gain === "1") {
        gain = "";
      }
      const offset = TeX.frmArray(this.Parameters.offset.Value);
      if (this.Parameters.mtype.Value[0][0] === "lm") {
        return TeX.prepInline(gain + "u+" + offset);
      } else if (this.Parameters.mtype.Value[0][0] === "rm") {
        return TeX.prepInline("u" + gain + "+" + offset);
      } else {
        return TeX.prepInline(gain + (gain === "" ? "" : "\\circ ") + "u+" + offset);
      }
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
        "offset": {
          "Name": {
            "en-us": "Offset $(H)$",
            "es-mx": "Offset $(H)$"
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
            sl: {
              "en-us": "Hadamard element-wise product",
              "es-mx": "Producto con elementos basados en Hadamard"
            },
            lm: {
              "en-us": "Matrix multiplication (Gu(t))",
              "es-mx": "Multiplicación de matrices (Gu(t))"
            },
            rm: {
              "en-us": "Matrix multiplication (u(t)G)",
              "es-mx": "Multiplicación de matrices (u(t)G)"
            }
          },
          "Value": [
            ["sl"]
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