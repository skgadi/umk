class umk_1589386968441 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp("\\sqrt{u_{i,j}}"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    this.outputs[0] = math.sqrt(this.inputs[0]);
  }
  Details() {
    return TeX.prepDisp("y_{i,j}=\\sqrt{u_{i,j}}");
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