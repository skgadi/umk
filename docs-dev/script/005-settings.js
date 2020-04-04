const settingsVue = new Vue({
    el: "#settings",
    data: {
        stings: settings,
        display: false
    },
    updated: function () {
        this.updateHideBtnText();
    },
    watch: {
        "display": function () {
            kbshort.suspend(this.display, function(evt){
                if (evt.keyCode === 27) {
                    settingsVue.showGUI(false);   
                }
            });
        },
        "stings":{
            deep: true,
            handler: function () {
                //console.log(this.stings);
                setCookie("settings", JSON.stringify2(this.stings));
            }
        },
        "stings.lang": {
            handler: function () {
                menuVue.update();
            }
        },
        "stings.theme": {
            handler: function () {
                document.getElementsByTagName('html')[0].className = this.stings.theme;
            }
        }
    },
    methods: {
        showGUI: function (show=true) {
            this.display = show;
        },
        updateHideBtnText: function () {
            document.getElementById ("hide-left-text").innerText = GUIText[this.stings.lang].hide;
            document.getElementById ("hide-right-text").innerText = GUIText[this.stings.lang].hide;    
        }
    }
});

