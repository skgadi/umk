class umk_1614656818163 extends umk_model {
  Icon() {
    return {
      html: this.Details(true),
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  Init() {
    let fElement = this.Parameters.fElement.Value._data[0][0];
    let rCount = this.Parameters.rCount.Value._data[0][0];
    let rLElement = this.Parameters.rLElement.Value._data[0][0];
    let cCount = this.Parameters.cCount.Value._data[0][0];
    let cLElement = this.Parameters.cLElement.Value._data[0][0];
    let rInc = (rCount === 1) ? 0 : (rLElement - fElement) / (rCount - 1);
    let cInc = (cCount === 1) ? 0 : (cLElement - fElement) / (cCount - 1);
    //console.log(rInc);
    let tempArray = [];
    for (let i = 0; i < rCount; i++) {
      let tempArray1 = [];
      let rFElement = fElement + rInc * i;
      for (let j = 0; j < cCount; j++) {
        tempArray1.push(rFElement + cInc * j);
      }
      tempArray.push(tempArray1);
    }
    this.CompParams.constant = math.matrix(tempArray);
  }
  Evaluate() {
    //console.log(this.Parameters.constant.Value);
    this.outputs[0] = this.CompParams.constant;
  }
  Details() {
    if (Number(this.Parameters.rCount.Value[0][0]) === 1 && Number(this.Parameters.cCount.Value[0][0]) === 1) {
      return this.Parameters.fElement.Value[0][0];
    } else if (Number(this.Parameters.rCount.Value[0][0]) === 1) {
      return TeX.prepDisp("\\begin{bmatrix} " + this.Parameters.fElement.Value[0][0] + " & \\dots & " + this.Parameters.cLElement.Value[0][0] + "\\end{bmatrix}");
    } else if (Number(this.Parameters.cCount.Value[0][0]) === 1) {
      return TeX.prepDisp("\\begin{bmatrix} " + this.Parameters.fElement.Value[0][0] + " \\\\ \\vdots \\\\ " + this.Parameters.rLElement.Value[0][0] + " \\end{bmatrix}");
    } else {
      return TeX.prepDisp("\\begin{bmatrix} " + this.Parameters.fElement.Value[0][0] + " & \\dots & " + this.Parameters.cLElement.Value[0][0] + "\\\\ \\vdots & \\ddots & \\vdots \\\\ " + this.Parameters.rLElement.Value[0][0] + " & \\dots & y_{m,n}\\end{bmatrix}");
    }
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "fElement": {
          "Name": {
            "en-us": "First element ($y_{1,1}$)",
            "es-mx": "Primer elemento ($y_{1,1}$)"
          },
          "Dimension": "Scalar",
          "Type": "Complex",
          "Value": [
            [1]
          ]
        },
        "rCount": {
          "Name": {
            "en-us": "Number of rows ($m$)",
            "es-mx": "Número de filas ($m$)"
          },
          "Dimension": "Scalar",
          "Type": "Real",
          "Value": [
            [3]
          ]
        },
        "rLElement": {
          "Name": {
            "en-us": "Last row element ($y_{m,1}$)",
            "es-mx": "Último elemento de la fila ($y_{m,1}$)"
          },
          "Dimension": "Scalar",
          "Type": "Complex",
          "Value": [
            [3]
          ]
        },
        "cCount": {
          "Name": {
            "en-us": "Number of columns ($n$)",
            "es-mx": "Número de columnas ($n$)"
          },
          "Dimension": "Scalar",
          "Type": "Real",
          "Value": [
            [1]
          ]
        },
        "cLElement": {
          "Name": {
            "en-us": "Last column element ($y_{1,n}$)",
            "es-mx": "Último elemento de la columna ($y_{1,n}$)"
          },
          "Dimension": "Scalar",
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