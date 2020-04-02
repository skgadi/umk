const varManagerVue = new Vue({
    el: "#varManager",
    data: {
        display: false,
        dVariables: {},
        uVariables: {},
    },
    watch: {
        "display": function () {
            kbshort.suspend(this.display, function (evt) {
                if (evt.keyCode === 27) {
                    varManagerVue.showGUI(false);
                }
            });
        },
    },
    methods: {
        showGUI: function (show = true) {
            this.display = show;
        }
    }
});