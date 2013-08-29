$(function() {
    $( "#slider-vertical" ).slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 100,
        value: 50,
        step: 1
    });

    var x = 0;

    $('#container').highcharts({
        chart: {
            type: 'spline'  ,
            animation: Highcharts.svg,
            events: {
                load: function() {
                    var series = this.series[0];
                    setInterval(function() {
                        x++;
                        var y = Math.floor(Math.random() * 10) + 1;
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            },
            marginTop: 20
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'seconds' ,
            labels: {
                formatter: function() {
                    if(this.value < 0) return ""
                    return this.value;
                }
            }
        },
        yAxis: {
            title: {
                text: null
            },
            min: 0,
            max: 10,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,
            plotBands: [{
                from: 0,
                to: 5,
                color: 'rgba(255, 0, 0, 0.1)'
            }, {
                from: 5,
                to: 10,
                color: 'rgba(0, 255, 0, 0.1)'
            }]
        },
        tooltip: {
            valueSuffix: ' m/s'
        },
        plotOptions: {
            spline: {
                lineWidth: 4,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                },
                pointInterval: 1000,
                pointStart: 0
            }
        },
        series: [{
            data: (function() {
                // generate an array of random data
                var data = [],
                    i;

                for (i = -10; i <= 0; i++) {
                    x = i;
                    data.push({
                        x: i,
                        y: 5
                    });
                }
                return data;
            })()

        }],
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        }
    });
});