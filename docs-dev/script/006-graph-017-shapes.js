(()=>{
  // fromTag
  mxUtils.extend(fromTag, mxCylinder);
  function fromTag() {
    mxShape.call(this);
  }
  fromTag.prototype.redrawPath = function (path, x, y, w, h, isForeground) {
    // scale holds the shape what we design through out graph
    const dy = this.scale;
    const dx = this.scale;
    path.begin();
    path.moveTo(0,h/2);
    path.lineTo(0.25*w,0);
    path.lineTo(w,0);
    path.lineTo(w,h);
    path.lineTo(0.25*w,h);
    path.lineTo(0,h/2);
  };
  mxCellRenderer.registerShape('fromTag', fromTag);

  // toTag
  mxUtils.extend(toTag, mxCylinder);
  function toTag() {
    mxShape.call(this);
  }
  toTag.prototype.redrawPath = function (path, x, y, w, h, isForeground) {
    // scale holds the shape what we design through out graph
    const dy = this.scale;
    const dx = this.scale;
    path.begin();
    path.moveTo(w,h/2);
    path.lineTo(0.75*w,0);
    path.lineTo(0,0);
    path.lineTo(0,h);
    path.lineTo(0.75*w,h);
    path.lineTo(w,h/2);
  };
  mxCellRenderer.registerShape('toTag', toTag);


})();