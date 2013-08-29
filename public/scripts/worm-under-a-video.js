$(function() {
    $( "#slider-vertical" ).slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 100,
        value: 50,
        step: 1,

        slide: function( event, ui ) {
            console.log(ui.value);
        }
    });

    $('#container').highcharts({
        chart: {
            type: 'spline'  ,
            animation: Highcharts.svg,
            events: {
                load: function() {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function() {
                        var x = (new Date()).getTime(), // current time
                            y = Math.random();
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            }
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'seconds'
        },
        yAxis: {
            title: {
                text: 'Sentiment'
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
            data: [5, 4, 1, 2, 1, 0, 1, 4, 2, 3, 7, 8, 10, 9, 3, 2, 3, 4, 5, 5.3, 5.1, 5.2, 5.1, 4, 3, 2, 1, 2, 5, 4, 1, 2, 1, 0, 1, 4, 2, 3, 7, 8, 10, 9, 3, 2, 3, 4, 5, 5.3, 5.1, 5.2, 5.1, 4, 3, 2, 1, 2]

        }]
        ,
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        }
    });
});