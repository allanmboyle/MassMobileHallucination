module.exports = {
	playerhandlers: function (socket) { 
		console.log("We have a connection!");

		socket.on('namechange', function (name) {
			socket.set("username", name);
			console.log("Name change: " + name);
		});

		socket.on('left', function (data) {
			socket.get("username", function (err, name) {
				theplayfield.emit('change', {left: name});
				console.log("left from " + name);
			});
		});

		socket.on('right', function (data) {
			socket.get("username", function (err, name) {
				// TODO: update the board and run the game.
				// Send a message to playfield
				theplayfield.emit('change', {right: name});
				console.log("right from " + name);
			});
		});

		socket.on('disconnect', function() {
			socket.get("username", function (err, name) {
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
