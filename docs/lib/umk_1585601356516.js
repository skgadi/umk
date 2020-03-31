var umk_1585601356516 = function (obj = {}) {
    this.Parameters = {};
    this.Label = function () {};
    this.Icon = function () {
        return {
            html: "<span class='w3-large'>$+$</span>",
            inLabels: new Array(this.TerminalsIn.value).fill("+"),
            outLabels: null,
            splStyle: "shape=triangle;"
        };
    };
    this.Init = function () {};
    this.End = function () {};
    this.Constructor = function () {};
    this.Destructor = function () {};
    this.RunTimeExec = function () {};
    this.Evaluate = function () {
        this.outputs[0] = math.add(this.inputs[0], this.inputs[1]);
        for (var i = 2; i < this.TerminalsIn.value; i++) {
            this.outputs[0] = math.add(this.outputs[0], this.inputs[i]);
        }
    };
    this.Details = function () {
        return "$$y(t) = \\sum_{i=1\}^{" + this.TerminalsIn.value + "}{u_i(t)}$$";
    };
    this.ValidateParams = function () {
        return "OK";
    };
    this.id = "umk_1585601356516";
    this.Colors = {};
    this.TerminalsIn = {
        min: 2,
        max: 100,
        value: 2,
        editable: true
    };
    this.TerminalsOut = {
        min: 1,
        max: 1,
        value: 1,
        editable: false
    };
    for (var prop in obj) {
        if (typeof obj[prop] !== 'function') this[prop] = JSON.parse2(JSON.stringify2(obj[prop]));
    }
}