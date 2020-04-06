const editorVue = new Vue({
    el: "#rp-content",
    data: {
        rpSettings: Object.assign({}, settings),
        uyamakModel: null,
        cellModel: {
            model: false,
            value: null
        },
        invalidInputs: [],
        parametersDisplay: null,
        updatingCounter: 0
    },
    computed: {
        parametersValidationComments: function () {
            if (!!this.uyamakModel && !!this.uyamakModel.ValidateParams)
                return this.uyamakModel.ValidateParams();
            return "OK";
        },
        inputErrors: function () {
            return (
                "<table class='w3-table'>" +
                this.invalidInputs
                .map(function (currentValue, index, arr) {
                    return (
                        "<tr><td>" +
                        editorVue.$data.uyamakModel.Parameters[currentValue]
                        .Name +
                        /*" at [" +
                        (parseInt(currentValue.split(",")[1]) + 1) +
                        ", " +
                        (parseInt(currentValue.split(",")[2]) + 1) +
                        "]" +*/
                        "</td></tr>"
                    );
                })
                .join("") +
                "</table>"
            );
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
            mainSystem.refresh();
        },
        rotate: function (ang) {
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
                )
                    mainSystem.graph.setCellStyles("portConstraint", pConstarins[ang].in, [
                        mainSystem.graph.getSelectionCell().children[i]
                    ]);
                if (
                    mainSystem.graph
                    .getSelectionCell()
                    .children[i].style.search("umk_output") >= 0
                )
                    mainSystem.graph.setCellStyles("portConstraint", pConstarins[ang].out, [
                        mainSystem.graph.getSelectionCell().children[i]
                    ]);
            }
        },
        applyCellValue: function () {
            if (
                mainSystem.graph.getSelectionCell().isEdge() ||
                mainSystem.graph.getSelectionCell().style.search("umk_group") >= 0
            ) {
                mainSystem.graph.getSelectionCell().value = this.cellModel.value;
                mainSystem.graph.refresh(mainSystem.graph.getSelectionCell());
            }
        },
        saveModel: function () {
            //Adding model to the Block
            eval(
                "tempModel = new " +
                this.uyamakModel.id +
                "(this.uyamakModel);"
            );
            mainSystem.graph.getSelectionCell().setValue(tempModel);
            setTermianls(mainSystem.graph.getSelectionCell(), "umk_input");
            setTermianls(mainSystem.graph.getSelectionCell(), "umk_output");
            mainSystem.graph.refresh(mainSystem.graph.getSelectionCell());
        },
        getBlockDetails: function () {
            try {
                return this.uyamakModel.Details();
            } catch (e) {
                console.log(e);
                return "¡¡¡UNKNOWN ERROR!!!. If this error continues, please contact the support.";
            }
        },
        toggleParamDisplay: function (index) {
            //console.log(this.parametersDisplay);
            this.updatingCounter++;
            this.parametersDisplay[index] = !this.parametersDisplay[index];
        },
        validateParamCellEntry: function (index, index1, index2) {
            /* Old one
            var tempValidateItem = index + "," + index1 + "," + index2;
            */
            let tempValidateItem = index;
            let outValue;
            let tempValue1;

            try {
                if (
                    this.uyamakModel.Parameters[index].Type === "Integer" ||
                    this.uyamakModel.Parameters[index].Type === "Real" ||
                    this.uyamakModel.Parameters[index].Type === "Complex"
                ) {
                    tempValue1 = getTheParameterValueFromEntry(
                        this.uyamakModel.Parameters[index].Value
                    );
                    for (let i = 0; i < tempValue1.length; i++) {
                        for (let j = 0; j < tempValue1[0].length; j++) {
                            let tempValue = tempValue1[0][0];
                            switch (this.uyamakModel.Parameters[index].Type) {
                                case "Integer":
                                    outValue = math.isInteger(tempValue);
                                    break;
                                case "Real":
                                    outValue = math.isNumber(tempValue);
                                    break;
                                case "Complex":
                                    outValue =
                                        math.isComplex(tempValue) || math.isNumber(tempValue);
                                    break;
                                case "Text":
                                case "Color":
                                case "Options":
                                    outValue = tempValue !== "" && tempValue !== null;
                                    break;
                            }
                        }
                    }
                } else {
                    outValue = true;
                }
                //console.log(tempValue1);
            } catch (e) {
                console.log(e);
                outValue = false;
            }
            let tempIndex = this.invalidInputs.indexOf(tempValidateItem);
            if (outValue) {
                if (tempIndex >= 0) this.invalidInputs.splice(tempIndex, 1);
            } else {
                if (tempIndex < 0) this.invalidInputs.push(tempValidateItem);
            }
            return outValue;
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
                        for (
                            let i = 0; i < this.uyamakModel.Parameters[index].Value[0].length; i++
                        ) {
                            this.removeFromInvalidInputs(
                                index,
                                this.uyamakModel.Parameters[index].Value.length - 1,
                                i
                            );
                        }
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
                        for (
                            let i = 0; i < this.uyamakModel.Parameters[index].Value.length; i++
                        ) {
                            this.removeFromInvalidInputs(
                                index,
                                i,
                                this.uyamakModel.Parameters[index].Value[0].length - 1
                            );
                        }
                        this.uyamakModel.Parameters[index].Value.map(function (val) {
                            return val.pop();
                        });
                    }
                    break;
            }
            this.updatingCounter++;
        },
        removeFromInvalidInputs: function (index, index1, index2) {
            let tempValidateItem = index + "," + index1 + "," + index2;
            console.log(this.invalidInputs);
            console.log(tempValidateItem);
            this.invalidInputs = arrayRemove(
                this.invalidInputs,
                tempValidateItem
            );
        }
    }
})