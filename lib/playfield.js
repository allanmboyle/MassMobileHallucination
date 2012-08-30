/*
 * Mass Mobile Hallucination.
 *
 * Copyright (c) 2012 MYOB Australia Ltd.
 *
 * Playfield socket message handlers. These are all the messages 
 * the playfield can send to the server.
 */
var players = {};
var updates = [];
var playfieldConnection = null;
var totals = {};
var no_updates = false;
var no_totals = false;
var metrics_on = false;
var SAMPLING_INTERVAL = 30000; //collect metrics every 10 seconds
var countNumberRequests = 0;

var UPDATE_FREQUENCY = 100; // milliseconds between updates of player states to playfield

module.exports = {
    // Used for first time connections. Tells the playfield who is
    // currently in play.
    playfieldhandlers: function (socket) {
        console.log("playfield: received new playfield connection!");

        // send the new playfield the players list on connection
        console.log("playfield: sending 'players' list");
        socket.emit('players', players);

        // Turning on and off the type of updates the playfield should send out. These
        // come from the controller only.
        socket.on("admin", function (message) {
            console.log("socket.on 'admin' ");
            console.log("admin message: " + message);
            if (message == "no_updates") {
                no_updates = true;
            } else if (message == "yes_updates") {
                no_updates = false;
            } else if (message == "no_totals") {
                no_totals = true;
            } else if (message == "yes_totals") {
                no_totals = false;
            } else if (message.update_frequency) {
                setUpdateFrequency(message.update_frequency);
            }
            else if(message =="metrics_on"){
                metrics_on = true;
                periodicSendServerMetrics();
            }
        });

        socket.on("sendtoUser", function (socketId, data) {
            console.log("playfield: message for one user recieved");
            console.log("playfield: socket.on 'sendtoUser' ");
            connections.players.socket(socketId).emit("userMessage", data);
        });

    },

    // setters
    setPlayers: function (aPlayerList) {
        players = aPlayerList;
    },

    // passthrough for the player module
    // TODO get rid of this. Other modules should call specfic methods which then do the emit.
    //		 a pass through is not "oo".
    // this is currently used for name changes.
    emit: function (message, data) {
        console.log("playfield: sending message: " + message + " with data: " + data);
        connections.playfield.emit(message, data);
    },

    sendCustomMessage: function (id, data) {
        console.log("playfield: sending custom message with data: " + data + " from client " + id);
        connections.playfield.emit("custom", {id: id, data: data});
    },



    sendAdminMessage: function (control, data) {
        connections.playfield.emit(control, data)
    },

    // Accept and store a acceleromter update from a client. These are stored until
    // they are ready to be sent. They are also averaged in case the particular game
    // requires that functionality. In this latter case only the average is sent to the
    // playfield, otherwise all user updates are sent to the playfield. The playfield
    // decides on a per game basis.
    addUpdate: function (update) {

        if (metrics_on)
        {
            countNumberRequests++;
        }

        // store
        updates.push(update);

        // sum the totals of all the values. The playfield can choose the sum or an average
        // depending on the game.

        if (update.accel.playerLocation == "right") {
            totals.right.count++;
            totals.right.totalTiltLR += update.accel.tiltLR;
            totals.right.totalTiltFB += update.accel.tiltFB;
            totals.right.totalDir += update.accel.dir;
            totals.right.totalMotionUD += update.accel.motionUD;
        } else {
            totals.left.count++;
            totals.left.totalTiltLR += update.accel.tiltLR;
            totals.left.totalTiltFB += update.accel.tiltFB;
            totals.left.totalDir += update.accel.dir;
            totals.left.totalMotionUD += update.accel.motionUD;
        }

        /*       totals.totalTiltLR += update.accel.tiltLR;
         totals.totalTiltFB += update.accel.tiltFB;
         totals.totalDir += update.accel.dir;
         totals.totalMotionUD += update.accel.motionUD;*/
    },

    // kick start the updates
    startUpdates: function () {
        periodicPlayfieldUpdate();
    },

    changeGame: function (newGame) {
        console.log("playfield: sending change game to " + newGame);
        connections.playfield.emit("changeGame", newGame);
    }

};
// run every so often and sends the collection of user updates
// to the play field
// TODO Make these update/totals config items actually work!
function periodicPlayfieldUpdate() {
    if (updates.length > 0) {
        // send updates (if not stopped)
        if (!no_updates) {
            connections.playfield.emit("updates", updates)
        };

        // send totals
        //totals.count = updates.length;
        if (!no_totals) {
            connections.playfield.emit("totals", totals)
        };

        // reset everything for next time
        updates = [];
        resetTotals();
    }
    setTimeout(periodicPlayfieldUpdate, UPDATE_FREQUENCY);
}

function periodicSendServerMetrics(){

    var metrics= {};
    metrics.messageCount =  countNumberRequests;
    metrics.interval =  SAMPLING_INTERVAL;
    metrics.memoryUsage = process.memoryUsage();
    metrics.uptime = process.uptime();
    metrics.interval = SAMPLING_INTERVAL;


    connections.playfield.emit("admin", metrics);

    resetServerMetrics();
    setTimeout(periodicSendServerMetrics, SAMPLING_INTERVAL);
}

function setUpdateFrequency(freq) {
    UPDATE_FREQUENCY = freq;
}

function resetServerMetrics()
{
    countNumberRequests =0;
}

function resetTotals() {
    /*	totals.totalTiltLR 		= 0;
     totals.totalTiltFB 		= 0;
     totals.totalDir 		= 0;
     totals.totalMotionUD 	= 0;
     totals.count			= 0; */
    totals.right = {};
    totals.right.count = 0;
    totals.right.totalTiltLR = 0;
    totals.right.totalTiltFB = 0;
    totals.right.totalDir = 0;
    totals.right.totalMotionUD = 0;

    totals.left = {};
    totals.left.count = 0;
    totals.left.totalTiltLR = 0;
    totals.left.totalTiltFB = 0;
    totals.left.totalDir = 0;
    totals.left.totalMotionUD = 0;

}

resetTotals();