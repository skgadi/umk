const blockUtils = {
  makeIcon: function (bid) {
    return "<div style='min-width:45px;'>" + GSKGenFuncs.makeSVG(bSummary.blocks[bid].icon, "#00000000", "var(--col-text-0)", "#00000000") + "</div>";
  },
  isAllSameDims: function (inAry) {
    //console.log(inAry);
    for (let i = 0; i < (inAry.length - 1); i++) {
      if (inAry[i].length !== inAry[i + 1].length) {
        return false;
      }
      if (inAry[i][0].length !== inAry[i + 1][0].length) {
        return false;
      }
    }
    return true;
  },
  cmpAsnLimit: function (compare, lowerLimit, upperLimit) {
    return math.add(math.dotMultiply(compare, lowerLimit), math.dotMultiply(math.not(compare), upperLimit));
  },
  bldTT: function (arr) {
    let out = "<table>";
    out += "<tr>";
    for (let i = 1; i < arr[0].length; i++) {
      out += "<td>";
      if ((i === 1) && (arr[0].length === 2)) {
        out += "$u_{i,j}(t)$";
      } else {
        out += "$u_{" + i + "_{i,j}}(t)$";
      }
      out += "</td>";
    }
    out += "<td>";
    out += "$y_{i,j}(t)$";
    out += "</td>";
    out += "</tr>";
    for (let i = 0; i < arr.length; i++) {
      out += "<tr>";
      for (let j = 0; j < arr[0].length; j++) {
        out += "<td>";
        out += arr[i][j];
        out += "</td>";
      }
      out += "</tr>";
    }
    out += "</table>";
    return out;
  }
}