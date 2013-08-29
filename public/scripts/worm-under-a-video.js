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

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'spline'  ,
            animation: Highcharts.svg,
            events: {
//                load: function() {
//                    var series = this.series[0];
//                    setInterval(function() {
//                        x++;
//                        var y = Math.floor(Math.random() * 10) + 1;
//                        series.addPoint([x, y], true, true);
//                    }, 1000);
//                }
            },
            marginTop: 20
        },
        legend: {
            enabled: false
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'seconds' ,
            minRange: 30,
            tickInterval: 5,
            labels: {
                formatter: function() {
                    if(this.value < 0) return ""

                    var mins = Math.floor(this.value/60),
                        seconds = this.value%60;

                    if(seconds < 10)
                        seconds = "0" + seconds;

                    return mins + ":" + seconds;
                }
            }
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function() {
                   switch(this.value){
                       case 100:
                           return "Yay!";
                       case 0:
                           return "No!";
                   }
                }
            },
            min: 0,
            max: 100,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,
            plotBands: [{
                from: 0,
                to: 50,
                color: 'rgba(255, 0, 0, 0.1)'
            }, {
                from: 50,
                to: 100,
                color: 'rgba(0, 255, 0, 0.1)'
            }]
        },
        tooltip: {
            valueSuffix: 's'
        },
        plotOptions: {
            spline: {
                lineWidth: 5,
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

                for (i = -30; i <= 0; i++) {
                    x = i;
                    data.push({
                        x: i,
                        y: 50
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

    window.addPoint = function(timeIndex, num){
        chart.series[0].addPoint([timeIndex, num], true, true);
    };

    var myPlayer;
    ninemsn.portal.common.video.ready(function () {
        myPlayer = new ninemsn.portal.common.video.Player({
            outputLocation: "video",
            height: '500',
            width: '800',
            data: {
                method: ninemsn.portal.common.video.enumerations.data.method.ID,
                filter: {
                     id: "2579842694001"
                }
            },
            ads: {
                freewheel: {
                    serverUrl: 'http://5c264.v.fwmrm.net',
                    networkId: 377444,
                    siteSection: 'noAds'
                }
            }
        });

        myPlayer.on('video:opening', function () {
            var socket = io.connect('/');
            var data = null;
            var positionsSent = {};

            var getPosition = function () {
                return parseInt(myPlayer.get('POSITION'));
            };

            var getMood = function () {
                return $('#slider-vertical').slider('option', 'value');
            };

            var updateGraph = function(position, clientMood) {
                var nextPosition = { x: position }

                var existing = data[position];
                console.log('existing', existing);
                if (existing) {
                    var newCount = existing.count + 1;
                    nextPosition.y = ((existing.mood * existing.count) + clientMood) / newCount;
                } else {
                    nextPosition.y = clientMood;
                }

                chart.series[0].addPoint([nextPosition.x, nextPosition.y], true, true);
            };

            var collect = function () {
                var position = getPosition();

                if (!positionsSent[position]) {
                    var mood = getMood();
                    updateGraph(position, mood);
                    socket.emit('client-update', { mood: mood, index: position });
                    positionsSent[position] = true;
                }

                setTimeout(collect, 500);
            };

            socket.on('init', function (initData) {
                data = initData;
                collect()
            });

            socket.on('update', function(dataItem) {
                data[dataItem.index] = { count: dataItem.count, mood: dataItem.mood }
            });
        });
    });
});