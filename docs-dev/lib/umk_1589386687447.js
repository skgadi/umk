class umk_1589386687447 extends umk_model {
  Icon() {
    return {
      //html: blockUtils.makeIcon(this.id),
      html: TeX.prepDisp("\\sqrt[" + this.TerminalsOut.value + "]{u_{i,j}}"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate(t) {
    if (t === 0) {
      for (let i=0; i<this.TerminalsOut.value; i++) {
        this.outputs[i] = math.zeros(this.inputs[0]._data.length, this.inputs[0]._data[0].length);
      }
    }
    let that = this;
    this.inputs[0].map(function (element, index) {
      let tempOut = math.nthRoots(element, that.TerminalsOut.value);
      for (let i=0; i<that.TerminalsOut.value; i++) {
        //console.log(that.outputs[i]._data[0]);
        that.outputs[i]._data[index[0]][index[1]] = tempOut[i];
      }
    });
  }
  Details() {
    return blockUtils.makeIcon(this.id);
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
        max: 100,
        value: 2,
        editable: true
      }
    }, obj));
  }
}