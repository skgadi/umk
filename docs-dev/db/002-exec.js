const exec = {
  dbHandler: null,
  results: [],
  dbName: "",
  setDB: function (name) {
    this.dbName = name;
    if (!!this.dbHandler) {
      this.dbHandler.close();
      this.dbHandler.delete().then(() => {
        exec.createDB();
      });
    } else {
      this.createDB(name);
    }
  },
  createDB = function (name) {
    if (!name) {
      name = this.dbName;
    }
    this.dbHandler = new Dexie(name);
    this.dbHandler.version(1).stores({
      outs: '++k, t, b' //future edits should be done at 3 places 1. script/018-sim, 2. db/002-exec.js, 3. chart/003-db
    });
  },
  putData = function (data) {
    this.dbHandler.outs.add(data);
  },
  delDbase = function () {
    this.dbHandler.delete();
  },
  maxCount: 101,
  wUDelFin: false, // Wait until delete operation is finished
  removeAboveLimit: function (max) {
    if (!this.wUDelFin) {
      if (max > 0) {
        this.maxCount = max;
      }
      this.dbHandler.outs.count().then(function (val) {
        console.log(val);
        let noOfItemsToRemove = val - exec.maxCount;
        console.log(noOfItemsToRemove);
        if (noOfItemsToRemove > 0) {
          exec.wUDelFin = true;
          exec.dbHandler.outs.orderBy("t").limit(noOfItemsToRemove).delete().then((e) => {
            exec.wUDelFin = false;
            console.log(e);
          });
        }
      });
    }
  },
  addResults = function (newRes) {
    //This code is may not work as expected
    this.dbHandler.outs.bulkAdd(newRes);
    this.removeAboveLimit()
    /*
        //Old code .... use this if error in seeing all the simulation results.
        this.results = this.results.concat(newRes);
        console.log(this.results[this.results.length - 1]);
        setTimeout(loop);
        */
  },
}

function loop(e) {
  //console.log(e);
  if (exec.results.length) {
    //console.log(exec.results[0]);
    let item = JSON.parse2(JSON.stringify2(exec.results.shift()));
    //exec.putData(exec.results.shift());
    exec.dbHandler.outs.add(item).then(loop, function () {
      console.log("sdf");
    });
    //console.log("item ->");
    //console.log(item);
    //localforage.setItem(item.t + "_" + item.b, item, loop);
    //console.log(exec.results[0]); 
    //setTimeout(loop);
  }
}