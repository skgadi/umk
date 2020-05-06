onmessage = function (event) {
  //console.log(event.data);
  if (event.data.d) {
    cItem.updData(event.data.d);
  }
  if (!!event.data.r) {
    cItem.resetChart();  
  }
  if (!!event.data.c) {
    this.console.log(event.data.c);
    cItem.showIm = event.data.c.Parameters.showIm.Value[0][0];
  }
};

(() => {
  console.log('loaded');
  cItem.prepareChart();
})()

