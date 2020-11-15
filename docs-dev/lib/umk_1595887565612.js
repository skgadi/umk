class umk_1595887565612 extends umk_model {
  Icon() {
    return {
      html: this.Details(),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Init() {
    /*this.Evaluate_out = []; //Output of int
    this.Evaluate_pt = [0]; // previous time
    this.Evaluate_mem = []; //Memory for integration*/
    // this.CompParams.isForward = 0;
  }
  Evaluate(t, k, simSettings) {
    //console.log(t-this.CompParams.pT);
    if (t!==0) {
      this.outputs[0] = math.divide(math.subtract(this.inputs[0], this.CompParams.pIn),(t-this.CompParams.pT));
      this.CompParams.pIn = this.inputs[0];
      this.CompParams.pT = t;
    } else {
      this.outputs[0] = math.divide(math.subtract(this.inputs[0], math.zeros(math.size(this.inputs[0]))),simSettings.h);
      this.CompParams.pIn = this.inputs[0];
      this.CompParams.pT = t;
    }
  }
  Details(inline) {
    if (inline) {
      return TeX.prepInline("\\frac{\\text{d}u}{\\text{d}t}");
    } else {
      return TeX.prepDisp("\\frac{\\text{d}u}{\\text{d}t}");
    }
  }
  constructor(obj) {
    super(Object.assign({
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