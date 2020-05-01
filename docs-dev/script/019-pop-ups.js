const popup = {
  rCells: {}, //Registered cells, where window information is stored
  open: function (evt, type) {
    let graphDOMHandle = document.getElementById("graph");
    let x = evt.pageX - graphDOMHandle.offsetLeft;
    let y = evt.pageY - graphDOMHandle.offsetTop;
    let cell = mainSystem.graph.getCellAt(x, y);
    if (cell.style.search("umk_model") >= 0) {
      let urlQuery = {};
      urlQuery.v = Object.assign({
        cid: cell.id
      }, cell.value);
      urlQuery.db = simVue.dbName;
      let urlQueryString = packer.pack(JSON.stringify2(urlQuery));
      switch (type) {
        case 'chart':
          this.openUrl(cell.id, "/chart.html?" + urlQueryString, "width=600,height=300");
          break;
        default:
          break;
      }
    }
  },
  openUrl: function (cid, url, spec) {
    console.log(cid);
    if (!this.rCells[cid] || this.rCells[cid].closed) {
      this.rCells[cid] = window.open(url, undefined, spec);
    } else {
      console.log(this.rCells[cid]);
      this.rCells[cid].location.assign(url);
      this.rCells[cid].focus();
    }
  },
  closeAll: function () {
    let keys = Object.keys (this.rCells);
    for (let i=0; i<keys.length; i++) {
      this.rCells[keys[i]].close();
    }
  }
};