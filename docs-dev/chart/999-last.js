onmessage = function (event) {
  //console.log(event.data);
  if (event.data.d) {
    cItem.updData(event.data.d);
  }
  if (!!event.data.r) {
    cItem.resetChart();  
  }
};

(() => {
  console.log('loaded');
  cItem.prepareChart();
  /*urlInfo.getInText();
  urlInfo.getInfo();
  urlInfo.getLocale();
  cItem.prepareChart();
  db.connectDB();
  db.cid = urlInfo.info.v.cid;*/
  //for (; true;) {}
  /*setTimeout(() => {
      db.getData();
  }, 100);*/
  /*setInterval(() => {
      db.getData();
  }, 100);*/
  //console.log(urlInfo.info);
})()

