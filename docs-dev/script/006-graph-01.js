//set valid drop targets required for groups
const isValidDropTargetDefault = mxGraph.prototype.isValidDropTarget;
mainSystem.graph.isValidDropTarget = function (cell, cells, evt) {
  let defaultRetValue = isValidDropTargetDefault.apply(
    this,
    arguments
  );
  //console.log(defaultRetValue);
  if (defaultRetValue) {
    if (cell.getStyle() && cell.getStyle().search("umk_group") >= 0) {
      return true;
    }
    /*else if (graph.getCellStyle(cell)["shape"] === "swimlane")
    return true;*/
    else {
      return false;
    }
  } else {
    return defaultRetValue;
  }
};
// Matches DnD inside the graph
mxDragSource.prototype.getDropTarget = function (graph, x, y) {
  let cell = graph.getCellAt(x, y);
  if (!graph.isValidDropTarget(cell)) {
    cell = null;
  }
  return cell;
};


// Handles how to resize works with sub-system
mainSystem.graph.addListener(mxEvent.CELLS_RESIZED, function (sender, evt) {
  let cells = evt.getProperty('cells');
  if (cells != null) {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].style.search('umk_group') >= 0) {
        //console.log(evt);
        if (mainSystem.graph.getModel().getChildCount(cells[i]) > 0) {
          let geo = mainSystem.graph.getCellGeometry(cells[i]);

          if (geo != null) {
            let children = mainSystem.graph.getChildCells(cells[i], true, true);
            let bounds = mainSystem.graph.getBoundingBoxFromGeometry(children, true);

            geo = geo.clone();
            if (cells[i].collapsed) {
              geo.height = 25;
            } else {
              geo.width = Math.max(geo.width, bounds.width + bounds.x + 25);
              geo.height = Math.max(geo.height, bounds.height + bounds.y + 25);
            }
            mainSystem.graph.getModel().setGeometry(cells[i], geo);
          }
        }
      }
    }
  }
});


