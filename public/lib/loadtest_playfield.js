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

	me.newUser 			= function (data) 	 { newUser(data) }
	me.woosOut 			= function (data) 	 {  }
	me.players 			= function (players) { players(data) }
	me.positionUpdates 	= function (updates) {  }
	me.totalUpdates 	= function (updates) { processTotalUpdates(updates) }
	me.admin 			= function (message) {  }
	me.processUserAnswer = function (answer) {}

	me.init = function (theSocket) {
		socket = theSocket;

        //load test is all about pushing the socket.io server to the max.
        //so get it to aggregate results and send totals only
        socket.emit("admin", "yes_totals");
        socket.emit("admin", "no_updates");

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

	var theBoard = {};
	var numberOfPlayers = 0;
	var numberOfCalls = 0;

	var times = 0;
	var totalTime = 0;

	MAX_X = 900;
	MAX_Y = 600;

	processTotalUpdates = function (updates) {



    }
	
	me.processPositionUpdates = function (updates) {
	}

	// user changed their name
	// Sometimes the player with data.id is not found. Not sure why!
	function nameChange(data) {
	}


	// every second see how many user updates were received		
	var lastCount = 0;
	var timer = null;
	
	// write the stats to the playfield
	function stats() {
		callsInThisPeriod = numberOfCalls - lastCount;
	//	document.getElementById("stats").innerHTML = callsInThisPeriod;
	//	lastCount = numberOfCalls;
    //
	//	document.getElementById("timer").innerHTML = totalTime/times;
//		totalTime=0;times=0;
  //
		timer = setTimeout(stats, 1000);
	}
	
	return me;
}());