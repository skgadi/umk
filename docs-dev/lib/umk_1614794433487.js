class umk_1614794433487 extends umk_model {
    Icon() {
      return {
        html: blockUtils.makeIcon(this.id),
        inLabels: ["1", "2"],
        outLabels: null,
        splStyle: ""
      };
    }
    Evaluate() {
      const tempOut = math.quantileSeq(this.inputs[0], math.squeeze(this.inputs[1]).toArray())
      if (math.typeOf(tempOut) === "number") {
        this.outputs[0] = math.matrix([[tempOut]]);
      } else {
        this.outputs[0] = math.matrix([tempOut]);
      }
      //console.log(this.outputs[0].toString());
    }
    Details() {
        return TeX.prepDisp("\\operatorname {quantileSeq} (u_1, u_2)");
    }
    constructor(obj) {
      super(Object.assign({
        TerminalsIn: {
          min: 2,
          max: 2,
          value: 2,
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