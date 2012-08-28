/*
 * Mass Mobile Hallucination.
 *
 * Copyright (c) 2012 MYOB Australia Ltd.
 *
 * Server side controller code for handling messages from the controller dashboard.
 */
var players = require("./players.js");
var playfield = require("./playfield.js");

module.exports = {
    sockethandlers: function (socket) {
        // Administrative messages are sent directly to all players.
        socket.on('admin', function (message) {
            console.log("socket.on 'admin'");
            players.sendAdminMessage(message.control, message.data);
        });

        // Administrative message for the playfield .
        socket.on('playfield_admin', function (message) {
            console.log("socket.on 'playfield_admin'");
            playfield.sendAdminMessage('admin', message.data);
        });

        // Handle the change game event. Tells the playfield to change the game. This
        // in turn triggers a broadcast to the players. But we'll leave that up to the
        // playfield to deal with.
        socket.on('changeGame', function (gameName) {
            console.log("controller: received 'changeGame' to " + gameName);
            playfield.changeGame(gameName);
            players.changeGame(gameName);
        });
    },
}