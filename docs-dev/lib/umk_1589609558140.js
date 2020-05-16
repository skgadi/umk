class umk_1589609558140 extends umk_model {
    Icon() {
      return {
        html: blockUtils.makeIcon(this.id),
        inLabels: "",
        outLabels: null,
        splStyle: ""
      };
    }
    Evaluate() {
      this.outputs[0] = math.sec(this.inputs[0]);
    }
    Details() {
      return TeX.prepDisp("y_{i,j}(t) = \\sec\\left({u_{i,j}(t)}\\right)");
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