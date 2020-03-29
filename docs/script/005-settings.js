const settingsVue = new Vue({
    el: "#settings",
    data: {
        settings: settings,
        display: false
    },
    watch: {
        "settings":{
            deep: true,
            handler: function () {
                setCookie("settings", JSON.stringify2(this.settings));
            }
        },
        "settings.theme": {
            handler: function () {
                document.getElementsByTagName('html')[0].className = settings.theme;
            }
        }
    },
    methods: {
        showGUI: function (show=true) {
            this.display = show;
        }
    }
});