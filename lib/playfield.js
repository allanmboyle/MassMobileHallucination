/*
 * Mass Mobile Hallucination.
 *
 * Copyright (c) 2012 MYOB Australia Ltd.
 *
 * Playfield socket message handlers
 */
var players = {};
var updates = [];
var playfieldConnection = null;
var totals = {};
var no_updates = false;
var no_totals = false;
var UPDATE_FREQUENCY = 40;	// milliseconds between updates of player states to playfield

module.exports = {
	// Used for first time connections. Tells the playfield who is
	// currently in play.
	playfieldhandlers: function (socket) {
		console.log ("new playfield connection!");
		
		// send the new playfield the players list on connection
		socket.emit('players', players); 
		
		// Turning on and off the type of updates the playfield should send out. These
		// come from the controller only.
		socket.on("admin", function (message) {
			console.log ("admin message: " + message);
			if (message == "no_updates") { no_updates = true; }
			else if (message == "yes_updates") { no_updates = false; }
			else if (message == "no_totals") { no_totals = true; }
			else if (message == "yes_totals") { no_totals = false; }
		});

		socket.on("sendtoUser", function (socketId,data) {
			console.log("message for one user recieved");
			connections.players.socket(socketId).emit("userMessage",data);
		});

	},

	// setters 
	setPlayers: function(aPlayerList) { players = aPlayerList; },

	// passthrough for the player module
	// TODO get rid of this. Other modules should call specfic methods which then do the emit.
	//		 a passthrough is not "oo".
	emit: function (message, data) {
		console.log("playfield sending message: " + message + " with data: " + data);
		connections.playfield.emit(message, data);
	},
	
	// Accept and store a acceleromter update from a client. These are stored until
	// they are ready to be sent. They are also averaged in case the particular game
	// requires that functionlity. In this latter case only the average is sent to the 
	// playfield, otherwise all user updates are sent to the playfield. The playfield 
	// decides on a per game basis.
	addUpdate: function(update) { 
		// store
		updates.push(update);
		
		// sum the totals of all the values. The playfield can choose the sum or an average
		// depending on the game.
		totals.totalTiltLR += update.accel.tiltLR;
		totals.totalTiltFB += update.accel.tiltFB;
		totals.totalDir += update.accel.dir;
		totals.totalMotionUD += update.accel.motionUD;
	},

	// kick start the updates
	startUpdates: function() { 
		periodicPlayfieldUpdate();
	},
	
	changeGame: function(newGame) {
		// TODO handle the changing of a game for the playfield. I think this is going to be a redirect to the new html file.
		console.log("TODO playfield has been asked to change the game to " + newGame);
		connections.playfield.emit("changeGame", newGame);
	}
};

// run every so often and sends the collection of user updates
// to the play field
// TODO Make these update/totals config items actually work!
function periodicPlayfieldUpdate() {
	if (updates.length > 0 ) {
		// send updates (if not stopped)
		if (!no_updates) { connections.playfield.emit("updates", updates) };

		// send totals
		totals.count = updates.length;
		if (!no_totals) { connections.playfield.emit("totals", totals) };

		// reset everything for next time
		updates = []; 
		resetTotals();
	}
	setTimeout(periodicPlayfieldUpdate, UPDATE_FREQUENCY);
}

function resetTotals() {
	totals.totalTiltLR 		= 0;
	totals.totalTiltFB 		= 0;
	totals.totalDir 		= 0;
	totals.totalMotionUD 	= 0;
	totals.count			= 0;
}

resetTotals();
