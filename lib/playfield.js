// Playfield socket message handlers

module.exports = {
	// the connection handler
	playfieldhandlers: function (socket) {
		console.log ("new playfield connection!");

		// on first connect pass the whole state board.
		// TODO: pass a real board object or how we going to manage this?
		socket.emit('board', {board: 5}); 
	},

	// how we get the current state of the play. We retrn this on first connection
	setboard: function setboard(board) {
		this.board = board;
	}
};

var board = {};
