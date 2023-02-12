mainSystem.graph.model.addListener(mxEvent.CHANGE, function (sender, evt) {

  // console.log(sender);
  // console.log(evt);
  if (settings.showExeOrder) {
    simVue.displayExecutionOrder();
  } else {
    mainSystem.refresh();
  }
});

/*
mainSystem.graph.addListener(mxEvent.CELLS_ADDED, function(sender, evt){
  console.log(sender);
  console.log(evt);
  const source = evt.properties.terminal;
  const target = evt.properties.terminal;
  const edge = evt.properties.edge;

});
*/
/*
mainSystem.graph.addListener(mxEvent.CELL_CONNECTED, function (sender, evt) {
  // console.log(evt);
  const edge = evt.properties.edge;
  const source = edge.source;
  const target = edge.target;
  if (!!source && !!target) {
    let removeEdge = false;
    let terminal = source;
    for (i = 0; i < 2; i++) {
      if (!!i) {
        terminal = target;
      }
      if (this.model.isEdge(terminal)) {

        if (!terminal.source && !terminal.target) {
          terminal.source = getTheSourceFromEdge(edge, terminal);

        } else if (!terminal.source) {
          terminal.source = getTheSourceFromEdge(edge, terminal);
          removeEdge = true;
          // console.log("<<<---");
        } else if (!terminal.target) {
          terminal.target = getTheSourceFromEdge(edge, terminal);
          removeEdge = true;
          console.log(getTheSourceFromEdge(edge, terminal));
          //console.log(getTheSourceFromEdge(edge, terminal));
          // console.log("--->>>");
        }

        function getTheSourceFromEdge(newEdge, existingEdge) {
          // console.log("hey");
          // console.log(newEdge);
          // console.log(existingEdge);
          try {
            if (newEdge.source === existingEdge) {
              // console.log("hey");
              return newEdge.target;
            }
            if (newEdge.target === existingEdge) {
              console.log("source");
              return newEdge.source;
            }
          } catch (e) {
            console.log(e);
          }
          return null;
        }
      }
    }
    if (removeEdge) {
      this.removeCells([edge], false);
    }

  }
});
*/