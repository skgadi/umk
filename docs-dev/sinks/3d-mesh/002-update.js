function clearData() {
  fullData = [];
  reactTheChart()
}

function appendData(inData) {
  if (!fullData.length) {
    if (!!inData.length) {
      settings.noOfPlots = 0;
      for (let j = 0; j < inData[0]['v'][0]['r'].length; j++) {
        for (let k = 0; k < inData[0]['v'][0]['r'][0].length; k++) {
          ["", "Img"].forEach(function (textPrepend) {
            fullData.push({
              type: 'mesh3d',
              name: textPrepend + '(' + j + ',' + k + ')',
              visible: (!settings.showIm && !!(settings.noOfPlots % 2)) ? 'legendonly' : 'true',
              //mode: settings.mode,
              x: [],
              y: [],
              z: [],
              opacity: 1,
              colorscale: settings.colorscale,
              reversescale: settings.reversescale,
              intensity: [],
              intensitymode:'cell',
              showscale: false,
              showlegend: true,
              contour: {
                width: settings.width,
              }
            });
            settings.noOfPlots++;
          });
        }
      }
      for (let idx = 0; idx < settings.noOfPlots; idx++) {}
    }
  }
  for (let i = 0; i < inData.length; i++) {
    let plotNumber = 0;
    for (let j = 0; j < inData[i]['v'][0]['r'].length; j++) {
      for (let k = 0; k < inData[i]['v'][0]['r'][0].length; k++) {
        //console.log(fullData);
        fullData[plotNumber].x.push(Number(inData[i]['v'][0]['r'][j][k]))
        fullData[plotNumber].y.push(Number(inData[i]['v'][1]['r'][j][k]))
        fullData[plotNumber].z.push(Number(inData[i]['v'][2]['r'][j][k]))
        fullData[plotNumber].intensity.push(Number(inData[i]['v'][3]['r'][j][k]))
        plotNumber++;
        fullData[plotNumber].x.push(Number(inData[i]['v'][0]['i'][j][k]))
        fullData[plotNumber].y.push(Number(inData[i]['v'][1]['i'][j][k]))
        fullData[plotNumber].z.push(Number(inData[i]['v'][2]['i'][j][k]))
        fullData[plotNumber].intensity.push(Number(inData[i]['v'][3]['i'][j][k]))
        plotNumber++;
      }
    }
  }
  fullData = fullData.slice(-settings.limitData);
  reactTheChart()
}

function updateConfiguration() {
  for (let index = 0; index < fullData.length; index++) {
    const eachPlot = fullData[index];
    //eachPlot.mode = settings.mode;
    eachPlot.contour.width = settings.width;
    eachPlot.visible = (!settings.showIm && !!(index % 2)) ? 'legendonly' : 'true',
    eachPlot.reversescale = settings.reversescale;
    eachPlot.colorscale = settings.colorscale;
  }
  //console.log('updated configuration');
  reactTheChart();
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