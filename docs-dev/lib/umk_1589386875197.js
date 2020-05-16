class umk_1589386875197 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  Evaluate() {
    if ((this.inputs[0]._data.length === 1) && (this.inputs[0]._data[0].length === 1)) {
      this.outputs[0] =math.mod(this.inputs[0]._data[0][0], this.inputs[1]);
    } else {
      if ((this.inputs[1]._data.length === 1) && (this.inputs[1]._data[0].length === 1)) {
        this.outputs[0] =math.mod(this.inputs[0], this.inputs[1]._data[0][0]);
      } else {
        this.outputs[0] =math.mod(this.inputs[0], this.inputs[1]);
      }
    }
  }
  Details() {
    return blockUtils.makeIcon(this.id);
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