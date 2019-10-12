mxBasePath = "libs-others/mxgraph-4.0.4/javascript/src";
var Graph = function (container) {
  mxGraph.call(this, container);
  //Pointer to this
  var GraphPointer = this;
  //General settings
  this.setAllowDanglingEdges(false);
  this.constrainChildren = false; // this won't let the the blocks inside the groups to not change size when groups are resized
  this.setConnectable(true);
  this.setPanning(true);
  this.setTooltips(true);
  this.htmlLabels = true;
  this.rubberband = new mxRubberband(this);
  this.setConnectableEdges(false);
  this.vStyle = this.getStylesheet().getDefaultVertexStyle();
  this.eStyle = this.getStylesheet().getDefaultEdgeStyle();
  this.vStyle["shadow"] = false;
  this.vStyle["whiteSpace"] = "wrap";
  this.vStyle["arcSize"] = 0;
  this.vStyle["absoluteArcSize"] = 1;
  this.vStyle["rounded"] = 1;
  this.vStyle["strokeWidth"] = 0;
  this.eStyle["edgeStyle"] = "orthogonalEdgeStyle";
  this.eStyle["strokeWidth"] = 1;
  this.eStyle["targetJettySize"] = 25;
  this.eStyle["shadow"] = false;
  //this.eStyle["endArrow"] = "none";
  this.eStyle["fontColor"] = "#000";
  this.eStyle["verticalAlign"] = "top";
  this.eStyle["overflow"] = "width";
  this.eStyle["align"] = "right";
  //Stylesheets
  var style = new Object();
  style.foldable = 0;
  style.overflow = "hidden";
  style.verticalAlign = "middle";
  style.fontColor = "#fff";
  //foldable=0;overflow=hidden;verticalAlign=middle;fontColor=#fff;
  this.getStylesheet().putCellStyle("umk_model", style);
  var style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
  style.startSize = 25;
  style.strokeWidth = 2;
  style.arcSize = 0;
  this.getStylesheet().putCellStyle("umk_group", style);
  style = new Object();
  style.constituent = 1;
  style.verticalLabelPosition = "bottom";
  style.verticalAlign = "top";
  style.fontColor = "#000";
  //constituent=1;verticalLabelPosition=bottom;verticalAlign=top;
  this.getStylesheet().putCellStyle("umk_caption", style);
  style = new Object();
  style.constituent = 1;
  style.align = "center";
  style.verticalAlign = "bottom";
  style.fontColor = "#000";
  //constituent=1;align=center;verticalAlign=bottom;fontColor=#000000;
  this.getStylesheet().putCellStyle("umk_EO", style);
  style = new Object();
  style.constituent = 1;
  style.verticalAlign = "middle";
  style.fontColor = "#fff";
  style.labelPosition = "right";
  style.labelWidth = 15;
  style.align = "left";
  style.shape = "triangle";
  style.portConstraint = "west";
  style.overflow = "fit";
  //constituent=1;verticalAlign=middle;fontColor=#ffffff;labelPosition=right;labelWidth=80;align=left;shape=triangle;portConstraint=west;
  this.getStylesheet().putCellStyle("umk_input", style);
  style = new Object();
  style.constituent = 1;
  style.verticalAlign = "middle";
  style.fontColor = "#fff";
  style.labelPosition = "left";
  style.labelWidth = 15;
  style.align = "right";
  style.shape = "triangle";
  style.portConstraint = "east";
  style.overflow = "fit";
  //constituent=1;fontColor=#ffffff;labelPosition=left;labelWidth=80;align=right;shape=triangle;portConstraint=east;
  this.getStylesheet().putCellStyle("umk_output", style);

  //Custom properties
  this.backDiv = document.createElement("div");
  this.backDiv.style.position = "absolute";
  this.backDiv.style.top = "0px";
  this.backDiv.style.left = "0px";
  this.backDiv.style.width = "100%";
  this.backDiv.style.height = "100%";
  this.backDiv.style.zIndex = -2;
  container.appendChild(this.backDiv);

  this.backgroundColor = "#f8f8f8";
  this.setBackgroundColor = function (val) {
    if (!val) val = this.backgroundColor;
    this.backDiv.style.backgroundColor = val;
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
  Canvas.style.pointerEvents = "none";
  Canvas.style.zIndex = -1; //It may effect the blocks and its selection ... todo
  container.appendChild(Canvas);
  this.grid = {
    canvas: Canvas,
    sGraph: this,
    minorStroke: {
      color: "#808080",
      thickness: 0.1,
      pattern: "",
      show: false
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
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
  //Handling labels
  this.getLabel = function (cell) {
    //console.log(cell);
    if (!!cell.value) {
      if (cell.style.search("umk_model") >= 0) {
        try {
          eval(
            "var tempModel = new " +
            cell.value.id +
            "(cell.value);"
          );
          this.setCaption(cell, tempModel.Name);
          if (cell.style.search("umk_display") >= 0) {
            return cell.value.show || "$[\\cdot]$";
          }
          return (
            "<p style='margin:0; padding: 0;'>" +
            tempModel.Icon().html +
            "</p>"
          );
        } catch (e) {
          console.log(e);
          return "ERROR";
        }
      } else return cell.value; //"$\\text{"+cell.value+"}$";
    } else return null;
  };
  this.getEditingValue = function (cell, evt) {
    if (!!cell.value) {
      if (typeof cell.value === "object") return cell.value.Name || "";
      else return cell.value;
    } else return null;
  };
  this.labelChanged = function (cell, newValue, trigger) {
    if (!!cell.value) {
      if (typeof cell.value === "object") {
        var value = mxUtils.clone(cell.value);
        value.Name = newValue;
        newValue = value;
      }
    }
    mxGraph.prototype.labelChanged.apply(this, arguments);
  };
  this.setCaption = function (Cell, value) {
    var children = Cell.children;
    if (!!children) {
      for (var i = 0; i < children.length; i++) {
        if (children[i].style.search("umk_caption") >= 0) {
          children[i].setValue(value);
          this.refresh(children[i]);
        }
      }
    }
  }
  //Lines before connecting edges
  this.view.updateFixedTerminalPoint = function (
    edge,
    terminal,
    source,
    constraint
  ) {
    mxGraphView.prototype.updateFixedTerminalPoint.apply(
      this,
      arguments
    );
    var pts = edge.absolutePoints;
    var pt = pts[source ? 0 : pts.length - 1];
    if (
      terminal != null &&
      pt == null &&
      this.getPerimeterFunction(terminal) == null
    ) {
      edge.setAbsoluteTerminalPoint(
        new mxPoint(
          this.getRoutingCenterX(terminal),
          this.getRoutingCenterY(terminal)
        ),
        source
      );
    }
  };
  this.connectionHandler.createEdgeState = function (me) {
    var edge = this.createEdge(null, null, null, null, null);
    return new mxCellState(
      this.graph.view,
      edge,
      this.graph.getCellStyle(edge)
    );
  };
  // Redirects selection to parent
  this.selectCellForEvent = function (cell) {
    if (this.isPart(cell)) {
      cell = this.model.getParent(cell);
    }

    mxGraph.prototype.selectCellForEvent.apply(this, arguments);
  };
  // Helper method to mark parts with constituent=1 in the style
  this.isPart = function (cell) {
    console.log(cell);
    var style = this.getCellStyle(cell);

    return style["constituent"] == "1";
  };

  //Connection switching source traget, when required
  this.connectionHandler.addListener(mxEvent.CONNECT, function (
    sender,
    evt
  ) {
    this.graph = GraphPointer;
    console.log(this);
    var edge = evt.getProperty("cell");
    var source = this.graph.getModel().getTerminal(edge, true);
    var target = this.graph.getModel().getTerminal(edge, false);
    if (
      source.style.search("umk_input") >= 0 &&
      target.style.search("umk_output") >= 0
    ) {
      this.graph.getModel().setTerminal(edge, source, false);
      this.graph.getModel().setTerminal(edge, target, true);
    }
  });
  //Connection validation
  this.customValidationError = true;
  this.getEdgeValidationError = function (
    edge,
    source,
    target
  ) {
    //console.log(source.edges);
    var defaultOut = mxGraph.prototype.getEdgeValidationError.apply(
      this,
      arguments
    );
    if (this.customValidationError) {
      var outError;
      try {
        if (source.parent === target.parent)
          outError = "Cannot connect to the same block.";
        if (
          source.style.search("umk_input") >= 0 &&
          target.style.search("umk_input") >= 0
        )
          outError = "Cannot connect both the inputs.";
        if (
          source.style.search("umk_output") >= 0 &&
          target.style.search("umk_output") >= 0
        )
          outError = "Cannot connect both the outputs.";
        if (
          (target.style.search("umk_input") >= 0 &&
            target.getEdgeCount() > 0) ||
          (source.style.search("umk_input") >= 0 &&
            source.getEdgeCount() > 0)
        )
          outError = "Only one input is allowed per port.";
      } catch (e) {} finally {
        return outError || defaultOut;
      }
    } else return defaultOut;
  };
  this.validationAlert = function (message) {
    notyf.error(message);
  };

  //selection of a vertix
  this.isCellSelectable = function (cell) {
    var state = this.view.getState(cell);
    var style = state != null ? state.style : this.getCellStyle(cell);

    return (
      this.isCellsSelectable() &&
      !this.isCellLocked(cell) &&
      style["selectable"] != 0
    );
  };

  //Change tooltip string
  this.getTooltipForCell = function (cell) {
    var label = this.convertValueToString(cell);
    return label;
  }
  this.convertValueToString = function (cell) {
    if (cell.style.search("umk_model") >= 0) return null;
    else return cell.value;
  }

};
mxUtils.extend(Graph, mxGraph);



var Outline = function (graph, container) {
  mxOutline.call(this, graph, container);
  this.visibility = false;
  this.setVisiblity = function () {
    container.style.display = (this.visibility) ? "block" : "none";
  }
}
mxUtils.extend(Outline, mxOutline);

var System = function (gContainer, oContainer) {
  this.graph = new Graph(gContainer);
  this.outline = new Outline(this.graph, oContainer);
  this.keyHandler = new mxKeyHandler(this.graph);

  this.undoManager = new mxUndoManager();
  var undoManager = this.undoManager;
  var umListener = function (sender, evt) {
    undoManager.undoableEditHappened(evt.getProperty("edit"));
  };
  this.graph.getModel().addListener(mxEvent.UNDO, umListener);
  this.graph.getView().addListener(mxEvent.UNDO, umListener);

  this.refresh = function () {
    this.graph.setBackgroundColor();
    this.graph.refresh();
    this.outline.setVisiblity();
    this.outline.refresh();
    //this.graph.grid.repaintGrid();
  }
  this.navigate = function (dir = "up") {
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
  updateMathJax();
  return mxOutline.prototype.update.apply(this, arguments);
};

mainSystem.outline.mouseDown = function (sender, me) {
  mainSystem.graph.container.style.backgroundColor = mainSystem.graph.backgroundColor;
  return mxOutline.prototype.mouseDown.apply(this, arguments);
};

mainSystem.outline.mouseUp = function (sender, me) {
  mainSystem.graph.container.style.backgroundColor = "";
  return mxOutline.prototype.mouseUp.apply(this, arguments);
};


function selectionChanged() {
  var editorDivs = document.getElementsByClassName("editorDivs");
  for (var i = 0; i < editorDivs.length; editorDivs++) {
    editorDivs[i].style.display = "none";
  }
  if (mainSystem.graph.getSelectionCells().length === 0)
    document.getElementById("editorForGraph").style.display = "block";
}


//Change caption
function setCaption(Cell, value) {
  var children = Cell.children;
  for (var i = 0; i < children.length; i++) {
    if (children[i].style.search("umk_caption") >= 0) {
      children[i].setValue(value);
      graph.refresh(children[i]);
    }
  }
}

mainSystem.keyHandler.bindControlKey(79, function (evt){alert()});mainSystem.keyHandler.bindControlKey(83, function (evt){alert()});mainSystem.keyHandler.bindControlKey(76, function (evt){alert()});mainSystem.keyHandler.bindControlKey(74, function (evt){alert()});mainSystem.keyHandler.bindControlShiftKey(74, function (evt){alert()});mainSystem.keyHandler.bindControlKey(80, function (evt){alert()});mainSystem.keyHandler.bindControlKey(85, function (evt){alert()});mainSystem.keyHandler.bindControlKey(69, function (evt){alert()});mainSystem.keyHandler.bindControlShiftKey(83, function (evt){alert()});mainSystem.keyHandler.bindControlShiftKey(86, function (evt){ShowModelItem('variablesManager')});mainSystem.keyHandler.bindControlKey(75, function (evt){if (mainSystem.graph.isEnabled()) createSubModel();});mainSystem.keyHandler.bindControlShiftKey(75, function (evt){if (mainSystem.graph.isEnabled()) ungroupSubModel();});mainSystem.keyHandler.bindControlKey(65, function (evt){alert()});mainSystem.keyHandler.bindControlShiftKey(65, function (evt){alert()});mainSystem.keyHandler.bindControlKey(88, function (evt){alert()});mainSystem.keyHandler.bindControlKey(67, function (evt){alert()});mainSystem.keyHandler.bindControlKey(86, function (evt){alert()});mainSystem.keyHandler.bindControlShiftKey(67, function (evt){alert()});mainSystem.keyHandler.bindKey(46, function (evt){if (mainSystem.graph.isEnabled()) mainSystem.graph.removeCells();});mainSystem.keyHandler.bindControlKey(90, function (evt){mainSystem.undoManager.undo();});mainSystem.keyHandler.bindControlShiftKey(90, function (evt){mainSystem.undoManager.redo();});mainSystem.keyHandler.bindControlKey(107, function (evt){mainSystem.graph.zoomIn();});mainSystem.keyHandler.bindControlKey(109, function (evt){mainSystem.graph.zoomOut();});mainSystem.keyHandler.bindControlKey(96, function (evt){mainSystem.graph.zoomActual();});mainSystem.keyHandler.bindControlShiftKey(96, function (evt){mainSystem.graph.fit();});mainSystem.keyHandler.bindControlKey(77, function (evt){foldItems();});mainSystem.keyHandler.bindControlShiftKey(77, function (evt){foldItems(false);});mainSystem.keyHandler.bindControlKey(82, function (evt){displayExecutionOrder()});mainSystem.keyHandler.bindControlKey(70, function (evt){alert()});mainSystem.keyHandler.bindControlKey(71, function (evt){alert()});mainSystem.keyHandler.bindControlKey(84, function (evt){alert()});mainSystem.keyHandler.bindControlKey(89, function (evt){alert()});mainSystem.keyHandler.bindControlKey(66, function (evt){alert()});mainSystem.keyHandler.bindControlKey(87, function (evt){alert()});mainSystem.keyHandler.bindControlKey(68, function (evt){alert()});mainSystem.keyHandler.bindControlKey(72, function (evt){alert()});mainSystem.keyHandler.bindKey(38, function (evt){movemainSystem.graph("up");});mainSystem.keyHandler.bindKey(40, function (evt){movemainSystem.graph("down");});mainSystem.keyHandler.bindKey(39, function (evt){movemainSystem.graph("right");});mainSystem.keyHandler.bindKey(37, function (evt){movemainSystem.graph("left");});mainSystem.keyHandler.bindControlKey(48, function (evt){mainSystem.graph.zoomActual();});mainSystem.keyHandler.bindControlShiftKey(48, function (evt){mainSystem.graph.fit();});
