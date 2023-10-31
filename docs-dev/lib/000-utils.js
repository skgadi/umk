const blockUtils = {
  makeIcon: function (bid) {
    return "<div style='min-width:45px;width:100%'>" + GSKGenFuncs.makeSVG(bSummary.blocks[bid].icon, "#00000000", "var(--col-text-0)", "#00000000", "monospace") + "</div>";
  },
  isScalar: function (inMatrix) {
    const gSize = inMatrix.size();
    if (gSize[0] == 1 && gSize[1] == 1) {
      return true;
    } else {
      return false;
    }
  },
  ifAllSameDimMatrices: function (inMatrixArray) {
    const outArray = [];
    for (let i = 0; i < inMatrixArray.length; i++) {
      outArray.push(inMatrixArray[i]._data);
    }
    return this.isAllSameDims(outArray);
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
  "isValidTagName": function (name) {
    if (!!name) {
      return true;
    } else {
      return false;
    }
  },
  "integrate-old": function (inItem, isFirstInEO = true) {
    /*
    //Initialize  the memory
    if (!inItem.mem.length) {
      inItem.mem.push(math.zeros(inItem.iv._data.length, inItem.iv._data[0].length));
    }
    //console.log("hey-->");
    for (let i = inItem.mem.length; i < (intTypes[inItem.it].m + 1); i++) {
      //console.log("-->"+i);
      inItem.mem.unshift(math.zeros(inItem.mem[0]._data.length, inItem.mem[0]._data[0].length));
    }
    */


    function addInps() {
      if (!!inItem.inp) {
        inItem.mem.push(inItem.inp);
      }
      /* else {
              inItem.mem.push(math.zeros(inItem.iv._data.length, inItem.iv._data[0].length));
            }*/
      /*while (inItem.mem.length > (intTypes[inItem.it].m + 1)) {
        inItem.mem.shift();
        //console.log(inItem.mem.length);
      }*/
    }

    function getOuts() {
      //console.log(JSON.stringify(inItem.mem));
      if (!inItem.t) {
        inItem.out[0] = inItem.iv;
      } else {
        if (inItem.mem.length > intTypes[inItem.it].m) {
          let out;
          let h = (inItem.t - inItem.pt[0]) * ((!!intTypes[inItem.it].m) ? intTypes[inItem.it].m : 1);
          //console.log(h);
          for (let i = 0; i < intTypes[inItem.it].c.length; i++) {
            // console.log(JSON.stringify(intTypes[inItem.it].b[i]));
            // console.log(JSON.stringify(intTypes[inItem.it].c[i]));
            // console.log(JSON.stringify(inItem.mem[math.round(intTypes[inItem.it].c[i] * intTypes[inItem.it].m)]));
            if (!i) {
              out = math.dotMultiply(h, math.dotMultiply(intTypes[inItem.it].b[i], inItem.mem[math.round(intTypes[inItem.it].c[i] * intTypes[inItem.it].m)]));
              //console.log(JSON.stringify(out));
            } else {
              out = math.add(out, math.dotMultiply(h, math.dotMultiply(intTypes[inItem.it].b[i], inItem.mem[math.round(intTypes[inItem.it].c[i] * intTypes[inItem.it].m)])));
            }
          }
          inItem.out[0] = math.add(inItem.out[0], out);
          while (inItem.mem.length > 1) {
            inItem.mem.shift();
          }
        } else {
          if (!inItem.out[0]) {
            inItem.out[0] = inItem.iv;
          } // else leave as it is ... don't change output
        }
      }
    }
    // inItem.mem ----> memory
    // inItem.it -----> Integration type
    // inItem.iv -----> Initial value
    // inItem.t ------> Simulation time
    // inItem.inp ----> Input to integrate
    // inItem.out ---> Previous output
    // inItem.pt -----> Previous time
    // inItem.isFr ---> is forward
    if (inItem.isFr[0] === 0) {
      if (!!inItem.inp) {
        inItem.isFr[0] = true;
      } else {
        inItem.isFr[0] = false;
      }
    }
    //console.log(inItem.isFr);
    if (inItem.isFr[0]) {
      addInps();
      getOuts();
    } else {
      getOuts();
      addInps();
    }
    //console.log(h);
    //console.log(inItem.it);
    //console.log(JSON.stringify(inItem.mem));
    //inItem.mem = inItem.mem.slice(-(intTypes[inItem.it].m + 1));
    //console.log(JSON.stringify(inItem.mem));
    //console.log(inItem.mem.length);
    //console.log(intTypes[inItem.it].m + 1);
    //console.log(JSON.stringify(inItem.mem));
    inItem.pt[0] = inItem.t;
    //console.log(inItem.t);
    //console.log(JSON.stringify(inItem.out[0]._data));
    //return out;
  },
  integrate_prev_with_delays: function (inItem, isFirstInEO = true) {
    /*
    //Initialize  the memory
    if (!inItem.mem.length) {
      inItem.mem.push(math.zeros(inItem.iv._data.length, inItem.iv._data[0].length));
    }
    //console.log("hey-->");
    for (let i = inItem.mem.length; i < (intTypes[inItem.it].m + 1); i++) {
      //console.log("-->"+i);
      inItem.mem.unshift(math.zeros(inItem.mem[0]._data.length, inItem.mem[0]._data[0].length));
    }
    */


    function addInps() {
      if (!!inItem.inp) {
        inItem.mem.push(inItem.inp);
      }
      /* else {
              inItem.mem.push(math.zeros(inItem.iv._data.length, inItem.iv._data[0].length));
            }*/
      /*while (inItem.mem.length > (intTypes[inItem.it].m + 1)) {
        inItem.mem.shift();
        //console.log(inItem.mem.length);
      }*/
    }

    function getOuts() {
      //console.log(JSON.stringify(inItem.mem));
      if (!inItem.t) {
        inItem.out[0] = inItem.iv;
      } else {
        if (inItem.mem.length > intTypes[inItem.it].m) {
          let out;
          let h = (inItem.t - inItem.pt[0]) * ((!!intTypes[inItem.it].m) ? intTypes[inItem.it].m : 1);
          //console.log(h);
          for (let i = 0; i < intTypes[inItem.it].c.length; i++) {
            // console.log(JSON.stringify(intTypes[inItem.it].b[i]));
            // console.log(JSON.stringify(intTypes[inItem.it].c[i]));
            // console.log(JSON.stringify(inItem.mem[math.round(intTypes[inItem.it].c[i] * intTypes[inItem.it].m)]));
            if (!i) {
              out = math.dotMultiply(h, math.dotMultiply(intTypes[inItem.it].b[i], inItem.mem[math.round(intTypes[inItem.it].c[i] * intTypes[inItem.it].m)]));
              //console.log(JSON.stringify(out));
            } else {
              out = math.add(out, math.dotMultiply(h, math.dotMultiply(intTypes[inItem.it].b[i], inItem.mem[math.round(intTypes[inItem.it].c[i] * intTypes[inItem.it].m)])));
            }
          }
          inItem.out[0] = math.add(inItem.out[0], out);
          while (inItem.mem.length > 1) {
            inItem.mem.shift();
          }
        } else {
          if (!inItem.out[0]) {
            inItem.out[0] = inItem.iv;
          } // else leave as it is ... don't change output
        }
      }
    }
    // inItem.mem ----> memory
    // inItem.it -----> Integration type
    // inItem.iv -----> Initial value
    // inItem.t ------> Simulation time
    // inItem.inp ----> Input to integrate
    // inItem.out ---> Previous output
    // inItem.pt -----> Previous time
    // inItem.isFr ---> is forward
    /*
    if (inItem.isFr[0] === 0) {
      if (!!inItem.inp) {
        inItem.isFr[0] = true;
      } else {
        inItem.isFr[0] = false;
      }
    }*/
    //console.log(inItem.isFr);
    addInps();
    getOuts();
    /*if (inItem.isFr[0]) {
        addInps();
        getOuts();
      } else {
        getOuts();
        addInps();
      }*/
    //console.log(h);
    //console.log(inItem.it);
    //console.log(JSON.stringify(inItem.mem));
    //inItem.mem = inItem.mem.slice(-(intTypes[inItem.it].m + 1));
    //console.log(JSON.stringify(inItem.mem));
    //console.log(inItem.mem.length);
    //console.log(intTypes[inItem.it].m + 1);
    //console.log(JSON.stringify(inItem.mem));
    inItem.pt[0] = inItem.t;
    //console.log(inItem.t);
    //console.log(JSON.stringify(inItem.out[0]._data));
    //return out;
  },
  integrate: function (inItem, isFirstInEO = true) {
    //console.log("integrate");
    // inItem.mem ----> memory
    // inItem.it -----> Integration type
    // inItem.iv -----> Initial value
    // inItem.t ------> Simulation time
    // inItem.inp ----> Input to integrate
    // inItem.out ---> Previous output
    // inItem.pt -----> Previous time
    // inItem.isFr ---> is forward
    function addInps() {
      if (!!inItem.inp) {
        inItem.mem.unshift(inItem.inp);
        //console.log(JSON.stringify(inItem.mem));
      } else {
        //TODO.....
        //inItem.mem.unshift(math.zeros(inItem.iv._data.length, inItem.iv._data[0].length));
        if (inItem.t === 0 && inItem.mem.length === 0) {
          inItem.mem.unshift(math.zeros(inItem.iv._data.length, inItem.iv._data[0].length));
        }
      }
    }

    function getOuts() {
      //console.log(JSON.stringify(inItem.mem));
      if (!inItem.t) {
        inItem.out[0] = inItem.iv;
      } else {
        if (inItem.mem.length > intTypes[inItem.it].m) {
          let out;
          let h = (inItem.t - inItem.pt[0]) * ((!!intTypes[inItem.it].m) ? intTypes[inItem.it].m : 1);
          //console.log(h);
          for (let i = 0; i < intTypes[inItem.it].a.length; i++) {
            let calcRes = math.dotMultiply(h, math.dotMultiply(intTypes[inItem.it].a[i], inItem.mem[i]));
            if (!i) {
              out = calcRes;
            } else {
              out = math.add(out, calcRes);
            }
          }
          inItem.out[0] = math.add(inItem.out[0], out);
          while (inItem.mem.length > 1) {
            inItem.mem.pop();
          }
        } else {
          if (!inItem.out[0]) {
            inItem.out[0] = inItem.iv;
          } // else leave as it is ... don't change output
        }
      }
    }
    addInps();
    getOuts();
    inItem.pt[0] = inItem.t;
  }
}