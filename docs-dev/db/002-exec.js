const exec = {
  dbHandler = null,
  results = [],
  setDB = function (name) {
    if (!!this.dbHandler) {
      this.dbHandler.delete();
    }
    this.dbHandler = new Dexie(name);
    this.dbHandler.version(1).stores({
      outs: '++k, t, b, v'
    });
  },
  putData = function (data) {
    this.dbHandler.outs.add(data);
  },
  delDbase = function () {
    this.dbHandler.delete();
  },
  addResults = function (newRes) {
    this.results = this.results.concat(newRes);
    console.log(this.results[this.results.length - 1]);
    setTimeout(loop);
  },
}

function loop(e) {
  console.log(e);
  if (exec.results.length) {
    //console.log(exec.results[0]);
    let item = JSON.parse2(JSON.stringify2(exec.results.shift()));
    //exec.putData(exec.results.shift());
    exec.dbHandler.outs.add(item).then(loop, function () {
      console.log("sdf");
    });
    console.log("item ->");
    console.log(item);
    //localforage.setItem(item.t + "_" + item.b, item, loop);
    //console.log(exec.results[0]); 
    //setTimeout(loop);
  } else {
    exec.dbHandler.outs.get(51).then(function(e){console.log(e)});
  }
}