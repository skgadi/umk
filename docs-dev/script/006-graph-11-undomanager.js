((system)=>{
  system.undoManager = new mxUndoManager();
  const umListener = function (sender, evt) {
    system.undoManager.undoableEditHappened(evt.getProperty("edit"));
  };
  system.graph.getModel().addListener(mxEvent.UNDO, umListener);
  system.graph.getView().addListener(mxEvent.UNDO, umListener);
})(mainSystem);