class umk_1589178085993 extends umk_model {
    Icon() {
      return {
        html: blockUtils.makeIcon(this.id),
        inLabels: null,
        outLabels: null,
        //splStyle: "shape=triangle;" // wait until the out triangle is hidden when connected
        splStyle: ""
      };
    }
    Evaluate() {
      this.outputs[0] = math.or(this.inputs[0], this.inputs[1]);
      //console.log(this.TerminalsIn.value);
      for (let i = 2; i < this.TerminalsIn.value; i++) {
        this.outputs[0] = math.or(this.outputs[0], this.inputs[i]);
      }
      this.outputs[0] = math.not(this.outputs[0]);
    }
    Details() {
      let outArr = [];
      for (let i = 0; i < math.pow(2, this.TerminalsIn.value); i++) {
        let tempArr = [];
        for (let j = 0; j < this.TerminalsIn.value; j++) {
          tempArr.push((i >> j) & 1);
        }
        outArr.push(tempArr);
      }
      for (let i = 0; i < outArr.length; i++) {
        let tempVal = outArr[i][0];
        for (let j = 1; j < outArr[i].length; j++) {
          tempVal = math.or(tempVal, outArr[i][j]);
        }
        outArr[i].push(math.not(tempVal));
      }
      return blockUtils.bldTT(math.number(outArr));
    }
    constructor(obj) {
      super(Object.assign({
        TerminalsIn: {
          min: 2,
          max: 100,
          value: 2,
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