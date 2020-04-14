const umk_1586738484106 = function (obj = {}) {
    this.Parameters = {};
    this.Label = function () {};
    this.Icon = function () {
        return {
            html: '<div class="gen-btn"><i class="fas fa-fw fa-external-link-alt"></i></div>',
            inLabels: null,
            outLabels: null,
            splStyle: null
        };
    };
    this.Init = function () {};
    this.End = function () {};
    this.Constructor = function () {};
    this.Destructor = function () {};
    this.RunTimeExec = function () {};
    this.Evaluate = function () {
        this.outputs[0] = math.add(this.inputs[0], this.inputs[1]);
        for (let i = 2; i < this.TerminalsIn.value; i++) {
            this.outputs[0] = math.add(this.outputs[0], this.inputs[i]);
        }
    };
    this.Details = function () {
        return "$$y(t) = \\sum_{i=1\}^{" + this.TerminalsIn.value + "}{u_i(t)}$$";
    };
    this.ValidateParams = function () {
        return "OK";
    };
    this.id = "umk_1586738484106";
    this.Colors = {};
    this.TerminalsIn = {
        min: 1,
        max: 1,
        value: 1,
        editable: false
    };
    this.TerminalsOut = {
        min: 0,
        max: 0,
        value: 0,
        editable: false
    };
    for (let prop in obj) {
        if (typeof obj[prop] !== 'function') this[prop] = JSON.parse2(JSON.stringify2(obj[prop]));
    }
}