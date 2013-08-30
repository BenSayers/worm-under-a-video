$(function() {

    var calculateMoodColor = function (moodValue) {
        var r, g, b = 0;
        g = Math.round(255 / 100 * moodValue); // 2.55 * (0 - 100) = 0 - 255
        r = 255 - g;
        return 'rgba(' + r + ',' + g + ',' + b + ', 0.2)';

    }

    var normalizePitch = function(pitch){
        var normalized = pitch < -7 ? -7 : pitch;
        normalized = normalized > -3 ? -3 : normalized;   
        normalized = (normalized + 7) / 4;
        return Math.round(normalized * 100)
    }

    var onDeviceMotion = function (event) {
        var y = event.accelerationIncludingGravity.y;
        $('#slider-vertical').slider('option', 'value', normalizePitch(y));
    }

    window.addEventListener("devicemotion",onDeviceMotion,false);


    $( "#slider-vertical" ).slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 100,
        value: 50,
        step: 1 ,
        slide: function(event, ui) {
            var color = calculateMoodColor(ui.value);
            $(this).find('.ui-slider-range').css({
                'background': color
            });
        }
    });

    $('.ui-slider-range').css({background: 'rgba(128, 127, 0, 0.2)'});

    var x = 0;

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'spline'  ,
            animation: {
                duration: 900
            },
            events: {

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
                       case 50:
                           return "Meh";
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
            width: '820',
            data: {
                method: ninemsn.portal.common.video.enumerations.data.method.ID,
                filter: {
                     id: "2217663448001"
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

         var postCommentToTimeline = function (commentObj) {

             var commentMood =  calculateMoodColor(commentObj.mood);
             $('.comments').prepend('<div class="comment" style="background-color:' + commentMood + '">' + commentObj.comment + '</div>')
         }

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

            var updateGraph = function(position, clientMood, comments) {
                var graphData = { x: position }

                var existing = data[position];
                if (existing) {
                    var newCount = existing.count + 1;
                    graphData.y = ((existing.mood * existing.count) + clientMood) / newCount;
                    graphData.count = newCount;

                    if (existing.comments && existing.comments.length) {
                        postCommentToTimeline(existing.comments[0]);
                    }
                } else {
                    graphData.y = clientMood;
                    graphData.count = 1;
                }

                chart.series[0].addPoint([graphData.x, graphData.y], true, true);
                //chart.series[1].addPoint([nextPosition.x, clientMood], true, true);

                $('.number').text(graphData.count + ' user(s)');



            };

            var collect = function () {
                var position = getPosition();

                if (!positionsSent[position]) {
                    var mood = getMood();
                    updateGraph(position, mood);
                    socket.emit('client-mood-update', { mood: mood, index: position });

                    positionsSent[position] = true;
                }

                setTimeout(collect, 100);
            };

            var postComment = function () {
                var position = getPosition();
                var mood = getMood();
                var commentObj = { comment: $('.comments-box').val(), mood: mood, index: position };
                socket.emit('client-comment-update', commentObj);
                postCommentToTimeline(commentObj);
                $('.comments-box').val('');
            };

            $('.comments-submit-button').click(postComment);

            $('.comments-box').keyup(function (event) {
                if(event.keyCode == 13){
                    $('.comments-submit-button').click();
                }
            });

            socket.on('init', function (initData) {
                console.log(initData);
                data = initData;
                collect()
            });

            socket.on('update', function(dataItem) {
                data[dataItem.index] = dataItem
            });
        });
    });
});