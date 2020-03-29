const kbshortcut = function (menuItem) {
    const kbsRegistered = {};
    const extraKBShortcut =[{"ctrl":true,"alt":false,"shift":false,"keycode":"96","func":"alert()"},{"ctrl":true,"alt":false,"shift":true,"keycode":"96","func":"alert()"},{"ctrl":true,"alt":false,"shift":false,"keycode":"189","func":"alert()"},{"ctrl":true,"alt":false,"shift":false,"keycode":"187","func":"alert()"}];
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

    document.onkeydown = (event => {
        let key = "";
        if (event.ctrlKey) key += "CTRL_";
        if (event.altKey) key += "ALT_";
        if (event.shiftKey) key += "SHIFT_";
        key += event.keyCode;
        if (!!kbsRegistered[key]) {
            if (!event.repeat) eval(kbsRegistered[key]);
            event.preventDefault();
        }
        //console.log(event);
    });
};
kbshort = new kbshortcut(menu);