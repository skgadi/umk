class umk_1586108946421 extends umk_model {
  Icon() {
    return {
      html: TeX.prepDisp(TeX.frmArray(this.Parameters.constant.Value)),
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    //console.log(this.Parameters.constant.Value);
    this.outputs[0] = this.Parameters.constant.Value;
  }
  Details() {
    return TeX.prepDisp("y(t) := " + TeX.frmArray(this.Parameters.constant.Value));
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "constant": {
          "Name": {
            "en-us": "Constant $(C)$",
            "es-mx": "Constante $(C)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [1]
          ]
        }
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