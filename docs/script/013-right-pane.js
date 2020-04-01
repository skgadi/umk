const editorVue = new Vue({
    el: "#rp-content",
    data: {
        disp: "graph",
        rpSettings: Object.assign({}, settings)
    },
    watch: {
        rpSettings: {
            deep: true,
            handler: function (a) {
                settingsVue.$set(settingsVue.$data.stings,'gLinesMinor', a.gLinesMinor);
                settingsVue.$set(settingsVue.$data.stings,'gLinesMajor', a.gLinesMajor);
                settingsVue.$set(settingsVue.$data.stings,'gLinesMega', a.gLinesMega);
            }
        }
    }

})