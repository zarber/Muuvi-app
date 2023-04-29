//student's hrv chart all measurements
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
            date: new Date(jsonHrvData[i].date)
        }
        hrvData.push(newData);
    }

    console.log("Arvot: ", hrvData);

    // Sending data to HRV chart
    generateData(hrvData);
};

fetchData();

// Create root element
var root = am5.Root.new("hrv_chart_student_all");

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
    pinchZoomX: true
}));

// Add cursor
var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
cursor.lineY.set("visible", false);

// Create axes
var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15
});

xRenderer.grid.template.setAll({
    location: 1
})

var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.3,
    categoryField: "date",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
}));

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
    })
}));

// Create series
var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "valueField1",
    sequencedInterpolation: true,
    categoryXField: "date",
    tooltip: am5.Tooltip.new(root, {
    labelText: "{valueY}"
    })
}));

series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
series.columns.template.adapters.add("fill", function(fill, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.columns.template.adapters.add("stroke", function(stroke, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
});

root.dateFormatter.setAll({
    dateFormat: "dd-MM-yyyy",
    dateFields: ["valueX"]
    });

// Set data
function generateData(hrvData) {
xAxis.data.setAll(hrvData);
series.data.setAll(hrvData);
}
    
// Make stuff animate on load
series.appear(100);
chart.appear(100, 10);

}); 