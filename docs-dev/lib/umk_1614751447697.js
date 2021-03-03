class umk_1614751447697 extends umk_model {
    Icon() {
      return {
        html: this.Details(),
        inLabels: "",
        outLabels: null,
        splStyle: ""
      };
    }
    Evaluate() {
      this.outputs[0] = math.arg(this.inputs[0]);
    }
    Details() {
      return TeX.prepDisp("\\operatorname{Arg} (u_{i,j})");
    }
    constructor(obj) {
      super(Object.assign({
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