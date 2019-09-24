var umk_20190921113111 = function (obj = {}) {
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
    this.id = "umk_20190921113111";
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
umkBlockSummary.umk_20190921113111 = {
    "id": "umk_20190921113111",
    "name": "Sum",
    "description": "Adds two or more numbers, vector, or matrices. All the inputs should of same size.",
    "icon": "<line x1='20' y1='50' x2= '80' y2='50' /><line x1='50' y1='20' x2= '50' y2='80'/>",
    "bg": "#1595C8",
    "fg": "#ffffff",
    "width": 50,
    "height": 50,
    "category": ["basics"],
    "order": 0,
    "keywords": "sum add addition summation",
    "premium": "false"
};