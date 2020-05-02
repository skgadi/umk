(() => {
    urlInfo.getInText();
    urlInfo.getInfo();
    urlInfo.getLocale();
    cItem.prepareChart();
    db.connectDB();
    db.cid = urlInfo.info.v.cid;
    //for (; true;) {}
    /*setTimeout(() => {
        db.getData();
    }, 100);*/
    setInterval(() => {
        db.getData();
    }, 100);
    //console.log(urlInfo.info);
})()