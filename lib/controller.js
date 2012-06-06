var playersConnection = null;
module.exports = {

	sockethandlers: function (socket) {
		
			socket.on('controlPanelMsg', function (message) {
			console.log('new message from controller ' + message);
			//broadcast to all players
			playersConnection.emit('changeSettings', message);
					});

	},
 setConnection: function(connection) { playersConnection = connection; },
}


