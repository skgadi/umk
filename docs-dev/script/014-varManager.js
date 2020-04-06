const varManagerVue = new Vue({
    el: "#varManager",
    data: {
        constants: ["e", "E", "i", "Infinity", "LN2", "LN10", "LOG2E", "LOG10E", "phi", "pi", "PI", "SQRT1_2", "SQRT2", "tau"],
        keywords: ["NaN", "null", "undefined", "mod", "to", "in", "and", "xor", "or", "not", "end"],
        display: false,
        variables: {},
        showAddVar: false
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
        },
        getConst: function (Constant) {
            if (Constant === "Infinity") return "\\infty";
            if (math.typeOf(math.evaluate(Constant)) === "number") return math.evaluate(Constant);
            else return Constant;
        }
    }
});