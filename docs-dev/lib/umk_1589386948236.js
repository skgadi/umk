class umk_1589386948236 extends umk_model {
    Icon() {
      return {
        html: blockUtils.makeIcon(this.id),
        inLabels: "",
        outLabels: null,
        splStyle: ""
      };
    }
    genCompParams() {
      this.CompParams["dp"] = math.round(math.abs(this.Parameters.dp.Value._data[0][0]));
    }
    Evaluate() {
      this.outputs[0] = math.round(this.inputs[0],this.CompParams["dp"]);
    }
    Details() {
      return blockUtils.makeIcon(this.id);
    }
    constructor(obj) {
      super(Object.assign({
        Parameters: {
          "dp": {
            "Name": {
              "en-us": "Number of decimal places",
              "es-mx": "Numero de decimales"
            },
            "Dimension": "Scalar",
            "Type": "Integer",
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