
module.exports = {

	sockethandlers: function (socket) {
		
			socket.on('controllerMessage', function (message) {
			console.log('new message from controller ' + message);

			// to do  socket.broadcast to all players ...
					});

	}
}


