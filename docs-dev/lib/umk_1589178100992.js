class umk_1589178100992 extends umk_model {
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
      this.outputs[0] = math.boolean(this.inputs[0]);
    }
    Details() {
      let outArr = [
        [0, 0],
        [1, 1]
      ];
      return blockUtils.bldTT(math.number(outArr));
    }
    constructor(obj) {
      super(Object.assign({
        TerminalsIn: {
          min: 1,
          max: 1,
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