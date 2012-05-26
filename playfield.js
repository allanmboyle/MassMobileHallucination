// Playfield socket message handlers

module.exports = {
	// the connection handler
	playfieldhandlers: function (socket) {
		console.log ("new playfield connection!");

		// on first connect pass the whole state board.
		socket.emit('board', {board: 5}); 
	},

	// how we get the current state of the play. We retrn this on first connection
	setboard: function setboard(board) {
		this.board = board;
	}
};

var board = {};
