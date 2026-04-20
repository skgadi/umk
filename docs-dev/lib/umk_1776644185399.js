class umk_1776644185399 extends umk_model {
  Icon() {
    return {
      //html: TeX.prepDisp("\\sin(\\cdot)"),
      html: blockUtils.makeIcon(this.id),
      inLabels: null,
      outLabels: null,
      splStyle: "",
    };
  }
  Evaluate(t, k, simSettings, missedReads) {
    this.outputs[0] = math.matrix([[missedReads]]);
  }
  Details() {
    return "<div>Displays the number of times hardware went non-operational.</div>";
  }
  constructor(obj) {
    super(
      Object.assign(
        {
          TerminalsOut: {
            min: 1,
            max: 1,
            value: 1,
            editable: false,
          },
        },
        obj,
      ),
    );
  }
}
