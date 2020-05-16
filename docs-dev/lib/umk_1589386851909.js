class umk_1589386851909 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      //html: TeX.prepDisp("\\ln{(u_{i,j}+1)}"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    this.outputs[0] = math.log1p(this.inputs[0]);
  }
  Details() {
    return TeX.prepDisp("y_{i,j} = \\ln{(u_{i,j}+1)}");
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