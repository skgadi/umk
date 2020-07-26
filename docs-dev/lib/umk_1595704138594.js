class umk_1595704138594 extends umk_model {
    Icon() {
      return {
        html: blockUtils.makeIcon(this.id),
        inLabels: "",
        outLabels: null,
        splStyle: ""
      };
    }
    Evaluate() {
      this.outputs[0] = math.inv(this.inputs[0]);
    }
    Details() {
      return TeX.prepDisp("y(t) = u^{-1}(t)");
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