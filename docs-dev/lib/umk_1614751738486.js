class umk_1614751738486 extends umk_model {
    Icon() {
      return {
        html: this.Details(),
        inLabels: "",
        outLabels: null,
        splStyle: ""
      };
    }
    Evaluate() {
      this.outputs[0] = math.im(this.inputs[0]);
    }
    Details() {
      return TeX.prepDisp("\\operatorname{Im} (u_{i,j})");
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