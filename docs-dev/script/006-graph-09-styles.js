((graph) => {

  mxConstants.OUTLINE_COLOR = 'var(--col-border-1)';
  mxConstants.OUTLINE_HANDLE_STROKECOLOR = 'var(--col-border-1)';
  mxConstants.OUTLINE_HANDLE_FILLCOLOR = 'var(--col-background-2)';
  //mxConstants.OUTLINE_STROKEWIDTH = 3;
  //mxConstants.LABEL_HANDLE_SIZE = 10;
  mxConstants.STYLE_BACKGROUND_OUTLINE = 'var(--col-background-1)';
  mxConstants.HIGHLIGHT_COLOR = 'var(--col-border-1)';
  mxConstants.GUIDE_COLOR = 'var(--col-text-1)';
  //mxConstants.GUIDE_STROKEWIDTH = 3;
  mxConstants.HANDLE_STROKECOLOR = 'var(--col-border-1)';
  mxConstants.HANDLE_FILLCOLOR = 'var(--col-background-2)';
  //mxConstants.HANDLE_SIZE = 10;
  mxConstants.EDGE_SELECTION_COLOR = 'var(--col-border-1)';
  //mxConstants.EDGE_SELECTION_STROKEWIDTH = 3;
  mxConstants.VERTEX_SELECTION_COLOR = 'var(--col-border-1)';
  //mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;
  mxConstants.DROP_TARGET_COLOR = 'var(--col-border-1)';

  mxConstants.STYLE_FONTFAMILY = "Univers 57 Condensed";
  mxConstants.DEFAULT_FONTFAMILY = "Univers 57 Condensed";
  mxConstants.DEFAULT_FONTSIZE = "15";
  mxConstants.SHADOWCOLOR = "var(--col-text-0 )";
  mxConstants.SHADOW_OFFSET_X = 3;
  mxConstants.SHADOW_OFFSET_Y = 3;
  mxConstants.SHADOW_OPACITY = 0.15;

  /*mxConstants.DEFAULT_HOTSPOT = 1;
  mxConstants.MIN_HOTSPOT_SIZE = 1000;*/



  graph.dropEnabled = true;
  graph.setRecursiveResize(false);

  mxGraphHandler.prototype.guidesEnabled = true; //enables guides
  // Alt disables guides
  mxGuide.prototype.isEnabledForEvent = function (evt) {
    return !mxEvent.isAltDown(evt);
  };
  mxEdgeHandler.prototype.snapToTerminals = true; //Enables snapping waypoints to terminals
  //General settings
  graph.constrainChildren = false; // this won't let the the blocks inside the groups to not change size when groups are resized
  graph.htmlLabels = true;



  const vStyle = graph.getStylesheet().getDefaultVertexStyle();
  const eStyle = graph.getStylesheet().getDefaultEdgeStyle();
  vStyle["shadow"] = false;
  //vStyle["whiteSpace"] = "wrap";
  vStyle["arcSize"] = 10;
  vStyle["absoluteArcSize"] = 1;
  vStyle["rounded"] = "1";
  vStyle["strokeWidth"] = 0;
  eStyle["edgeStyle"] = "wireEdgeStyle"; //"wireEdgeStyle"; //"orthogonalEdgeStyle";
  eStyle["strokeWidth"] = 1;
  //eStyle["movable"] = "0";
  eStyle["rounded"] = "0";
  //eStyle["targetJettySize"] = 25;
  eStyle[mxConstants.STYLE_JETTY_SIZE] = 50;
  eStyle["shadow"] = false;
  eStyle["fontColor"] = "var(--col-text-0)";
  eStyle["verticalAlign"] = "top";
  //eStyle["overflow"] = "width";
  eStyle["align"] = "right";
  eStyle["strokeColor"] = "var(--col-text-0)";
  eStyle['startSize'] = 7;
  eStyle['endSize'] = 7;
  eStyle['arcSize'] = 10;
  mxConstants.LINE_ARCSIZE = 5;
  delete eStyle['endArrow'];
  //eStyle["endArrow"] = "none";


  //Shapes for in and out arrows
  function inArrowShape() {};
  inArrowShape.prototype = new mxCylinder();
  inArrowShape.prototype.constructor = inArrowShape;
  inArrowShape.prototype.redrawPath = function (path, x, y, w, h, isForeground) {
    if (isForeground) {
      path.moveTo(0, h / 2);
      path.lineTo(w, h / 2);
      path.moveTo(3 * w / 4, h);
      path.lineTo(w, h / 2);
      path.lineTo(3 * w / 4, 0);
      path.end();
    }
  };
  mxCellRenderer.registerShape('inArrow', inArrowShape);

  function inArrowShapeConnected() {};
  inArrowShapeConnected.prototype = new mxCylinder();
  inArrowShapeConnected.prototype.constructor = inArrowShapeConnected;
  inArrowShapeConnected.prototype.redrawPath = function (path, x, y, w, h, isForeground) {
    if (isForeground) {
      path.moveTo(0, h / 2);
      path.lineTo(3 * w / 4, h / 2);
      path.lineTo(0.675 * w, h);
      path.lineTo(w, h / 2);
      path.lineTo(0.675 * w, 0);
      path.lineTo(3 * w / 4, h / 2);
      path.fillAndStroke();
      path.end();
    }
  };
  mxCellRenderer.registerShape('inArrowConnected', inArrowShapeConnected);


  function outArrowShape() {};
  outArrowShape.prototype = new mxCylinder();
  outArrowShape.prototype.constructor = outArrowShape;
  outArrowShape.prototype.redrawPath = function (path, x, y, w, h, isForeground) {
    if (isForeground) {
      path.moveTo(0, h / 2);
      path.lineTo(w, h / 2);
      path.end();
    }
  };
  mxCellRenderer.registerShape('outArrow', outArrowShape);


  function outArrowConnectedShape() {};
  outArrowConnectedShape.prototype = new mxCylinder();
  outArrowConnectedShape.prototype.constructor = outArrowConnectedShape;
  outArrowConnectedShape.prototype.redrawPath = function (path, x, y, w, h, isForeground) {
    if (isForeground) {
      path.moveTo(0, h / 2);
      //path.lineTo(w, h / 2);
      path.end();
    }
  };
  mxCellRenderer.registerShape('outArrowConnected', outArrowConnectedShape);



  //Stylesheets
  let style = new Object();
  style.foldable = 0;
  style.overflow = "hidden";
  style.verticalAlign = "middle";
  style.fontColor = "var(--col-text-1)";
  style.fillColor = "var(--col-background-2)";
  //style.gradientColor = "var(--col-background-1)";
  //style.gradientDirection = mxConstants["DIRECTION_SOUTH"]; //  DIRECTION_EAST, DIRECTION_WEST, DIRECTION_NORTH and DIRECTION_SOUTH
  style.strokeColor = "var(--col-text-0)";
  //style.strokeWidth = 2;
  style.shadow = 0;
  //foldable=0;overflow=hidden;verticalAlign=middle;fontColor=#fff;
  graph.getStylesheet().putCellStyle("umk_model", style);
  style = new Object();
  style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
  style.startSize = 25;
  style.strokeWidth = 1;
  style.arcSize = 0;
  style.foldable = 1;
  style.strokeColor = "var(--col-border-0)";
  style.fontColor = "var(--col-text-0)";
  //style.verticalLabelPosition = "top";
  style.verticalAlign = "top";
  style.fillColor = "var(--col-background-1)";
  style.resizable = 1;
  //style.swimlaneFillColor = "red";
  graph.getStylesheet().putCellStyle("umk_group", style);
  style = new Object();
  style.constituent = 1;
  style.labelPosition = "center";
  style.verticalLabelPosition = "bottom";
  style.verticalAlign = "top";
  style.fontColor = "var(--col-text-0)";
  //constituent=1;verticalLabelPosition=bottom;verticalAlign=top;
  graph.getStylesheet().putCellStyle("umk_caption_0", style);
  style = new Object();
  style.constituent = 1;
  style.labelPosition = "left";
  style.verticalLabelPosition = "bottom";
  style.verticalAlign = "top";
  style.fontColor = "var(--col-text-0)";
  style.rotation = 270;
  //constituent=1;verticalLabelPosition=bottom;verticalAlign=top;
  graph.getStylesheet().putCellStyle("umk_caption_90", style);
  style = new Object();
  style.constituent = 1;
  style.labelPosition = "center";
  style.verticalLabelPosition = "bottom";
  style.verticalAlign = "top";
  style.fontColor = "var(--col-text-0)";
  //constituent=1;verticalLabelPosition=bottom;verticalAlign=top;
  graph.getStylesheet().putCellStyle("umk_caption_180", style);
  style = new Object();
  style.constituent = 1;
  style.labelPosition = "right";
  style.verticalLabelPosition = "bottom";
  style.verticalAlign = "top";
  style.fontColor = "var(--col-text-0)";
  style.rotation = 270;
  //constituent=1;verticalLabelPosition=bottom;verticalAlign=top;
  graph.getStylesheet().putCellStyle("umk_caption_270", style);
  style = new Object();
  style.constituent = 1;
  style.align = "center";
  style.verticalAlign = "bottom";
  style.fontColor = "var(--col-text-0)";
  //constituent=1;align=center;verticalAlign=bottom;fontColor=#000000;
  graph.getStylesheet().putCellStyle("umk_EO_0", style);
  style = new Object();
  style.constituent = 1;
  style.align = "center";
  style.verticalAlign = "bottom";
  style.fontColor = "var(--col-text-0)";
  style.rotation = 270;
  //constituent=1;align=center;verticalAlign=bottom;fontColor=#000000;
  graph.getStylesheet().putCellStyle("umk_EO_90", style);
  style = new Object();
  style.constituent = 1;
  style.align = "center";
  style.verticalAlign = "bottom";
  style.fontColor = "var(--col-text-0)";
  //constituent=1;align=center;verticalAlign=bottom;fontColor=#000000;
  graph.getStylesheet().putCellStyle("umk_EO_180", style);
  style = new Object();
  style.constituent = 1;
  style.align = "center";
  style.verticalAlign = "bottom";
  style.fontColor = "var(--col-text-0)";
  style.rotation = 270;
  //constituent=1;align=center;verticalAlign=bottom;fontColor=#000000;
  graph.getStylesheet().putCellStyle("umk_EO_270", style);
  style = new Object();
  style.constituent = 1;
  style.verticalAlign = "middle";
  style.fontColor = "var(--col-text-0)";
  style.labelPosition = "right";
  style.labelWidth = 15;
  style.align = "left";
  style.shape = "rectangle"; //arrow inArrow triangle
  style.strokeWidth = 1;
  //style.portConstraint = "west";
  style.overflow = "fit";
  style.fillColor = "none"; //"var(--col-text-0)";
  style.strokeColor = "var(--col-text-0)";
  style.fontSize = 15;
  style.spacingLeft = 2;
  style.spacingTop = -5;
  style.rounded = 0;
  style.routingCenterX = -0.5;
  //constituent=1;verticalAlign=middle;fontColor=#ffffff;labelPosition=right;labelWidth=80;align=left;shape=triangle;portConstraint=west;
  graph.getStylesheet().putCellStyle("umk_input", style);

  style = new Object();
  style.constituent = 1;
  style.verticalAlign = "middle";
  style.fontColor = "var(--col-text-0)";
  style.labelPosition = "right";
  style.labelWidth = 15;
  style.align = "left";
  style.shape = "inArrowConnected"; //arrow inArrow triangle
  style.strokeWidth = 1;
  //style.portConstraint = "west";
  style.overflow = "fit";
  style.fillColor = "var(--col-text-0)";
  style.strokeColor = "var(--col-text-0)";
  style.fontSize = 15;
  style.spacingLeft = 2;
  style.spacingTop = -5;
  style.rounded = 0;
  style.routingCenterX = -0.5;
  //constituent=1;verticalAlign=middle;fontColor=#ffffff;labelPosition=right;labelWidth=80;align=left;shape=triangle;portConstraint=west;
  graph.getStylesheet().putCellStyle("umk_input_connected", style);

  style = new Object();
  style.constituent = 1;
  style.verticalAlign = "middle";
  style.fontColor = "var(--col-text-0)";
  style.labelPosition = "left";
  style.labelWidth = 12;
  style.align = "right";
  style.shape = "rectangle"; //"outArrow", "line", ""triangle", "ellipse";
  //style.portConstraint = "east";
  style.overflow = "fit";
  style.fillColor = "var(--col-text-0)";
  style.strokeColor = "var(--col-text-0)";
  //style.fontSize = "0.75em";
  //style.routingCenterX = -0.5;
  style.spacingLeft = 12;
  style.strokeWidth = 0.5;
  style.routingCenterX = 0.5;
  style.rounded = 0;
  //'shape=line;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;' +      'spacingLeft=12;fontColor='
  /*  style.fillColor = "none";
  style.strokeColor = "none";*/
  //constituent=1;fontColor=#ffffff;labelPosition=left;labelWidth=80;align=right;shape=triangle;portConstraint=east;
  graph.getStylesheet().putCellStyle("umk_output", style);

  style = new Object();
  style.constituent = 1;
  style.verticalAlign = "middle";
  style.fontColor = "var(--col-text-0)";
  style.labelPosition = "left";
  style.labelWidth = 12;
  style.align = "right";
  style.shape = "line"; //"outArrow", "line", ""triangle", "ellipse";
  //style.portConstraint = "east";
  style.overflow = "fit";
  style.fillColor = "var(--col-text-0)";
  style.strokeColor = "var(--col-text-0)";
  //style.fontSize = "0.75em";
  //style.routingCenterX = -0.5;
  style.spacingLeft = 12;
  style.strokeWidth = 1;
  style.routingCenterX = 0.5;
  style.rounded = 0;
  //'shape=line;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;' +      'spacingLeft=12;fontColor='
  /*  style.fillColor = "none";
  style.strokeColor = "none";*/
  //constituent=1;fontColor=#ffffff;labelPosition=left;labelWidth=80;align=right;shape=triangle;portConstraint=east;
  graph.getStylesheet().putCellStyle("umk_output_connected", style);


})(mainSystem.graph);

mainSystem.graph.addListener(mxEvent.ADD_CELLS, function (x, cells, parent, index, source, target, absolute) {
  //console.log(cells);
});