((graph) => {

  const Canvas = document.createElement("canvas");
  Canvas.style.position = "absolute";
  Canvas.style.top = "0px";
  Canvas.style.left = "0px";
  Canvas.style.pointerEvents = "none";
  Canvas.style.zIndex = -1; //It may effect the blocks and its selection ... todo
  graph.container.appendChild(Canvas);
  graph.gridCanvas = Canvas;
  graph.grid = {
    canvas: Canvas,
    sGraph: graph,
    minorStroke: {
      color: '#808080',
      thickness: 0.1,
      pattern: "",
      show: false
    },
    majorStroke: {
      color: '#808080',
      thickness: 0.5,
      pattern: "2, 2",
      show: true
    },
    megaStroke: {
      color: '#808080',
      thickness: 1,
      pattern: "20, 5, 5, 5",
      show: false
    },
    repaintGrid: function () {
      let graph = this.sGraph;
      let lineColor = window.getComputedStyle(graph.container, null).getPropertyValue('border-color');
      this.minorStroke.color = lineColor;
      this.majorStroke.color = lineColor;
      this.megaStroke.color = lineColor;
      //console.log(lineColor);

      let s = 0;
      let gs = 0;
      let tr = new mxPoint();
      let w = 0;
      let h = 0;
      let ctx = this.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "#ff000000";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      if (ctx != null) {
        let bounds = graph.getGraphBounds();
        let width = Math.max(
          bounds.x + bounds.width,
          graph.container.clientWidth
        );
        let height = Math.max(
          bounds.y + bounds.height,
          graph.container.clientHeight
        );
        let sizeChanged = width != w || height != h;
        if (
          graph.view.scale != s ||
          graph.view.translate.x != tr.x ||
          graph.view.translate.y != tr.y ||
          gs != graph.gridSize ||
          sizeChanged
        ) {
          tr = graph.view.translate.clone();
          s = graph.view.scale;
          gs = graph.gridSize;
          w = width;
          h = height;
          if (!sizeChanged) {
            ctx.clearRect(0, 0, w, h);
          } else {
            this.canvas.setAttribute("width", w);
            this.canvas.setAttribute("height", h);
          }
          let tx = tr.x * s;
          let ty = tr.y * s;
          let minStepping = graph.gridSize;
          let stepping = minStepping * s;
          /*if (stepping < minStepping) {
              let count =
                  Math.round(Math.ceil(minStepping / stepping) / 2) * 2;
              stepping = count * stepping;
          }*/
          let xs = Math.floor((0 - tx) / stepping) * stepping + tx;
          let xe = Math.ceil(w / stepping) * stepping;
          let ys = Math.floor((0 - ty) / stepping) * stepping + ty;
          let ye = Math.ceil(h / stepping) * stepping;
          xe += Math.ceil(stepping);
          ye += Math.ceil(stepping);
          let ixs = Math.round(xs);
          let ixe = Math.round(xe);
          let iys = Math.round(ys);
          let iye = Math.round(ye);

          if (this.minorStroke.show) {
            ctx.strokeStyle = this.minorStroke.color;
            ctx.beginPath();
            ctx.lineCap = "round";
            try {
              ctx.setLineDash(
                JSON.parse("[" + this.minorStroke.pattern + "]")
              );
            } catch (e) {}
            ctx.lineWidth = this.minorStroke.thickness;
            for (let x = xs; x <= xe; x += stepping) {
              x = Math.round((x - tx) / stepping) * stepping + tx;
              let ix = Math.round(x);
              ctx.moveTo(ix + 0.5, iys + 0.5);
              ctx.lineTo(ix + 0.5, iye + 0.5);
            }
            for (let y = ys; y <= ye; y += stepping) {
              y = Math.round((y - ty) / stepping) * stepping + ty;
              let iy = Math.round(y);
              ctx.moveTo(ixs + 0.5, iy + 0.5);
              ctx.lineTo(ixe + 0.5, iy + 0.5);
            }
            ctx.closePath();
            ctx.stroke();
          }

          stepping = stepping * 5;
          if (this.majorStroke.show) {
            ctx.strokeStyle = this.majorStroke.color;
            xs = Math.floor((0 - tx) / stepping) * stepping + tx;
            xe = Math.ceil(w / stepping) * stepping;
            ys = Math.floor((0 - ty) / stepping) * stepping + ty;
            ye = Math.ceil(h / stepping) * stepping;
            xe += Math.ceil(stepping);
            ye += Math.ceil(stepping);
            ixs = Math.round(xs);
            ixe = Math.round(xe);
            iys = Math.round(ys);
            iye = Math.round(ye);
            ctx.beginPath();
            ctx.lineCap = "round";
            try {
              ctx.setLineDash(
                JSON.parse("[" + this.majorStroke.pattern + "]")
              );
            } catch (e) {}
            ctx.lineWidth = this.majorStroke.thickness;
            for (let x = xs; x <= xe; x += stepping) {
              x = Math.round((x - tx) / stepping) * stepping + tx;
              let ix = Math.round(x);
              ctx.moveTo(ix + 0.5, iys + 0.5);
              ctx.lineTo(ix + 0.5, iye + 0.5);
            }
            for (let y = ys; y <= ye; y += stepping) {
              y = Math.round((y - ty) / stepping) * stepping + ty;
              let iy = Math.round(y);
              ctx.moveTo(ixs + 0.5, iy + 0.5);
              ctx.lineTo(ixe + 0.5, iy + 0.5);
            }
            ctx.closePath();
            ctx.stroke();
          }

          stepping = stepping * 2;
          if (this.megaStroke.show) {
            ctx.strokeStyle = this.megaStroke.color;
            xs = Math.floor((0 - tx) / stepping) * stepping + tx;
            xe = Math.ceil(w / stepping) * stepping;
            ys = Math.floor((0 - ty) / stepping) * stepping + ty;
            ye = Math.ceil(h / stepping) * stepping;
            xe += Math.ceil(stepping);
            ye += Math.ceil(stepping);
            ixs = Math.round(xs);
            ixe = Math.round(xe);
            iys = Math.round(ys);
            iye = Math.round(ye);
            ctx.beginPath();
            ctx.lineCap = "round";
            try {
              ctx.setLineDash(
                JSON.parse("[" + this.megaStroke.pattern + "]")
              );
            } catch (e) {}
            ctx.lineWidth = this.megaStroke.thickness;
            for (let x = xs; x <= xe; x += stepping) {
              x = Math.round((x - tx) / stepping) * stepping + tx;
              let ix = Math.round(x);
              ctx.moveTo(ix + 0.5, iys + 0.5);
              ctx.lineTo(ix + 0.5, iye + 0.5);
            }
            for (let y = ys; y <= ye; y += stepping) {
              y = Math.round((y - ty) / stepping) * stepping + ty;
              let iy = Math.round(y);
              ctx.moveTo(ixs + 0.5, iy + 0.5);
              ctx.lineTo(ixe + 0.5, iy + 0.5);
            }
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
    }
  };

})(mainSystem.graph);