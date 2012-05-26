//
// Mass Mobile Hellucination
// 
// @simonraikallen 2012
// 
var server 		= require('express').createServer(),  
	io			= require('socket.io').listen(server),
	playfield 	= require('./lib/playfield.js'),
	players 	= require('./lib/players.js');

// The currently connected user list
var playerList = {};

// start up the server 
server.listen(8080);

// Serve up our two html fies
server.get('/', function (req, res) { res.sendfile(__dirname + '/html/index.html'); });
server.get('/playfield', function (req, res) { res.sendfile(__dirname + '/html/playfield.html'); });

// set up socket handlers (one per namespace)
var playersconnection = io.of('/players').on('connection', players.playerhandlers);
var playfieldconnection = io.of('/playfield').on('connection', playfield.playfieldhandlers);

// pass the playfield to the players module so they can tell the players where they have moved.
// pass the player list to both connections. This is the main server state.
players.setPlayfield(playfieldconnection);
players.setPlayers(playerList);
playfield.setPlayers(playerList);
