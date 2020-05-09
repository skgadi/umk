uyamak.cmprs = {
  encoder: new mxCodec(),
  xmlText: function (graph = mainSystem.graph) {
    return mxUtils.getXml(this.encoder.encode(graph.getModel()));
  },
  compressJSON: function (JSONIn) {
    return packer.pack(JSON.stringify2(JSONIn));
  },
  decompressJSON: function (codedText) {
    return JSON.parse2(packer.unpack(codedText));
  },
  compressModel: function (graph = mainSystem.graph) {
    if (!graph) {
      graph = mainSystem.graph;
    }
    //let encoder = new mxCodec();
    let model = graph.getModel();
    let xmlCellArray = this.encoder.encode(model);
    let xmlString = mxUtils.getXml(xmlCellArray);
    return packer.pack(xmlString);
  },
  decompressModel: function (codedText) {
    let xmlText = packer.unpack(codedText);
    let xml = mxUtils.parseXml(xmlText);
    return this.encoder.decode(xml.documentElement);
  }
}