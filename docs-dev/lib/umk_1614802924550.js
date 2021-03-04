class umk_1614802924550 extends umk_model {
  Icon() {
    return {
      html: this.Details(true),
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  Evaluate() {
    this.outputs[0] = math.multiply(this.inputs[0], math.ctranspose(this.inputs[0]));
  }
  Details(short = false) {
    const tempOut = "u u^{\\operatorname{H}}"
    if (short) {
      return TeX.prepDisp(tempOut);
    } else {
      return TeX.prepDisp("\\Huge "+tempOut);
    }
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