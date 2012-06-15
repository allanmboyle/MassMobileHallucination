/*
 * Mass Mobile Hallucination.
 *
 * Copyright (c) 2012 MYOB Australia Ltd.
 *
 * Server side controller code for handling messages from the controller dashboard.
 */
var players 	= require("./players.js");
var playfield 	= require("./playfield.js");

module.exports = {
	sockethandlers: function (socket) {
		// Administrive messages are sent directly to all players.
		socket.on('admin', function (message) {
			console.log('new message from controller ' + message);
			players.sendAdminMessage(message.control, message.data);
		});

		// Handle the change game event. Tells the playfield to change the game. This
		// in turn triggers a broadcast to the players. But we'll leave that up to the
		// playfield to deal with.
		socket.on('changeGame', function (gameName) {
			console.log('controller says change game to ' + gameName);
			playfield.changeGame(gameName);
			players.changeGame(gameName);
		});
	}, 
}


