class umk_1704846786288 extends umk_model {
  Icon() {
    return {
      html: this.Details(true),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    //Check if the input matrix size is the same as the upper and lower limits
    let isSame = blockUtils.isAllSameDims([this.inputs[0]._data, this.Parameters.ul.Value._data, this.Parameters.ll.Value._data]);

    this.outputs[0] = this.inputs[0];
    const gSize = this.Parameters.ul.Value.size();
    for (let i = 0; i < gSize[0]; i++) {
      for (let j = 0; j < gSize[1]; j++) {
        this.outputs[0]._data[i][j] = math.min(math.max(this.inputs[0]._data[i][j], this.Parameters.ll.Value._data[isSame?i:0][isSame?j:0]), this.Parameters.ul.Value._data[isSame?i:0][isSame?j:0]);
      }
    }

  }
  Details(short = false) {
    if (!short) {
      return TeX.prepDisp("sat(u)");
    } else {
      return TeX.prepDisp("sat(u)");
    }
  }

  invalidParams() {
    if (this.Parameters.ul.Value === undefined || this.Parameters.ll.Value === undefined) {
      return true;
    }
    if(blockUtils.isAllSameDims([this.Parameters.ul.Value, this.Parameters.ll.Value])){
      for (let i = 0; i < this.Parameters.ul.Value.length; i++) {
        for (let j = 0; j < this.Parameters.ul.Value[0].length; j++) {
          if (this.Parameters.ul.Value[i][j] < this.Parameters.ll.Value[i][j]) {
            return true
          }
        }
      }
      return false;
    } else {
      return true
    }
  }

  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "ul": {
          "Name": {
            "en-us": "Upper limit",
            "es-mx": "Limite superior"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [1]
          ]
        },
        "ll": {
          "Name": {
            "en-us": "Lower limit",
            "es-mx": "Límite inferior"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [-1]
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