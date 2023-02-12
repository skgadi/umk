((graph) => {
  // Redirects selection to parent
  graph.selectCellForEvent = function (cell) {
    //Use this code to select parent when a terminal is connected
    /*
    if (graph.isPart(cell)) {
      cell = graph.model.getParent(cell);
    }
    */
    mxGraph.prototype.selectCellForEvent.apply(this, arguments);
  };
  // Helper method to mark parts with constituent=1 in the style
  graph.isPart = function (cell) {
    //console.log(cell);
    let style = graph.getCellStyle(cell);
    return style["constituent"] == "1";
  };


  //selection of a vertix
  graph.isCellSelectable = function (cell) {
    let state = this.view.getState(cell);
    let style = state != null ? state.style : this.getCellStyle(cell);

    return (
      this.isCellsSelectable() &&
      !this.isCellLocked(cell) &&
      style["selectable"] != 0
    );
  };

  graph.getSelectionModel().addListener(mxEvent.CHANGE, function (sender, evt) {
    selectionChanged();
  });



  function selectionChanged() {
    clearAllTheGraphSelections();
    if (
      mainSystem.graph.getSelectionCells().length === 1 &&
      mainSystem.graph.getSelectionCell() &&
      mainSystem.graph.getSelectionCell().isVertex() &&
      typeof mainSystem.graph.getSelectionCell().value === "object"
    ) {
      changeEditModelWithSelectedBlock();
    } else if (
      mainSystem.graph.getSelectionCells().length === 1 &&
      mainSystem.graph.getSelectionCell() &&
      mainSystem.graph.getSelectionCell().isEdge()
    ) {
      editorVue.$set(editorVue.$data, "modelValue", mainSystem.graph.getSelectionCell().value);
    } else if (
      mainSystem.graph.getSelectionCells().length === 1 &&
      mainSystem.graph.getSelectionCell() &&
      !!mainSystem.graph.getSelectionCell().style &&
      mainSystem.graph.getSelectionCell().style.search("umk_group") >= 0
    ) {
      editorVue.$set(editorVue.$data, "modelValue", mainSystem.graph.getSelectionCell().value);
    }
  }

  function changeEditModelWithSelectedBlock() {
    eval(
      "var editModel = new " +
      mainSystem.graph.getSelectionCell().value.id +
      "(mainSystem.graph.getSelectionCell().value);"
    );
    editorVue.$set(editorVue.$data, "uyamakModel", editModel);
    editorVue.$set(editorVue.$data, "parametersDisplay", {});
  }

  function clearAllTheGraphSelections() {
    editorVue.$set(editorVue.$data, "uyamakModel", null);
    editorVue.$set(editorVue.$data, "modelValue", null);
    editorVue.$set(editorVue.$data, "bunchOfItems", null);
  }


})(mainSystem.graph);