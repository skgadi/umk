((graph) => {
    //Group blocks
    mxGraph.prototype.createSubModel = function () {
      let model = this.getModel();
      model.beginUpdate();
      let subModel;
      try {
        subModel = this.groupCells(null, 35, this.getSelectionCells());
        subModel.geometry.alternateBounds = new mxRectangle(0, 0, 200, 25);
        this.setSelectionCell(subModel);
      } catch (e) {
        console.log(e);
        this.validationAlert(GUIText[settings.lang].errUnablGrping);
        return;
      } finally {
        model.endUpdate();
        return subModel;
      }
    }
  
    mxGraph.prototype.ungroupSubModel = function () {
      let model = this.getModel();
      model.beginUpdate();
      try {
        let cells = this.getSelectionCells();
        for (let i = 0; i < cells.length; i++) {
          if (!!cells[i].getStyle() && cells[i].getStyle().search("umk_group") >= 0) {
            let sCells = this.getSelectionCells();
            sCells = sCells.concat(cells[i].children);
            //console.log(sCells);
            this.ungroupCells([cells[i]]);
            this.setSelectionCells(sCells);
          }
        }
      } catch (e) {
        console.log(e);
        validationAlert(GUIText[settings.lang].k171);
      } finally {
        model.endUpdate();
      }
    }
    // fold and unfold
    graph.collapsedImage = new mxImage("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjQ0OHB0IiB2aWV3Qm94PSIwIDAgNDQ4IDQ0OCIgd2lkdGg9IjQ0OHB0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im00MDggMTg0aC0xMzZjLTQuNDE3OTY5IDAtOC0zLjU4MjAzMS04LTh2LTEzNmMwLTIyLjA4OTg0NC0xNy45MTAxNTYtNDAtNDAtNDBzLTQwIDE3LjkxMDE1Ni00MCA0MHYxMzZjMCA0LjQxNzk2OS0zLjU4MjAzMSA4LTggOGgtMTM2Yy0yMi4wODk4NDQgMC00MCAxNy45MTAxNTYtNDAgNDBzMTcuOTEwMTU2IDQwIDQwIDQwaDEzNmM0LjQxNzk2OSAwIDggMy41ODIwMzEgOCA4djEzNmMwIDIyLjA4OTg0NCAxNy45MTAxNTYgNDAgNDAgNDBzNDAtMTcuOTEwMTU2IDQwLTQwdi0xMzZjMC00LjQxNzk2OSAzLjU4MjAzMS04IDgtOGgxMzZjMjIuMDg5ODQ0IDAgNDAtMTcuOTEwMTU2IDQwLTQwcy0xNy45MTAxNTYtNDAtNDAtNDB6bTAgMCIvPjwvc3ZnPg==", 13, 13);
    graph.expandedImage = new mxImage("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQyIDQyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MiA0MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGQ9Ik0zNy4wNTksMTZIMjZIMTZINC45NDFDMi4yMjQsMTYsMCwxOC4yODIsMCwyMXMyLjIyNCw1LDQuOTQxLDVIMTZoMTBoMTEuMDU5QzM5Ljc3NiwyNiw0MiwyMy43MTgsNDIsMjEgUzM5Ljc3NiwxNiwzNy4wNTksMTZ6Ii8+PC9zdmc+", 13, 13);
    graph.foldItems = function (fold = true) {
      let cells;
      if (this.getSelectionCells().length > 0) {
        cells = this.getSelectionCells();
      } else {
        cells = this.getDefaultParent().children;
      }
      for (let i = 0; i < cells.length; i++) {
        if (!!cells[i].style && cells[i].style.search("umk_group") >= 0) {
          this.foldCells(fold, false, [cells[i]]);
        }
      }
    }
  
  
  
  
  
  
  
    //set valid drop targets required for groups
    const isValidDropTargetDefault = mxGraph.prototype.isValidDropTarget;
    graph.isValidDropTarget = function (cell, cells, evt) {
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
    graph.addListener(mxEvent.CELLS_RESIZED, function (sender, evt) {
      let cells = evt.getProperty('cells');
      if (cells != null) {
        for (let i = 0; i < cells.length; i++) {
          if (!!cells[i].style && cells[i].style.search('umk_group') >= 0) {
            //console.log(evt);
            if (graph.getModel().getChildCount(cells[i]) > 0) {
              let geo = graph.getCellGeometry(cells[i]);
  
              if (geo != null) {
                let children = graph.getChildCells(cells[i], true, true);
                let bounds = graph.getBoundingBoxFromGeometry(children, true);
  
                geo = geo.clone();
                if (cells[i].collapsed) {
                  geo.height = 25;
                } else {
                  geo.width = Math.max(geo.width, bounds.width + bounds.x + 25);
                  geo.height = Math.max(geo.height, bounds.height + bounds.y + 25);
                }
                graph.getModel().setGeometry(cells[i], geo);
              }
            }
          }
        }
      }
    });
  
  
  
    /*Group cells */
    /*graph.autoSizeCellsOnAdd = true;
                    graph.autoSizeCells = true;/**/
    //Adjust vertices when new group is formed
    var graphCreateGroupCell = mxGraph.prototype.createGroupCell;
    mxGraph.prototype.createGroupCell = function (cells) {
      var group = graphCreateGroupCell.apply(this, arguments);
      group.setStyle("umk_group;");
      group.setValue(GUIText[settings.lang].subModel);
      return group;
    };
  
  
  
  })(mainSystem.graph)