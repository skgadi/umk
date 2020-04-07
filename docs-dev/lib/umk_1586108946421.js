const umk_1586108946421 = function (obj = {}) {
    this.Parameters = {
        "constant": {
            "Name": {"en-us":"Constant $(C)$","es-mx":"Constante $(C)$"},
            "Dimension": "Matrix",
            "Type": "Complex",
            "Value": [
                [1]
            ]
        }
    };
    this.Label = function () {};
    this.Icon = function () {
        return {
            html: TeXTools.getTeXInline(this.Parameters.constant.Value),
            inLabels: null,
            outLabels: null,
            splStyle: ""
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
    this.id = "umk_1586108946421";
    this.Colors = {};
    this.TerminalsIn = {
        "editable": false,
        "max": 0,
        "min": 0,
        "value": 0
    };
    this.TerminalsOut = {
        "editable": false,
        "max": 1,
        "min": 1,
        "value": 1
    };
    for (let prop in obj) {
        if (typeof obj[prop] !== 'function') this[prop] = JSON.parse2(JSON.stringify2(obj[prop]));
    }
}