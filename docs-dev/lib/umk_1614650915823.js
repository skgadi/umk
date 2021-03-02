class umk_1614650915823 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp("u_1^\\intercal u_2"),
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  Evaluate() {
    this.outputs[0] = math.multiply(math.transpose(this.inputs[0]), this.inputs[1]);
  }
  Details() {
    return TeX.prepDisp("\\Huge u_1^\\intercal u_2");
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