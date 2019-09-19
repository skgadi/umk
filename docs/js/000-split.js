//Split related code
//not universally used
if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(function () {
        if (typeof mainSystem.graph !== "undefined") {
            mainSystem.graph.grid.repaintGrid();
        }
        if (typeof outln !== "undefined") outln.refresh();
    }).observe(modelContainer);
}

function hideSidesOnMainSplit(isLeft = true, isHide = true) {
    var presentSplit = mainSplit.getSizes();
    if (isHide) {
        if (isLeft) {
            mainSplit.setSizes([
                0,
                presentSplit[0] + presentSplit[1],
                presentSplit[2]
            ]);
        } else {
            mainSplit.setSizes([
                presentSplit[0],
                presentSplit[1] + presentSplit[2],
                0
            ]);
        }
    } else {
        mainSplit.setSizes([15, 60, 25]);
    }
}
var mainSplit = Split(["#flex-1", "#flex-2", "#flex-3"], {
    minSize: 0,
    snapOffset: 200,
    sizes: [15, 60, 25],
    gutterSize: 4,
    onDrag: function () {
        if (typeof mainSystem.graph !== "undefined") {
            mainSystem.graph.grid.repaintGrid();
        }
        if (typeof outln !== "undefined") outln.refresh();
    },
    elementStyle: function (dimension, size, gutterSize) {
        return {
            "flex-basis": "calc(" + size + "% - " + gutterSize + "px)"
        };
    },
    gutterStyle: function (dimension, gutterSize) {
        return {
            "flex-basis": gutterSize + "px"
        };
    }
});