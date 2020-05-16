class umk_1589386996268 extends umk_model {
    Icon() {
      return {
        html: blockUtils.makeIcon(this.id),
        inLabels: "",
        outLabels: null,
        splStyle: ""
      };
    }
    Evaluate() {
      this.outputs[0] = math.sign(this.inputs[0]);
    }
    Details() {
      return TeX.prepDisp("y_{i,j} = \\left \\{ \\begin{matrix}1, & u_{i,j}>0 \\\\ 0, & u_{i,j}=0 \\\\ -1, & u_{i,j}<0\\end{matrix} \\right.");
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