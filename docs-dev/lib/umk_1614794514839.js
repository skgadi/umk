class umk_1614794514839 extends umk_model {
  Icon() {
    return {
      html: this.Details(true),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    if (this.Parameters.iSelected.Value[0][0] === "ae") {
      this.outputs[0] = math.matrix([
        [math.mad(this.inputs[0])]
      ]);
    } else if (this.Parameters.iSelected.Value[0][0] === "rw") {
      let gSize = this.inputs[0].size();
      const TempOutArray = [];
      for (let i = 0; i < gSize[0]; i++) {
        let TempResult = math.mad(this.inputs[0].subset(math.index(i, Array.from(Array(gSize[1]).keys()))));
        TempOutArray.push([TempResult]);
      }
      this.outputs[0] = math.matrix(TempOutArray);
    } else {
      let gSize = this.inputs[0].size();
      const TempOutArray = [];
      for (let i = 0; i < gSize[1]; i++) {
        let TempResult = math.mad(this.inputs[0].subset(math.index(Array.from(Array(gSize[0]).keys()), i)));
        TempOutArray.push(TempResult);
      }
      this.outputs[0] = math.matrix([TempOutArray]);
    }
    //console.log(this.outputs[0].toString());
  }
  Details(short = false) {
    let outString_1 = "";
    let outString_2 = "";
    if (this.Parameters.iSelected.Value[0][0] === "ae") {
      outString_1 = "\\operatorname{MAD} (u)"; //TeX.prepDisp();
      outString_2 = "y=";
    } else if (this.Parameters.iSelected.Value[0][0] === "rw") {
      outString_1 = " \\operatorname{MAD} \\left( u_{i,\\left[1,n\\right]}\\right)"; //TeX.prepDisp();
      outString_2 = "y_{i,1}=";
    } else {
      outString_1 = "\\operatorname{MAD} \\left( u_{\\left[1,m\\right],j}\\right)"; //TeX.prepDisp();
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