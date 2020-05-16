class umk_1589386733656 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      //html: TeX.prepDisp("\\small \\log_n{(u)}"),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  genCompParams () {
    this.CompParams[sN] = (this.Parameters.n.Value.length === 1) && (this.Parameters.n.Value[0].length === 1);
  }
  Evaluate() {
    let that = this;
    if (this.CompParams[sN]) {
      this.outputs[0] = this.inputs[0].map(function(element){
        return math.log(element, that.Parameters.n.Value._data[0][0]);
      });
    } else {
      this.outputs[0] = this.inputs[0].map(function(element, index){
        return math.log(element, that.Parameters.n.Value._data[index[0]][index[1]]);
      });
    }
  }
  Details() {
    return TeX.prepDisp("y_{i,j} = \\log_n{(u)}");
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "n": {
          "Name": {
            "en-us": "Base $(n)$",
            "es-mx": "Base $(n)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            ['e']
          ]
        }
      },
      TerminalsIn: {
        min: 1,
        max: 1,
        value: 1,
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