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
      isOut: true //shows that this is a output
    }, obj));
  }
}