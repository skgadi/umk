class umk_1614889433774 extends umk_model {
    Icon() {
      return {
        html: blockUtils.makeIcon(this.id),
        inLabels: "",
        outLabels: null,
        splStyle: ""
      };
    }
    Evaluate(t,k) {
      this.outputs[0] = math.matrix([[k]]);
    }
    Details() {
      return TeX.prepDisp("y = k");
    }
    constructor(obj) {
      super(Object.assign({
        TerminalsOut: {
          min: 1,
          max: 1,
          value: 1,
          editable: false
        }
      }, obj));
    }
  }