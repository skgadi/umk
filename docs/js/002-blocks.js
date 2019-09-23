function blockOnDOM(img) {
    var model = img.getAttribute("umk_model");
    var width = umkBlockSummary[model].width;
    var height = umkBlockSummary[model].height;

    var dragElt = document.createElement("div");
    dragElt.style.border = "dashed " + img.getAttribute("umk_color") + " 1px";
    dragElt.style.width = width + "px";
    dragElt.style.height = height + "px";
    var addANewBlock = function (graph, evt, cell, x, y) {
        graph.getModel().beginUpdate();
        try {
            eval("var modelForVertex = new " + model + "({})");
            console.log(modelForVertex);
            v = graph.insertVertex(graph.getDefaultParent(), null, modelForVertex, x, y, width, height, "umk_model;");
        } catch (e) {
            notyf.error("Block error: Unable to place this block. Contact the support.")
            console.log(e);
        }
        graph.getModel().endUpdate();
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
    this.ds.setGuidesEnabled(mainSystem.graph.graphHandler.guidesEnabled);
}