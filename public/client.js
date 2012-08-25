/*
 * The client side Javascript code.
 *
 *
 *
 *
 *
 */

MMH.performSlowCrappyGyroscopeDetection();

// 
// Socket messages received by each client
//
var socket = io.connect('/players');

socket.on('changeSettings', function (data) {
    document.getElementById("log").innerHTML = "message from controller " + JSON.stringify(data);
});

socket.on('changeGame', function (game) {
    changeGame(game);
});

/* MAY NOT NEED THIS YET
socket.on('userMessage', function (message) {
    //this is fired when the palyfield targets a single user....
    //e.g. for millionaire we need to quit people from the game if they get the wrong answers...
    alert('message from server');
    alert(message);
});
*/

//
// client helper functions
//

// Change the game on request of the controller and initialize the screens and data
function changeGame(gameName) {
    $("#main").load("/games/"+gameName+"/client.html", function () {
        initClient();
    });
}

function setPlayerLocation(input){

    MMH.setPlayerLocation(input);
}

function getPlayerLocation(){
    return MMH.getPlayerLocation();
}

// TODO move to MMH.js
function changeName() {
    socket.emit("namechange", document.getElementById('username').value);
}






