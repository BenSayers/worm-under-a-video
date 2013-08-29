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
        legend: {
            enabled: false
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'seconds' ,
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
                       case 10:
                           return "Yay!";
                       case 0:
                           return "No!";
                   }
                }
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

    window.addPoint = function(timeIndex, num){
        chart.series[0].addPoint([timeIndex, num], true, true);
    }


    var myPlayer;
    ninemsn.portal.common.video.ready(function () {
        myPlayer = new ninemsn.portal.common.video.Player({
            outputLocation: "video",
            height: '500',
            width: '800',
            data: {
                method: ninemsn.portal.common.video.enumerations.data.method.ID,
                filter: {
                    // id: "2633252440001"
                    id: '97F3402B-B6B6-451A-A99B-03127133372D'
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

        myPlayer.on('video:loaded', function () {

            var getExperience = function () {
                var experiences = window.brightcove.experiences;
                for (var exp in experiences) {
                    if (experiences.hasOwnProperty(exp) && $(experiences[exp]).hasClass('BrightcoveExperience')) {
                        return experiences[exp];
                    }
                }
            }

            var experience = brightcove.api.getExperience($(getExperience()).attr('id'));

            var videoPlayerModule = experience.getModule('videoPlayer');
            videoPlayerModule.addEventListener(window.brightcove.api.events.MediaEvent.SEEK_NOTIFY, function (event) {
                console.log('has seeked to ' + event.position);
            });
        });

        myPlayer.on('video:opening', function () {
            var socket = io.connect('http://localhost');
            var data = null;
            var positionsSent = {};

            var getPosition = function () {
                return parseInt(myPlayer.get('POSITION'));
            };

            var getMood = function () {
                return $('#slider-vertical').slider('option', 'value');
            };

            var collect = function () {
                var position = getPosition();

                if (!positionsSent[position]) {
                    var mood = getMood();
                    socket.emit('update', { mood: mood, index: position });
                    positionsSent[position] = true;
                }

                setTimeout(collect, 500);
            };

            socket.on('init', function (initData) {
                data = initData;
                collect()
            });
        });
    });
});