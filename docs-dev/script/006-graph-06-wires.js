((graph, container) => {


  /*
  //Maximum size
  graph.maximumGraphBounds = new mxRectangle(0, 0, 800, 600)
  graph.border = 50;*/

  // Panning handler consumed right click so this must be
  // disabled if right click should stop connection handler.
  graph.panningHandler.isPopupTrigger = function () {
    return false;
  };

  // Enables return key to stop editing (use shift-enter for newlines)
  graph.setEnterStopsCellEditing(true);


  // Alternative solution for implementing connection points without child cells.
  // This can be extended as shown in portrefs.html example to allow for per-port
  // incoming/outgoing direction.
  graph.getAllConnectionConstraints = function (terminal) {
    var geo = (terminal != null) ? this.getCellGeometry(terminal.cell) : null;

    if ((geo != null ? !geo.relative : false) &&
      this.getModel().isVertex(terminal.cell) &&
      this.getModel().getChildCount(terminal.cell) == 0) {
      return [new mxConnectionConstraint(new mxPoint(0, 0.5), false),
        new mxConnectionConstraint(new mxPoint(1, 0.5), false)
      ];
    }

    return null;
  };

  // Makes sure non-relative cells can only be connected via constraints
  graph.connectionHandler.isConnectableCell = function (cell) {
    if (this.graph.getModel().isEdge(cell)) {
      return true;
    } else {
      var geo = (cell != null) ? this.graph.getCellGeometry(cell) : null;

      return (geo != null) ? geo.relative : false;
    }
  };
  mxEdgeHandler.prototype.isConnectableCell = function (cell) {
    return graph.connectionHandler.isConnectableCell(cell);
  };

  // Adds a special tooltip for edges
  graph.setTooltips(true);


  //Change tooltip string
  graph.getTooltipForCell = function (cell) {
    let label = this.convertValueToString(cell);
    return label;
  }
  graph.convertValueToString = function (cell) {
    if (!!cell.style && cell.style.search("umk_model") >= 0) {
      if (!!cell.value.Name) {
        return cell.value.Name;
      } else {
        return null;
      }
    } else if (!!cell.style && cell.style.search("umk_output") >= 0) {
      if (!!cell.value) {
        return cell.value;
      } else {
        const siblings = cell.parent.children;
        let count = 0;
        for (let i = 0; i < siblings.length; i++) {
          if (siblings[i].style.search("umk_output") >= 0) {
            count++;
            if (cell === siblings[i]) {
              break;
            }
          }
        }
        return count;
      }
    } else if (!!cell.style && cell.style.search("umk_input") >= 0) {
      if (!!cell.value) {
        return cell.value;
      } else {
        const siblings = cell.parent.children;
        let count = 0;
        for (let i = 0; i < siblings.length; i++) {
          if (siblings[i].style.search("umk_input") >= 0) {
            count++;
            if (cell === siblings[i]) {
              break;
            }
          }
        }
        return count;
      }
    } else if (!!cell.style && (cell.style.search("umk_EO") >= 0 || cell.style.search("umk_caption") >= 0)) {
      return "";
    } else {
      if (!!cell.value) {
        return cell.value
      } else {
        return "";
      }
    };
  }
  var getTooltipForCell = graph.getTooltipForCell;
  graph.getTooltipForCell = function (cell) {
    var tip = '';

    if (cell != null) {
      var src = this.getModel().getTerminal(cell, true);

      if (src != null) {
        tip += "[" + this.getTooltipForCell(src) + ']&#9477;';
      }

      var parent = this.getModel().getParent(cell);

      if (this.getModel().isVertex(parent) && parent.style.search("umk_model") >= 0) {
        tip += this.getTooltipForCell(parent);
        if (!(cell.style.search("umk_EO") >= 0 || cell.style.search("umk_caption") >= 0)) {
          tip += '.';
        }
      }

      const thisTip = getTooltipForCell.apply(this, arguments);
      tip += thisTip;

      var trg = this.getModel().getTerminal(cell, false);

      if (trg != null) {
        tip += (thisTip === "") ? "" : "&#9477;";
        tip += '[' + this.getTooltipForCell(trg) + "]";
      }
    }

    return tip;
  };

  // Switch for black background and bright styles
  var invert = false;

  if (invert) {
    container.style.backgroundColor = 'black';

    // White in-place editor text color
    mxCellEditorStartEditing = mxCellEditor.prototype.startEditing;
    mxCellEditor.prototype.startEditing = function (cell, trigger) {
      mxCellEditorStartEditing.apply(this, arguments);

      if (this.textarea != null) {
        this.textarea.style.color = '#FFFFFF';
      }
    };

    mxGraphHandler.prototype.previewColor = 'white';
  }



  //wiremode
  graph.wMode = false;

  // Starts connections on the background in wire-mode

  var connectionHandlerIsStartEvent = graph.connectionHandler.isStartEvent;
  graph.connectionHandler.isStartEvent = function (me) {
    return graph.wMode || connectionHandlerIsStartEvent.apply(this, arguments);
  };

  // Avoids any connections for gestures within tolerance except when in wire-mode
  // or when over a port
  var connectionHandlerMouseUp = graph.connectionHandler.mouseUp;
  graph.connectionHandler.mouseUp = function (sender, me) {
    if (this.first != null && this.previous != null) {
      var point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
      var dx = Math.abs(point.x - this.first.x);
      var dy = Math.abs(point.y - this.first.y);

      if (dx < this.graph.tolerance && dy < this.graph.tolerance) {
        // Selects edges in non-wire mode for single clicks, but starts
        // connecting for non-edges regardless of wire-mode
        if (!graph.wMode && this.graph.getModel().isEdge(this.previous.cell)) {
          this.reset();
        }

        return;
      }
    }

    connectionHandlerMouseUp.apply(this, arguments);
  };










  /*
    //Connection switching source traget, when required

    graph.connectionHandler.addListener(mxEvent.CONNECT, function (
      sender,
      evt
    ) {
      //this.graph = graph;
      //console.log(this);
      let edge = evt.getProperty("cell");
      let source = graph.getModel().getTerminal(edge, true);
      let target = graph.getModel().getTerminal(edge, false);
      if ((!!source && !!source.style && source.style.search("umk_input") >= 0) ||
        (!!target && !!target.style && target.style.search("umk_output") >= 0)
      ) {
        graph.getModel().setTerminal(edge, source, false);
        graph.getModel().setTerminal(edge, target, true);
      }
    });
  */


  //Connection validation
  graph.customValidationError = true;
  graph.getEdgeValidationError = function (edge, source, target) {
    //console.log("hey");
    //console.log(source.edges);
    let defaultOut = mxGraph.prototype.getEdgeValidationError.apply(this, arguments);
    if (this.customValidationError) {
      //console.log("hello");
      let outError;
      try {
        //console.log(edge);
        /*
        if (source.parent === target.parent) {
          outError = GUIText[settings.lang].errSameBlkConn;
        }
        if (!!source.style && !!target.style &&
          source.style.search("umk_input") >= 0 &&
          target.style.search("umk_input") >= 0
        ) {
          outError = GUIText[settings.lang].errInpInpConn;
        }
        if (!!source.style && !!target.style &&
          source.style.search("umk_output") >= 0 &&
          target.style.search("umk_output") >= 0
          ) {
          outError = GUIText[settings.lang].errOutOutConn;
        }
        if (!!source.style && !!target.style && (
          (target.style.search("umk_input") >= 0 &&
          target.getEdgeCount() > 0) ||
          (source.style.search("umk_input") >= 0 &&
          source.getEdgeCount() > 0))) {
          outError = GUIText[settings.lang].errOnlyOneInp;
        }
        */
        //console.log(isSourceAlreadyAvail(source));
        //console.log(isSourceAlreadyAvail(target));
        if (graph.areAllFromSameNode([source, target], [edge])) {
          outError = GUIText[settings.lang].errSameBlkConn;
        } else if (graph.doesContainMultipleSources([source, target], [edge])) {
          outError = GUIText[settings.lang].errInpInpConn;
        } else if (graph.doesContainMultipleTags([source, target], [edge])) {
          outError = GUIText[settings.lang].errMulTags;
        }

        /*
        function isSourceAlreadyAvail(inCell) {
          if (inCell.isEdge()) {
            if (inCell.source.isEdge()) {
              if (isSourceAlreadyAvail(inCell.source)) {
                return true;
              };
            } else {
              if (!!inCell.source && !!inCell.source.style && inCell.source.style.search("umk_output") >= 0) {
                return true;
              }
            }
            if (inCell.target.isEdge()) {
              if (isSourceAlreadyAvail(inCell.target)) {
                return true;
              };
            } else {
              if (!!inCell.target && !!inCell.target.style && inCell.target.style.search("umk_output") >= 0) {
                return true;
              }
            }
            return false;
          } else {
            if (!!inCell && !!inCell.style && inCell.style.search("umk_output") >= 0) {
              return true;
            } else {
              return false;
            }
          }
        }
        */

        //console.log(defaultOut);
      } catch (e) {
        console.log(e);
      } finally {
        return outError || defaultOut;
      }
    } else return defaultOut;
  };







})(mainSystem.graph, document.getElementById("modelContainer"));