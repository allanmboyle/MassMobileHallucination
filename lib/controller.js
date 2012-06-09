var playersConnection = null;
module.exports = {
	sockethandlers: function (socket) {
		socket.on('admin', function (message) {
			console.log('new message from controller ' + message);
			playersConnection.emit(message.control, message.data);
		});
	}, 
	
	setConnection: function(connection) { 
		playersConnection = connection; 
	}
}


