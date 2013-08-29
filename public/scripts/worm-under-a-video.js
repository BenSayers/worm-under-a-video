$(function() {
    $( "#slider-vertical" ).slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 10,
        value: 5,
        step: 1,

        slide: function( event, ui ) {
            console.log(ui.value);
        }
    });


    $('#container').highcharts({
        chart: {
            type: 'spline'
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
                pointInterval: 1,
                pointStart: 0
            }
        },
        series: [{
            data: [5, 4, 3, 2, 1, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10, 10, 10, 1, 2, 3, 4, 5, 5, 5, 5, 5, 4, 3, 2, 2, 2, 5, 4, 3, 2, 1, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10, 10, 10, 1, 2, 3, 4, 5, 5, 5, 5, 5, 4, 3, 2, 2, 2]

        }]
        ,
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        }
    });
});