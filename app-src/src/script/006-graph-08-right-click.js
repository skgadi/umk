/*

((graph) => {
  // Panning handler consumed right click so this must be
  // disabled if right click should stop connection handler.
  graph.panningHandler.isPopupTrigger = function () {
    return false;
  };


  const container = graph.container;

  // To detect if touch events are actually supported, the following condition is recommended:
  // mxClient.IS_TOUCH || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0

  // Disables built-in text selection and context menu while not editing text
  var textEditing = mxUtils.bind(this, function (evt) {
    return graph.isEditing();
  });

  container.onselectstart = textEditing;
  container.onmousedown = textEditing;

  if (mxClient.IS_IE && (typeof (document.documentMode) === 'undefined' || document.documentMode < 9)) {
    mxEvent.addListener(container, 'contextmenu', textEditing);
  } else {
    container.oncontextmenu = textEditing;
  }


  graph.centerZoom = false;


  graph.popupMenuHandler.autoExpand = true;

  graph.popupMenuHandler.isSelectOnPopup = function (me) {
    return mxEvent.isMouseEvent(me.getEvent());
  };



  // Installs context menu
  graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
    menu.addItem('Item 1', null, function () {
      alert('Item 1');
    });

    menu.addSeparator();

    var submenu1 = menu.addItem('Submenu 1', null, null);

    menu.addItem('Subitem 1', null, function () {
      alert('Subitem 1');
    }, submenu1);
    menu.addItem('Subitem 1', null, function () {
      alert('Subitem 2');
    }, submenu1);
  };




  // Context menu trigger implementation depending on current selection state
  // combined with support for normal popup trigger.
  var cellSelected = false;
  var selectionEmpty = false;
  var menuShowing = false;

  graph.fireMouseEvent = function (evtName, me, sender) {
    //console.log("gerg");
    if (evtName == mxEvent.MOUSE_DOWN) {
      // For hit detection on edges
      me = this.updateMouseEvent(me);

      cellSelected = this.isCellSelected(me.getCell());
      selectionEmpty = this.isSelectionEmpty();
      menuShowing = graph.popupMenuHandler.isMenuShowing();
    }

    mxGraph.prototype.fireMouseEvent.apply(this, arguments);
  };

  // Shows popup menu if cell was selected or selection was empty and background was clicked
  graph.popupMenuHandler.mouseUp = function (sender, me) {
    this.popupTrigger = !graph.isEditing() && (this.popupTrigger || (!menuShowing &&
      !graph.isEditing() && !mxEvent.isMouseEvent(me.getEvent()) &&
      ((selectionEmpty && me.getCell() == null && graph.isSelectionEmpty()) ||
        (cellSelected && graph.isCellSelected(me.getCell())))));
    mxPopupMenuHandler.prototype.mouseUp.apply(this, arguments);
  };





  //Delete this ....
  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  var parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.getModel().beginUpdate();
  try {
    var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
    var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
    var e1 = graph.insertEdge(parent, null, '', v1, v2);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }













  // Disables new connections via "hotspot"
  graph.connectionHandler.marker.isEnabled = function () {
    return this.graph.connectionHandler.first != null;
  };

  // Adds custom hit detection if native hit detection found no cell
  graph.updateMouseEvent = function (me) {
    var me = mxGraph.prototype.updateMouseEvent.apply(this, arguments);

    if (me.getState() == null) {
      var cell = this.getCellAt(me.graphX, me.graphY);

      if (cell != null && this.isSwimlane(cell) && this.hitsSwimlaneContent(cell, me.graphX, me.graphY)) {
        cell = null;
      } else {
        me.state = this.view.getState(cell);

        if (me.state != null && me.state.shape != null) {
          this.container.style.cursor = me.state.shape.node.style.cursor;
        }
      }
    }

    if (me.getState() == null) {
      this.container.style.cursor = 'default';
    }

    return me;
  };


})(mainSystem.graph);
*/