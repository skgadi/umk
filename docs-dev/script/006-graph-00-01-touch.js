(function () {
  // Enables rotation handle
  mxVertexHandler.prototype.rotationEnabled = false;
  // Enables managing of sizers
  mxVertexHandler.prototype.manageSizers = true;
  // Enables live preview
  mxVertexHandler.prototype.livePreview = true;

  // Sets constants for touch style
  mxConstants.HANDLE_SIZE = 16;
  mxConstants.LABEL_HANDLE_SIZE = 7;

  // Larger tolerance and grid for real touch devices
  if (mxClient.IS_TOUCH || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
    mxShape.prototype.svgStrokeTolerance = 18;
    mxVertexHandler.prototype.tolerance = 12;
    mxEdgeHandler.prototype.tolerance = 12;
    mxGraph.prototype.tolerance = 12;
  }

  // One finger pans (no rubberband selection) must start regardless of mouse button
  mxPanningHandler.prototype.isPanningTrigger = function (me) {
    var evt = me.getEvent();

    return (me.getState() == null && !mxEvent.isMouseEvent(evt)) ||
      (mxEvent.isPopupTrigger(evt) && (me.getState() == null ||
        mxEvent.isControlDown(evt) || mxEvent.isShiftDown(evt)));
  };

  // Don't clear selection if multiple cells selected
  var graphHandlerMouseDown = mxGraphHandler.prototype.mouseDown;
  mxGraphHandler.prototype.mouseDown = function (sender, me) {
    graphHandlerMouseDown.apply(this, arguments);

    if (this.graph.isCellSelected(me.getCell()) && this.graph.getSelectionCount() > 1) {
      this.delayedSelection = false;
    }
  };

  // On connect the target is selected and we clone the cell of the preview edge for insert
  mxConnectionHandler.prototype.selectCells = function (edge, target) {
    if (target != null) {
      this.graph.setSelectionCell(target);
    } else {
      this.graph.setSelectionCell(edge);
    }
  };

  // Overrides double click handling to use the tolerance
  var graphDblClick = mxGraph.prototype.dblClick;
  mxGraph.prototype.dblClick = function (evt, cell) {
    if (cell == null) {
      var pt = mxUtils.convertPoint(this.container,
        mxEvent.getClientX(evt), mxEvent.getClientY(evt));
      cell = this.getCellAt(pt.x, pt.y);
    }

    graphDblClick.call(this, evt, cell);
  };

  // Rounded edge and vertex handles
  var touchHandle = new mxImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAACXBIWXMAAAsTAAALEwEAmpwYAAABLUlEQVQ4y61US4rCQBBNeojiRrLSnbMOWWU3V1FPouARcgc9hyLOCSSbYZw5gRCIkM9KbevJaycS4zCOBY+iq6pf1y+xrNtiE6oEY/tVzMUXgSNoCJrUDu3qHpldutwSuIKOoEvt0m7I7DoCvNj2fb8XRdEojuN5lmVraJxhh59xFSLFF9phGL7lef6hRb63R73aHM8aAjv8JHJ47yqLlud5r0VRbHa51sPZQVuT/QU4ww4/4ljaJRubrC5SxouD6TWBQV/sEIkbs0eOIVGssSO1L5D6LQID+BHHZjdMSYpj7KZpun7/uk8CP5rNqTXLJP/OpNyTMWruP9CTP08nCILKdCp7gkCzJ8vPnz2BvW5PKhuLjJBykiQLaWIEjTP3o3Zjn/LtPO0rfvh/cgKu7z6wtPPltQAAAABJRU5ErkJggg==", 17, 17);
  mxVertexHandler.prototype.handleImage = touchHandle;
  mxEdgeHandler.prototype.handleImage = touchHandle;
  mxOutline.prototype.sizerImage = touchHandle;

  // Pre-fetches touch handle
  new Image().src = touchHandle.src;

  // Adds connect icon to selected vertex
  var connectorSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABLZJREFUeNqcVl1MHFUUPrPMsn8s7UItthFa/ImNRB7aIC0aWyQhpqZWTBMNkQc3PvjiQ4MR05honyQmpjE8mmw01EqMwQcIopYAdUNR0CYYsk37oMIGuru1rEt2Z3Zm7lzPnbl3dlgXqE5ysnfPved85++ecyW4v0/aaZPit6OwJO2oQOLkcf16XKBMuVlGFUG3AxK8Kk5eJLm/v39vNBo9UVtb20gIUTc2NpJDQ0MLsVhsE/d1JAOJcNoCyIAqgTCrq5GCSHVra2vvFQqFON3my+fzs8lk8jyejXAZr/CcYVWKqhskPDExcRyVXBcKVYPSpb8pnUqZNH7XpIkcpRopAaIx06Ojo0dRtobrcMDKk8w2ZCTf1NTUsc7Ozgl0ObCuAHyxSuD7eyYopmRLUFuyFiVO7/PAqw95oN6HMSMkPTs7e66rq+sGniiycDIj3DmSeD58k5OTrd3d3TO4Wf1j2oSLt3RQTVuz2yoMisPZI0tw8XEZjtV7GFhubGzsuZ6engRuaTxnVHJ5w2IbUhTlB7/ff3R6ncCFhMbNt21xwiAJ21gO7KWMzI+e8EJHgwwYxmuhUOgl3ClwMOouXW8qlXqbgfy5acIHSwUwNQOJcDKA6sSiEs+0/xcJaKoB7y+pkFFMCAaDz2KBRHkqqoQnjkdYul3sTyyhQL5ogIHKjSInzaafng9bZGg6JwOIbtM9RYfLN1VLYSQS6eFRsu6jAzQ8PNyE3jyVK5owvlqwFTDluuGsGYmPuHhu+ur3PCgGZV49PTAwEBHOOEAdHR0n2GIppYGKlglPSJEDqvZ/8elq6YybNhUDbv+lWWf6+vraBIYsXKupqTnEGGs5DRUTdrWtG81yfTPa+K9Lt/zaQWd9JLbqrhm4kzOgtcEH4XC4SVwhWRw2TdMyQ0YBDa21SouVlCTt2nE17qm4Yh6OilVKxBmZ71Es6xRj1PmlLSFim02Xbjnmrpx/zFo1XbpdKn1hFD+zL2BnJJvNJsUh4ZE5Pz8/19zcDK0HsV1h6HQmSLcfFHpRdzqEsIjh7ZE9cKQhYLFGRkYWRVcXxWD29vauoFcLdaEqONMYwEpDMCwCh4o2lYC28tmahfDlh4Pg90qAuuKDg4MbAsjxiMliE70WCATa3jq1H75ObGBvo+7hZrWc2gu/Wl5QUSxO05QgjK3ozZP7Rdi+46ODlrcg1nFDqqpO+3y+J6/E78Ab36zwyiv1OgolxaLfCXO+fOUwnG17gLWgeWxBLyArz2eV6XHlnKGry8vL7zJG7zMPwqdnG8FDsGtjGBVsNQWd/ZoWWWvkFzBkfkLg8rlDFghTuri4+A7v3kQUQ8UxgYVxsr29fYwxf/sjBx+PrcDniayrgG1RP3r7eute6H/xMDxyIGhxZ2ZmunDELHAgXYyJ8sFnjQo2+NCq0xjGhBhsa3dV+u1Cmn52dZVemU7SqzcyNJ0tOoMPk/9LPB4/xWS5ji2Dr9KUrRL5QqrPZDKfYMwXtxvlCPBzOp3+kJ3lMtWVRrm0y+tH5h3YOz4+/mhLS8txrMoDKKwh+Prc3Nx17GcrPOE6z4nJ3yb0/zy3PNxTaZfnFv0vz62dHo/l5+n9PCIZ0D8CDACEWhv+nM/wTwAAAABJRU5ErkJggg==";

  var vertexHandlerInit = mxVertexHandler.prototype.init;
  mxVertexHandler.prototype.init = function () {
    // TODO: Use 4 sizers, move outside of shape
    //this.singleSizer = true//this.state.width < 50 || this.state.height < 50;
    vertexHandlerInit.apply(this, arguments);

    // Only show connector image on one cell and do not show on containers
    if (this.graph.connectionHandler.isEnabled() &&
      this.graph.getSelectionCount() == 1 &&
      !!this.graph.getSelectionCell().style &&
      this.graph.getSelectionCell().style.search("umk_model") >= 0) {
      //this.graph.isCellConnectable(this.state.cell) && // --> This is part of the conditions
      //console.log("hey");
      let portCells = [];
      let children = mainSystem.graph.getSelectionCell().children;
      for (let i = 0; i < children.length; i++) {
        if (!!children[i].style && ((children[i].style.search("umk_input") >= 0) || (children[i].style.search("umk_output") >= 0))) {
          portCells.push(children[i]);
        }
      }
      this.genImg = function (graph, state) {
        let connectorImg = mxUtils.createImage(connectorSrc);
        connectorImg.style.cursor = 'pointer';
        connectorImg.style.width = '15px';
        connectorImg.style.height = '15px';
        connectorImg.style.position = 'absolute';
        if (!mxClient.IS_TOUCH) {
          //connectorImg.setAttribute('title', mxResources.get('connect'));
          mxEvent.redirectMouseEvents(connectorImg, graph, state);
        }
        //console.log(this);

        // Starts connecting on touch/mouse down
        mxEvent.addGestureListeners(connectorImg, function (evt) {
          //console.log(state);
          graph.popupMenuHandler.hideMenu();
          graph.stopEditing(false);

          var pt = mxUtils.convertPoint(graph.container,
            mxEvent.getClientX(evt), mxEvent.getClientY(evt));
          graph.connectionHandler.start(state, pt.x, pt.y);
          graph.isMouseDown = true;
          graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
          mxEvent.consume(evt);
        });

        graph.container.appendChild(connectorImg);


        return connectorImg;
      }

      this.ports = [];
      for (let i = 0; i < portCells.length; i++) {
        let portState = this.graph.getView().getState(portCells[i]);
        //console.log(portState);
        this.ports.push({
          s: portState,
          i: this.genImg(this.graph, portState)
        });
      }
    }
    //console.log(this.ports);
    setTimeout(function (that) {

      that.redrawHandles();
    }, 4, this);
  };

  var vertexHandlerHideSizers = mxVertexHandler.prototype.hideSizers;
  mxVertexHandler.prototype.hideSizers = function () {
    vertexHandlerHideSizers.apply(this, arguments);
    if (!!this.ports) {
      for (let i = 0; i < this.ports.length; i++) {
        if (this.ports[i].i != null) {
          this.ports[i].i.style.visibility = 'hidden';
        }
      }
    }
  };

  var vertexHandlerReset = mxVertexHandler.prototype.reset;
  mxVertexHandler.prototype.reset = function () {
    vertexHandlerReset.apply(this, arguments);
    if (!!this.ports) {
      for (let i = 0; i < this.ports.length; i++) {
        if (this.ports[i].i != null) {
          this.ports[i].i.style.visibility = '';
        }
      }
    }
  };

  var vertexHandlerRedrawHandles = mxVertexHandler.prototype.redrawHandles;
  mxVertexHandler.prototype.redrawHandles = function () {
    vertexHandlerRedrawHandles.apply(this);
    //console.log(this.ports);
    if (!!this.ports) {
      for (let i = 0; i < this.ports.length; i++) {

        if (this.ports[i].s != null && this.ports[i].i != null) {
          var pt = new mxPoint();
          var s = this.ports[i].s;

          // Top right for single-sizer
          if (mxVertexHandler.prototype.singleSizer) {
            pt.x = s.x - s.width - this.ports[i].i.offsetWidth / 2;
            pt.y = s.y - this.ports[i].i.offsetHeight / 2;
          } else {
            pt.x = s.x + ((!!this.ports[i].s.cell && !!this.ports[i].s.cell.style && this.ports[i].s.cell.style.search("umk_input") >= 0) ? -24 : (s.width + 24)); // + mxConstants.HANDLE_SIZE / 2 + 4 + this.ports[i].i.offsetWidth / 2;
            pt.y = s.y + s.height / 2;
          }
          //console.log(s);

          var alpha = mxUtils.toRadians(mxUtils.getValue(s.style, mxConstants.STYLE_ROTATION, 0));

          if (alpha != 0) {
            var cos = Math.cos(alpha);
            var sin = Math.sin(alpha);

            var ct = new mxPoint(s.getCenterX(), s.getCenterY());
            pt = mxUtils.getRotatedPoint(pt, cos, sin, ct);
          }

          this.ports[i].i.style.left = (pt.x - this.ports[i].i.offsetWidth / 2) + 'px';
          this.ports[i].i.style.top = (pt.y - this.ports[i].i.offsetHeight / 2) + 'px';
        }

      }
    }


  };

  var vertexHandlerDestroy = mxVertexHandler.prototype.destroy;
  mxVertexHandler.prototype.destroy = function (sender, me) {
    vertexHandlerDestroy.apply(this, arguments);
    if (!!this.ports) {
      for (let i = 0; i < this.ports.length; i++) {
        this.ports[i].i.parentNode.removeChild(this.ports[i].i);
        this.ports[i].i = null;
      }
      this.ports = [];
    }
  };

  // Pre-fetches touch connector
  new Image().src = connectorSrc;
})();