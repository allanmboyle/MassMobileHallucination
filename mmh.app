//
// Mass Mobile Hallucination
// 
// @simonraikallen 2012
// 

var express = require('express');
var server 		= express.createServer(),  
	io			= require('socket.io').listen(server),
	playfield 	= require('./lib/playfield.js'),
	players 	= require('./lib/players.js');
    controller 	= require('./lib/controller.js');

// The currently connected user list
var playerList = {};

// start up the server 
server.listen(process.env.PORT || 8080);
io.set('log level', 3); // turn logging down

// serve up static content images, css etc...
server.use(express.static(__dirname + '/public')); 
server.use(express.static(__dirname + '/public/images')); 
server.use(express.static(__dirname + '/public/lib')); 

// Give some things nice names
server.get('/', function (req, res) { res.sendfile(__dirname + '/public/index.html'); });
server.get('/playfield', function (req, res) { res.sendfile(__dirname + '/public/playfield.html'); });
server.get('/test', function (req, res) { res.sendfile(__dirname + '/public/scaletest.html'); });
server.get('/motiontest', function (req, res) { res.sendfile(__dirname + '/public/motiondetector.html'); });
server.get('/control', function (req, res) { res.sendfile(__dirname + '/public/controller.html'); });
server.get('/bounce', function (req, res) { res.sendfile(__dirname + '/public/bounce/playfield.html'); });

// set up socket handlers (one per namespace)
// Should this move to each of the modules???
// TODO make te full connections list not global!
connections = {
	players: 	io.of('/players').on('connection', players.playerhandlers),
	playfield: 	io.of('/playfield').on('connection', playfield.playfieldhandlers),
	controller:	io.of('/control').on('connection', controller.sockethandlers)
}

// pass the player list to both modules as this is the main server state.
players.setPlayers(playerList);
playfield.setPlayers(playerList);

// start the timer that periodically sends player updates to the playfield
playfield.startUpdates();
