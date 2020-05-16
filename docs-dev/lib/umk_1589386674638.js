class umk_1589386674638 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    if (this.TerminalsIn.value === 1) {
      this.outputs[0] = math.matrix([
        [math.hypot(this.inputs[0])]
      ]);
    } else {
      let that = this;
      this.outputs[0] = this.inputs[0].map(function (element, index) {
        let tempOut = math.pow(element, 2);
        for (let i = 1; i < that.TerminalsIn.value; i++) {
          tempOut += math.pow(that.inputs[i]._data[index[0]][index[1]], 2);
        }
        return math.sqrt(tempOut);
      });
    }
  }
  Details() {
    return blockUtils.makeIcon(this.id);
  }
  constructor(obj) {
    super(Object.assign({
      TerminalsIn: {
        min: 1,
        max: 100,
        value: 1,
        editable: true
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