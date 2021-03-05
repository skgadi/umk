class umk_1614876628659 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate(t) {
    this.outputs[0] = math.matrix([[t]]);
  }
  Details() {
    return TeX.prepDisp("y = t");
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