/*
 * Mass Mobile Hallucination.
 *
 * Copyright (c) 2012 MYOB Australia Ltd.
 *
 */

var express = require('express');
var server  = express.createServer();
var io      = require('socket.io').listen(server);

server.listen(process.env.PORT || 8080);

console.log("Server listening on port %d", server.address().port);

var    playfield = require('./lib/playfield.js'),
    players = require('./lib/players.js');
controller = require('./lib/controller.js');

// The currently connected user list
var playerList = {};



var useLongPolling = true;

if (!useLongPolling) {
    //sockets
    io.set('log level', 2); // turn logging down
    io.enable('browser client minification'); // send minified client
    io.enable('browser client etag'); // apply etag caching logic based on version number
    io.enable('browser client gzip'); // gzip the file
    io.set('transports', [ // enable all transports (optional if you want flashsocket)
        'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling' ]);

} else {
    //long polling
    io.set('log level', 2); // turn logging down
    io.configure(function () {
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 10);
    });
}


process.on('uncaughtException', function (err) {
    console.log('uncaught error' + err);
});

// serve up static content images, css etc...
server.use(express.static(__dirname + '/public'));
server.use(express.static(__dirname + '/public/images'));
server.use(express.static(__dirname + '/public/lib'));

// Give some things nice names
server.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
server.get('/playfield', function (req, res) {
    res.sendfile(__dirname + '/public/playfield.html');
});
server.get('/test', function (req, res) {
    res.sendfile(__dirname + '/public/scaletest.html');
});
server.get('/control', function (req, res) {
    res.sendfile(__dirname + '/public/controller.html');
});

// set up socket handlers (one per namespace)
// Should this move to each of the modules???
// TODO make te full connections list not global!
connections = {
    players: io.of('/players').on('connection', players.playerhandlers),
    playfield: io.of('/playfield').on('connection', playfield.playfieldhandlers),
    controller: io.of('/control').on('connection', controller.sockethandlers)
}

// pass the player list to both modules as this is the main server state.
players.setPlayers(playerList);
playfield.setPlayers(playerList);

// start the timer that periodically sends player updates to the playfield
playfield.startUpdates();