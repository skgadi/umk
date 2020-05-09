//Handles the umk_model 's value
const oldEncode = mxCodec.prototype.encode;
mxCodec.prototype.encode = function (obj) {
  /*mxLog.show();
  mxLog.debug('mxCodec.encode: obj=' + mxUtils.getFunctionName(obj.constructor));*/
  if (obj.constructor.name === "Object" || obj.constructor.name.search(/umk_\d{13}/g) >= 0) {
    //console.log(obj.constructor.name);
    return;
  } else {
    let xmlOut = oldEncode.apply(this, arguments);
    if (!!xmlOut && !!xmlOut.getAttribute('style') && xmlOut.getAttribute('style').search('umk_model') >= 0) {
      xmlOut.setAttribute("value", JSON.stringify2(obj.value));
    }
    return xmlOut;
  }


  /*
  console.log(obj.constructor.name);
  let a = oldEncode.apply(this, arguments);
  //console.log(a);
  return a;
  return oldEncode.apply(this, arguments);
  */
};

/*
const mxCodecEncodeCell = mxCodec.prototype.encodeCell;
mxCodec.prototype.encodeCell = function(cell,node,includeChildren	) {
  console.log(arguments);
  if (cell.style && cell.style.search('umk_model')>=0) {
    arguments[3] = false;
  }
  mxCodecEncodeCell.apply(this, arguments);
}
*/