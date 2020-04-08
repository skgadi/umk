//set valid drop targets required for groups
var isValidDropTargetDefault = mxGraph.prototype.isValidDropTarget;
mainSystem.graph.isValidDropTarget = function (cell, cells, evt) {
    var defaultRetValue = isValidDropTargetDefault.apply(
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
    var cell = graph.getCellAt(x, y);
    if (!graph.isValidDropTarget(cell)) {
        cell = null;
    }
    return cell;
};