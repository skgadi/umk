const settings = {
  width: 5,
  reversescale: false,
  mode: 'lines',
  showIm: false,
  limitData: 1000,
  mSettings: {},
  noOfPlots: 1,
  chartConfig: {
    paper_bgcolor: "#ffffff00",
    plot_bgcolor: "#ffffff00",
    font: {
      color: '#000'
    },
    scene: {
      xaxis: {
        tickcolor: '#000',
        gridcolor: '#888',
        zerolinecolor: "#000",
      },
      yaxis: {
        tickcolor: '#000',
        gridcolor: '#888',
        zerolinecolor: "#000",
      },
      zaxis: {
        tickcolor: '#000',
        gridcolor: '#888',
        zerolinecolor: "#000",
      }
    },
  }
}

let fullData = [];



Plotly.newPlot('chart', fullData, settings.chartConfig);
window.addEventListener('resize', function (event) {
  Plotly.newPlot('chart', fullData, settings.chartConfig);
});