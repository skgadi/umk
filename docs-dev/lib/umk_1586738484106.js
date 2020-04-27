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
      TerminalsIn: {
        min: 1,
        max: 1,
        value: 1,
        editable: false
      }
    }, obj));
  }
}