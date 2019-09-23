var umk_20190921113111 = function (obj = {}) {
    this.Parameters = {};
    this.Label = function () {};
    this.Icon = function () {};
    this.Init = function () {};
    this.End = function () {};
    this.Constructor = function () {};
    this.Destructor = function () {};
    this.RunTimeExec = function () {};
    this.Evaluate = function () {};
    this.Details = function () {};
    this.ValidateParams = function () {};
    this.id = "umk_20190921113111";
    this.Colors = {};
    this.TerminalsIn = {};
    this.TerminalsOut = {};
    for (var prop in obj) {
        if (typeof obj[prop] !== 'function') this[prop] = JSON.parse2(JSON.stringify2(obj[prop]));
    }
}
umkBlockSummary.push({
    "id": "umk_20190921113111",
    "name": "Sum",
    "description": "Adds two or more numbers, vector, or matrices. All the inputs should of same size.",
    "icon": "<line x1='20' y1='50' x2= '80' y2='50' /><line x1='50' y1='20' x2= '50' y2='80'/>",
    "bg": "#1595C8",
    "fg": "#ffffff",
    "width": "50",
    "height": "50",
    "category": ["basics"],
    "order": "0",
    "keywords": "sum add addition summation",
    "premium": "false"
});