const mainSystem = {};
((graphContainer, outlineContainer)=>{
  const graph = new mxGraph(graphContainer);
  const outline  = new mxOutline(graph, outlineContainer);
  mainSystem.graph = graph;
  mainSystem.outline = outline;
  outline.container = outlineContainer;
})(document.getElementById("modelContainer"), document.getElementById("outlineContainer"));