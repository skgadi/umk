class umk_1588716024472 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp("\\int"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Init() {
    this.temp_exec.t = 0; // previous time
    this.temp_exec.pv = this.Parameters.ic.Value; // previous value
  }
  Evaluate(t) {
    //console.log(t);
    //console.log(this.temp_exec.pv);
    if (!t) {
      this.outputs[0] = this.temp_exec.pv;
    } else {
      this.outputs[0] = math.add(this.temp_exec.pv, math.dotMultiply((t-this.temp_exec.t),this.inputs[0]));
      //this.outputs[0] = math.add(this.temp_exec.pv,math.dotMultiply((t-this.temp_exec.t), math.dotMultiply(0.5, math.add(this.temp_exec.pv,this.inputs[0]))));
      this.temp_exec.t = t;
      this.temp_exec.pv = this.outputs[0];
    }
    //console.log(this.temp_exec.pv);
  }
  Details() {
    return TeX.prepDisp("\\int_{0}^{t}u(t)\\mathrm{d}t");
  }
  constructor(obj) {
    super(Object.assign({
      fInEO: true,
      Parameters: {
        "ic": {
          "Name": {
            "en-us": "Initial conditions $(y_0)$",
            "es-mx": "Condiciones iniciales $(y_0)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [0]
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