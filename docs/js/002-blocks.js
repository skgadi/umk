var splDraggable = function (element, graphF, funct, dragElement, dx, dy, autoscroll, scalePreview, highlightDropTargets, getDropTarget) {
    
}


function blockOnDOM(img) {
    var model = img.getAttribute("umk_model");
    console.log(model);
    var dragElt = document.createElement("div");
    dragElt.style.border = "dashed " + img.getAttribute("umk_color") + " 1px";
    dragElt.style.width = img.getAttribute("umk_width") + "px";
    dragElt.style.height = img.getAttribute("umk_height") + "px";
    var addANewBlock = function (graph, evt, cell, x, y) {
        this.model = model;
        console.log(this.model);
        var newPt = {
            x: x,
            y: y
        };
        if (cell) {
            var pt = cell.getGeometry().getPoint();
            newPt.x -= pt.x;
            newPt.y -= pt.y;
        }
        v = graph.insertVertex(graph.getDefaultParent(), null, 'H', x, y, 50, 50);
    }
    this.ds = mxUtils.makeDraggable(
        img,
        mainSystem.graph,
        addANewBlock,
        dragElt,
        0,
        0,
        true,
        true
    );
    this.ds.setGuidesEnabled(mainSystem.graph.guidesEnabled);
}
