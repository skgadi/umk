class umk_1589037918939 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate(t) {
    this.outputs[0] = blockUtils.cmpAsnLimit(math.smaller(t, this.Parameters.sT.Value), this.Parameters.iLi.Value, this.Parameters.fLi.Value);
  }
  Details() {
    try {
      if (!this.invalidParams()) {
        let out = TeX.prepDisp("y_{i,j}(t) := \\left\\{ \\begin{matrix} A_{i,j} & \\text{ "+GUIText[settings.lang].for+" } T_{0_{i,j}} \< t \\\\ B_{i,j} & \\text{ "+GUIText[settings.lang].for+" }  T_{0_{i,j}} \\ge t \\end{matrix} \\right.");
        out += "<br/>" + TeX.prepInline("i \\in" + TeX.prepSetWithRange(this.Parameters.sT.Value.length));
        out += ",<br/>" + TeX.prepInline("j \\in" + TeX.prepSetWithRange(this.Parameters.sT.Value[0].length));
        return out;
      }
    } catch (e) {
      console.log(e);
    }
  }
  invalidParams() {
    return !blockUtils.isAllSameDims([this.Parameters.iLi.Value, this.Parameters.fLi.Value, this.Parameters.sT.Value]);
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "iLi": {
          "Name": {
            "en-us": "Value before step time $(A)$",
            "es-mx": "Valor antes del escalón $(A)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [0]
          ]
        },
        "fLi": {
          "Name": {
            "en-us": "Value after step time $(B)$",
            "es-mx": "Valor después del escalón $(B)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [1]
          ]
        },
        "sT": {
          "Name": {
            "en-us": "Step time $(T_0)$",
            "es-mx": "Tiempo de aplicación del escalón $(T_0)$"
          },
          "Dimension": "Matrix",
          "Type": "Real",
          "Value": [
            [1]
          ]
        },
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