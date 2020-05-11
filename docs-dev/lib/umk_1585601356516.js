class umk_1585601356516 extends umk_model {
  Icon() {
    return {
      html: "$+$",
      inLabels: this.Parameters.pm.Value.map((ele) => {
        return (ele[0] === "pl") ? "$+$" : "$-$";
      }),
      outLabels: null,
      //splStyle: "shape=triangle;" // wait until the out triangle is hidden when connected
      splStyle: ""
    };
  }
  Evaluate() {
    if (this.Parameters.pm.Value[0][0] === "pl") {
      this.outputs[0] = this.inputs[0];
    } else {
      this.outputs[0] = math.subtract(0, this.inputs[0]);
    }
    for (let i = 1; i < this.TerminalsIn.value; i++) {
      if (this.Parameters.pm.Value[i][0] === "pl") {
        this.outputs[0] = math.add(this.outputs[0], this.inputs[i]);
      } else {
        this.outputs[0] = math.subtract(this.outputs[0], this.inputs[i]);
      }
    }
  }
  Details() {
    if (!this.invalidParams()) {
      let out = "y(t)="
      if (this.Parameters.pm.Value[0][0] !== "pl") {
        out += "-";
      }
      out += "u_1(t)";
      for (let i = 1; i < this.TerminalsIn.value; i++) {
        if (this.Parameters.pm.Value[i][0] === "pl") {
          out += "+";
        } else {
          out += "-";
        }
        out += "u_" + i + "(t)";
      }
      return TeX.prepDisp(out);
    }
  }
  invalidParams() {
    return (this.Parameters.pm.Value.length !== this.TerminalsIn.value);
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "pm": {
          "Name": {
            "en-us": "Operation",
            "es-mx": "Operación"
          },
          "Dimension": "Vector",
          "Type": "Options",
          "Options": {
            pl: {
              "en-us": "Plus $(+)$",
              "es-mx": "Más $(+)$"
            },
            mn: {
              "en-us": "Minus $(-)$",
              "es-mx": "Menos $(-)$"
            },
          },
          "Value": [
            ["pl"],
            ["pl"]
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