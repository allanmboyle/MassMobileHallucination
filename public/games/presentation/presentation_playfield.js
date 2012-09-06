/*
 * Mass Mobile Hallucination.
 * PresentationPlayField
 *
 * Copyright (c) 2012 MYOB Australia Ltd.
 *
 */

var PresentationPlayField = (function (playfieldSocket) {
    var me = {};
    //
    // Publics
    //
    me.init = function () {
        // tell the server we don't want totals (only real time updates)
        playfieldSocket.emit("admin", "no_updates");
    }
    me.newUser = function (data) 	{ /* doesn't matter if new come */}
    me.woosOut = function (data) 	{  }
    me.positionUpdates = function (updates) { }
    me.totalUpdates = function (updates) { }
    me.shutdown = function () { }
    me.admin = function(message) { }
    me.nameChange = function() {}
    me.processCustomMessage = function (message) {}

    me.initPlayers = function (players) {
        // can ignore this. Just need totals
    }

    return me;
}(socket));
