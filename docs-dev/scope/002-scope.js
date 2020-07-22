function prepareScope() {
  if (!!chart) {
    chart.dispose();
  }
  chart = am4core.create("scope", am4charts.XYChart);
  const xAxis = chart.xAxes.push(new am4charts.ValueAxis());
  const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
  xAxis.padding(0, 0, 0, 0);
  yAxis.padding(0, 0, 0, 0);
  // xAxis.cursorTooltipEnabled = false;
  // yAxis.cursorTooltipEnabled = false;

  chart.padding(0, 32, 10, 0);
  chart.legend = new am4charts.Legend();
  chart.legend.position = "top";
  chart.legend.itemContainers.template.paddingTop = 0;
  chart.legend.itemContainers.template.paddingBottom = 0;
  chart.legend.fontSize = 10;
  chart.legend.useDefaultMarker = true;
  var marker = chart.legend.markers.template.children.getIndex(0);
  marker.cornerRadius(12, 12, 12, 12);
  marker.strokeWidth = 2;
  // marker.strokeOpacity = 0;
  // marker.stroke = am4core.color("#ccc");

  chart.cursor = new am4charts.XYCursor();
  chart.numberFormatter.numberFormat = "##.###e";
  chart.cursor.behavior = "zoomXY";
  //chart.fontSize = 15;


  prepareColors();
}

function updateData(inData) {
  if (!chart) {
    prepareScope();
  }
  //console.log(inData);
  const dataToUpdate = [];
  let addSeries = true;
  for (let i = 0; i < inData.length; i++) {
    const tempData = {};
    tempData["t"] = inData[i].t;
    for (let j = 0; j < inData[i]['v'][0].length; j++) {
      for (let k = 0; k < inData[i]['v'][0][0].length; k++) {
        const realID = 'r_' + (j + 1) + '_' + (k + 1);
        const imagID = 'i_' + (j + 1) + '_' + (k + 1);
        tempData[realID] = inData[i]['v'][0][j][k];
        tempData[imagID] = inData[i]['v'][1][j][k];

        //Set series if it is first time
        if ((chart.data.length === 0) && (addSeries)) {
          // Real series
          createANewSeries(realID, "(" + (j + 1) + ", " + (k + 1) + ")");
          const seriesImag = createANewSeries(imagID, "Img(" + (j + 1) + "," + (k + 1) + ")");
          if (!settings.showImg) {
            seriesImag.hidden = true;
          }
        }
      }
    }
    dataToUpdate.push(tempData);
    addSeries = false;
  }
  //Num of datapoints to remove
  let removeDatapoints = chart.data.length + dataToUpdate.length - settings.limitData;
  if (removeDatapoints < 0) {
    removeDatapoints = 0;
  }
  // console.log(settings.limitData);
  // console.log(removeDatapoints);
  // console.log(chart.data);
  chart.addData(dataToUpdate, removeDatapoints);

}


function adjustImagSeriesView() {
  if (!!chart) {
    const noOfImagSeries = chart.series.length / 2;
    for (let i = 0; i < noOfImagSeries; i++) {
      if (settings.showImg) {
        chart.series.getIndex(i * 2 + 1).show();
      } else {
        chart.series.getIndex(i * 2 + 1).hide();
      }
    }

  }
}

function prepareColors() {
  document.getElementsByTagName('html')[0].className = settings.mSettings.theme;
  if (!!chart) {
    //Axis colors
    for (let i = 0; i < chart.xAxes.length; i++) {
      setAxisColorProperties(chart.xAxes.getIndex(i));
    }
    for (let i = 0; i < chart.yAxes.length; i++) {
      setAxisColorProperties(chart.yAxes.getIndex(i));
    }


    //zoom button

    chart.zoomOutButton.background.cornerRadius(5, 5, 5, 5);
    chart.zoomOutButton.background.fill = am4core.color(window.getComputedStyle(document.getElementById("css-ref-ele-1"), null).getPropertyValue('border-color'));
    chart.zoomOutButton.icon.stroke = am4core.color(window.getComputedStyle(document.getElementById("css-ref-ele-1"), null).getPropertyValue('color'));
    chart.zoomOutButton.icon.strokeWidth = 2;
    chart.zoomOutButton.background.states.getKey("hover").properties.fill = am4core.color(window.getComputedStyle(document.getElementById("css-ref-ele-3"), null).getPropertyValue('background-color'));

  }
}

function setAxisColorProperties(axis) {
  axis.setStroke(am4core.color(window.getComputedStyle(document.getElementById("css-ref-ele-0"), null).getPropertyValue('color')));
  axis.strokeWidth = 0;
  axis.setFill(am4core.color(window.getComputedStyle(document.getElementById("css-ref-ele-0"), null).getPropertyValue('color')));
  axis.renderer.grid.template.stroke = am4core.color(window.getComputedStyle(document.getElementById("css-ref-ele-0"), null).getPropertyValue('border-color'));
  axis.renderer.grid.template.strokeWidth = 1;
  axis.renderer.grid.template.strokeOpacity = 0.5;
}

function createANewSeries(id, name) {
  const series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueX = "t";
  series.dataFields.valueY = id;
  series.strokeWidth = 2;
  series.name = name;
  series.tooltipText = "{t}";
  return series;
}