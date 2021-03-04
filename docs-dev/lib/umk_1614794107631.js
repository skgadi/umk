class umk_1614794107631 extends umk_model {
  Icon() {
    return {
      html: blockUtils.makeIcon(this.id),
      inLabels: "",
      outLabels: null,
      splStyle: ""
    };
  }
  Evaluate() {
    this.outputs[0] = math.transpose(math.matrix([
      math.mode(this.inputs[0])
    ]));
    //console.log(this.outputs[0].toString());
  }
  Details(short = false) {
    let outString_1 = "";
    let outString_2 = "";
    outString_1 = "\\operatorname{mode} (u)"; //TeX.prepDisp();
    outString_2 = "y=";
    if (short) {
      return TeX.prepInline(outString_1);
    } else {
      return TeX.prepDisp("{\\huge " + outString_2 + outString_1 + "}");
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