const signalRouteVue = {
  tags: {},
  foundErrores: false,
  updateTags: function () {
    this.foundErrores = false;
    this.tags = {};
    //Obtain all the blocks
    let allTheCells = [];
    if (mainSystem.graph.getDefaultParent().children) {
      allTheCells = allTheCells.concat(mainSystem.graph.getDefaultParent().children);
    }
    for (let i = 0; i < allTheCells.length; i++) {
      if (allTheCells[i].children) {
        allTheCells = allTheCells.concat(allTheCells[i].children);
      }
    }
    const allFromTags = [];
    const allToTags = [];
    allTheCells.forEach(function (cell) {
      if (
        cell.isVertex() &&
        cell.style.indexOf("umk_model") >= 0 &&
        !!cell.value.signalRerouting
      ) {
        if (!cell.value.TerminalsOut.max) {
          allToTags.push(cell);
        } else {
          allFromTags.push(cell);
        }
      }
    });

    // update all the tags
    for (let idx = 0; idx < allToTags.length; idx++) {
      const cell = allToTags[idx];
      const AllInps = simVue.getSourcesWithIndexes(cell);
      //console.log(AllInps);
      //console.log(cell.value.Parameters.tag.Value);
      for (let i = 0; i < cell.value.Parameters.tag.Value.length; i++) {
        if (!this.tags[cell.value.Parameters.tag.Value[i][0]]) {
          if (!!AllInps[i] && !!AllInps[i].model) {
            this.tags[cell.value.Parameters.tag.Value[i][0]] = {
              cell: cell,
              source: AllInps[i]
            };
            mainSystem.graph.setCellWarning(cell);
          } else {
            this.foundErrores = true;
            console.log("error: Not connected");
            mainSystem.graph.setCellWarning(cell, "<b>" + GUIText[settings.lang].errRouting + "</b><br/>" + GUIText[settings.lang].errRouteNotCon);
          }
        } else {
          this.foundErrores = true;
          console.log("error: Multiple labels");
          mainSystem.graph.setCellWarning(cell, "<b>" + GUIText[settings.lang].errRouting + "</b><br/>" + GUIText[settings.lang].errRouteDef);
          mainSystem.graph.setCellWarning(this.tags[cell.value.Parameters.tag.Value[i][0]].cell, "<b>" + GUIText[settings.lang].errRouting + "</b><br/>" + GUIText[settings.lang].errRouteDef);
        }
      }
    }

    //check for tags
    for (let idx = 0; idx < allFromTags.length; idx++) {
      const cell = allFromTags[idx];
      for (let i = 0; i < cell.value.Parameters.tag.Value.length; i++) {
        if (!this.tags[cell.value.Parameters.tag.Value[i][0]]) {
          mainSystem.graph.setCellWarning(cell, "<b>" + GUIText[settings.lang].errRouting + "</b><br/>" + GUIText[settings.lang].errRouteNotFound);
        } else {
          mainSystem.graph.setCellWarning(cell);
        }
      }
    }
  },
  
};