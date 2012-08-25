/*
 * Mass Mobile Hallucination.
 *
 * Copyright (c) 2012 MYOB Australia Ltd.
 *
 * Server side code to handle all messages coming from players.
 */
var playfield = require('./playfield.js');
var players = null; // passed in from mmh.

module.exports = {
    playerhandlers: function (socket) {
        players[socket.id] = {};
        players[socket.id].id = socket.id;

        console.log("playfield.emit 'newuser' to playfield");
        playfield.emit('newuser', {
            id: socket.id
        });

        socket.on('namechange', function (name) {
            console.log("socket.on 'namechange' fired");
            players[socket.id].username = name;
            playfield.emit('namechange', {
                id: socket.id,
                username: name
            });
        });

        // receive the acceleromter info and pass it to the playfield
        socket.on('accel', function (data) {
            playfield.addUpdate({
                id: socket.id,
                accel: data
            });
        });

        socket.on('custom', function (data) {
            console.log("custom message from from player" + players[socket.id].username)
            playfield.sendCustomMessage(socket.id, data);
        });

        // player sending an answer
        // SRA: this should go... too game specific.
        //socket.on('answer', function (data) {
        //    console.log("socket.on 'answer' - answer received from player" + players[socket.id].username)
        //    playfield.emit('answer', data);
        //});

        socket.on('disconnect', function () {
            console.log("disconnected by " + players[socket.id].username);
            console.log("playfield.emit 'woosout'");
            playfield.emit('woosout', {
                id: socket.id
            });
            delete players[socket.id]
        });
    },

    sendAdminMessage: function (control, data) {
        connections.players.emit(control, data)
    },

    changeGame: function (newGame) {
        console.log("players changing game to " + newGame);
        connections.players.emit("changeGame", newGame);
    },

    setPlayers: function (aPlayerList) {
        players = aPlayerList;
    }
}