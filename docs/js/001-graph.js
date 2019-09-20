
var Graph = function (container) {
    mxGraph.call(this, container);
    this.guidesEnabled = true;
    this.backgroundColor = "#f8f8f8";
    this.setBackgroundColor = function (val) {
        if (!val) val = this.backgroundColor;
        container.style.backgroundColor = val;
    };
    //Navigate graph
    this.navigate = {
        sGraph: this,
        move: function (direction = "up", step = 10) {
            var graph = this.sGraph;
            //step = step*graph.view.scale;
            var value = graph.view.getTranslate();
            switch (direction) {
                case "up":
                    value.y += step;
                    break;
                case "down":
                    value.y -= step;
                    break;
                case "left":
                    value.x += step;
                    break;
                case "right":
                    value.x -= step;
                    break;
                case "0":
                    value.x = 0;
                    value.y = 0;
                    break;
            }
            graph.view.setTranslate(value.x, value.y);
            graph.view.refresh();
        }
    };
    //Draws grid
    var Canvas = document.createElement("canvas");
    Canvas.style.position = "absolute";
    Canvas.style.top = "0px";
    Canvas.style.left = "0px";
    //Canvas.style.zIndex = -1;//It may effect the blocks and its selection ... todo
    container.appendChild(Canvas);
    this.grid = {
        canvas: Canvas,
        sGraph: this,
        minorStroke: {
            color: "#808080",
            thickness: 0.5,
            pattern: "1, 1",
            show: true
        },
        majorStroke: {
            color: "#808080",
            thickness: 1,
            pattern: "2, 2",
            show: true
        },
        megaStroke: {
            color: "#808080",
            thickness: 2,
            pattern: "20, 5, 5, 5",
            show: false
        },
        repaintGrid: function () {
            var graph = this.sGraph;
            var s = 0;
            var gs = 0;
            var tr = new mxPoint();
            var w = 0;
            var h = 0;
            var ctx = this.canvas.getContext("2d");
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (ctx != null) {
                var bounds = graph.getGraphBounds();
                var width = Math.max(
                    bounds.x + bounds.width,
                    graph.container.clientWidth
                );
                var height = Math.max(
                    bounds.y + bounds.height,
                    graph.container.clientHeight
                );
                var sizeChanged = width != w || height != h;
                if (
                    graph.view.scale != s ||
                    graph.view.translate.x != tr.x ||
                    graph.view.translate.y != tr.y ||
                    gs != graph.gridSize ||
                    sizeChanged
                ) {
                    tr = graph.view.translate.clone();
                    s = graph.view.scale;
                    gs = graph.gridSize;
                    w = width;
                    h = height;
                    if (!sizeChanged) {
                        ctx.clearRect(0, 0, w, h);
                    } else {
                        this.canvas.setAttribute("width", w);
                        this.canvas.setAttribute("height", h);
                    }
                    var tx = tr.x * s;
                    var ty = tr.y * s;
                    var minStepping = graph.gridSize;
                    var stepping = minStepping * s;
                    /*if (stepping < minStepping) {
                        var count =
                            Math.round(Math.ceil(minStepping / stepping) / 2) * 2;
                        stepping = count * stepping;
                    }*/
                    var xs = Math.floor((0 - tx) / stepping) * stepping + tx;
                    var xe = Math.ceil(w / stepping) * stepping;
                    var ys = Math.floor((0 - ty) / stepping) * stepping + ty;
                    var ye = Math.ceil(h / stepping) * stepping;
                    xe += Math.ceil(stepping);
                    ye += Math.ceil(stepping);
                    var ixs = Math.round(xs);
                    var ixe = Math.round(xe);
                    var iys = Math.round(ys);
                    var iye = Math.round(ye);

                    if (this.minorStroke.show) {
                        ctx.strokeStyle = this.minorStroke.color;
                        ctx.beginPath();
                        ctx.lineCap = "round";
                        try {
                            ctx.setLineDash(
                                JSON.parse("[" + this.minorStroke.pattern + "]")
                            );
                        } catch (e) {}
                        ctx.lineWidth = this.minorStroke.thickness;
                        for (var x = xs; x <= xe; x += stepping) {
                            x = Math.round((x - tx) / stepping) * stepping + tx;
                            var ix = Math.round(x);
                            ctx.moveTo(ix + 0.5, iys + 0.5);
                            ctx.lineTo(ix + 0.5, iye + 0.5);
                        }
                        for (var y = ys; y <= ye; y += stepping) {
                            y = Math.round((y - ty) / stepping) * stepping + ty;
                            var iy = Math.round(y);
                            ctx.moveTo(ixs + 0.5, iy + 0.5);
                            ctx.lineTo(ixe + 0.5, iy + 0.5);
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }

                    stepping = stepping * 5;
                    if (this.majorStroke.show) {
                        ctx.strokeStyle = this.majorStroke.color;
                        xs = Math.floor((0 - tx) / stepping) * stepping + tx;
                        xe = Math.ceil(w / stepping) * stepping;
                        ys = Math.floor((0 - ty) / stepping) * stepping + ty;
                        ye = Math.ceil(h / stepping) * stepping;
                        xe += Math.ceil(stepping);
                        ye += Math.ceil(stepping);
                        ixs = Math.round(xs);
                        ixe = Math.round(xe);
                        iys = Math.round(ys);
                        iye = Math.round(ye);
                        ctx.beginPath();
                        ctx.lineCap = "round";
                        try {
                            ctx.setLineDash(
                                JSON.parse("[" + this.majorStroke.pattern + "]")
                            );
                        } catch (e) {}
                        ctx.lineWidth = this.majorStroke.thickness;
                        for (var x = xs; x <= xe; x += stepping) {
                            x = Math.round((x - tx) / stepping) * stepping + tx;
                            var ix = Math.round(x);
                            ctx.moveTo(ix + 0.5, iys + 0.5);
                            ctx.lineTo(ix + 0.5, iye + 0.5);
                        }
                        for (var y = ys; y <= ye; y += stepping) {
                            y = Math.round((y - ty) / stepping) * stepping + ty;
                            var iy = Math.round(y);
                            ctx.moveTo(ixs + 0.5, iy + 0.5);
                            ctx.lineTo(ixe + 0.5, iy + 0.5);
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }

                    stepping = stepping * 2;
                    if (this.megaStroke.show) {
                        ctx.strokeStyle = this.megaStroke.color;
                        xs = Math.floor((0 - tx) / stepping) * stepping + tx;
                        xe = Math.ceil(w / stepping) * stepping;
                        ys = Math.floor((0 - ty) / stepping) * stepping + ty;
                        ye = Math.ceil(h / stepping) * stepping;
                        xe += Math.ceil(stepping);
                        ye += Math.ceil(stepping);
                        ixs = Math.round(xs);
                        ixe = Math.round(xe);
                        iys = Math.round(ys);
                        iye = Math.round(ye);
                        ctx.beginPath();
                        ctx.lineCap = "round";
                        try {
                            ctx.setLineDash(
                                JSON.parse("[" + this.megaStroke.pattern + "]")
                            );
                        } catch (e) {}
                        ctx.lineWidth = this.megaStroke.thickness;
                        for (var x = xs; x <= xe; x += stepping) {
                            x = Math.round((x - tx) / stepping) * stepping + tx;
                            var ix = Math.round(x);
                            ctx.moveTo(ix + 0.5, iys + 0.5);
                            ctx.lineTo(ix + 0.5, iye + 0.5);
                        }
                        for (var y = ys; y <= ye; y += stepping) {
                            y = Math.round((y - ty) / stepping) * stepping + ty;
                            var iy = Math.round(y);
                            ctx.moveTo(ixs + 0.5, iy + 0.5);
                            ctx.lineTo(ixe + 0.5, iy + 0.5);
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
            }
        }
    };
};
mxUtils.extend(Graph, mxGraph);
var Outline = function (graph, container) {
    mxOutline.call(this, graph, container);
    this.visibility = true;
    this.setVisiblity = function () {
        container.style.display = (this.visibility)?"block":"none";
    }
}
mxUtils.extend(Outline, mxOutline);

var System = function (gContainer, oContainer) {
    this.graph = new Graph(gContainer);
    this.outline = new Outline (this.graph, oContainer);
    this.refresh = function () {
        this.graph.setBackgroundColor();
        this.graph.refresh();
        this.outline.setVisiblity();
        this.outline.refresh();
        //this.graph.grid.repaintGrid();
    }
    this.navigate = function (dir="up") {
        switch (dir) {
            case "up":
            case "down":
            case "left":
            case "right":
            case "0":
                this.graph.navigate.move(dir);
                break;
            case "zoomIn":
                this.graph.zoomIn();
                break;
            case "zoomOut":
                this.graph.zoomOut();
                break;
            case "zoomActual":
                this.graph.zoomActual();
                break;
            case "fit":
                this.graph.fit();
                break;
                        
        }
        this.refresh();
    }
}

var mainSystem = new System(document.getElementById("modelContainer"), document.getElementById("outlineContainer"));
mainSystem.graph.getSelectionModel().addListener(mxEvent.CHANGE, function (sender, evt) {
    selectionChanged();
});

mainSystem.outline.update = function (rv) {
    mainSystem.graph.grid.repaintGrid();
    return mxOutline.prototype.update.apply(this, arguments);
  };