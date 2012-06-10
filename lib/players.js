var theplayfield = {};
var players = {};

module.exports = {
	playerhandlers: function (socket) { 
		players[socket.id] = {};
		players[socket.id].id = socket.id;
		theplayfield.emit('newuser', {id: socket.id});

		socket.on('namechange', function (name) {
			players[socket.id].username = name;
			theplayfield.emit('namechange', {id: socket.id, username: name});
		});

//		socket.on('axis', function (data) {
//			theplayfield.addUpdate({id: socket.id, axis: data.axis, accel: data.accel});
//		});

		// receive the acceleromter info and pass it to the playfield
		socket.on('accel', function (data) {
			theplayfield.addUpdate({id: socket.id, accel: data});
		});

/* THIS HAS TO GO! */
		socket.on('left', function (data) {
			theplayfield.addUpdate({id: socket.id, dir: 'l'});
		});

		socket.on('up', function (data) {
			theplayfield.addUpdate({id: socket.id, dir: 'u'});
		});

		socket.on('down', function (data) {
			theplayfield.addUpdate({id: socket.id, dir: 'd'});
		});

		socket.on('right', function (data) {
			theplayfield.addUpdate({id: socket.id, dir: 'r'});
		});
/* UP TO HERE */

		socket.on('disconnect', function() {
			console.log("disconnected by " + players[socket.id].username);
			theplayfield.emit('woosout', {id: socket.id});
			delete players[socket.id] 
		});
	},
	
	setPlayfield: function (aPlayfield) {
		theplayfield = aPlayfield;
	},

	setPlayers: function(aPlayerList) { players = aPlayerList; }
}

