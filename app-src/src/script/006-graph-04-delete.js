mainSystem.graph.cellsRemoved = function (cells) {
  //console.log(cells);
  cells.forEach(element => {
    try {
      popup.close(element.id);
      element.value.Dest();
    } catch (e) {
      //console.log(e);
    }
  });
  return mxGraph.prototype.cellsRemoved.apply(this, arguments);
}