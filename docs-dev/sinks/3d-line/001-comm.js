onmessage = function (event) {
  //console.log(event.data);
  if (event.data.d) {
    appendData(event.data.d);
  }
  if (!!event.data.r) {
    clearData();
  }
  if (!!event.data.c) {
    settings.width = JSON.parse(event.data.c.Parameters.width.Value)[0][0];
    settings.reversescale = !!event.data.c.Parameters.reversescale.Value[0][0];
    settings.showIm = !!event.data.c.Parameters.showIm.Value[0][0];
    settings.mode = event.data.c.Parameters.mode.Value[0][0];
    settings.limitData = JSON.parse(event.data.c.Parameters.limitData.Value)[0][0];
    //console.log(settings);
  }
  if (!!event.data.s) {
    settings.mSettings = event.data.s;
    updateColors();
  }
};