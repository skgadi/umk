(() => {
    urlInfo.getInText();
    urlInfo.getInfo();
    urlInfo.getLocale();
    cItem.prepareChart();
    db.connectDB();
    db.cid = urlInfo.info.v.cid;
    /*setTimeout(() => {
        db.getData();
    }, 100);*/
    setInterval(() => {
        db.getData();
    }, 1000);
    //console.log(urlInfo.info);
})()