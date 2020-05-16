class umk_1589386497071 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      //html: TeX.prepDisp("\\large \\sqrt[3]{u_{i,j}}"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    for (let i = 1; i < this.TerminalsOut.value; i++) {
      this.outputs[i] = math.clone(this.inputs[0]);
    }
    let that = this;
    this.outputs[0] = this.inputs[0].map(function (element, index) {
      let cbrt = math.cbrt(element, true);
      for (let i = 1; i < that.TerminalsOut.value; i++) {
        that.outputs[i]._data[index[0]][index[1]] = cbrt._data[i];
      }
      return cbrt._data[0];
    });
  }
  Details() {
    return blockUtils.makeIcon(this.id);
    return TeX.prepDisp("|u_{i,j}|");
  }
  invalidParams() {
    if ((this.TerminalsOut.value <= 3) && (this.TerminalsOut.value > 0)) {
      return false;
    } else {
      return true;
    }
  };
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
        max: 3,
        value: 1,
        editable: true
      }
    }, obj));
  }
}