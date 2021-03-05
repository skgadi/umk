class umk_1614899219940 extends umk_model {
  Icon() {
    return {
      html: this.Details(true),
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  genCompParams() {
    this.CompParams.out = math.identity(
      math.squeeze(this.Parameters.size.Value),
      math.squeeze(this.Parameters.size.Value) - math.squeeze(this.Parameters.offset.Value)
    );
  }
  Evaluate() {
    //console.log(this.Parameters.constant.Value);
    this.outputs[0] = this.CompParams.out;
  }
  Details(short = false) {
    //console.log(math.number(this.Parameters.size.Value[0][0]));
    const firstOut = TeX.frmArray(
      math.identity(math.number(this.Parameters.size.Value[0][0]),
      math.number(this.Parameters.size.Value[0][0] - this.Parameters.offset.Value[0][0])).toArray()
      );
    if (short) {
      return TeX.prepDisp(firstOut);
    } else {
      return TeX.prepDisp("y(t) := " + firstOut);
    }
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "size": {
          "Name": {
            "en-us": "Size",
            "es-mx": "Tamaño"
          },
          "Dimension": "Scalar",
          "Type": "Real",
          "Value": [
            [2]
          ]
        },
        "offset": {
          "Name": {
            "en-us": "Offset",
            "es-mx": "Offset"
          },
          "Dimension": "Scalar",
          "Type": "Real",
          "Value": [
            [0]
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