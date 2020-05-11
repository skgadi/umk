class umk_1588580715574 extends umk_model {
  Icon() {
    return {
      //html: TeX.prepDisp("\\sin(\\cdot)"),
      html: blockUtils.makeIcon(this.id),
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate(t) {
    //console.log(this.Parameters.constant.Value);
    if (this.CompParams["isHz"]) {
      this.outputs[0] = math.dotMultiply(this.Parameters.amp.Value,
        math.sin(math.add(math.dotMultiply(2 * math.pi * t,
          this.Parameters.freq.Value), this.Parameters.phase.Value))
      )
    } else {
      this.outputs[0] = math.dotMultiply(this.Parameters.amp.Value,
        math.sin(math.add(math.dotMultiply(t,
          this.Parameters.freq.Value), this.Parameters.phase.Value))
      )
    }
  }
  Details() {
    let out;
    try {
      if (!this.invalidParams()) {
        out = "y(t) =[";
        for (let i = 0; i < this.Parameters.amp.Value.length; i++) {
          out += ((!!i) ? "," : "") + "[";
          for (let j = 0; j < this.Parameters.amp.Value[0].length; j++) {

            out += ((!!j) ? "," : "") + "(" + this.Parameters.amp.Value[i][j] +
              ")*sin("+((this.Parameters.fTyp.Value[0][0] === 'hz')?"2*pi*":"")+"(" + this.Parameters.freq.Value[i][j] +
              ")*t+" + this.Parameters.phase.Value[i][j] + ")";
          }
          out += "]";
        }
        out += "]";
      }
      //console.log(out);
      out = "<div>" + TeX.prepDisp(TeX.frmStr(out)) + "</div>";
    } catch (e) {
      console.log(e);
    }
    //out = "<div>$$y(t) = A\\sin(2\\pi f t + \\phi)$$</div><br>" + (!!out ? out : "");
    return out;
  }
  invalidParams() {
    return !blockUtils.isAllSameDims([this.Parameters.amp.Value, this.Parameters.freq.Value, this.Parameters.phase.Value]);
    /*if (
      this.Parameters.amp.Value.length === this.Parameters.freq.Value.length &&
      this.Parameters.amp.Value.length === this.Parameters.phase.Value.length
    ) {
      if (
        this.Parameters.amp.Value[0].length === this.Parameters.freq.Value[0].length &&
        this.Parameters.amp.Value[0].length === this.Parameters.phase.Value[0].length
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }*/
  }
  genCompParams() {
    this.CompParams["isHz"] = (this.Parameters.fTyp.Value[0][0] === "hz");
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "amp": {
          "Name": {
            "en-us": "Amplitude $(A)$",
            "es-mx": "Amplitud $(A)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [1]
          ]
        },
        "freq": {
          "Name": {
            "en-us": "Frequency",
            "es-mx": "Frecuencia"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [1]
          ]
        },
        "fTyp": {
          "Name": {
            "en-us": "Frequency type",
            "es-mx": "Tipo de frecuencia"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options": {
            hz: {
              "en-us": "Cycles per second (Hz)",
              "es-mx": "Ciclos por segundo (Hz)"
            },
            rad: {
              "en-us": "Radians per second",
              "es-mx": "Radianes por segundo"
            },
          },
          "Value": [
            ["hz"]
          ]
        },
        "phase": {
          "Name": {
            "en-us": "Phase $(\\phi)$",
            "es-mx": "Fase $(\\phi)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [0]
          ]
        },
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