const db = {
  handle: null,
  cid: null,
  lastIdx: -1,
  connectDB: function (name) {
    if (!name) {
      name = urlInfo.info.db
    }
    Dexie.exists(name).then(function (val) {
      if (val) {
        db.handle = new Dexie(name);
        db.handle.version(1).stores({
          outs: '++k, t, b' //future edits should be done at 3 places 1. script/018-sim, 2. db/002-exec.js, 3. chart/003-db
        });
        db.lastIdx = -1;
      }
    });
  },
  /*
    removeDB: function () {
      if (!!this.handle) {
        this.handle.delete()
      }
    },*/
  getData: function () {
    if (!!this.handle && !this.handle.hasBeenClosed()) {
      this.handle.outs.where("b").equals(this.cid).filter(function (item) {
        return item.k > db.lastIdx;
      }).sortBy("t", function (vals) {
        //console.log(vals);
        db.pDataNPlot(vals);
      });
    } else {
      this.connectDB();
    }
  },
  pDataNPlot: function (vals) {
    if (vals.length > 0) {

      let series = [];
      for (let i = 0; i < vals.length; i++) {
        let mVal = math.evaluate(vals[i].v);
        let eleNum = 0;
        mVal.forEach(function (val, index) {
          if (!i) {
            if (cItem.showIm) {
              series.push({
                name: "Re([" + (index[0] + 1) + ", " + (index[1] + 1) + "])",
                data: []
              });
              series.push({
                name: "Im([" + (index[0] + 1) + ", " + (index[1] + 1) + "])",
                data: []
              });
            } else {
              series.push({
                name: "[" + (index[0] + 1) + ", " + (index[1] + 1) + "]",
                data: []
              });
            }
          }
          if (cItem.showIm) {
            series[eleNum++].data.push([vals[i].t, math.re(val)]);
            series[eleNum++].data.push([vals[i].t, math.im(val)]);
          } else {
            series[eleNum++].data.push([vals[i].t, math.re(val)]);
          }
        });
      }
      //console.log(series);
      if (this.lastIdx > 0) {
        for (let i=0; i<series.length; i++) {
          delete series[i].name;
        }
        cItem.handle.appendData(series);
      } else {
        cItem.handle.updateSeries(series);
      }
      let maxKey = Math.max.apply(Math, vals.map(function (o) {
        return o.k;
      }));
      if (maxKey >= 0) {
        this.lastIdx = maxKey;
      }
      console.log(vals);
    }

  }
}