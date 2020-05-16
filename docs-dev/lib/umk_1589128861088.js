class umk_1589128861088 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  genCompParams() {
    this.CompParams["T"] = math.dotDivide(1, this.Parameters.fr.Value);
    this.CompParams["hT"] = math.dotDivide(this.CompParams["T"], 2);
    this.CompParams["cT"] = math.dotDivide(this.CompParams["hT"], 2);
    this.CompParams["m"] = math.dotDivide(math.subtract(this.Parameters.fl.Value, this.Parameters.sl.Value), this.CompParams["hT"]);
    this.CompParams["m2"] = math.unaryMinus(this.CompParams["m"]);
    this.CompParams["c2"] = math.subtract(math.dotMultiply(2, this.Parameters.fl.Value), this.Parameters.sl.Value);
    //console.log(this.CompParams["m"].toString());
  }
  Evaluate(t) {
    let modT = math.mod(math.add(t, this.CompParams["cT"]), this.CompParams["T"]);
    this.outputs[0] = blockUtils.cmpAsnLimit(math.smaller(modT, this.CompParams["hT"]),
      math.add(math.dotMultiply(this.CompParams["m"], modT), this.Parameters.sl.Value),
      math.add(math.dotMultiply(this.CompParams["m2"], modT), this.CompParams["c2"]));
  }
  Details() {
    try {
      if (!this.invalidParams()) {
        return GSKGenFuncs.makeSVG("<polyline points=\'10,50 30,10 70,90 90,50\'\/><g stroke-width=\"1\"><text x=\'35\' y=\'12\' font-size=\'1em\'>L1<\/text><text x=\'48\' y=\'97\' font-size=\'1em\'>L2<\/text><line x1=\'10\' y1=\'50\' x2= \'90\' y2=\'50\'\/><line x1=\'10\' y1=\'30\' x2= \'10\' y2=\'70\'\/><line x1=\'90\' y1=\'30\' x2= \'90\' y2=\'70\'\/><text x=\'15\' y=\'62\' font-size=\'1em\'>1\/f<\/text><\/g>", "#00000000", "var(--col-text-0)", "#00000000", "monospace");
      }
    } catch (e) {
      console.log(e);
    }
  }
  invalidParams() {
    return !blockUtils.isAllSameDims([this.Parameters.fl.Value, this.Parameters.fl.Value, this.Parameters.fr.Value]);
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "fl": {
          "Name": {
            "en-us": "First limit $(L_1)$",
            "es-mx": "Primer límite $(L_1)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [1]
          ]
        },
        "sl": {
          "Name": {
            "en-us": "Second limit $(L_2)$",
            "es-mx": "Segundo límite $(L_2)$"
          },
          "Dimension": "Matrix",
          "Type": "Complex",
          "Value": [
            [-1]
          ]
        },
        "fr": {
          "Name": {
            "en-us": "Frequency $(f)$",
            "es-mx": "Frecuencia $(f)$"
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