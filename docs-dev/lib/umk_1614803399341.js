class umk_1614803399341 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    //console.log(math.squeeze(this.inputs[0]).toArray());
    this.outputs[0] = math.matrix(math.diag(math.squeeze(this.inputs[0]).toArray(), this.Parameters.offset.Value._data[0][0]));
  }
  Details() {
    return TeX.prepDisp("\\operatorname {Diag} (u, "+this.Parameters.offset.Value+")");
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "offset": {
          "Name": {
            "en-us": "Offset",
            "es-mx": "Compensar"
          },
          "Dimension": "Scalar",
          "Type": "Real",
          "Value": [
            [0]
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