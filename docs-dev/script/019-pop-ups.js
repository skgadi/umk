const popup = {
  rCells: {}, //Registered cells, where window information is stored
  rType: {}, //Registered type
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
      urlQuery.lang = (type === 'chart') ? GUIText[settings.lang].chartLang : settings.lang;
      let urlQueryString = packer.pack(JSON.stringify2(urlQuery));
      switch (type) {
        case 'chart':
          this.rType[cell.id] = "chart";
          this.openUrl(cell.id, "chart.html?" + urlQueryString, "width=600,height=300,"); //noreferrer, noopener,
          break;
        default:
          break;
      }
    }
  },
  openUrl: function (cid, url, spec) {
    //console.log(cid);
    if (this.rCells[cid] && !this.rCells[cid].closed) {
      //console.log(this.rCells[cid]);
      //this.rCells[cid].location.assign(url);
      this.rCells[cid].focus();
    } else {
      this.rCells[cid] = window.open(url, "_blank", spec);
    }
  },
  closeAll: function () {
    let keys = Object.keys(this.rCells);
    for (let i = 0; i < keys.length; i++) {
      this.rCells[keys[i]].close();
    }
  },
  prepareData: function (cid) {
    //console.log(cid);
    return function (ele) {
      let val = math.evaluate(ele.o[cid]);
      return {
        t: ele.t,
        v: [math.re(val)._data, math.im(val)._data]
      };
    }
  },
  sendData: function (cid) {
    if (this.rCells[cid] && !this.rCells[cid].closed) {
      this.rCells[cid].postMessage({
        d: simVue.results.map(popup.prepareData(cid))
      });
    }
  },
  resetAll: function () {
    let keys = Object.keys(this.rCells);
    for (let i = 0; i < keys.length; i++) {
      if (this.rCells[keys[i]] && !this.rCells[keys[i]].closed) {
        this.rCells[keys[i]].postMessage({
          r: true
        });
      }
    }
  }
};