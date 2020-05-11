class umk_1589037990977 extends umk_model {
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
    let tempMat = math.dotMultiply(0,this.Parameters.dc.Value);
    let ulAdj = blockUtils.cmpAsnLimit(math.smaller(this.Parameters.dc.Value, 0), tempMat, this.Parameters.dc.Value);
    tempMat = math.add(100,tempMat);
    let allAdj = blockUtils.cmpAsnLimit(math.smaller(100, ulAdj), tempMat, ulAdj);
    this.CompParams["aT"] = math.dotDivide(allAdj, 100);
    //this.CompParams["m"] = math.dotDivide(math.subtract(this.Parameters.fl.Value, this.Parameters.sl.Value), this.CompParams["T"]);
  }
  Evaluate(t) {
    this.outputs[0] = blockUtils.cmpAsnLimit(math.smallerEq(math.mod(t, this.CompParams["T"]), this.CompParams["aT"]), this.Parameters.fl.Value, this.Parameters.sl.Value);
  }
  Details() {
    try {
      if (!this.invalidParams()) {
        return GSKGenFuncs.makeSVG("<polyline points=\'10,50 10,10 50,10 50,90 90,90 90,50\'\/><g stroke-width=\"1\"><text x=\'60\' y=\'12\' font-size=\'1em\'>L1<\/text><text x=\'22\' y=\'97\' font-size=\'1em\'>L2<\/text><line x1=\'10\' y1=\'50\' x2= \'90\' y2=\'50\'\/><line x1=\'10\' y1=\'30\' x2= \'10\' y2=\'70\'\/><line x1=\'90\' y1=\'30\' x2= \'90\' y2=\'70\'\/><text x=\'15\' y=\'62\' font-size=\'1em\'>1\/f<\/text><\/g>", "#00000000", "var(--col-text-0)", "#00000000", "monospace");
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
        },
        "dc": {
          "Name": {
            "en-us": "Duty cycle $(\\%)$",
            "es-mx": "Ciclo de trabajo $(\\%)$"
          },
          "Dimension": "Matrix",
          "Type": "Real",
          "Value": [
            [50]
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