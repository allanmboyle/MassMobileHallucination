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

server.get('/', function (req, res) { res.sendfile(__dirname + '/public/index.html'); });
server.get('/playfield', function (req, res) { res.sendfile(__dirname + '/public/playfield.html'); });
server.get('/test', function (req, res) { res.sendfile(__dirname + '/public/scaletest.html'); });
server.get('/motiontest', function (req, res) { res.sendfile(__dirname + '/public/motiondetector.html'); });
server.get('/control', function (req, res) { res.sendfile(__dirname + '/public/controller.html'); });
server.get('/bounce', function (req, res) { res.sendfile(__dirname + '/public/bounce/playfield.html'); });

// set up socket handlers (one per namespace)
var playersConnection = io.of('/players').on('connection', players.playerhandlers);
var playfieldConnection = io.of('/playfield').on('connection', playfield.playfieldhandlers);
var controllerConnection = io.of('/control').on('connection', controller.sockethandlers);

// pass the playfield to the players module so they can tell the players where they have moved.
// pass the player list to both modules as this is the main server state.
players.setPlayfield(playfield);
players.setPlayers(playerList);

playfield.setPlayers(playerList);
playfield.setConnection(playfieldConnection);
//pass players connection to controller
controller.setConnection(playersConnection);

// start the timer that periodically sends player updates to the playfield
playfield.startUpdates();
