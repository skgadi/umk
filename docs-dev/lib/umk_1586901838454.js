class umk_1586901838454 extends umk_model {
  Icon() {
    return {
      html: '$0$',
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
