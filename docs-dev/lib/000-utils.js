const blockUtils = {
  makeIcon: function (bid) {
    return "<div style='min-width:45px;'>" + GSKGenFuncs.makeSVG(bSummary.blocks[bid].icon, "#00000000", "var(--col-text-0)", "#00000000", "monospace") + "</div>";
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
  cmpAsnLimit: function (compare, satisfying, otherwise) {
    return compare.map(function (element, index) {
      if (element) {
        return satisfying._data[index[0]][index[1]];
      } else {
        return otherwise._data[index[0]][index[1]];
      }
    });
    //return math.add(math.dotMultiply(compare, lowerLimit), math.dotMultiply(math.not(compare), upperLimit));
  },
  bldTT: function (arr) {
    let out = "<table class='simple-border'>";
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
  },
  integrate: function (inItem, isFirstInEO = true) {
    // inItem.mem ----> memory
    // inItem.it -----> Integration type
    // inItem.iv -----> Initial value
    // inItem.t ------> Simulation time
    // inItem.inp ----> Input to integrate
    // inItem.out ---> Previous output
    // inItem.pt -----> Previous time
    let h = inItem.t - inItem.pt[0];
    //console.log(h);
    //console.log(inItem.it);
    if (isFirstInEO && !inItem.t) {
      inItem.mem.push(math.zeros(inItem.iv._data.length, inItem.iv._data[0].length));
    } else {
      inItem.mem.push(inItem.inp);
    }
    //console.log(JSON.stringify(inItem.mem));
    while (inItem.mem.length > (intTypes[inItem.it].m + 1)) {
      inItem.mem.shift();
      //console.log(inItem.mem.length);
    }
    //inItem.mem = inItem.mem.slice(-(intTypes[inItem.it].m + 1));
    //console.log(JSON.stringify(inItem.mem));
    //console.log(inItem.mem.length);
    //console.log(intTypes[inItem.it].m + 1);
    for (let i = inItem.mem.length; i < (intTypes[inItem.it].m + 1); i++) {
      //console.log("-->"+i);
      inItem.mem.unshift(math.zeros(inItem.mem[0]._data.length, inItem.mem[0]._data[0].length));
    }
    //console.log(JSON.stringify(inItem.mem));
    let out;
    for (let i = 0; i < intTypes[inItem.it].c.length; i++) {
      if (!i) {
        out = math.dotMultiply((inItem.t - inItem.pt[0]), math.dotMultiply(intTypes[inItem.it].b[i], inItem.mem[math.round(intTypes[inItem.it].c[i] * intTypes[inItem.it].m)]));
      } else {
        out = math.add(out, math.dotMultiply((inItem.t - inItem.pt[0]), math.dotMultiply(intTypes[inItem.it].b[i], inItem.mem[math.round(intTypes[inItem.it].c[i] * intTypes[inItem.it].m)])));
      }
    }
    if (!inItem.out[0]) {
      if (isFirstInEO && !inItem.t) {
        inItem.out[0] = math.add(out, inItem.iv);
      } else {
        inItem.out[0] = out;
      }
    } else {
      inItem.out[0] = math.add(out, inItem.out[0]);
    }
    inItem.pt[0] = inItem.t;
    //console.log(inItem.t);
    //console.log(JSON.stringify(inItem.out[0]._data));
    //return out;
  }
}