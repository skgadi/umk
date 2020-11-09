class umk_1588716918922 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      //html: TeX.prepDisp("\\begin{bmatrix}"+(new Array(this.TerminalsIn.value).fill("\\cdot")).join("\\\\")+"\\end{bmatrix}"),
      //html: TeX.prepDisp("[\\square \\square]"),
      inLabels: [],
      outLabels: null,
      //splStyle: "shape=triangle;" // wait until the out triangle is hidden when connected
      splStyle: ""
    };
  }
  Evaluate() {
    this.outputs[0] = this.inputs[0];
    for (let i = 1; i < this.TerminalsIn.value; i++) {
      this.outputs[0] = math.concat(this.outputs[0], this.inputs[i], 0);
    }
  }
  Details() {
    let arr = [];
    for (let i = 0; i < this.TerminalsIn.value; i++) {
      arr.push(["u_" + i + "(t)"]);
    }
    return TeX.prepDisp("y(t)=" + TeX.frmArray(arr));
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