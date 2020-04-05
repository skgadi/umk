cPolicyVue = new Vue({
    el: "#cookies-policy",
    data: {
        display: false
    },
    watch: {
        "display": function () {
            kbshort.suspend(this.display, function (evt) {});
        }
    },
    mounted: function () {
        this.checkAcceptance();
    },
    methods: {
        acceptBtn: function () {
            setCookie("cpAccepted", "true");
            this.checkAcceptance();
        },
        checkAcceptance: function () {
            if (getCookie("cpAccepted") !== "true") {
                this.display = true;
            } else {
                this.display = false;
            }
        }
    }
});