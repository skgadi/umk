class umk_1589386475682 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp("|u_{i,j}|"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    this.outputs[0] = math.abs(this.inputs[0]);
  }
  Details() {
    return TeX.prepDisp("|u_{i,j}|");
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