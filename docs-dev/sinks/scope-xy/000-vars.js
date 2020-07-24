let chart;
const settings = {
  isChartReady: false,
  showImg: false,
  limitData: 1000,
  mSettings: {},
  xLogScale: false,
  yLogScale: false,
  aCharts: true
};
let inData;

//prepareScope();
// // Themes begin
// am4core.useTheme(am4themes_kelly);
// // am4core.useTheme(am4themes_animated);
// // Themes end



// // Create chart instance
// chart = am4core.create("scope", am4charts.XYChart);

// // Add data
// chart.data = [{
//   "date": new Date(2018, 0, 1),
//   "value": 450,
//   "value2": 362,
//   "value3": 699
// }, {
//   "date": new Date(2018, 0, 2),
//   "value": 269,
//   "value2": 450,
//   "value3": 841
// }, {
//   "date": new Date(2018, 0, 3),
//   "value": 700,
//   "value2": 358,
//   "value3": 699
// }, {
//   "date": new Date(2018, 0, 4),
//   "value": 490,
//   "value2": 367,
//   "value3": 500
// }, {
//   "date": new Date(2018, 0, 5),
//   "value": 500,
//   "value2": 485,
//   "value3": 369
// }, {
//   "date": new Date(2018, 0, 6),
//   "value": 550,
//   "value2": 354,
//   "value3": 250
// }, {
//   "date": new Date(2018, 0, 7),
//   "value": 420,
//   "value2": 350,
//   "value3": 600
// }];

// // Create axes
// var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
// //dateAxis.logarithmic = true;
// dateAxis.renderer.grid.template.location = 0;
// dateAxis.renderer.minGridDistance = 30;

// var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
// // valueAxis.logarithmic = true;

// // Create series
// function createSeries(field, name) {
//   var series = chart.series.push(new am4charts.LineSeries());
//   series.dataFields.valueY = field;
//   series.dataFields.dateX = "date";
//   series.name = name;
//   series.tooltipText = "{dateX}: [b]{valueY}[/]";
//   series.strokeWidth = 2;

//   var bullet = series.bullets.push(new am4charts.CircleBullet());
//   bullet.circle.stroke = am4core.color("#fff");
//   bullet.circle.strokeWidth = 2;
// }

// createSeries("value", "Series #1");
// createSeries("value2", "Series #2");
// createSeries("value3", "Series #3");

// chart.legend = new am4charts.Legend();
// chart.cursor = new am4charts.XYCursor();
// chart.numberFormatter.numberFormat = "##.###e";
// chart.cursor.behavior = "zoomXY";

//  am4core.useTheme(am4themes_animated);

/*
  chart = am4core.create("scope", am4charts.XYChart);
  //chart.paddingRight = 20;

  // Add data
  chart.data = [{
    "x": 0,
    "y1": -0.307,
    "y2": 0.307
  }, {
    "x": 1,
    "y1": -0.168,
    "y2": 0.168
  }, {
    "x": 1.5,
    "y1": -2,
    "y2": 2
  }, {
    "x": 2,
    "y1": 0.1,
    "y2": -0.1
  }];
  
  // Create axes
  var xAxis = chart.xAxes.push(new am4charts.ValueAxis());

  // Create value axis
  var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
  
  
  
  // Create series
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueX = "x";
  series.dataFields.valueY = "y1";
  series.strokeWidth = 2;
  series.name = "Hey";
  series.tooltipText = "{valueY}";
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.background.fillOpacity = 0.5;
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueX = "x";
  series.dataFields.valueY = "y2";
  series.strokeWidth = 2;
  series.name = "Hey2";
  series.tooltipText = "{valueY}";
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.background.fillOpacity = 0.5;
  // Add scrollbar
  //var scrollbarX = new am4charts.XYChartScrollbar();
  // scrollbarX.series.push(series);
  // chart.scrollbarX = scrollbarX;
  

 
  */