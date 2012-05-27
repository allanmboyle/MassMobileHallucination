// Playfield socket message handlers

var players = {};
var updates = [];
var playfieldConnection = null;

var UPDATE_FREQUENCY = 200;	// milliseconds between updates of player states to playfield

// I envisaged this containing more game specific commands that the playfield 
// would be interested in. It doesn't at the moment. If it stays this size 
// I'll incorporate it into the player code.
//
// but it might just evolve...
module.exports = {
	// Used for first time connections. Tells the playfield who is
	// currently in play.
	playfieldhandlers: function (socket) {
		console.log ("new playfield connection!");
		socket.emit('players', players); 
	},

	// setters 
	setPlayers: function(aPlayerList) { players = aPlayerList; },
	setConnection: function(connection) { playfieldConnection = connection; },

	// passthrough for the player module
	emit: function (message, data) {
		playfieldConnection.emit(message, data);
	},
	
	// record a change. These are grouped up and sent as a bunch
	// on a periodic basis
	addUpdate: function(update) {
		updates.push(update);
	},

	// kick start the updates
	startUpdates: function() { 
		periodicPlayfieldUpdate();
	}
};

// run every so often and sends the collection of user updates
// to the play field
function periodicPlayfieldUpdate() {
	if (updates.length > 0 ) {
		playfieldConnection.emit("updates", updates)	
		updates = []; // reset for next time
	}
	setTimeout(periodicPlayfieldUpdate, UPDATE_FREQUENCY);
}

