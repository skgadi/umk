const kbshortcut = function (menuItem) {
  let suspendShortcuts = true;
  let callback = null;
  const kbsRegistered = {};
  const extraKBShortcut = [{
    "ctrl": true,
    "alt": false,
    "shift": false,
    "keycode": "96",
    "func": "mainSystem.navigate('zoomActual')"
  }, {
    "ctrl": true,
    "alt": false,
    "shift": true,
    "keycode": "96",
    "func": "mainSystem.navigate('fit')"
  }, {
    "ctrl": true,
    "alt": false,
    "shift": false,
    "keycode": "189",
    "func": "mainSystem.navigate('zoomOut')"
  }, {
    "ctrl": true,
    "alt": false,
    "shift": false,
    "keycode": "187",
    "func": "mainSystem.navigate('zoomIn')"
  }, {
    "ctrl": false,
    "alt": false,
    "shift": false,
    "keycode": "38",
    "func": "mainSystem.navigate('up')"
  }, {
    "ctrl": false,
    "alt": false,
    "shift": false,
    "keycode": "40",
    "func": "mainSystem.navigate('down')"
  }, {
    "ctrl": false,
    "alt": false,
    "shift": false,
    "keycode": "39",
    "func": "mainSystem.navigate('right')"
  }, {
    "ctrl": false,
    "alt": false,
    "shift": false,
    "keycode": "37",
    "func": "mainSystem.navigate('left')"
  }];

  function registerANewKBS(scItem, func) {
    if (!!scItem.keycode) {
      let key = "";
      if (scItem.ctrl) key += "CTRL_";
      if (scItem.alt) key += "ALT_";
      if (scItem.shift) key += "SHIFT_";
      key += scItem.keycode;
      kbsRegistered[key] = func;
    }
  }
  menuItem.forEach((ele) => {
    ele.subMenu.forEach((ele2) => {
      registerANewKBS(ele2.kbShort, ele2.func);
    });
  });

  extraKBShortcut.forEach((ele) => {
    registerANewKBS(ele, ele.func);
  });

  document.onkeydown = function (event) {
    if ((event.srcElement.className.toLowerCase().indexOf("mxCellEditor".toLowerCase()) < 0) && (event.srcElement.tagName.toLowerCase().indexOf("input".toLowerCase()) < 0)) {
      if (!suspendShortcuts) {
        let key = "";
        if (event.ctrlKey) key += "CTRL_";
        if (event.altKey) key += "ALT_";
        if (event.shiftKey) key += "SHIFT_";
        key += event.keyCode;
        if (!!kbsRegistered[key]) {
          event.preventDefault();
          if (!event.repeat) eval(kbsRegistered[key]);
        }
      } else {
        callback(event);
      }
    }
  };
  this.suspend = function (sus = true, cb = null) {
    suspendShortcuts = sus;
    callback = cb;
  }
  //Mouse events
  mainSystem.graph.container.addEventListener("wheel", function (event) {
    if (event.ctrlKey) {
      if (event.wheelDelta > 0) {
        mainSystem.graph.zoomIn();
      } else {
        mainSystem.graph.zoomOut();
      }
      event.preventDefault();
    }
  });
  document.addEventListener('contextmenu', event => event.preventDefault());

};
kbshort = new kbshortcut(menu);