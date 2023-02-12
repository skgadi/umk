((system, graph)=>{

    //Navigate graph
    graph.navigate = {
      sGraph: graph,
      move: function (direction = "up", step = 10) {
        let graph = this.sGraph;
        step = step / graph.view.scale;
        let value;
        let sCells = graph.getSelectionCells();
        if (!!sCells.length && direction !== "0") {
          value = {};
          value.x = 0;
          value.y = 0;
        } else {
          value = graph.view.getTranslate();
        }
        switch (direction) {
          case "up":
            value.y += step;
            break;
          case "down":
            value.y -= step;
            break;
          case "left":
            value.x += step;
            break;
          case "right":
            value.x -= step;
            break;
          case "0":
            value.x = 0;
            value.y = 0;
            break;
        }
        if (!!sCells.length) {
          graph.moveCells(sCells, -value.x, -value.y);
        } else {
          graph.view.setTranslate(value.x, value.y);
        }
        graph.view.refresh();
      }
    };
  


  system.navigate = function (dir = "up") {
    switch (dir) {
      case "up":
      case "down":
      case "left":
      case "right":
      case "0":
        this.graph.navigate.move(dir);
        break;
      case "zoomIn":
        this.graph.zoomIn();
        break;
      case "zoomOut":
        this.graph.zoomOut();
        break;
      case "zoomActual":
        this.graph.zoomActual();
        break;
      case "fit":
        this.graph.fit();
        break;

    }
    this.refresh();
  }

}) (mainSystem, mainSystem.graph)