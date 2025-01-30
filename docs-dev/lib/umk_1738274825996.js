class umk_1738274825996 extends umk_model {
    Icon() {
      return {
        html: blockUtils.makeIcon(this.id),
        inLabels: null,
        outLabels: null,
        splStyle: ""
      };
    }
    Evaluate() {
      this.outputs[0] = math.atan2(this.inputs[0], this.inputs[1]);
    }
    Details() {
      return TeX.prepDisp("y_{i,j}(t) = \\text{atan2}\\left({u_{1}(t), u_{2}(t)}\\right)");
    }
    constructor(obj) {
      super(Object.assign({
        TerminalsIn: {
          min: 2,
          max: 2,
          value: 2,
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