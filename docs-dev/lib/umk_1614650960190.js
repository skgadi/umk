class umk_1614650960190 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp("u^\\intercal u"),
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  Evaluate() {
    this.outputs[0] = math.multiply(math.transpose(this.inputs[0]), this.inputs[0]);
  }
  Details() {
    return TeX.prepDisp("\\Huge u^\\intercal u");
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