class umk_1614802772056 extends umk_model {
  Icon() {
    return {
      html: this.Details(true),
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  Evaluate() {
    this.outputs[0] = math.multiply(this.inputs[0], math.ctranspose(this.inputs[1]));
  }
  Details(short = false) {
    const tempOut = "u_1 u_2^{\\operatorname{H}}"
    if (short) {
      return TeX.prepDisp(tempOut);
    } else {
      return TeX.prepDisp("\\Huge "+tempOut);
    }
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