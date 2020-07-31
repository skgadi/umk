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
      let tempOut = [math.transpose(math.row(inpTrans, i))];
      if (!math.size(tempOut)[1]) {
        tempOut = [tempOut];
      }
      this.outputs[i] = math.matrix(tempOut);
      console.log(JSON.stringify(math.size(tempOut) ));
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