class umk_1589386660500 extends umk_model {
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
      let tempOut;
      let fIdx = true;
      this.inputs[0].map(function (element){
        if (fIdx) {
          fIdx = false;
          tempOut = element;
        } else {
          tempOut = math.gcd(tempOut,element);
        }
      });
      this.outputs[0] = math.matrix([[tempOut]]);
    } else {
      if ((this.inputs[0]._data.length === 1) && (this.inputs[0]._data[0].length === 1)) {
        this.outputs[0] = math.gcd(this.inputs[0]._data[0][0], this.inputs[1]);
      } else {
        if ((this.inputs[1]._data.length === 1) && (this.inputs[1]._data[0].length === 1)) {
          this.outputs[0] = math.gcd(this.inputs[0], this.inputs[1]._data[0][0]);
        } else {
          this.outputs[0] = math.gcd(this.inputs[0], this.inputs[1]);
        }
      }
      for (let i = 2; i < this.TerminalsOut.value; i++) {
        this.outputs[0] = math.gcd(this.outputs[0], this.inputs[i]);
      }
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