function updateMathJax() {
  MathJax.typesetPromise();
  //MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

const TeXTools = {
  avoidItems: [{
    js: "Infinity",
    tex: "\\infty"
  }],
  getTeXDisp: function (val, dec = 4) {
    return "$" + this.getTeXInline(val, dec) + "$";
  },
  getTeXInline: function (val, dec = 4) {
    return "$" + this.makeMatrix(val, dec) + "$";
  },
  makeMatrix: function (inArray, dec = 4) {
    if (inArray.length === 1 && inArray[0].length === 1) {
      return inArray[0][0];
    }
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