class umk_1589386786107 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      //html: TeX.prepDisp("\\log_{2}{(u_{i,j})}"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    this.outputs[0] = math.log2(this.inputs[0]);
  }
  Details() {
    return TeX.prepDisp("y_{i,j} = \\log_{2}{(u_{i,j})}");
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