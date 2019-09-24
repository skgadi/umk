function blockOnDOM(img) {
    var model = img.getAttribute("umk_model");
    var width = umkBlockSummary[model].width;
    var height = umkBlockSummary[model].height;
    var fg = umkBlockSummary[model].fg;
    var bg = umkBlockSummary[model].bg;
    var Name = umkBlockSummary[model].name;

    var dragElt = document.createElement("div");
    dragElt.style.border = "dashed " + img.getAttribute("umk_color") + " 1px";
    dragElt.style.width = width + "px";
    dragElt.style.height = height + "px";
    var addANewBlock = function (graph, evt, cell, x, y) {
        graph.getModel().beginUpdate();
        try {
            eval("var modelForVertex = new " + model + "({'Name': '"+Name+"'})");
            var IconDetails = modelForVertex.Icon();
            var inLabels = IconDetails.inLabels || [];
            var outLabels = IconDetails.outLabels || [];
            var splStyle = "";
            if (!!IconDetails.splStyle) splStyle = IconDetails.splStyle;
            console.log(modelForVertex);
            v = graph.insertVertex(graph.getDefaultParent(), null, modelForVertex, x, y, width, height, "umk_model;fillColor=" + bg + ";strokeColor=" + bg + ";" + splStyle);
            v.setConnectable(false);
            setTermianls(graph, v, "umk_input");
            setTermianls(graph, v, "umk_output");
            var EO = graph.insertVertex(v, null, "", 0.5, 0, 0, 0, "umk_EO", true);
            EO.setConnectable(false);
            var Details = graph.insertVertex(v, null, modelForVertex.Name, 0.5, 1, 0, 0, "umk_caption", true);
            Details.geometry.offset = new mxPoint(0, 0);
            Details.setConnectable(false);
            graph.setSelectionCell(v);
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

//Prepare input and output terminals
function setTermianls(graph, Cell, type = "umk_input") {
    if (!!Cell && typeof Cell === "object") {
        var IconDetails = Cell.value.Icon();
        var Labels;
        var RequiredCount;
        var position;
        if (type === "umk_input") {
            Labels = IconDetails.inLabels || [];
            RequiredCount = Cell.value.TerminalsIn.value;
            console.log(RequiredCount);
            position = {
                x: 0,
                size: {
                    width: 4,
                    height: 8
                },
                offset: {
                    x: 0,//-4,
                    y: -4
                }
            };
        } else {
            Labels = IconDetails.outLabels || [];
            RequiredCount = Cell.value.TerminalsOut.value;
            position = {
                x: 1,
                size: {
                    width: 4,
                    height: 8
                },
                offset: {
                    x: -4,
                    y: -4
                }
            };
        }
        //Adjust input terminals
        //Check count of available input terminals
        var availableCount = 0;
        var cellsToRemove = [];
        for (
            var i = 0; i < (!!Cell.children ? Cell.children.length : 0); i++
        ) {
            if (Cell.children[i].style.search(type) >= 0) {
                if (availableCount < RequiredCount) {
                    Cell.children[i].geometry.y =
                        (availableCount + 1) / (RequiredCount + 1);
                    Cell.children[i].setValue(Labels[availableCount] || "");
                } else {
                    cellsToRemove.push(Cell.children[i]);
                }
                availableCount++;
            }
        }
        graph.removeCells(cellsToRemove);
        //Add more cells if required
        for (var i = 0; i < RequiredCount - availableCount; i++) {
            var port = graph.insertVertex(
                Cell,
                null,
                Labels[i + availableCount] || "",
                position.x,
                (availableCount + i + 1) / (RequiredCount + 1),
                position.size.width,
                position.size.height,
                type +
                ";fillColor=none;strokeColor=none;",
                true
            );
            port.geometry.offset = new mxPoint(
                position.offset.x,
                position.offset.y
            );
        }
    }
}