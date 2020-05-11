class umk_1589037930037 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  genCompParams() {
    this.CompParams["c"] = math.unaryMinus(math.dotMultiply(this.Parameters.sl.Value, this.Parameters.st.Value));
  }
  Evaluate(t) {
    let lesM = math.smaller(t, this.Parameters.st.Value);
    //console.log(lesM);
    this.outputs[0] = blockUtils.cmpAsnLimit(math.smaller(t, this.Parameters.st.Value), this.Parameters.iv.Value, math.add(math.dotMultiply(t, this.Parameters.sl.Value), this.CompParams["c"]));
  }
  Details() {
    try {
      if (!this.invalidParams()) {
        return GSKGenFuncs.makeSVG("<polyline points=\'10,90 30,90 90,10\'\/><g stroke-width=\"1\"><text x=\'0\' y=\'86\' font-size=\'1em\'>y0<\/text><text x=\'20\' y=\'70\' font-size=\'1em\'>T0<\/text><line x1=\'20\' y1=\'70\' x2= \'27\' y2=\'85\'\/><line x1=\'27\' y1=\'80\' x2= \'27\' y2=\'85\'\/><line x1=\'23\' y1=\'82\' x2= \'27\' y2=\'85\'\/><text x=\'80\' y=\'50\' font-size=\'1em\'>m<\/text><line x1=\'75\' y1=\'40\' x2= \'75\' y2=\'55\'\/><line x1=\'62\' y1=\'55\' x2= \'75\' y2=\'55\'\/><\/g>", "#00000000", "var(--col-text-0)", "#00000000", "monospace");
      }
    } catch (e) {
      console.log(e);
    }
  }
  invalidParams() {
    return !blockUtils.isAllSameDims([this.Parameters.sl.Value, this.Parameters.st.Value]);
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "iv": {
          "Name": {
            "en-us": "Initial value $(y_0)$",
            "es-mx": "Valor inicial $(y_0)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [0]
          ]
        },
        "sl": {
          "Name": {
            "en-us": "Slope $(m)$",
            "es-mx": "Pendiente $(m)$"
          },
          "Dimension": "Matrix",
          "Type": "Real",
          "Value": [
            [1]
          ]
        },
        "st": {
          "Name": {
            "en-us": "Start time $(T_0)$",
            "es-mx": "Tiempo de inicio $(T_0)$"
          },
          "Dimension": "Matrix",
          "Type": "Real",
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