const footerVue = new Vue({
    el: "#footer",
    data: {
        updateCounter: 0,
        Hints: {}
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
        }
    },
    methods: {
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