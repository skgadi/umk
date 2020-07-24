onmessage = function (event) {
  //console.log(event.data);
  if (event.data.d) {
    //console.log(event.data.d);
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
    // Check for change in log scales
    let resetTheChart = false;
    if (settings.xLogScale !== event.data.c.Parameters.xLogScale.Value[0][0]) {
      settings.xLogScale = event.data.c.Parameters.xLogScale.Value[0][0];
      resetTheChart=true;
    }
    if (settings.yLogScale !== event.data.c.Parameters.yLogScale.Value[0][0]) {
      settings.yLogScale = event.data.c.Parameters.yLogScale.Value[0][0];
      resetTheChart=true;
    }

    // show and hide the imagenary axis
    if (settings.showImg !== event.data.c.Parameters.showIm.Value[0][0]) {
      settings.showImg = event.data.c.Parameters.showIm.Value[0][0];
      adjustImagSeriesView();
    }
    //Setting data limit
    settings.limitData = JSON.parse(event.data.c.Parameters.limitData.Value)[0][0];
    document.title = event.data.c.Name;

    //enable charts animation
    setAnimation(event.data.c.Parameters.aCharts.Value[0][0]);

    if (resetTheChart) {
      prepareScope();
    }
  }
  if (!!event.data.s) {
    settings.mSettings = event.data.s;
    prepareColors();
  }
  };