(() => {
    const minHeight = 360;
    const minWidth = 400;
    const panes = ['left', 'right'];

    function setPaneVisible(pane = "left", visible = true) {
        let val = !!visible ? 1 : 0;
        document.documentElement.style.setProperty('--' + pane + '-bar-size', val);
    }

    function setAllPanesVisibility(visibility = [true, true]) {
        visibility.forEach((ele, idx) => {
            setPaneVisible(panes[idx], ele);
        });
    }

    function resizePanesAutomatically(presWidth, presHeight) {
        let pVisibility = [];
        if (presHeight < minHeight) {
            //holdToFinishAProcess("tooSmallHeight");
            return;
        }
        if (presWidth < minWidth) {
            //holdToFinishAProcess("tooSmallWidth");
            return;
        }
        if (presWidth < 640) {
            pVisibility = [false, false];
        } else if (presWidth >= 640 && presWidth < 960) {
            pVisibility = [true, false];
        } else if (presWidth >= 960) {
            pVisibility = [true, true];
        }
        setAllPanesVisibility(pVisibility);
        console.log(presWidth);
    }
    windResizeCallbacks.push((event) => {
        resizePanesAutomatically(event.currentTarget.innerWidth, event.currentTarget.innerHeight);
    });
    document.getElementById('btn-blocks').addEventListener('click', (event) => {
        setPaneVisible('left', true);
    });
    document.getElementById('btn-edit').addEventListener('click', (event) => {
        setPaneVisible('right', true);
    });
    document.getElementById('hide-button-left').addEventListener('click', (event) => {
        setPaneVisible('left', false);
    });
    document.getElementById('hide-button-right').addEventListener('click', (event) => {
        setPaneVisible('right', false);
    });

})();