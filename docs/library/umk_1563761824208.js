var umk_1563761824208 = function(obj={}) {
    this.Category = "basics";
    this.Name = "Sum";
    this.Description = "Adds two or more numbers, vector, or matrices. All the inputs should of same size.";
    this.Parameters = [];
    this.bid = "1563761824208";
    this.Colors = {
        "bg": "#1595C8",
        "fg": "#0D7CA7"
    };
    this.TerminalsIn = {
        "editable": true,
        "max": 100,
        "min": 2,
        "value": 2
    };
    this.TerminalsOut = {
        "editable": false,
        "max": 1,
        "min": 1,
        "value": 1
    };
    for (var prop in obj) {
        if (typeof obj[prop] !== 'function')
            this[prop] = JSON.parse2(JSON.stringify2(obj[prop]));
    }
}
