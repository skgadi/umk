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
    if (!!TheCellStyle && (TheCellStyle.search("umk_output") >= 0)) {
      if (!!this.edges && !!this.edges.length) {
        if (TheCellStyle.search("umk_output_connected") < 0) {
          TheCellStyle = TheCellStyle.replace("umk_output", "umk_output_connected");
        }
      } else {
        TheCellStyle = TheCellStyle.replace("umk_output_connected", "umk_output");
      }
    } else
    if (!!TheCellStyle && (TheCellStyle.search("umk_input") >= 0)) {
      if (!!this.edges && !!this.edges.length) {
        if (TheCellStyle.search("umk_input_connected") < 0) {
          TheCellStyle = TheCellStyle.replace("umk_input", "umk_input_connected");
        }
      } else {
        TheCellStyle = TheCellStyle.replace("umk_input_connected", "umk_input");
      }
    }
    return TheCellStyle;
  }

  //Adjust arrow size
  const cellGeometry = mxCell.prototype.getGeometry;
  mxCell.prototype.getGeometry = function () {
    const TheCellGeometry = cellGeometry.apply(this, arguments);
    const TheCellStyle = this.getStyle();
    let TheGeometryTemplate;
    if (!!TheCellStyle) {
      if (TheCellStyle.search("umk_output_connected") >= 0) {
        TheGeometryTemplate = "umk_output_connected";
      } else
      if (TheCellStyle.search("umk_input_connected") >= 0) {
        TheGeometryTemplate = "umk_input_connected";
      } else
      if (TheCellStyle.search("umk_output") >= 0) {
        TheGeometryTemplate = "umk_output";
      } else
      if (TheCellStyle.search("umk_input") >= 0) {
        TheGeometryTemplate = "umk_input";
      }
    }
    if (!!TheGeometryTemplate) {
      TheGeometryTemplate = GeometryTemplates[TheGeometryTemplate];
      if (!!TheCellGeometry) {
        //console.log(TheGeometryTemplate);
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