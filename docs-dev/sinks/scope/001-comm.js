onmessage = function (event) {
  //console.log(event.data);
  if (event.data.d) {
    if (settings.isChartReady) {
      updateData(event.data.d);
    }
    // console.log("done data");
  }
  if (!!event.data.r) {
    if (settings.isChartReady) {
      prepareScope();
    }
  }
  if (!!event.data.c) {
    // console.log(event.data.c);
    // show and hide the imagenary axis
    if (settings.showImg !== event.data.c.Parameters.showIm.Value[0][0]) {
      settings.showImg = event.data.c.Parameters.showIm.Value[0][0];
      adjustImagSeriesView();
    }
    //Setting data limit
    settings.limitData = JSON.parse(event.data.c.Parameters.limitData.Value)[0][0];
    document.title = event.data.c.Name;
  }
  if (!!event.data.s) {
    settings.mSettings = event.data.s;
    prepareColors();
  }
  };