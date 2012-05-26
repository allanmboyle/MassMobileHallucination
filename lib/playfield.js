// Playfield socket message handlers

var players = {};

module.exports = {
	// the connection handler
	playfieldhandlers: function (socket) {
		console.log ("new playfield connection!");
		socket.emit('players', players); 
	},

	setPlayers: function(aPlayerList) { players = aPlayerList; }
};

