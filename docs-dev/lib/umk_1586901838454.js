class umk_1586901838454 extends umk_model {
  Icon(inHtml) {
    if (!!inHtml) {
      this.Icon_Temp_Html = inHtml;
    }
    return {
      html: (!!this.Icon_Temp_Html) ? this.Icon_Temp_Html : '$[\\#]$',
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  constructor(obj) {
    super(Object.assign({
      isOut: true, //shows that this is a output
      showInpOnHtml: true // lets to show inputs as HTML on cell 
    }, obj));
  }
}