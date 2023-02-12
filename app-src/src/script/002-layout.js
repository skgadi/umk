(() => {
    const minHeight = 200;
    const minWidth = 400;
    const panes = ['left', 'right'];
    let tooSmallHeight = 0;
    let tooSmallWidth = 0;

    resizePanesAutomatically(window.innerWidth, window.innerHeight);


    function setPaneVisible(pane = "left", visible = true) {
        let val = !!visible ? 1 : 0;
        document.documentElement.style.setProperty('--' + pane + '-bar-size', val);
        setTimeout(() => {
            try {
                mainSystem.refresh();
            } catch (e) {}
        }, 250);
    }

    function setAllPanesVisibility(visibility = [true, true]) {
        visibility.forEach((ele, idx) => {
            setPaneVisible(panes[idx], ele);
        });
    }

    function resizePanesAutomatically(presWidth, presHeight) {
        let pVisibility = [];
        if (presHeight < minHeight) {
            if (!tooSmallHeight) tooSmallHeight = suspendUserInterface.addOrder(GUIText[settings.lang].errorShortHeight)
        } else {
            if (!!tooSmallHeight) {
                suspendUserInterface.removeOrder(tooSmallHeight);
                tooSmallHeight = 0;
            }
        }
        if (presWidth < minWidth) {
            if (!tooSmallWidth) tooSmallWidth = suspendUserInterface.addOrder(GUIText[settings.lang].errorShortWidth)
        } else {
            if (!!tooSmallWidth) {
                suspendUserInterface.removeOrder(tooSmallWidth);
                tooSmallWidth = 0;
            }
        }
        if (presWidth < 640) {
            pVisibility = [false, false];
        } else if (presWidth >= 640 && presWidth < 960) {
            pVisibility = [true, false];
        } else if (presWidth >= 960) {
            pVisibility = [true, true];
        }
        setAllPanesVisibility(pVisibility);
        //console.log(presWidth);
    }
    windResizeCallbacks.push((event) => {
        resizePanesAutomatically(event.currentTarget.innerWidth, event.currentTarget.innerHeight);
    });
    document.getElementById('btn-blocks').addEventListener('click', (event) => {
        setPaneVisible('left', true);
        if (window.innerWidth < 940)
            setPaneVisible('right', false);

    });
    document.getElementById('btn-edit').addEventListener('click', (event) => {
        setPaneVisible('right', true);
        if (window.innerWidth < 940)
            setPaneVisible('left', false);
    });
    document.getElementById('hide-button-left').addEventListener('click', (event) => {
        setPaneVisible('left', false);
    });
    document.getElementById('hide-button-right').addEventListener('click', (event) => {
        setPaneVisible('right', false);
    });

})();