// To detect if touch events are actually supported, the following condition is recommended:
// mxClient.IS_TOUCH || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0

// Tap and hold on background starts rubberband for multiple selected
// cells the cell associated with the event is deselected
mainSystem.graph.addListener(mxEvent.TAP_AND_HOLD, function (sender, evt) {
    if (!mxEvent.isMultiTouchEvent(evt)) {
        var me = evt.getProperty('event');
        var cell = evt.getProperty('cell');

        if (cell == null) {
            var pt = mxUtils.convertPoint(this.container,
                mxEvent.getClientX(me), mxEvent.getClientY(me));
            rubberband.start(pt.x, pt.y);
        } else if (mainSystem.graph.getSelectionCount() > 1 && mainSystem.graph.isCellSelected(cell)) {
            mainSystem.graph.removeSelectionCell(cell);
        }

        // Blocks further processing of the event
        evt.consume();
    }
});

// Adds mouse wheel handling for zoom
/*
document.getElementById("modelContainer").addEventListener("wheel", function (evt, up) {
    console.log (evt);
    if (up) {
        mainSystem.graph.zoomIn();
    } else {
        mainSystem.graph.zoomOut();
    }

});
*/

/*window.addEventListener('scroll',function(){
    var scrolled = window.scrollY / ( document.getElementById("Table_01").offsetHeight );
    console.log("window.scrollY: " + window.scrollY);
    console.log("scrolled: " + scrolled );
    var zoomLevels = 1; //change to have a different behavior
    var scale = Math.pow( 3, scrolled * zoomLevels);
    var images = document.getElementById("Table_01").getElementsByTagName("img");
    console.log("scale:" + scale);
    for(i=0;i<images.length;i++){
        images[i].width = Math.round(500/scale); //change 500 to your image size
        images[i].height = Math.round(500/scale); //change 500 to your image size
    }
},true);
*/
/*

(function()
{
    this.graph = mainSystem.graph;
    // Enables rotation handle
    mxVertexHandler.prototype.rotationEnabled = true;
    
    // Enables managing of sizers
    mxVertexHandler.prototype.manageSizers = true;
    
    // Enables live preview
    mxVertexHandler.prototype.livePreview = true;

    // Sets constants for touch style
    mxConstants.HANDLE_SIZE = 16;
    mxConstants.LABEL_HANDLE_SIZE = 7;

    // Larger tolerance and grid for real touch devices
    if (mxClient.IS_TOUCH || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)
    {
        mxShape.prototype.svgStrokeTolerance = 18;
        mxVertexHandler.prototype.tolerance = 12;
        mxEdgeHandler.prototype.tolerance = 12;
        mxGraph.prototype.tolerance = 12;
    }
    
    // One finger pans (no rubberband selection) must start regardless of mouse button
    mxPanningHandler.prototype.isPanningTrigger = function(me)
    {
        var evt = me.getEvent();
        
         return (me.getState() == null && !mxEvent.isMouseEvent(evt)) ||
             (mxEvent.isPopupTrigger(evt) && (me.getState() == null ||
             mxEvent.isControlDown(evt) || mxEvent.isShiftDown(evt)));
    };

    // Don't clear selection if multiple cells selected
    var graphHandlerMouseDown = mxGraphHandler.prototype.mouseDown;
    mxGraphHandler.prototype.mouseDown = function(sender, me)
    {
        graphHandlerMouseDown.apply(this, arguments);

        if (this.graph.isCellSelected(me.getCell()) && this.graph.getSelectionCount() > 1)
        {
            this.delayedSelection = false;
        }
    };

    // On connect the target is selected and we clone the cell of the preview edge for insert
    mxConnectionHandler.prototype.selectCells = function(edge, target)
    {
        if (target != null)
        {
            this.graph.setSelectionCell(target);
        }
        else
        {
            this.graph.setSelectionCell(edge);
        }
    };

    // Overrides double click handling to use the tolerance
    var graphDblClick = mxGraph.prototype.dblClick;
    mxGraph.prototype.dblClick = function(evt, cell)
    {
        if (cell == null)
        {
            var pt = mxUtils.convertPoint(this.container,
                mxEvent.getClientX(evt), mxEvent.getClientY(evt));
            cell = this.getCellAt(pt.x, pt.y);
        }

        graphDblClick.call(this, evt, cell);
    };

    // Rounded edge and vertex handles
    var touchHandle = new mxImage('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="9" height="9"><circle cx="4.5" fill="var(--col-text-1)" cy="4.5" r="3.5"/></svg>', 17, 17);
    mxVertexHandler.prototype.handleImage = touchHandle;
    mxEdgeHandler.prototype.handleImage = touchHandle;
    mxOutline.prototype.sizerImage = touchHandle;
    
    // Pre-fetches touch handle
    new Image().src = touchHandle.src;

    // Adds connect icon to selected vertex
    var connectorSrc = 'images/handle-connect.png';

    var vertexHandlerInit = mxVertexHandler.prototype.init;
    mxVertexHandler.prototype.init = function()
    {
        // TODO: Use 4 sizers, move outside of shape
        //this.singleSizer = this.state.width < 30 && this.state.height < 30;
        vertexHandlerInit.apply(this, arguments);

        // Only show connector image on one cell and do not show on containers
        if (this.graph.connectionHandler.isEnabled() &&
            this.graph.isCellConnectable(this.state.cell) &&
            this.graph.getSelectionCount() == 1)
        {
            this.connectorImg = mxUtils.createImage(connectorSrc);
            this.connectorImg.style.cursor = 'pointer';
            this.connectorImg.style.width = '29px';
            this.connectorImg.style.height = '29px';
            this.connectorImg.style.position = 'absolute';
            
            if (!mxClient.IS_TOUCH)
            {
                this.connectorImg.setAttribute('title', mxResources.get('connect'));
                mxEvent.redirectMouseEvents(this.connectorImg, this.graph, this.state);
            }

            // Starts connecting on touch/mouse down
            mxEvent.addGestureListeners(this.connectorImg,
                mxUtils.bind(this, function(evt)
                {
                    this.graph.popupMenuHandler.hideMenu();
                    this.graph.stopEditing(false);
                    
                    var pt = mxUtils.convertPoint(this.graph.container,
                            mxEvent.getClientX(evt), mxEvent.getClientY(evt));
                    this.graph.connectionHandler.start(this.state, pt.x, pt.y);
                    this.graph.isMouseDown = true;
                    this.graph.isMouseTrigger = mxEvent.isMouseEvent(evt);
                    mxEvent.consume(evt);
                })
            );

            this.graph.container.appendChild(this.connectorImg);
        }

        this.redrawHandles();
    };
    
    var vertexHandlerHideSizers = mxVertexHandler.prototype.hideSizers;
    mxVertexHandler.prototype.hideSizers = function()
    {
        vertexHandlerHideSizers.apply(this, arguments);
        
        if (this.connectorImg != null)
        {
            this.connectorImg.style.visibility = 'hidden';
        }
    };
    
    var vertexHandlerReset = mxVertexHandler.prototype.reset;
    mxVertexHandler.prototype.reset = function()
    {
        vertexHandlerReset.apply(this, arguments);
        
        if (this.connectorImg != null)
        {
            this.connectorImg.style.visibility = '';
        }
    };
    
    var vertexHandlerRedrawHandles = mxVertexHandler.prototype.redrawHandles;
    mxVertexHandler.prototype.redrawHandles = function()
    {
        vertexHandlerRedrawHandles.apply(this);

        if (this.state != null && this.connectorImg != null)
        {
            var pt = new mxPoint();
            var s = this.state;
            
            // Top right for single-sizer
            if (mxVertexHandler.prototype.singleSizer)
            {
                pt.x = s.x + s.width - this.connectorImg.offsetWidth / 2;
                pt.y = s.y - this.connectorImg.offsetHeight / 2;
            }
            else
            {
                pt.x = s.x + s.width + mxConstants.HANDLE_SIZE / 2 + 4 + this.connectorImg.offsetWidth / 2;
                pt.y = s.y + s.height / 2;
            }
            
            var alpha = mxUtils.toRadians(mxUtils.getValue(s.style, mxConstants.STYLE_ROTATION, 0));
            
            if (alpha != 0)
            {
                var cos = Math.cos(alpha);
                var sin = Math.sin(alpha);
                
                var ct = new mxPoint(s.getCenterX(), s.getCenterY());
                pt = mxUtils.getRotatedPoint(pt, cos, sin, ct);
            }
            
            this.connectorImg.style.left = (pt.x - this.connectorImg.offsetWidth / 2) + 'px';
            this.connectorImg.style.top = (pt.y - this.connectorImg.offsetHeight / 2) + 'px';
        }
    };
    
    var vertexHandlerDestroy = mxVertexHandler.prototype.destroy;
    mxVertexHandler.prototype.destroy = function(sender, me)
    {
        vertexHandlerDestroy.apply(this, arguments);

        if (this.connectorImg != null)
        {
            this.connectorImg.parentNode.removeChild(this.connectorImg);
            this.connectorImg = null;
        }
    };
    
    // Pre-fetches touch connector
    new Image().src = connectorSrc;
})();*/