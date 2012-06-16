/*
 * Mass Mobile Hallucination.
 * Copyright (c) 2012 MYOB Australia Ltd.
 * 
 * BouncePlayField.js - implementation of the bounce game. Client side playfield.
 *
 * 14-06-12 AidanC first version - rewriting bounce to run inside a replaceable div with local variables etc...
 */

var BouncePlayfield = (function () {
	var me = {};
	var socket;
	
	//
	// Publics
	//	
	me.newUser = function (data) 	{ newUser(data) }
	me.woosOut = function (data) 	{ woosOut(data) }
	me.players = function (players) { players(data) }
	me.updates = function (updates) { processPositionUpdates(updates) }
	me.admin = function(message) 	{ alert("Bounce playfield got an admin message: " + messages); }
	
	me.init = function (theSocket) {
	
		alert('bounce init!!');
		socket = theSocket;
		
		// tell the server we don't want totals (only real time updates)
		socket.emit("admin", "no_totals");

		// Start the timer that measures timing statistics
		stats();
		
		// redraw the board when we come back here. On the first time it might do nothing.
		updateBoard(); 
	}

	me.shutdown = function () { 
		// stop the stats timer
//		clearTimeout(timer);
	}
	
	// place players randomly on the screen
	me.initPlayers = function (players) {

    };
	
	//
	// Privates 
	//

	// var theBoard = {};
	// var numberOfPlayers = 0;
	// var numberOfCalls = 0;

	// var times = 0;
	// var totalTime = 0;

	// MAX_X = 900;
	// MAX_Y = 600;

	me.processPositionUpdates = function (updates) {

	}

	// user changed their name
	function nameChange(data) {

	}

	// handle the arrival of a new user to the game
	function newUser(data) {

	}

	// Color them out on woosing out of the game
	function woosOut(data) {

	}

	function updateBoard() {

	}

	// write the stats to the playfield
	function stats() {

	}
	
	return me;
}());