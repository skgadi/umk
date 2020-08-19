(() => {
  const GeometryTemplates = {
    "umk_input": {
      h: 12,
      w: 12,
      o: {
        x: -12,
        y: -6
      }
    },
    "umk_input_connected": {
      h: 6,
      w: 11,
      o: {
        x: -12,
        y: -3
      }
    },
    "umk_output": {
      h: 12,
      w: 12,
      o: {
        x: 0,
        y: -6
      }
    },
    "umk_output_connected": {
      h: 2,
      w: 12,
      o: {
        x: 0,
        y: -1
      }
    }
  };
  //Adjust arrow symbol
  const cellStyle = mxCell.prototype.getStyle;
  mxCell.prototype.getStyle = function () {
    let TheCellStyle = cellStyle.apply(this, arguments);
    if (!!TheCellStyle && (TheCellStyle.search("umk_output")>=0) && !!this.edges && !!this.edges.length) {
      TheCellStyle = TheCellStyle.replace("umk_output", "umk_output_connected");
    } else if (!!TheCellStyle && (TheCellStyle.search("umk_input")>=0) && !!this.edges && !!this.edges.length){
      TheCellStyle = TheCellStyle.replace("umk_input", "umk_input_connected");
    }
    return TheCellStyle;
  }

  //Adjust arrow size
  const cellGeometry = mxCell.prototype.getGeometry;
  mxCell.prototype.getGeometry = function () {
    const TheCellGeometry = cellGeometry.apply(this, arguments);
    const TheGeometryTemplate = GeometryTemplates[this.getStyle()];
    if (!!TheGeometryTemplate) {
      if (!!TheCellGeometry) {
        TheCellGeometry.height = TheGeometryTemplate.h;
        TheCellGeometry.width = TheGeometryTemplate.w;
        if (!!TheCellGeometry.offset) {
          TheCellGeometry.offset.x = TheGeometryTemplate.o.x;
          TheCellGeometry.offset.y = TheGeometryTemplate.o.y;
        }
      }
    }
    return TheCellGeometry;
  }

})();