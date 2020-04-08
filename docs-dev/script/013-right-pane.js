const editorVue = new Vue({
    el: "#rp-content",
    data: {
        rpSettings: Object.assign({}, settings),
        uyamakModel: null,
        modelValue: null,
        bunchOfItems: false,
        parametersDisplay: null,
        updatingCounter: 0
    },
    computed: {
        getBlockDetails: function () {
            try {
                return this.uyamakModel.Details();
            } catch (e) {
                console.log(e);
                return "¡¡¡UNKNOWN ERROR!!!. If this error continues, please contact the support.";
            }
        }
    },
    mounted: function () {
        this.refreshGraph();
    },
    updated: function () {
        updateMathJax();
    },
    watch: {
        rpSettings: {
            deep: true,
            handler: function (a) {
                if (!a.gridSize || a.gridSize <= 0) a.gridSize = 1;
                settingsVue.$set(settingsVue.$data.stings, 'gLinesMinor', a.gLinesMinor);
                settingsVue.$set(settingsVue.$data.stings, 'gLinesMajor', a.gLinesMajor);
                settingsVue.$set(settingsVue.$data.stings, 'gLinesMega', a.gLinesMega);
                settingsVue.$set(settingsVue.$data.stings, 'showOutline', a.showOutline);
                settingsVue.$set(settingsVue.$data.stings, 'gridSize', a.gridSize);
                settingsVue.$set(settingsVue.$data.stings, 'guidesEnabled', a.guidesEnabled);
                settingsVue.$set(settingsVue.$data.stings, 'showLabels', a.showLabels);
                this.refreshGraph();
            }
        }
    },
    methods: {
        refreshGraph() {
            mainSystem.graph.grid.minorStroke.show = this.rpSettings.gLinesMinor;
            mainSystem.graph.grid.majorStroke.show = this.rpSettings.gLinesMajor;
            mainSystem.graph.grid.megaStroke.show = this.rpSettings.gLinesMega;
            mainSystem.outline.visibility = this.rpSettings.showOutline;
            mainSystem.graph.graphHandler.guidesEnabled = this.rpSettings.guidesEnabled;
            mainSystem.graph.gridSize = this.rpSettings.gridSize;
            mainSystem.graph.showCaptions = this.rpSettings.showLabels;
            mainSystem.refresh();
        },
        getAngle: function () {
            for (let i = 0; i < mainSystem.graph.getSelectionCell().children.length; i++) {
                if (mainSystem.graph
                    .getSelectionCell()
                    .children[i].style.search("umk_caption") >= 0) {
                    let styleSplit = mainSystem.graph.getSelectionCell().children[i].style.split("_");
                    try {
                        return parseInt(styleSplit[styleSplit.length - 1])
                    } catch (e) {
                        return 0;
                    }
                }
            }
        },
        rotate: function (ang) {
            if (this.getAngle !== ang) {
                let model = mainSystem.graph.getModel();
                model.beginUpdate();
            
                if (ang === 180 || ang === 90) {
                    mainSystem.graph.getSelectionCell().value.rotateHTML = 180;
                } else {
                    mainSystem.graph.getSelectionCell().value.rotateHTML = 0;
                }
                const pConstarins = [];
                pConstarins[0] = {
                    in: "west",
                    out: "east"
                };
                pConstarins[90] = {
                    in: "north",
                    out: "south"
                };
                pConstarins[180] = {
                    in: "east",
                    out: "west"
                };
                pConstarins[270] = {
                    in: "south",
                    out: "north"
                };
                const geos = [];
                geos[0] = {
                    "umk_caption": {
                        x: 0.5,
                        y: 1
                    },
                    "umk_EO": {
                        x: 0.5,
                        y: 0
                    },
                };
                geos[90] = {
                    "umk_caption": {
                        x: 0.5,
                        y: 0
                    },
                    "umk_EO": {
                        x: 0.5,
                        y: 1
                    },
                };
                geos[180] = {
                    "umk_caption": {
                        x: 0.5,
                        y: 0
                    },
                    "umk_EO": {
                        x: 0.5,
                        y: 1
                    },
                };
                geos[270] = {
                    "umk_caption": {
                        x: 0.5,
                        y: 1
                    },
                    "umk_EO": {
                        x: 0.5,
                        y: 0
                    },
                };
                mainSystem.graph.setCellStyles(
                    "rotation",
                    ang,
                    [mainSystem.graph.getSelectionCell()].concat(
                        mainSystem.graph.getSelectionCell().children
                    )
                );
                for (let i = 0; i < mainSystem.graph.getSelectionCell().children.length; i++) {
                    if (
                        mainSystem.graph
                        .getSelectionCell()
                        .children[i].style.search("umk_input") >= 0
                    ) {
                        mainSystem.graph.setCellStyles("portConstraint", pConstarins[ang].in, [
                            mainSystem.graph.getSelectionCell().children[i]
                        ]);
                    } else if (
                        mainSystem.graph
                        .getSelectionCell()
                        .children[i].style.search("umk_output") >= 0
                    ) {
                        mainSystem.graph.setCellStyles("portConstraint", pConstarins[ang].out, [
                            mainSystem.graph.getSelectionCell().children[i]
                        ]);
                    } else if (
                        mainSystem.graph
                        .getSelectionCell()
                        .children[i].style.search("umk_caption") >= 0
                    ) {
                        mainSystem.graph.getSelectionCell().children[i].setStyle("umk_caption_" + ang);
                        let tempGeo = new mxGeometry(geos[ang]["umk_caption"].x, geos[ang]["umk_caption"].y, 0, 0);
                        tempGeo.relative = true;
                        mainSystem.graph.getSelectionCell().children[i].setGeometry(tempGeo);
                    } else if (
                        mainSystem.graph
                        .getSelectionCell()
                        .children[i].style.search("umk_EO") >= 0
                    ) {
                        mainSystem.graph.getSelectionCell().children[i].setStyle("umk_EO_" + ang);
                        let tempGeo = new mxGeometry(geos[ang]["umk_EO"].x, geos[ang]["umk_EO"].y, 0, 0);
                        tempGeo.relative = true;
                        mainSystem.graph.getSelectionCell().children[i].setGeometry(tempGeo);
                    }
                }
                model.endUpdate();
                mainSystem.refresh();
            }
        },
        applyModelValue: function () {
            mainSystem.graph.getSelectionCell().value = this.modelValue;
            mainSystem.refresh();
        },
        saveModel: function () {
            let model = mainSystem.graph.getModel();
            model.beginUpdate();

            //Adding model to the Block
            eval(
                "var tempModel = new " +
                this.uyamakModel.id +
                "(this.uyamakModel);"
            );
            mainSystem.graph.getSelectionCell().setValue(tempModel);
            setTermianls(mainSystem.graph, mainSystem.graph.getSelectionCell(), "umk_input");
            setTermianls(mainSystem.graph, mainSystem.graph.getSelectionCell(), "umk_output");
            //mainSystem.graph.refresh(mainSystem.graph.getSelectionCell());
            model.endUpdate();
            mainSystem.refresh();
        },
        toggleParamDisplay: function (index) {
            //console.log(this.parametersDisplay);
            this.updatingCounter++;
            this.parametersDisplay[index] = !this.parametersDisplay[index];
        },
        valueDimensionsModify: function (func, index) {
            let tempItem;
            switch (this.uyamakModel.Parameters[index].Type) {
                case "Integer":
                case "Real":
                case "Complex":
                    tempItem = 0;
                    break;
                case "Text":
                    tempItem = "";
                    break;
                case "Color":
                    tempItem = "#000";
                    break;
            }
            switch (func) {
                case 0:
                    this.uyamakModel.Parameters[index].Value.push(
                        new Array(
                            this.uyamakModel.Parameters[index].Value[0].length
                        ).fill(tempItem)
                    );
                    break;
                case 1:
                    if (this.uyamakModel.Parameters[index].Value.length > 1) {
                        this.uyamakModel.Parameters[index].Value.pop();
                    }
                    break;
                case 2:
                    this.uyamakModel.Parameters[index].Value.map(function (val) {
                        return val.push(tempItem);
                    });
                    break;
                case 3:
                    if (this.uyamakModel.Parameters[index].Value[0].length > 1) {
                        this.uyamakModel.Parameters[index].Value.map(function (val) {
                            return val.pop();
                        });
                    }
                    break;
            }
            this.updatingCounter++;
        }
    }
})