class umk_1586738484106 extends umk_model {
  Icon() {
    return {
      html: '<div class="gen-btn"><i class="fas fa-fw fa-external-link-alt"></i></div>',
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