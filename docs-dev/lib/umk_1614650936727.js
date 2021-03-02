class umk_1614650936727 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp("u_1 u_2^\\intercal"),
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  Evaluate() {
    this.outputs[0] = math.multiply(this.inputs[0], math.transpose(this.inputs[1]));
  }
  Details() {
    return TeX.prepDisp("\\Huge u_1 u_2^\\intercal");
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