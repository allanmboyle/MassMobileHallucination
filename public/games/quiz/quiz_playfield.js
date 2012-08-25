/*
 * Mass Mobile Hallucination.
 * Copyright (c) 2012 MYOB Australia Ltd.
 * 
 * worm_playfield.js - implementation of the worm game.
 */
var QuizPlayfield = (function (playfieldSocket) {
	var me = {};

	//
	// Publics
	//	
	me.init = function () {
		// tell the server we don't want totals (only real time updates)
		playfieldSocket.emit("admin", "no_updates");
	}
	me.newUser = function (data) 	{ /* doesn't matter if new come */}
	me.woosOut = function (data) 	{ removeUserAnswer(data); }
	me.positionUpdates = function (updates) { }
	me.totalUpdates = function (updates) { }
	me.shutdown = function () { }
	me.admin = function(message) { }
	
	me.processCustomMessage = function (message) {
		recordAnswer(message);
	}	
	
	me.initPlayers = function (players) { 
		// can ignore this. Just need totals
	}

	// this should be called periodically to see if the totals have changed.
	me.getAnswers = function () {
		var answers = [0,0,0,0];

		for (user in userAnswers) {
			switch (userAnswers[user]) {
				case 'A': 
					answers[0]++;
					break;
				case 'B': 
					answers[1]++;
					break;
				case 'C': 
					answers[2]++;
					break;
				case 'D': 
					answers[3]++;
			}
		}
		return answers;
	}

	me.clearAnswers = function () {
		userAnswers = {};
	}

	//
	// privates
	//
	var userAnswers = {};

	function removeUserAnswer(data) {
		if (userAnswers[data.id]) {
			delete userAnswers[data.id];
		}	
	}

	function recordAnswer(message) {
		// overrides any previos answer
		userAnswers[message.id] = message.data;
	}

	return me;
}(socket));
