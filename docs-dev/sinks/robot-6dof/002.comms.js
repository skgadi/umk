onmessage = function (event) {
  //console.log(event.data);
  if (event.data.d) {
    updateData(event.data.d);
  }
  if (!!event.data.r) {
    restThedata();
  }
  if (!!event.data.c) {
    //Setting data limit
    settings.limitData = JSON.parse(event.data.c.Parameters.limitData.Value)[0][0];
    document.title = event.data.c.Name;

  }
  if (!!event.data.s) {
    settings.mSettings = event.data.s;
  }
};