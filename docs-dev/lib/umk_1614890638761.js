class umk_1614890638761 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: ['1','L', '2'],
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    let gSize = this.inputs[1].size();
    if (gSize[0] === 1 && gSize[1] === 1) {
      //console.log(gSize);
      if (!!math.compare(this.inputs[1]._data[0][0], 0)) {
        //console.log('sdf');
        this.outputs[0] = this.inputs[0];
      } else {
        this.outputs[0] = this.inputs[2];
      }
    } else {
      const tempOut1 = [];
      for (let i = 0; i < gSize[0]; i++) {
        const tempOut2 = [];
        for (let j = 0; j < gSize[1]; j++) {
          if (!!math.compare(this.inputs[1]._data[i][j], 0)) {
            tempOut2.push(this.inputs[0]._data[i][j]);
          } else {
            tempOut2.push(this.inputs[2]._data[i][j]);
          }
        }
        tempOut1.push(tempOut2);
      }
      this.outputs[0] = math.matrix(tempOut1);
    }
  }
  Details() {
    return TeX.prepInline("u_L\\in \\R^{m\\times n} \\\\\\text{Case 1: } m=n=1\\\\y = \\begin{cases}u_1 & \\text{if} & u_L\\ne0\\\\u_2 & \\text{if} & u_L=0\\end{cases}\\\\\\text{Case 2: } m\\ne 1 \\vee n\\ne1\\\\y_{i,j} = \\begin{cases}u_{1_{i,j}} & \\text{if} & u_{L_{i,j}}\\ne0\\\\u_{2_{i,j}} & \\text{if} & u_{L_{i,j}}=0\\end{cases}");
  }
  constructor(obj) {
    super(Object.assign({
      TerminalsIn: {
        min: 3,
        max: 3,
        value: 3,
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