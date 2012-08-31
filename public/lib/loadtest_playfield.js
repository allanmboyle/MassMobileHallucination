/*
 * Mass Mobile Hallucination.
 * Load test playfield
 *
 * Gonna dog food the load testing - a bunch of clients will send data to the server and it
 * all gets pumped to this palyfield
 *
 *   CPU
 *   Requests per second
 *   Number of sessions
 *   Number of dropped sessions
 *
 * Copyright (c) 2012 MYOB Australia Ltd.

 */

var LoadTestPlayfield = (function () {
	var me = {};
	var socket;

    me.newUser 			=  function (data) 	 { processNewUser(data) }
    me.woosOut 			= function (data) 	 { processWoosOut(data) }
    me.players 			= function (players) { players(data) }
    me.positionUpdates 	= function (updates) {  }
    me.totalUpdates 	= function (updates) { processTotalUpdates(updates) }
    me.admin 			= function (message) { processAdminMessage(message) }
    me.processUserAnswer = function (answer) {}

    me.nameChange  =  function (data) 	 {  }



    me.init = function (theSocket) {
		socket = theSocket;

        //load test is all about pushing the socket.io server to the max.
        //so get it to aggregate results and send totals only
        socket.emit("admin", "yes_totals");
        socket.emit("admin", "no_updates");

        //start sending server metrics...
        socket.emit("admin", "metrics_on");

		// Start the timer that measures timing statistics
		stats();
	}

	me.shutdown = function () { 
		// stop the stats timer
		clearTimeout(timer);
	}
	
	me.initPlayers = function (players) {
    }
	
	//
	// Privates 
	//

    var numberOfUsers = 0;
    var numberDroppedUsers = 0;


    var theBoard = {};
	var numberOfPlayers = 0;
	var numberOfCalls = 0;

	var times = 0;
	var totalTime = 0;

	MAX_X = 900;
	MAX_Y = 600;

	processTotalUpdates = function (totals) {


        document.getElementById("loadTestOutput").innerHTML = totals.left.count;


    }
	
	me.processPositionUpdates = function (updates) {
	}

    var requestsOverTime = [];
    var userCountOverTime = [];

    var intervalId = 0;
    var maxYAxis  = 100;


	function processAdminMessage(message) {

        document.getElementById("loadTestMetricData").innerHTML = JSON.stringify(message);

        //convert interval to  seconds...
        intervalId = intervalId + (message.interval/1000);


        requestsOverTime.push([intervalId, message.messageCount]);
        userCountOverTime.push([intervalId, numberOfUsers]);

    }



    function replotChart()
    {

        if ((intervalId/maxYAxis) >= .8)
        {
            maxYAxis = (maxYAxis * 10);
        }


        var options = {
            series: { lines: { show: true },points: { show: false } }, // drawing is faster without shadows
            //yaxis: { min: 0, max: 500 },
            grid: {backgroundColor: { colors: ["#fff", "#eee"] }}
            ,            xaxis: {min: 0, max: maxYAxis}
        };
        var plot = $.plot($("#chartRequestsPerSecond"), [{label: "requests per 30 seconds",  data: requestsOverTime} ], options);

        var options = {
            series: { lines: { show: true },points: { show: false } }, // drawing is faster without shadows
            yaxis: { min: 0, max: 300 },
            grid: {backgroundColor: { colors: ["#fff", "#eee"] }}
            ,            xaxis: {min: 0, max: maxYAxis}
        };
        var plot = $.plot($("#chartUserCount"), [{label: "user count per 30 seconds",  data: userCountOverTime} ], options);

    }

    function processNewUser()
    {
        numberOfUsers++;
        document.getElementById("loadTestNoOpenSockets").innerHTML = numberOfUsers;
    }
    function processWoosOut()
    {
        numberOfUsers--;
        numberDroppedUsers++;
        document.getElementById("loadTestDroppedConnections").innerHTML = numberDroppedUsers;
    }



    // every second see how many user updates were received
	var lastCount = 0;
	var timer = null;
	
	// write the stats to the playfield
	function stats() {
		callsInThisPeriod = numberOfCalls - lastCount;

        replotChart();
		timer = setTimeout(stats, 5000);
	}
	
	return me;
}());