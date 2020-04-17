const exec = {
    cells: [],
    h: 5000,
    setCells: function (vals) {
        this.cells = vals.map((ele) => {
            eval("var tempModel = new " + ele.id + "(ele);");
            return tempModel;
        });
    },
    updCell: function (value, index) {
        eval("var tempModel = new " + value.id + "(value);");
        this.cells[index] = tempModel;
    },
    start: function () {
        setInterval(function () {
            console.log(exec);
        }, this.h);
    }
};