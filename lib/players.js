/*
 * Mass Mobile Hallucination.
 *
 * Copyright (c) 2012 MYOB Australia Ltd.
 */

var playfield = require('./playfield.js');
var players = null; // passed in from mmh.

module.exports = {
	playerhandlers: function (socket) { 
		players[socket.id] = {};
		players[socket.id].id = socket.id;
		
		playfield.emit('newuser', {id: socket.id});

		socket.on('namechange', function (name) {
			players[socket.id].username = name;
			playfield.emit('namechange', {id: socket.id, username: name});
		});

		// receive the acceleromter info and pass it to the playfield
		socket.on('accel', function (data) {
			playfield.addUpdate({id: socket.id, accel: data});
		});

		socket.on('disconnect', function() {
			console.log("disconnected by " + players[socket.id].username);
			playfield.emit('woosout', {id: socket.id});
			delete players[socket.id] 
		});
	},
	
	sendAdminMessage: function (control, data) {
		connections.players.emit(control, data)
	},
	
	changeGame: function (newGame) {
		// TODO handle the changing of a game for the playfield. I think this is going to be a redirect to the new html file.
		console.log("players changing game to " + newGame);
		connections.players.emit("changeGame", newGame);
	},
	
	setPlayers: function(aPlayerList) { players = aPlayerList; }
}

