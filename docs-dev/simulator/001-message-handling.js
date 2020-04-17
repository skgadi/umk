onmessage = function (oEvent) {
    if (typeof oEvent.data === "object") {
        let keys = Object.keys(oEvent.data);
        for (let i = 0; i < keys.length; i++) {
            switch (keys[i]) {
                case "cells":
                    exec.setCells(oEvent.data.cells);
                    break;
                case "updateCell":
                    exec.updCell(oEvent.data.updateCell.v, oEvent.data.updateCell.i);
                    break;
                default:
                    break;
            }
        }
    } else {
        exec.start();
    }
};