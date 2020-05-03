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
          try {
            return math.parse(a).toString(4);
          } catch (e) {
            console.log(e);
            return "Waiting ..."
          }
        }
      }
    }
  },
  showIm: true,
  handle: null,
  isFirst: true,
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
  updData: function (vals) {
    //console.log(vals);
    if (vals.length > 0) {
      let series = [];
      for (let i = 0; i < vals.length; i++) {
        let mVal = vals[i].v;
        let eleNum = 0;
        mVal[0].forEach(function (rowItem, j) {
          rowItem.forEach(function (rNcItem, k) {
            if (!i) {
              series.push({
                name: (cItem.showIm ? "Re" : "") + "[" + String(j + 1) + ", " + String(k + 1) + "]",
                data: []
              });
            }
            series[eleNum++].data.push([vals[i].t, rNcItem]);
          });
        });
        if (cItem.showIm) {
          mVal[1].forEach(function (rowItem, j) {
            rowItem.forEach(function (rNcItem, k) {
              if (!i) {
                series.push({
                  name: "Im[" + String(j + 1) + ", " + String(k + 1) + "]",
                  data: []
                });
              }
              series[eleNum++].data.push([vals[i].t, rNcItem]);
            });
          });
        }
        /*
        mVal.forEach(function (rowItem, j) {
          console.log(typeof rowItem[0]);
          if (typeof rowItem[0] === "number") {
            console.log("entereted");
            rowItem = [rowItem];
          }
          console.log(rowItem);
          rowItem[0].forEach(function (rNcItem, k) {
            if (!i) {
                series.push({
                  name: (cItem.showIm?"Re":"")+"([" + String(j + 1) + " " + String(k + 1) + "])",
                  data: []
                });
            }
            series[eleNum++].data.push([vals[i].t, rNcItem]);
          });
          if (cItem.showIm) {
            rowItem[0].forEach(function (rNcItem, k) {
              if (!i) {
                series.push({
                  name: "Im([" + String(j + 1) + " " + String(k + 1) + "])",
                  data: []
                });

              }
              series[eleNum++].data.push([vals[i].t, rNcItem]);
            });
          }
        });
        */
      }
      //console.log(series);
      if (this.isFirst) {
        this.handle.updateSeries(series);
        this.isFirst = false;
      } else {
        for (let i = 0; i < series.length; i++) {
          delete series[i].name;
        }
        this.handle.appendData(series);
      }
      //console.log(series);
      //console.log(vals);
    }


  },
  resetChart: function() {
    this.isFirst = true;
    this.handle.updateSeries([]);
  },
  prepareChart: function () {
    this.handle = new ApexCharts(document.querySelector("#chart"), this.options);
    this.handle.render();
  }
};