class umk_1614651143702 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp("u u^\\intercal"),
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  Evaluate() {
    this.outputs[0] = math.multiply(this.inputs[0], math.transpose(this.inputs[0]));
  }
  Details() {
    return TeX.prepDisp("\\Huge u u^\\intercal");
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