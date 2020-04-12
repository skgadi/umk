//Copy paste stuff
const uyamakCbManager = {
  graph: new Graph(document.getElementById('GraphForCopyPaste')),
  clone: function () {
    mainSystem.graph.createSubModel();
    mxClipboard.copy(mainSystem.graph);
    mainSystem.graph.ungroupSubModel();
    mxClipboard.paste(mainSystem.graph);
    mainSystem.graph.orderCells(false);
    mainSystem.graph.ungroupSubModel();
  },
  cut: function () {
    this.copy();
    if (mainSystem.graph.isEnabled()) {
      mainSystem.graph.removeCells();
    }
  },
  copy: function () {
    this.graph.getModel().clear()
    mainSystem.graph.createSubModel();
    mxClipboard.copy(mainSystem.graph);
    mxClipboard.paste(this.graph);
    this.graph.ungroupSubModel();
    this.presPasteText = uyamakFileManager.compressModel(this.graph);
    navigator.clipboard.writeText(this.presPasteText).then((e) => {
      console.log("copied");
    });
    mainSystem.graph.ungroupSubModel();
  },
  presPasteText: "",
  paste: function () {
    navigator.clipboard.readText().then((text) => {
      try {
        if (this.presPasteText !== text) {
          // Text imported to paste model
          this.presPasteText = text;
          mxClipboard.setCells([]);
          this.prepareAltAndCopy(text);
        }
        this.bringModelToMain();
      } catch (e) {
        console.log(e);
        console.log("unable to paste");
      }
    });
  },
  bringModelToMain: function () {
    mxClipboard.paste(mainSystem.graph);
    mainSystem.graph.ungroupSubModel();
    mainSystem.graph.orderCells(false);
    mainSystem.refresh();
  },
  prepareAltAndCopy: function (text) {
    this.inmportToGraph(text, this.graph);
    this.graph.setSelectionCells(this.graph.getChildCells());
    this.graph.createSubModel()
    mxClipboard.copy(this.graph);
    this.graph.ungroupSubModel();
  },
  inmportToGraph: function (text, graph) {
    let deflated16bit = new Uint16Array(uyamakFileManager.str2ab(text));
    deflated16bit = uyamakFileManager.escZero(deflated16bit, false);
    let inflated8Bit = pako.inflate(deflated16bit);
    let xmlString = uyamakFileManager.ab2str(inflated8Bit);
    let doc = mxUtils.parseXml(xmlString);
    //console.log(doc);
    let codec = new mxCodec(doc);
    //console.log(doc);
    //console.log(xmlString);
    codec.decode(doc.documentElement, graph.getModel());
  } ,
  linkToParentCells(cells, parentCells) {
    let pCellsOut = {};
    for (let i = 0; i < parentCells.length; i++) {
      for (let j = 0; j < cells.length; j++) {
        pCellsOut[i] = parentCells[i];
        if (parentCells[i].id === cells[j].id) {
          pCellsOut[i] = cells[j];
        }
      }
    }
    return pCellsOut;
  }
}



mxClipboard.copy = function(graph, cells)
{
  cells = cells || graph.getSelectionCells();
  var result = graph.getExportableCells(cells);

  mxClipboard.parents = new Object();

  for (var i = 0; i < result.length; i++)
  {
    mxClipboard.parents[i] = graph.model.getParent(cells[i]);
  }

  mxClipboard.insertCount = 1;
  mxClipboard.setCells(graph.cloneCells(result));

  return result;
};

mxClipboard.paste = function(graph)
{
  if (!mxClipboard.isEmpty())
  {
    var cells = graph.getImportableCells(mxClipboard.getCells());
    var delta = mxClipboard.insertCount * mxClipboard.STEPSIZE;
    var parent = graph.getDefaultParent();

    graph.model.beginUpdate();
    try
    {
      for (var i = 0; i < cells.length; i++)
      {
        var tmp = (mxClipboard.parents != null && graph.model.contains(mxClipboard.parents[i])) ?
             mxClipboard.parents[i] : parent;
        cells[i] = graph.importCells([cells[i]], delta, delta, tmp)[0];
      }
    }
    finally
    {
      graph.model.endUpdate();
    }

    // Increments the counter and selects the inserted cells
    mxClipboard.insertCount++;
    graph.setSelectionCells(cells);
  }
};