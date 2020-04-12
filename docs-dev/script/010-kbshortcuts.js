const kbshortcut = function (menuItem) {
    let suspendShortcuts = true;
    let callback = null;
    const kbsRegistered = {};
    const extraKBShortcut = [{
        "ctrl": true,
        "alt": false,
        "shift": false,
        "keycode": "96",
        "func": "alert()"
    }, {
        "ctrl": true,
        "alt": false,
        "shift": true,
        "keycode": "96",
        "func": "alert()"
    }, {
        "ctrl": true,
        "alt": false,
        "shift": false,
        "keycode": "189",
        "func": "alert()"
    }, {
        "ctrl": true,
        "alt": false,
        "shift": false,
        "keycode": "187",
        "func": "alert()"
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
        if (!suspendShortcuts) {
            if ((event.srcElement.className.toLowerCase().indexOf("mxCellEditor".toLowerCase()) < 0) && (event.srcElement.tagName.toLowerCase().indexOf("input".toLowerCase()) < 0)) {
                let key = "";
                if (event.ctrlKey) key += "CTRL_";
                if (event.altKey) key += "ALT_";
                if (event.shiftKey) key += "SHIFT_";
                key += event.keyCode;
                if (!!kbsRegistered[key]) {
                    event.preventDefault();
                    if (!event.repeat) eval(kbsRegistered[key]);
                }
            }
        } else {
            callback(event);
        }
    };
    this.suspend = function (sus = true, cb = null) {
        suspendShortcuts = sus;
        callback = cb;
    }
};
kbshort = new kbshortcut(menu);