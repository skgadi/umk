class umk_1588580715574 extends umk_model {
  Icon() {
    return {
      html: "$\\sin(\\cdot)$",
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate(t) {
    //console.log(this.Parameters.constant.Value);
    this.outputs[0] = math.dotMultiply(this.Parameters.amp.Value,
      math.sin(math.add(math.dotMultiply(2 * math.pi * t,
        this.Parameters.freq.Value), this.Parameters.phase.Value))
    )
  }
  Details() {
    let out;
    try {
      if (!this.invalidParams()) {
        out = "[";
        for (let i = 0; i < this.Parameters.amp.Value.length; i++) {
          out += ((!!i) ? "," : "") + "[";
          for (let j = 0; j < this.Parameters.amp.Value[0].length; j++) {

            out += ((!!j) ? "," : "") + "(" + this.Parameters.amp.Value[i][j] +
              ")*sin(2*pi*(" + this.Parameters.freq.Value[i][j] +
              ")*t+" + this.Parameters.phase.Value[i][j] + ")";
          }
          out += "]";
        }
        out += "]";
      }
      //console.log(out);
      out = "<div>$$" + TeXTools.strToTex(out) + "$$</div>";
    } catch (e) {
      console.log(e);
    }
    out = "<div>$$y(t) = A\\sin(2\\pi f t + \\phi)$$</div><br>" + (!!out ? out : "");
    return out;
  }
  invalidParams() {
    if (
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
    }
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
            "en-us": "Frequency $(f)$",
            "es-mx": "Frecuencia $(f)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [1]
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