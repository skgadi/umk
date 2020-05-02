const cItem = {
  options: {
    chart: {
      animations: {
        enabled: false
      },
      height: '100%',
      type: 'line',
      zoom: {
        enabled: true,
        type: 'xy',
        autoScaleYaxis: false,
        zoomedArea: {
          fill: {
            color: '#90CAF9',
            opacity: 0.4
          },
          stroke: {
            color: '#0D47A1',
            opacity: 0.4,
            width: 1
          }
        }
      },
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: '<i class="fas fa-download"></i>',
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: '<i class="fas fa-compress"></i>'
        },
        autoSelected: 'zoom'
      },
      defaultLocale: 'en',
      //locales: []
    },
    markers: {
      size: 0
    },
    series: [],
    xaxis: {
      type: 'numeric',
      labels: {
        formatter: function (a, b, c) {
          /*console.log(a);
          console.log(b);
          console.log(c);*/
          return math.parse(a).toString(4);
        }
      }
    }
  },
  showIm: true,
  handle: null,
  setLocale: function (lang) {
    if (!this.options.chart.locales) {
      this.options.chart.locales = [];
    }
    this.options.chart.locales.push(lang);
    this.options.chart.defaultLocale = lang.name;
    console.log(lang);
    console.log(lang.name);
    if (!!this.handle) {
      this.handle.updateOptions(this.options);
    }
  },
  getData: function () {

  },
  prepareChart: function () {
    this.handle = new ApexCharts(document.querySelector("#chart"), this.options);
    this.handle.render();
  }
};