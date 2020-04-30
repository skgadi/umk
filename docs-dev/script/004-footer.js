const footerVue = new Vue({
    el: "#footer",
    data: {
        updateCounter: 0,
        Hints: {},
        mode: "mDesign",
        totalTime: 5,
        presTime: 0
    },
    /*watch: {
        Hints: {
            deep: true,
            handler: function () {
                this.updateCounter++;
            }
        }
    },*/
    computed: {
        textForHint: function () {
            this.updateCounter;
            if (!!Object.keys(this.Hints).length)
                return this.Hints[Object.keys(this.Hints)[Object.keys(this.Hints).length - 1]];
            else return "";
        },
        status: function () {
            let outStr = GUIText[settings.lang][this.mode];
            switch (this.mode) {
                case "mSim":
                    return outStr = "<i class='fa-fw fas fa-play'></i>&nbsp;" + outStr;
                case "mSimPause":
                    return outStr = "<i class='fa-fw fas fa-pause'></i>&nbsp;" + outStr;
                default:
                    return outStr = "<i class='fa-fw fas fa-drafting-compass'></i>&nbsp;" + outStr;
            }
        },
        progress: function () {
            let outStr = "";
            if (this.totalTime < 0) {
                outStr = "<i class='fas fa-infinity fa-fw'></i>"
            } else {
                outStr = this.totalTime;
            }
            if (this.mode === "mDesign") {
                return "- / " + outStr;
            } else {
                if (this.totalTime < 0) {
                    return math.round(this.presTime * 1e6) / 1e6 + " / " + outStr;
                } else {
                    return math.round(this.presTime * 1e6) / 1e6 + " / " + outStr + " = " + math.round(this.presTime / this.totalTime * 100, 2) + "%";
                }
            }
        }
    },
    methods: {
        refreshFooter: function () {
            this.updateCounter++;
        },
        addHint: function (txt) {
            let key = Date.now();
            this.$set(this.Hints, key, txt);
            return key;
        },
        removeHint: function (hKey) {
            delete(this.Hints[hKey]);
            this.updateCounter++;
        }
    }

});