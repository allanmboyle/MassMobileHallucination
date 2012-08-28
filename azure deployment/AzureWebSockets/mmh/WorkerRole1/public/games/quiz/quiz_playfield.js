/*
 * Mass Mobile Hallucination.
 * Copyright (c) 2012 MYOB Australia Ltd.
 * 
 * worm_playfield.js - implementation of the worm game.
 */
var QuizPlayfield = (function (playfieldSocket) {
	var me = {};
	var userVotes = {};

	//
	// Publics
	//	
	me.init = function () {
		// tell the server we don't want totals (only real time updates)
		playfieldSocket.emit("admin", "no_updates");
	}
	me.newUser = function (data) 	{ /* doesn't matter if new come */}
	me.woosOut = function (data) 	{ removeUserVote(data); }
	me.positionUpdates = function (updates) { }
	me.totalUpdates = function (updates) { }
	me.shutdown = function () { }
	me.admin = function(message) { }
	
	me.processCustomMessage = function (message) {
		recordVote(message);
	}	
	
	me.initPlayers = function (players) { 
		// can ignore this. Just need totals
	}

	// this should be called periodically to see if the totals have changed.
	me.calculateVotes = function () {
		var votes = [0,0,0,0];

		for (user in userVotes) {
			switch (userVotes[user]) {
				case 'A': 
					votes[0]++;
					break;
				case 'B': 
					votes[1]++;
					break;
				case 'C': 
					votes[2]++;
					break;
				case 'D': 
					votes[3]++;
			}
		}
		return votes;
	}


	me.clearVotes = function () {
		userVotes = {};
	}
	//
	// privates
	//

	function removeUserVote(data) {
		if (userVotes[data.id]) {
			delete userVotes[data.id];
		}	
	}

	function recordVote(message) {
		// overrides any previous vote so you can only provide 
		userVotes[message.id] = message.data;
	}

	return me;
}(socket));