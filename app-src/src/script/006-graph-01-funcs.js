((graph, system) => {
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
        if (!!!!allNodeCells[j] && !!allNodeCells[j].style && allNodeCells[j].style.search("umk_output") >= 0) {
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

  //checks for tags signal routing
  graph.doesContainMultipleTags = function (inCells, ignCells = []) {
    let foundATag = -1;
    let foundAFromTag = 0;
    for (let i = 0; i < inCells.length; i++) {
      let allNodeCells = this.getNodeCells(inCells[i]);
      for (let j = 0; j < allNodeCells.length; j++) {
        //console.log(allNodeCells[j]);
        if (!!allNodeCells[j] && !!allNodeCells[j].parent && !! allNodeCells[j].parent.value && allNodeCells[j].parent.value.signalRerouting) {
          foundATag++;
          if (!allNodeCells[j].parent.value.TerminalsIn.max) {
            foundAFromTag++;
          }
          if (foundATag*foundAFromTag) {
            return true;
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

  //Delete button action
  graph.deleteBtnPress = function () {
    if (graph.isEnabled()) {
      graph.removeCells(null, false);
    }
  }

  mainSystem.removeUselessEdges = function () {
    let contRemoving = true;
    while (contRemoving) {
      let cellsToRemove = [];
      let allCells = Object.values(this.graph.getModel().cells);
      for (let i = 0; i < allCells.length; i++) {
        if (!mainSystem.isUsefulEdge(allCells[i])) {
          //console.log(allCells[i]);
          cellsToRemove.push(allCells[i]);
        }
      }
      contRemoving = !!cellsToRemove.length;
      this.graph.removeCells(cellsToRemove, false);
    }
  }
  mainSystem.isUsefulEdge = function (inEdge) {
    if (this.graph.getModel().isEdge(inEdge)) {
      let noOfConnections = 0;
      if (!!inEdge.source) {
        noOfConnections++;
      }
      if (!!inEdge.target) {
        noOfConnections++;
      }
      noOfConnections += inEdge.getEdgeCount();
      if (noOfConnections < 2) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
})(mainSystem.graph, mainSystem);