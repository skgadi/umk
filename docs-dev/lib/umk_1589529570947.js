class umk_1589529570947 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    function operate(arrItem, Item2, isItem2Array, out) {
      //let out = [];
      for (let i = 0; i < 3; i++) {
        out[i] = math.zeros(arrItem._data.length, arrItem._data[0].length);
      }
      arrItem.map(function (element, index) {
        let tempOut;
        if (isItem2Array) {
          tempOut = math.xgcd(element, Item2._data[index[0]][index[1]]);
        } else {
          tempOut = math.xgcd(element, Item2);
        }
        //console.log(tempOut._data);
        for (let i = 0; i < 3; i++) {
          out[i]._data[index[0]][index[1]] = tempOut._data[i];
        }
      });
      return out;
    }
    let tempOut;
    if ((this.inputs[0]._data.length === 1) && (this.inputs[0]._data[0].length === 1)) {
      tempOut = operate(this.inputs[1], this.inputs[0]._data[0][0], false, this.outputs);
    } else {
      if ((this.inputs[1]._data.length === 1) && (this.inputs[1]._data[0].length === 1)) {
        tempOut = operate(this.inputs[0], this.inputs[1]._data[0][0], false, this.outputs);
      } else {
        tempOut = operate(this.inputs[0], this.inputs[1], true, this.outputs);
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
        min: 3,
        max: 3,
        value: 3,
        editable: false
      }
    }, obj));
  }
}