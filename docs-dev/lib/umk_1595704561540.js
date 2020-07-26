class umk_1595704561540 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    this.outputs[0] = math.kron(this.inputs[0], this.inputs[1]);
    for (let i=2; i<this.TerminalsIn.value;i++) {
      this.outputs[0] = math.kron(this.outputs[0], this.inputs[i]);
    }
  }
  Details() {
    return TeX.prepDisp("{\\mathbf {A} \\otimes \\mathbf {B} } ={\\begin{bmatrix}a_{11}\\mathbf {B} &\\cdots &a_{1n}\\mathbf {B} \\\\\\vdots &\\ddots &\\vdots \\\\a_{m1}\\mathbf {B} &\\cdots &a_{mn}\\mathbf {B} \\end{bmatrix}}={\\begin{bmatrix}a_{11}b_{11}&a_{11}b_{12}&\\cdots &a_{11}b_{1q}&\\cdots &\\cdots &a_{1n}b_{11}&a_{1n}b_{12}&\\cdots &a_{1n}b_{1q}\\\\a_{11}b_{21}&a_{11}b_{22}&\\cdots &a_{11}b_{2q}&\\cdots &\\cdots &a_{1n}b_{21}&a_{1n}b_{22}&\\cdots &a_{1n}b_{2q}\\\\\\vdots &\\vdots &\\ddots &\\vdots &&&\\vdots &\\vdots &\\ddots &\\vdots \\\\a_{11}b_{p1}&a_{11}b_{p2}&\\cdots &a_{11}b_{pq}&\\cdots &\\cdots &a_{1n}b_{p1}&a_{1n}b_{p2}&\\cdots &a_{1n}b_{pq}\\\\\\vdots &\\vdots &&\\vdots &\\ddots &&\\vdots &\\vdots &&\\vdots \\\\\\vdots &\\vdots &&\\vdots &&\\ddots &\\vdots &\\vdots &&\\vdots \\\\a_{m1}b_{11}&a_{m1}b_{12}&\\cdots &a_{m1}b_{1q}&\\cdots &\\cdots &a_{mn}b_{11}&a_{mn}b_{12}&\\cdots &a_{mn}b_{1q}\\\\a_{m1}b_{21}&a_{m1}b_{22}&\\cdots &a_{m1}b_{2q}&\\cdots &\\cdots &a_{mn}b_{21}&a_{mn}b_{22}&\\cdots &a_{mn}b_{2q}\\\\\\vdots &\\vdots &\\ddots &\\vdots &&&\\vdots &\\vdots &\\ddots &\\vdots \\\\a_{m1}b_{p1}&a_{m1}b_{p2}&\\cdots &a_{m1}b_{pq}&\\cdots &\\cdots &a_{mn}b_{p1}&a_{mn}b_{p2}&\\cdots &a_{mn}b_{pq}\\end{bmatrix}}");
  }
  constructor(obj) {
    super(Object.assign({
      TerminalsIn: {
        min: 2,
        max: Infinity,
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