class umk_1585601356516 extends umk_model {
  Icon() {
    return {
      html: "$+$",
      inLabels: new Array(this.TerminalsIn.value).fill("+"),
      outLabels: null,
      //splStyle: "shape=triangle;" // wait until the out triangle is hidden when connected
      splStyle: ""
    };
  }
  Evaluate() {
    this.outputs[0] = math.add(this.inputs[0], this.inputs[1]);
    for (let i = 2; i < this.TerminalsIn.value; i++) {
      this.outputs[0] = math.add(this.outputs[0], this.inputs[i]);
    }
  }
  Details() {
    return "$$y(t) = a\\times u(t)$$";
  }
  constructor(obj) {
    super(Object.assign({
      TerminalsIn: {
        min: 2,
        max: 100,
        value: 2,
        editable: true
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