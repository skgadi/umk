class umk_1702511170827 extends umk_model {
  Icon() {
    return {
      html: this.Details(true),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    this.outputs[0] = math.square(this.inputs[0]);
    let numberOfElements;
    if (this.Parameters.iSelected.Value[0][0] === "ae") {
      this.outputs[0] = math.matrix([[math.sum(this.outputs[0])]]);
      numberOfElements = this.inputs[0].size()[0] * this.inputs[0].size()[1];
    } else if (this.Parameters.iSelected.Value[0][0] === "rw") {
      this.outputs[0] = math.transpose(math.matrix([math.sum(this.outputs[0], 1)]));
      numberOfElements = this.inputs[0].size()[0];
    } else {
      this.outputs[0] = math.matrix([math.sum(this.outputs[0], 0)]);
      numberOfElements = this.inputs[0].size()[1];
    }
    this.outputs[0] = math.sqrt(math.divide(this.outputs[0], numberOfElements));
  }
  Details(short = false) {
    let outString_1 = "";
    let outString_2 = "";
    if (this.Parameters.iSelected.Value[0][0] === "ae") {
      outString_1 = "\\operatorname{RMS} (u)"; //TeX.prepDisp();
      outString_2 = "y=";
    } else if (this.Parameters.iSelected.Value[0][0] === "rw") {
      outString_1 = " \\operatorname{RMS} \\left( u_{i,\\left[1,n\\right]}\\right)"; //TeX.prepDisp();
      outString_2 = "y_{i,1}=";
    } else {
      outString_1 = "\\operatorname{RMS} \\left( u_{\\left[1,m\\right],j}\\right)"; //TeX.prepDisp();
      outString_2 = "y_{1,j}=";
    }
    if (short) {
      return TeX.prepInline(outString_1);
    } else {
      return TeX.prepDisp("{\\huge " + outString_2 + outString_1 + "}");
    }
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "iSelected": {
          "Name": {
            "en-us": "Input selection",
            "es-mx": "Selección de entrada"
          },
          "Dimension": "Scalar",
          "Type": "Options",
          "Options": {
            ae: {
              "en-us": "Apply on all the elements",
              "es-mx": "Aplicar en todos los elementos"
            },
            rw: {
              "en-us": "Apply on each row",
              "es-mx": "Aplicar en cada fila"
            },
            cl: {
              "en-us": "Apply on each column",
              "es-mx": "Aplicar en cada columna"
            }
          },
          "Value": [
            ["ae"]
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