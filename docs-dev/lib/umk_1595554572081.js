class umk_1595554572081 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: null,
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate(t) {
    const fl = this.Parameters.fl.Value;
    const sl = this.Parameters.sl.Value;
    if (this.Parameters.intOnly.Value[0][0]) {
      this.outputs[0] = this.Parameters.fl.Value.map(function (val, idx) {
        return math.randomInt(val, sl.get(idx));
      });
    } else {
      this.outputs[0] = this.Parameters.fl.Value.map(function (val, idx) {
        return math.random(val, sl.get(idx));
      });
    }
  }
  Details() {
    try {
      if (!this.invalidParams()) {
        return GSKGenFuncs.makeSVG("<polyline stroke-width=\'1\' points=\'10,38 11,24 12,40 13,56 14,64 15,72 16,89 17,61 18,18 19,59 20,32 21,47 22,85 23,34 24,39 25,34 26,22 27,78 28,67 29,15 30,81 31,54 32,36 33,23 34,89 35,55 36,57 37,51 38,59 39,27 40,85 41,58 42,19 43,11 44,35 45,56 46,45 47,57 48,24 49,11 50,45 51,61 52,41 53,10 54,42 55,67 56,60 57,27 58,40 59,29 60,27 61,59 62,82 63,43 64,26 65,89 66,75 67,36 68,44 69,20 70,58 71,44 72,19 73,63 74,59 75,24 76,66 77,61 78,35 79,81 80,73 81,36 82,82 83,58 84,28 85,68 86,66 87,86 88,21 89,77 90,38\'\/><path stroke-width=\'1\' stroke-dasharray=\'2,3\' d=\'M20,10 L90,10 M20,90 L90,90\'\/><text stroke-width=\'0.1\' fill=\'var(--col-text-1)\' x=\'2\' y=\'15\'font-size=\'1em\'>L1<\/text><text stroke-width=\'0.1\' fill=\'var(--col-text-1)\' x=\'2\' y=\'95\'font-size=\'1em\'>L2<\/text>", "#00000000", "var(--col-text-0)", "#00000000", "monospace");
      }
    } catch (e) {
      console.log(e);
    }
  }
  invalidParams() {
    return !blockUtils.isAllSameDims([this.Parameters.fl.Value, this.Parameters.sl.Value]);
  }
  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "intOnly": {
          "Name": {
            "en-us": "Generate only integer values",
            "es-mx": "Generar solo valores enteros"
          },
          "Dimension": "Scalar",
          "Type": "Checkbox",
          "Value": [
            [false]
          ]
        },
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