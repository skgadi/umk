function clearData() {
  fullData[0].z = [];
  reactTheChart()
}

function appendData(inData) {
  //console.log(fullData);
  fullData[0].x = inData[inData.length-1]['v'][0]['r'];
  fullData[0].y = inData[inData.length-1]['v'][1]['r'];
  fullData[0].z = inData[inData.length-1]['v'][2]['r'];
  //console.log(fullData[0].z);
  reactTheChart()
}

function updateConfiguration() {
  for (let index = 0; index < fullData.length; index++) {
    const eachPlot = fullData[index];
    eachPlot.contours.z.width = settings.width;
    eachPlot.visible = (!settings.showIm && !!(index % 2)) ? 'legendonly' : 'true',
    eachPlot.reversescale = settings.reversescale;
    eachPlot.colorscale = settings.colorscale;
  }
  reactTheChart()
}

function reactTheChart() {
  Plotly.react('chart', fullData, settings.chartLayout);
}

function updateColors() {
  document.getElementsByTagName('html')[0].className = settings.mSettings.theme;
  settings.chartLayout.plot_bgcolor = window.getComputedStyle(document.getElementById("css-ref-ele-0"), null).getPropertyValue('background-color');
  settings.chartLayout.paper_bgcolor = window.getComputedStyle(document.getElementById("css-ref-ele-0"), null).getPropertyValue('background-color');
  settings.chartLayout.font.color = window.getComputedStyle(document.getElementById("css-ref-ele-0"), null).getPropertyValue('color');
  ["xaxis", "yaxis", "zaxis"].forEach(function (element) {
    settings.chartLayout.scene[element].tickcolor = window.getComputedStyle(document.getElementById("css-ref-ele-0"), null).getPropertyValue('color');
    settings.chartLayout.scene[element].gridcolor = window.getComputedStyle(document.getElementById("css-ref-ele-0"), null).getPropertyValue('border-color');
    settings.chartLayout.scene[element].zerolinecolor = window.getComputedStyle(document.getElementById("css-ref-ele-0"), null).getPropertyValue('color');
  });
  //console.log(settings);
  reactTheChart();
}