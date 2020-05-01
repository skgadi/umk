class umk_1586738484106 extends umk_model {
  Icon() {
    return {
      html: '<div onClick="popup.open(event,\'chart\')" class="pointer"><i class="fas fa-chart-line fa-2x fa-fw"></i></div>',
      //html: '<iframe style="width:100%; height: 100%" src="/chart.html"></iframe>',
      inLabels: null,
      outLabels: null,
      splStyle: null
    };
  }
  constructor(obj) {
    super(Object.assign({
      isOut: true //shows that this is a output
    }, obj));
  }
}