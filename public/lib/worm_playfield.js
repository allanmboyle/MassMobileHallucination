/*
 * Mass Mobile Hallucination.
 * Copyright (c) 2012 MYOB Australia Ltd.
 * 
 * worm_playfield.js - implementation of the worm game.
 */

var WormPlayfield = (function () {
	var me = {};

var socket;
	//
	// Publics
	//	
	me.init = function (socket) {
		// tell the server we don't want totals (only real time updates)
		socket.emit("admin", "no_updates");
		
	me.newUser = function (data) 	{ newUser(data) }
	me.woosOut = function (data) 	{ woosOut(data) }
	me.players = function (players) { players(data) }
	me.updates = function (updates) { processPositionUpdates(updates) }
	me.shutdown = function () { }
	me.admin = function(message) { alert("Fairy playfield got an admin message: " + messages); 	}	}
	
	me.initPlayers = function (players) { 
		// can ignore this. Just need totals
	}

	return me;
}());