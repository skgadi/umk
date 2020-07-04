class umk_1585601356516 extends umk_model {
  Icon() {
    this.genCompParams();
    return {
      html: '<i class="fas fa-plus"></i>',
      inLabels: this.CompParams.isAdd.map((ele) => {
        return (ele) ? "+" : "-";
      }),
      outLabels: null,
      //splStyle: "shape=triangle;" // wait until the out triangle is hidden when connected
      splStyle: ""
    };
  }
  Evaluate() {
    if (this.CompParams.isAdd[0]) {
      this.outputs[0] = this.inputs[0];
    } else {
      this.outputs[0] = math.subtract(0, this.inputs[0]);
    }
    for (let i = 1; i < this.TerminalsIn.value; i++) {
      if (this.CompParams.isAdd[i]) {
        this.outputs[0] = math.add(this.outputs[0], this.inputs[i]);
      } else {
        this.outputs[0] = math.subtract(this.outputs[0], this.inputs[i]);
      }
    }
  }
  Details() {
    this.genCompParams();
      let out = "y(t)="
      if (!this.CompParams.isAdd[0]) {
        out += "-";
      }
      out += "u_1(t)";
      for (let i = 1; i < this.TerminalsIn.value; i++) {
        if (this.CompParams.isAdd[i]) {
          out += "+";
        } else {
          out += "-";
        }
        out += "u_" + (i+1) + "(t)";
      }
      return TeX.prepDisp(out);
  }
  genCompParams () {
    this.CompParams.isAdd = [];
    for (let i =0; i<this.TerminalsIn.value; i++) {
      if (!!this.Parameters.pm.Value[i] && (this.Parameters.pm.Value[i][0]==="mn")) {
        this.CompParams.isAdd[i] = false;
      } else {
        this.CompParams.isAdd[i] = true;
      }
    }
  }
  /*
  invalidParams() {
    return !((this.TerminalsIn.value>1) && (this.Parameters.pm.Value.length === this.TerminalsIn.value));
  }
  */
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