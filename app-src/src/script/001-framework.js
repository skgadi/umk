// Executes all the callbacks registered in windResizeCallbacks
window.addEventListener('resize', (event) => {
  windResizeCallbacks.forEach(cBack => {
    cBack(event);
    try {
      mainSystem.refresh();
    } catch (e) {}
  });
});

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

convertAllTheParamsforAModel = function (model) {
  let a = 5;
  let outModel = {};
  let outPrams = {};
  modifyFor = ["Integer", "Real", "Complex"];
  for (let param in model.Parameters) {
    let tempParam = {};
    if (modifyFor.indexOf(model.Parameters[param].Type) >= 0) {
      tempParam["Value"] = getTheParameterValueFromEntry(
        model.Parameters[param].Value
      );
    }
    //console.log(model.Parameters[param]);
    outPrams[param] = Object.assign({},
      model.Parameters[param],
      tempParam
    );
  }
  outModel = Object.assign({}, model, {
    Parameters: outPrams
  });
  return outModel;
};

getTheParameterValueFromEntry = function (inVar) {
  let outArray = new Array();
  //console.log(outArray);
  for (let i = 0; i < inVar.length; i++) {
    let tempRows = new Array(new Array());
    for (let j = 0; j < inVar[0].length; j++) {
      let evalValue;
      try {
        evalValue = parser.evaluate(inVar[i][j]);
      } catch (e) {
        //this is useful in the case of complex multiplied to a variable
        evalValue = inVar[i][j];
      }
      if (math.isNumber(evalValue) || math.isComplex(evalValue)) {
        tempRows[0].push(evalValue);
      }
      if (math.isMatrix(evalValue)) {
        let subMatrix;
        //if (evalValue)
        subMatrix = getTheParameterValueFromEntry(evalValue.toArray()); //evalValue.toArray();
        //console.log(subMatrix);
        for (let k = 0; k < subMatrix.length; k++) {
          if (k === tempRows.length) tempRows.push(new Array());
          for (let l = 0; l < subMatrix[0].length; l++) {
            tempRows[k].push(subMatrix[k][l]);
          }
        }
      }
    }
    tempRows.forEach(function (tempRow) {
      outArray.push(tempRow);
    });
  }
  //console.log(outArray);
  return outArray;
};
