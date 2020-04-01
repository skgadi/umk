const editorVue = new Vue({
    el: "#rp-content",
    data: {
        disp: "graph",
        rpSettings: Object.assign({}, settings)
    },
    mounted: function (){
        this.updateGrids();
    },
    watch: {
        rpSettings: {
            deep: true,
            handler: function (a) {
                settingsVue.$set(settingsVue.$data.stings,'gLinesMinor', a.gLinesMinor);
                settingsVue.$set(settingsVue.$data.stings,'gLinesMajor', a.gLinesMajor);
                settingsVue.$set(settingsVue.$data.stings,'gLinesMega', a.gLinesMega);
                this.updateGrids();
            }
        }
    },
    methods: {
        updateGrids() {
            mainSystem.graph.grid.minorStroke.show = this.rpSettings.gLinesMinor;
            mainSystem.graph.grid.majorStroke.show = this.rpSettings.gLinesMajor;
            mainSystem.graph.grid.megaStroke.show = this.rpSettings.gLinesMega;
            mainSystem.graph.grid.repaintGrid();
        }
    }

})