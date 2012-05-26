module.exports = {
	playerhandlers: function (socket) { 
		console.log("We have a connection!");


		socket.on('namechange', function (name) {
			console.log("Name change: " + name);
			socket.set("username", name);
			// this is a problem. can't create a new one on name change.
			// TODO: use socket.id to track changes.
			theplayfield.emit('newuser', {username: name});
		});

		socket.on('left', function (data) {
			socket.get("username", function (err, name) {
				theplayfield.emit('change', {direction: 'left', username: name});
				console.log("left from " + name);
			});
		});

		socket.on('right', function (data) {
			socket.get("username", function (err, name) {
				// TODO: update the board and run the game.
				// Send a message to playfield
				theplayfield.emit('change', {direction: 'right', username: name});
				console.log("right from " + name);
			});
		});

		socket.on('disconnect', function() {
			socket.get("username", function (err, name) {
				// TODO: emit a disconnect to the playfield
				console.log("disconnected by " + name);
			});
		});
	},
	
	setplayfield: function (playfield) {
		console.log("setting the playfield");
		theplayfield = playfield;
	}
}

var theplayfield = {};
