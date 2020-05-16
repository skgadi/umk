class umk_1589564768522 extends umk_model {
  Icon() {
    return {
      //html: blockUtils.makeIcon(this.id),
      html: TeX.prepDisp("\\log_{u_2}{(u_1)}"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    let that = this;
    if((this.inputs[0]._data.length === 1) && (this.inputs[0]._data[0].length === 1)) {
      this.outputs[0] = this.inputs[1].map(function (element){
        return math.log(that.inputs[0]._data[0][0],element);
      });
    } else {
      if((this.inputs[1]._data.length === 1) && (this.inputs[1]._data[0].length === 1)) {
        this.outputs[0] = this.inputs[0].map(function (element){
          return math.log(element, that.inputs[1]._data[0][0]);
        });  
      } else {
        this.outputs[0] = this.inputs[0].map(function (element, index){
          return math.log(element, that.inputs[1]._data[index[0]][index[1]]);
        });  
      }
    }
  }
  Details() {
    return TeX.prepDisp("y_{i,j} = \\log_{u_2}{(u_1)}");
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