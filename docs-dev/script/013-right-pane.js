const editorVue = new Vue({
    el: "#rp-content",
    data: {
        disp: "graph",
        rpSettings: Object.assign({}, settings)
    },
    mounted: function (){
        this.refreshGraph();
    },
    watch: {
        rpSettings: {
            deep: true,
            handler: function (a) {
                if (!a.gridSize || a.gridSize<=0) a.gridSize = 1;
                settingsVue.$set(settingsVue.$data.stings,'gLinesMinor', a.gLinesMinor);
                settingsVue.$set(settingsVue.$data.stings,'gLinesMajor', a.gLinesMajor);
                settingsVue.$set(settingsVue.$data.stings,'gLinesMega', a.gLinesMega);
                settingsVue.$set(settingsVue.$data.stings,'showOutline', a.showOutline);
                settingsVue.$set(settingsVue.$data.stings,'gridSize', a.gridSize);
                settingsVue.$set(settingsVue.$data.stings,'guidesEnabled', a.guidesEnabled);
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
        }
    }

})