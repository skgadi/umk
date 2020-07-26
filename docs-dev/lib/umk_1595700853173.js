class umk_1595700853173 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    let inpTrans = math.transpose(this.inputs[0]);
    for (let i = 0; i < this.TerminalsOut.value; i++) {
      this.outputs[i] = math.transpose(math.row(inpTrans, i));
    }
  }
  Details() {
    return TeX.prepDisp("y_i(t) = u_{\\{j,i\\}}");
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