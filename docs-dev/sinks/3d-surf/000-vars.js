const settings = {
  width: 5,
  reversescale: false,
  mode: 'lines',
  showIm: false,
  limitData: 1000,
  mSettings: {},
  colorscale: "jet",
  noOfPlots: 1,
  chartLayout: {
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
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    },
    /*modebar: {
      orientation: "v"
    },*/
    legend: {
      y: 0.5
    }
  },
  chartConfig: {
    displaylogo: false,
    toImageButtonOptions: {
      //format: 'svg', // one of png, svg, jpeg, webp
      filename: 'umk_3D_line_chart',
    },
    responsive: true
  }
}

let fullData = [{
  x:[],
  y:[],
  z: [],
  type: 'surface',
  colorscale: "Greens",
  contours: {
    z: {
      show: true,
      usecolormap: true,
      //highlightcolor: "#42f462",
      project: {
        z: true
      },
      width: settings.width
    }
  }
}];



Plotly.newPlot('chart', fullData, settings.chartLayout, settings.chartConfig);
/*
window.addEventListener('resize', function (event) {
  Plotly.newPlot('chart', fullData, settings.chartLayout, settings.chartConfig);
});*/