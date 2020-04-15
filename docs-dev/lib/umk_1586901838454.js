const umk_1586901838454 = function (obj = {}) {
    this.Parameters = {};
    this.Label = function () {};
    this.Icon = function () {
        return {
            html: '$0$',
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
    this.Evaluate = function () {};
    this.Details = function () {
        return "";
    };
    this.ValidateParams = function () {
        return "OK";
    };
    this.id = "umk_1586901838454";
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