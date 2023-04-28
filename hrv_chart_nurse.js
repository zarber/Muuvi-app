//https://www.amcharts.com/demos/line-graph/

//nurse's hrv chart
am5.ready(function() {

  // Fetch data from database
  const fetchData = async () => {
    // HRV data
    const response_hrvData = await fetch('/hrvResults');
    const jsonHrvData = await response_hrvData.json();

    const hrvData = [];
    for (var i = 0; i < jsonHrvData.length; i++) {
        const newData = {
            valueField1: jsonHrvData[i].readiness,
            valueField2: jsonHrvData[i].stress,
            date: new Date(jsonHrvData[i].date).getTime()
        }
        hrvData.push(newData);
    }

   console.log("Arvot: ", hrvData);

    // Sending data to HRV chart
    generateData(hrvData);
};

fetchData();

// Create root element
var root = am5.Root.new("hrv_chart_nurse");
  
// Set themes
root.setThemes([
    am5themes_Animated.new(root)
]);
  
// Create chart
var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX:true
}));

chart.get("colors").set("step", 3);
  
// Add cursor
var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "none"
}));
cursor.lineY.set("visible", false);
  
// Create axes
var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  maxDeviation: 0.3,
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {}),
  tooltip: am5.Tooltip.new(root, {})
}));
  
var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0.3,
  renderer: am5xy.AxisRendererY.new(root, {})
}));
  
// Add series
var series_readiness = chart.series.push(am5xy.LineSeries.new(root, {
  name: "Series Readiness",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "valueField1",
  valueXField: "date",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{valueX}, Valmiustila: {valueY}"
  })
}));

series_readiness.strokes.template.setAll({ strokeWidth: 2 })
series_readiness.get("tooltip").get("background").set("fillOpacity", 0.5);

var series_stress = chart.series.push(am5xy.LineSeries.new(root, {
  name: "Series Readiness",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "valueField2",
  valueXField: "date",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{valueX} Stressiarvo: {valueY}"
  })
}))

series_stress.strokes.template.setAll({
  strokeDasharray: [2, 2],
  strokeWidth: 2
});
  
// Add scrollbar
chart.set("scrollbarX", am5.Scrollbar.new(root, {
orientation: "horizontal"
}));

// Set date fields
root.dateFormatter.setAll({
  dateFormat: "dd-MM-yyyy",
  dateFields: ["valueX"]
});

// Set data
function generateData(hrvData) {
  // var data = generateDatas(50);
  // var data = generateDatas(testData);
  // series.data.setAll(data);
  series_readiness.data.setAll(hrvData); // HRV
  series_stress.data.setAll(hrvData); // Pulse
}

// Make stuff animate on load
series_readiness.appear(1000);
series_stress.appear(1000);
chart.appear(1000, 100);
  
});
