/*function updateMathJax() {
  mathEqn.update();
  //MathJax.typesetPromise();
  //MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}*/
const mathEqn = {
  updInProgress = false,
  updNow = function () {
    MathJax.typesetPromise();
    this.updInProgress = false;
  },
  update: function () {
    if (!this.updInProgress) {
      this.updInProgress = true;
      setTimeout(function () {
        mathEqn.updNow();
      }, 50);
    } else {
      //console.log("blocked math update");
    }
  }
}

const TeXTools = {
  avoidItems: [{
    js: "Infinity",
    tex: "\\infty"
  }],
  strToTex: function (val, dec=4) {
    return this.removeAvoidedItems(math.parse(val).toTex(dec));
  },
  mathMatToTex: function (val, dec = 4) {
    return "$$" + this.removeAvoidedItems(math.parse(val).toTex(dec)) + "$$";
  },
  getTeXDisp: function (val, dec = 4) {
    return "$" + this.getTeXInline(val, dec) + "$";
  },
  getTeXInline: function (val, dec = 4) {
    return "$" + this.makeMatrix(val, dec) + "$";
  },
  makeMatrix: function (inArray, dec = 4) {
    if (inArray.length === 1 && inArray[0].length === 1) {
      return math.parse(inArray[0][0]).toTex();
    }
    return math.parse("[" + inArray.map((a) => {
      return "[" + a.join(",") + "]";
    }).join(",") + "]").toTex(dec);

    return math.parse(math.matrix(inArray).toString()).toTex(dec).replace(/"/g, "");
    //return this.removeAvoidedItems(math.parse((math.squeeze(math.matrix(val)).toString())).toTex(dec));
  },
  removeAvoidedItems: function (inString) {
    outString = inString;
    for (let i = 0; i < this.avoidItems.length; i++) {
      outString = outString.replace(this.avoidItems[i].js, this.avoidItems[i].tex)
    }
    return outString;
  }
};