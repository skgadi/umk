const popup = {
  preparedData: {},
  pointToOpenWind: { //Gives the point at witch the window open
    x: 50,
    y: 50
  },
  refsForSinks: {}, // References for the sink cells
  /**
   * Each item maximum items are:
   * id: {
   *  extWind: frameHandle,
   *  intWind: {
   *    winRef: windowHandle,
   *    frmRef: frameHandle 
   *  }
   * }
   * 
   * 
   */
  rType: {}, //Registered type
  open: function (evt, type, pop, cid) {
    //console.log(cid);
    let graphDOMHandle = document.getElementById("graph");
    let cell;
    if (!!cid) {
      cell = mainSystem.graph.getModel().getCell(cid);
    } else {
      let x = evt.pageX - graphDOMHandle.offsetLeft;
      let y = evt.pageY - graphDOMHandle.offsetTop;
      cell = mainSystem.graph.getCellAt(x, y);

    }
    if (cell.style.search("umk_model") >= 0) {
      /*
      let urlQuery = {};
      urlQuery.v = Object.assign({
        cid: cell.id
      }, cell.value);
      urlQuery.lang = (type === 'scope') ? GUIText[settings.lang].chartLang : settings.lang;
      let urlQueryString = packer.pack(JSON.stringify2(urlQuery));*/
      let urlQueryString = "";
      switch (type) {
        case 'scope':
          this.rType[cell.id] = "scope";
          this.openUrl(cell.id, "./sinks/scope.min.html?" + urlQueryString, {
            W: 600,
            H: 300,
            w: 350,
            h: 200
          }, pop); //noreferrer, noopener,
          break;
        case 'scope-xy':
          this.rType[cell.id] = "scope-xy";
          this.openUrl(cell.id, "./sinks/scope-xy.min.html?" + urlQueryString, {
            W: 600,
            H: 300,
            w: 350,
            h: 200
          }, pop); //noreferrer, noopener,
          break;
        case "robot-6dof":
          this.rType[cell.id] = "ball";
          this.openUrl(cell.id, "./sinks/robot-6dof.min.html?" + urlQueryString, {
            W: 300,
            H: 300,
            w: 200,
            h: 200
          }, pop); //noreferrer, noopener,
          break;
        case "3d-line":
          this.rType[cell.id] = "ball";
          this.openUrl(cell.id, "./sinks/3d-line.min.html?" + urlQueryString, {
            W: 600,
            H: 300,
            w: 350,
            h: 200
          }, pop); //noreferrer, noopener,
          break;
        case "3d-surf":
          this.rType[cell.id] = "ball";
          this.openUrl(cell.id, "./sinks/3d-surf.min.html?" + urlQueryString, {
            W: 600,
            H: 300,
            w: 350,
            h: 200
          }, pop); //noreferrer, noopener,
          break;

        default:
          break;
      }
      this.initMessages(cell); // sends the cell info to the popup window
    }
    evt.stopPropagation();
  },
  openUrl: function (cid, url, spec, pop = true) {
    //console.log(cid);
    if (!this.refsForSinks[cid]) {
      this.refsForSinks[cid] = {};
    }
    if (pop) {
      if (!!this.refsForSinks[cid] && !!this.refsForSinks[cid].extWind && !this.refsForSinks[cid].extWind.closed) {
        this.refsForSinks[cid].extWind.focus();
      } else {
        this.refsForSinks[cid].extWind = window.open(url, "_blank", "width=" + spec.W + ",height=" + spec.H + ",");
        //Send all previous data
        this.sendStoredResults(this.refsForSinks[cid].extWind, cid);
        umk_audio.play("pop_openWind");
      }
    } else {
      if (!!this.refsForSinks[cid] && !!this.refsForSinks[cid].intWind) {
        this.refsForSinks[cid].intWind.winRef.activate();
      } else {
        const tempItem = {};
        tempItem.frmRef = document.createElement('iframe');
        tempItem.frmRef.setAttribute('width', '100%');
        tempItem.frmRef.setAttribute('height', '100%');
        tempItem.frmRef.setAttribute('src', url);
        tempItem.winRef = new mxWindow(mainSystem.graph.getTooltipForCell(mainSystem.graph.getModel().getCell(cid)),
          tempItem.frmRef, this.pointToOpenWind.x, this.pointToOpenWind.y, spec.w, spec.h);
        this.refsForSinks[cid].intWind = tempItem;
        tempItem.winRef.setVisible(true);
        tempItem.winRef.setMaximizable(true);
        tempItem.winRef.setMinimizable(true);
        tempItem.winRef.setClosable(true);
        tempItem.winRef.setResizable(true);
        tempItem.winRef.destroyOnClose = true;
        tempItem.winRef.cid = cid;
        tempItem.winRef.addListener(mxEvent.DESTROY, function (sender, evt, c) {
          //console.log(sender.cid);
          popup.refsForSinks[sender.cid].intWind.frmRef.remove();
          delete popup.refsForSinks[sender.cid].intWind;
        });
        // update this.pointToOpenWind
        this.pointToOpenWind.x = ((this.pointToOpenWind.x + 50 + 200 - document.body.clientWidth) < 0) ? this.pointToOpenWind.x + 5 : 50;
        this.pointToOpenWind.y = ((this.pointToOpenWind.y + 50 + 200 - document.body.clientHeight) < 0) ? this.pointToOpenWind.y + 5 : 50;

        //Send all previous data
        this.sendStoredResults(tempItem.frmRef.contentWindow, cid);
        umk_audio.play("pop_openWind");
      }
    }
  },
  closeAll: function (clearRegisters = false) {
    let keys = Object.keys(this.refsForSinks);
    for (let i = 0; i < keys.length; i++) {
      this.close(keys[i]);
    }
    if (clearRegisters) {
      this.rType = {};
    }
  },
  close: function (cid) {
    if (!!this.refsForSinks[cid]) {
      if (!!this.refsForSinks[cid].extWind) {
        this.refsForSinks[cid].extWind.close();
      }
      if (!!this.refsForSinks[cid].intWind) {
        this.refsForSinks[cid].intWind.winRef.destroy();
      }
      delete this.refsForSinks[cid]
    }
  },
  prepareData: function (results) {


    //console.log(cid);
    try {
      this.preparedData = {};
      for (let index = 0; index < Object.keys(results[0].o).length; index++) {
        const cid = Object.keys(results[0].o)[index];
        this.preparedData[cid] = results.map(
          function (ele) {
            // console.log(ele);
            const val = [];
            for (let i = 0; i < ele.o[cid].length; i++) {
              let tempVal = math.evaluate(ele.o[cid][i]);
              val.push({
                r: math.re(tempVal)._data,
                i: math.im(tempVal)._data
              });
            }
            return {
              t: ele.t,
              v: val
            };
          }
        )
      }
    } catch (e) {
      console.log(e);
    }
  },
  //Types of messages sent are d,r,c,s which represent Data, reset, configuration, settings
  messageWindows: function (cid, msg) {
    // console.log(cid);
    if (!!this.refsForSinks[cid]) {
      if (!!this.refsForSinks[cid].extWind &&
        !this.refsForSinks[cid].extWind.closed) {
        this.refsForSinks[cid].extWind.postMessage(msg);
      }
      if (!!this.refsForSinks[cid].intWind) {
        this.refsForSinks[cid].intWind.frmRef.contentWindow.postMessage(msg);
      }
    }
  },
  initMessages: function (cell) {
    setTimeout((that, cell) => {
      that.sendSettings(cell.id);
      that.sendParams(simVue.pCell4Exp(cell));
    }, 1000, this, cell);
  },
  sendParams: function (prepCell) {
    // console.log('sendParams');
    this.messageWindows(prepCell.cid, {
      c: prepCell
    });
  },
  sendData: function (cid) {
    // console.log('sendData');
    this.messageWindows(cid, {
      d: this.preparedData[cid]
    });
  },
  resetAll: function () {
    // console.log('resetAll');
    let keys = Object.keys(this.refsForSinks);
    for (let i = 0; i < keys.length; i++) {
      this.sendResetNSettings(keys[i]);
    }
  },
  sendResetNSettings: function (cid) {
    this.sendReset(cid);
    this.sendSettings(cid);
  },
  sendReset: function (cid) {
    this.messageWindows(cid, {
      r: true
    });
  },
  sendSettingsToAll: function () {
    let keys = Object.keys(this.refsForSinks);
    for (let i = 0; i < keys.length; i++) {
      this.sendSettings(keys[i]);
    }
  },
  sendSettings: function (cid) {
    this.messageWindows(cid, {
      s: settings
    });
  },
  destroyAllPopups: function () {
    this.closeAll();
    this.pointToOpenWind = { //Gives the point at witch the window open
      x: 50,
      y: 50
    };
    this.refsForSinks = {};
    this.rType = {};
  },
  sendStoredResults: function (handle, cid) {
    setTimeout(() => {
      //console.log(handle);
      handle.postMessage({
        d: simVue.results[cid]
      });
      setTimeout(() => {
        umk_audio.play("pop_sentPrevData");
      }, 500);
    }, settings.waitPRLoad * 1000);
  }

};