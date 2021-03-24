class umk_1616354932295 extends umk_model {
  Icon() {
    this.genCompParams();
    return {
      html: "",
      inLabels: null,
      outLabels: this.Parameters.tag.Value.map((ele) => {
        return ele[0];
      }),
      //splStyle: "shape=triangle;" // wait until the out triangle is hidden when connected
      splStyle: "shape=fromTag;"
    };
  }
  Details() {
    this.TerminalsOut.value=this.Parameters.tag.Value.length;
    let out;
    for (let i=0; i<this.Parameters.tag.Value.length; i++) {
      out += "<p>"+TeX.prepInline(this.Parameters.tag.Value[i][0])+"</p>";
    }
    return out;
  }
  invalidParams() {
    for (let i=0; i<this.Parameters.tag.Value.length; i++) {
      if (!blockUtils.isValidTagName(this.Parameters.tag.Value[i][0])) {
        return true;
      }
    }
    return false;
  };

  constructor(obj) {
    super(Object.assign({
      Parameters: {
        "tag": {
          "Name": {
            "en-us": "Tag name",
            "es-mx": "Tag name"
          },
          "hideEval": true,
          "Dimension": "Vector",
          "Type": "Text",
          "Value": [
            ["x"]
          ]
        }
      },
      TerminalsOut: {
        min: 1,
        max: 100,
        value: 1,
        editable: false
      },
      signalRerouting: true
    }, obj));
  }
}