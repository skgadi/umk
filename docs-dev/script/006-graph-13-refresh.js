((system, graph, outline)=>{

  outline.visibility = false;
  outline.setVisiblity = function () {
    outline.container.style.display = (outline.visibility) ? "block" : "none";
  }

  outline.update = function (rv) {
    mainSystem.graph.grid.repaintGrid();
    //mathEqn.update();
    return mxOutline.prototype.update.apply(this, arguments);
  };

  outline.mouseDown = function (sender, me) {
    mainSystem.graph.gridCanvas.style.display = "none";
    //mainSystem.graph.container.style.backgroundColor = mainSystem.graph.backgroundColor;
    return mxOutline.prototype.mouseDown.apply(this, arguments);
  };

  outline.mouseUp = function (sender, me) {
    mainSystem.graph.gridCanvas.style.display = "block";
    //mainSystem.graph.container.style.backgroundColor = "";
    return mxOutline.prototype.mouseUp.apply(this, arguments);
  };

  



  graph.refresh = function (cell) {
    let out = mxGraph.prototype.refresh.apply(this, arguments);
    mathEqn.update();
    return out;
  }



  system.isRefreshing = false;

  system.refreshNow = function (that) {
    try {
      that.graph.refresh();
      if (that.outline.visibility) {
        that.graph.container.style.overflow = 'hidden';
      } else {
        that.graph.container.style.overflow = 'auto';
      }
      that.outline.setVisiblity();
      that.outline.refresh();
    } catch (e) {
      console.log(e);
    }
    that.isRefreshing = false;
  }
  system.refresh = function () {
    if (!system.isRefreshing) {
      system.isRefreshing = true;
      setTimeout(system.refreshNow.bind(null, system), 300);
    } else {
      // console.log("Full refresh call blocked");
    }
    //this.graph.grid.repaintGrid();
  }



})(mainSystem, mainSystem.graph, mainSystem.outline);