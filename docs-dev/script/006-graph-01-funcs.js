((graph) => {
  //graph.setAllowDanglingEdges(false);
  graph.setConnectable(true);
  graph.setTooltips(true);
  graph.setPanning(true);
  graph.setConnectableEdges(true);
  graph.setDisconnectOnMove(false);


  // Enables return key to stop editing (use shift-enter for newlines)
  graph.setEnterStopsCellEditing(true);


  graph.validationAlert = function (message) {
    new Noty({
      text: message,
      timeout: 5000,
      theme: "nest",
      type: 'warning'
    }).show();
  };





  graph.areAllFromSameNode = function (inCells, ignCells = []) {
    const refCell = this.getNodeCells(inCells[0], ignCells)[0];
    for (let i = 1; i < inCells.length; i++) {
      let allNodeCells = this.getNodeCells(inCells[i], ignCells);
      let foundMatch = false;
      for (let j = 0; j < allNodeCells.length; j++) {
        if (refCell === allNodeCells[j]) {
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch) {
        return false;
      }
    }
    return true;
  }

  graph.areAllFromDiffNodes = function (inCells, ignCells = []) {
    const refCell = this.getNodeCells(inCells[0], ignCells)[0];
    for (let i = 1; i < inCells.length; i++) {
      let allNodeCells = this.getNodeCells(inCells[i], ignCells);
      let foundMatch = false;
      for (let j = 0; j < allNodeCells.length; j++) {
        if (refCell === allNodeCells[j]) {
          foundMatch = true;
          break;
        }
      }
      if (foundMatch) {
        return false;
      }
    }
    return true;
  }

  graph.doesContainMultipleSources = function (inCells, ignCells = []) {
    let foundSource = false;
    for (let i = 0; i < inCells.length; i++) {
      let allNodeCells = this.getNodeCells(inCells[i], ignCells);
      for (let j = 0; j < allNodeCells.length; j++) {
        if (!!allNodeCells[j].style && allNodeCells[j].style.search("umk_output") >= 0) {
          if (foundSource) {
            return true;
          } else {
            foundSource = true;
          }
        }
      }
    }
    return false;
  }


  graph.getNodeCells = function (inCell, ignCells = []) {
    const nItems = []; //Node Items
    nItems.push(inCell);
    let index = 0;
    while (index < nItems.length) {
      const connectedCells = [];
      if (!!nItems[index] && !!nItems[index].edges && nItems[index].edges.length > 0) {
        for (let i = 0; i < nItems[index].edges.length; i++) {
          connectedCells.push(nItems[index].edges[i]);
        }
      }
      if (!!nItems[index] && nItems[index].isEdge()) {
        connectedCells.push(nItems[index].source);
        connectedCells.push(nItems[index].target);
      }
      //console.log(connectedCells);  
      for (let i = 0; i < connectedCells.length; i++) {
        let isNewItem = true;
        for (let j = 0; j < nItems.length; j++) {
          if (connectedCells[i] === nItems[j]) {
            isNewItem = false;
            break;
          }
        }
        if (isNewItem) {
          if (ignCells.findIndex(function (ignCell) {
              return connectedCells[i] === ignCell;
            }) < 0) {
            nItems.push(connectedCells[i]);
          }
        }
      }
      index++;
    }
    return nItems;
  }

})(mainSystem.graph);