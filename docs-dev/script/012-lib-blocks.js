function blockOnDOM(img) {
    let model = img.getAttribute("umk_model");
    let width = bSummary.blocks[model].width;
    let height = bSummary.blocks[model].height;
    let fg = bSummary.blocks[model].fg;
    let bg = bSummary.blocks[model].bg;
    let Name = bSummary.blocks[model].name[settings.lang];

    let dragElt = document.createElement("div");
    dragElt.style.border = "dashed var(--text-link) 1px";
    dragElt.style.width = width + "px";
    dragElt.style.height = height + "px";
    let addANewBlock = function (graph, evt, cell, x, y) {
        graph.getModel().beginUpdate();
        try {
            eval("var modelForVertex = new " + model + "({'Name': '" + Name + "'})");
            let IconDetails = modelForVertex.Icon();
            let inLabels = IconDetails.inLabels || [];
            let outLabels = IconDetails.outLabels || [];
            let splStyle = "";
            if (!!IconDetails.splStyle) splStyle = IconDetails.splStyle;
            v = graph.insertVertex(graph.getDefaultParent(), null, modelForVertex, x, y, width, height, "umk_model;" + splStyle);
            v.setConnectable(false);
            setTermianls(graph, v, "umk_input");
            setTermianls(graph, v, "umk_output");
            let EO = graph.insertVertex(v, null, "", 0.5, 0, 0, 0, "umk_EO_0", true);
            EO.setConnectable(false);
            let Details = graph.insertVertex(v, null, modelForVertex.Name, 0.5, 1, 0, 0, "umk_caption_0", true);
            Details.geometry.offset = new mxPoint(0, 0);
            Details.setConnectable(false);
            graph.setSelectionCell(v);
        } catch (e) {
            new Noty({
                text: GUIText[settings.lang].errUblPlcBlock,
                timeout: 5000,
                theme: "nest",
                type: 'error'
            }).show();
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
    //console.log(Cell);
    if (!!Cell && typeof Cell === "object") {
        IconDetails = Cell.value.Icon();
        //console.log(IconDetails);
        let Labels;
        let RequiredCount;
        let position;
        if (type === "umk_input") {
            Labels = IconDetails.inLabels || [];
            RequiredCount = Cell.value.TerminalsIn.value;
            //console.log(RequiredCount);
            position = {
                x: 0,
                size: {
                    width: 4,
                    height: 8
                },
                offset: {
                    x: -4,
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
        let availableCount = 0;
        let cellsToRemove = [];
        for (
            let i = 0; i < (!!Cell.children ? Cell.children.length : 0); i++
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
        for (let i = 0; i < RequiredCount - availableCount; i++) {
            let port = graph.insertVertex(
                Cell,
                null,
                Labels[i + availableCount] || "",
                position.x,
                (availableCount + i + 1) / (RequiredCount + 1),
                position.size.width,
                position.size.height,
                type,
                true
            );
            port.geometry.offset = new mxPoint(
                position.offset.x,
                position.offset.y
            );
        }
    }
}