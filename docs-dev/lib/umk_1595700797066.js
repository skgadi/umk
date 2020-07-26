class umk_1595700797066 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    for (let i=0; i<this.TerminalsOut.value; i++) {
      this.outputs[i] = math.row(this.inputs[0],i);
    }
  }
  Details() {
    return TeX.prepDisp("y_i(t) = u_{\\{i,j\\}}");
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
        min: 2,
        max: Infinity,
        value: 2,
        editable: true
      }
    }, obj));
  }
}