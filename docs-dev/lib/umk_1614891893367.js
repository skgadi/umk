class umk_1614891893367 extends umk_model {
    Icon() {
      return {
        html: blockUtils.makeIcon(this.id),
        inLabels: ["1", "2"],
        outLabels: null,
        splStyle: ""
      };
    }
    Evaluate() {
      let first = this.inputs[0];
      let second = this.inputs[1];
      if (blockUtils.isScalar(first)) {
        first = first._data[0][0];
      } else if (blockUtils.isScalar(second)) {
        second = second._data[0][0];
      }
      this.outputs[0] = math.compare(first, second);
    }
    Details() {
      return TeX.prepDisp("y_{i,j} = \\begin{cases}1 & \\text{if} & u_{1_{i,j}}\\gt u_{2_{i,j}}\\\\0 & \\text{if} & u_{1_{i,j}}=u_{2_{i,j}}\\\\-1 & \\text{if} & u_{1_{i,j}}\\lt u_{2_{i,j}}\\\\\\end{cases}");
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