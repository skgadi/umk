class umk_1614918829723 extends umk_model {
    Icon() {
      return {
        html: blockUtils.makeIcon(this.id),
        inLabels: "",
        outLabels: null,
        splStyle: ""
      };
    }
    Evaluate() {
      let gSize = this.inputs[0].size();
      const tempOut =[];
      for (let i=0;i<gSize[0];i++) {
        const tempOut1 = [];
        for (let j=0; j<gSize[1];j++) {
          let val = this.inputs[0]._data[i][j]
          for (let k=1; k<this.TerminalsIn.value; k++) {
            val = math.min(val, this.inputs[k]._data[i][j]);
          }
          tempOut1.push(val);
        }
        tempOut.push(tempOut1);
      }
      this.outputs[0] = math.matrix(tempOut);
    }
    Details() {
      return TeX.prepDisp("y_{i,j} = \\min(u_{1_{i,j}}, u_{2_{i,j}}, \\dots,u_{n_{i,j}})");
    }
    constructor(obj) {
      super(Object.assign({
        TerminalsIn: {
          min: 2,
          max: Infinity,
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