//
// Mass Mobile Hellucination
// 
// @simonraikallen 2012
// 
var server 		= require('express').createServer(),  
	io			= require('socket.io').listen(server),
	playfield 	= require('./lib/playfield.js'),
	players 	= require('./lib/players.js');

// The state of the playing board. Where all the players are.
var board = {};

// start up the server 
server.listen(8080);

// Serve up our two html fies
server.get('/', function (req, res) { res.sendfile(__dirname + '/html/index.html'); });
server.get('/playfield', function (req, res) { res.sendfile(__dirname + '/html/playfield.html'); });

// socket handlers (one per namespace
var playersconnection = io.of('/players').on('connection', players.playerhandlers);
var playfieldconnection = io.of('/playfield').on('connection', playfield.playfieldhandlers);

// pass the playfield to the players module so they can tell the players where they have moved.
// TODO: We need a Board object that the players change and that in turn send a message to the playfield to redraw.
players.setplayfield(playfieldconnection);
