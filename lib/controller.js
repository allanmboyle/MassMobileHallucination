var playersConnection = null;
module.exports = {

	sockethandlers: function (socket) {
		
			socket.on('controllerMessage', function (message) {
			console.log('new message from controller ' + message);
			//broadcast to all players
			playersConnection.emit('admin','a message from the controller' + message);
					});

	},
 setConnection: function(connection) { playersConnection = connection; },
}


