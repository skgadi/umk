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

const TeX = {
  avoidItems: [{
    js: "Infinity",
    tex: "\\infty"
  }],
  removeAvoidedItems: function (inString) {
    outString = inString;
    for (let i = 0; i < this.avoidItems.length; i++) {
      outString = outString.replace(this.avoidItems[i].js, this.avoidItems[i].tex)
    }
    return outString;
  },
  frmStr: function (val, dec = 4) {
    return math.parse(val).toTex(dec);
    //return this.removeAvoidedItems(math.parse(val).toTex(dec));
  },
  frmMathJS: function (val, dec = 4) {
    return math.parse(val.toString()).toTex(dec);
  },
  frmArray: function (inArray, dec = 4, forceBrackets = false) { //used to be makeMatrix
    if (!forceBrackets && inArray.length === 1 && inArray[0].length === 1) {
      return math.parse(inArray[0][0]).toTex();
    }
    return math.parse("[" + inArray.map((a) => {
      return "[" + a.join(",") + "]";
    }).join(",") + "]").toTex(dec);
  },
  /*
  mathMatToTex: function (val, dec = 4) {
    return "$$" + this.removeAvoidedItems(math.parse(val).toTex(dec)) + "$$";
  },
  */
  getTeXDisp: function (val, dec = 4) {
    return "$" + this.getTeXInline(val, dec) + "$";
  },
  getTeXInline: function (val, dec = 4) {
    return "$" + this.makeMatrix(val, dec) + "$";
  },
  prepInline: function (inp) {
    return "$" + inp + "$";
  },
  prepDisp: function (inp) {
    return "$$" + inp + "$$";
  },
  prepSetWithRange: function (min = 1, max = 1) {
    if (max < min) {
      let temp = max;
      max = min;
      min = temp;
    }
    if (min === max) {
      return "\\{" + min + "\\}";
    }
    if ((min === -Infinity) && (max === Infinity)) {
      return "\\{-\\infty,\\dots, -1, 0, 1,\\dots,\\infty\\}";
    }
    if (min === -Infinity) {
      return "\\{-\\infty,\\dots," + (max - 2) + "," + (max - 1) + "," + max + "\\}"
    }
    if (max === Infinity) {
      return "\\{" + min + "," + (min - 1) + "," + (min - 2) + "\\dots,\\infty\\}"
    }
    let diff = max - min;
    let textOut = "\\{";
    if (diff < 5) {
      let isFirst = true;
      for (let i = min; i < (max + 1); i++) {
        if (!isFirst) {
          textOut += ",";
        } else {
          isFirst = false;
        }
        textOut += i;
      }
      return textOut + "\\}";
    } else {
      let rSide = max + "\\}";
      let lSide = "\\{" + min + ",";
      if (max > 3) {
        rSide = "\\dots," + rSide;
        if (min <= 0) {
          rSide = "0,1," + rSide;
          if (min < -3) {
            lSide += "\\dots,-1,";
          } else {
            if (min < -2) {
              lSide += "-2,";
            }
            if (min < -1) {
              lSide += "-1,";
            }
          }
        } else {
          lSide += (min + 1) + "," + (min + 2) + ",";
        }
      } else {
        if (min < -3) {
          lSide += "\\dots,-1,";
          if (max > 2) {
            rSide = "2," + rSide;
          }
          if (max > 1) {
            rSide = "1," + rSide;
          }
          if (max > 0) {
            rSide = "0," + rSide;
          }
        } else {
          for (let i = (min + 1); i < max; i++) {
            lSide += i + ",";
          }
        }
      }
      return lSide + rSide;
    }
  }
};