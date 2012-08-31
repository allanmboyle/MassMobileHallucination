/*
 * Mass Mobile Hallucination.
 * Load test playfield
 *
 * Gonna dog food the load testing - a bunch of clients connect to the server and each one will open multiple
 * socket connections, all the data gets aggregated and sent here using the same MMH API's that the games use
 *
 * Copyright (c) 2012 MYOB Australia Ltd.
 */
var LoadTestPlayfield = (function () {
    var me = {};
    var socket;

    me.newUser = function (data) {
        processNewUser(data)
    }
    me.woosOut = function (data) {
        processWoosOut(data)
    }
    me.players = function (players) {
        players(data)
    }
    me.positionUpdates = function (updates) {}
    me.totalUpdates = function (updates) {
        processTotalUpdates(updates)
    }
    me.admin = function (message) {
        processAdminMessage(message)
    }
    me.processUserAnswer = function (answer) {}
    me.nameChange = function (data) {}

    me.init = function (theSocket) {
        socket = theSocket;

        //load test is all about pushing the socket.io server to the max.
        //so get it to aggregate results and send totals only
        socket.emit("admin", "yes_totals");
        socket.emit("admin", "no_updates");

        //start sending server metrics...
        socket.emit("admin", "metrics_on");
    }

    me.shutdown = function () {
        // stop the stats timer
        clearTimeout(timer);
    }

    me.initPlayers = function (players) {}


    var numberOfUsers = 0;
    var numberDroppedUsers = 0;
    var reportingInterval = 10000; // aggregate all server readings for 10 seconds before charting

    processTotalUpdates = function (totals) {

        document.getElementById("loadTestOutput").innerHTML = totals.left.count;
    }

    me.processPositionUpdates = function (updates) {}

    var requestsOverTime = [];
    var userCountOverTime = [];

    var intervalId = 0;
    var maxXAxis = 100; //default time line X axis to 100 seconds...

    var incrementalInterval = 0; //running total of  data that has yet to be plotted on graph
    var incrementalMessageCount = 0; //running total of  data that has yet to be plotted on graph



    // Server has sent through another measurement
    function processAdminMessage(message) {

        document.getElementById("loadTestMetricData").innerHTML = JSON.stringify(message);


        //aggregate all the data and redraw the graphs every 10 seconds..

        incrementalInterval += message.interval;
        incrementalMessageCount += message.messageCount;

        //if the reporting interval time has been exceeded redraw graphs and reset counters
        if (incrementalInterval >= reportingInterval) {
            intervalId += incrementalInterval;
            requestsOverTime.push([intervalId / 1000, incrementalMessageCount]);
            userCountOverTime.push([intervalId / 1000, numberOfUsers]);

            incrementalInterval = 0;
            incrementalMessageCount = 0;
            redrawCharts();
        }
    }

    function redrawCharts() {

        //if we are getting close to the edge of the graph rescale it who knows how long the load test will run for
        if (((intervalId / 1000) /maxXAxis) >= .8)
        {
            maxXAxis = (maxXAxis * 3.5);
        }

        // re plot the requests per second graph

        var options = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            }, // drawing is faster without shadows
            //yaxis: { min: 0, max: 500 },
            grid: {
                backgroundColor: {
                    colors: ["#fff", "#eee"]
                }
            },
            xaxis: {
                min: 0,
                max: maxXAxis
            }
        };
        var plot = $.plot($("#chartRequestsPerSecond"), [{
            label: "requests per 30 seconds",
            data: requestsOverTime
        }], options);

        //re plot the user count graph

        var options = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            }, // drawing is faster without shadows
            yaxis: {
                min: 0,
                max: 300
            },
            grid: {
                backgroundColor: {
                    colors: ["#fff", "#eee"]
                }
            },
            xaxis: {
                min: 0,
                max: maxXAxis
            }
        };
        var plot = $.plot($("#chartUserCount"), [{
            label: "user count per 30 seconds",
            data: userCountOverTime
        }], options);

    }

    function processNewUser() {
        numberOfUsers++;
        document.getElementById("loadTestNoOpenSockets").innerHTML = numberOfUsers;
    }

    function processWoosOut() {
        numberOfUsers--;
        numberDroppedUsers++;
        document.getElementById("loadTestDroppedConnections").innerHTML = numberDroppedUsers;
    }

    return me;
}());