// mmh.js
//
// Share functions that are needed by many of the MassMobileHallucination clients.
//
// TODO stop sending movements to server on request. Ie. some games don't need it.
var MMH = (function () {
	
	var me = {};
	
	// 
	// Public methods
	// 

	me.init = function (playerSocket) {
		socket = playerSocket;
		//socket = io.connect('/players'); // SHOULD THIS BE HERE? WILL IT LISTEN MULTIPLE TIMES IF CALLED REPEATADLY?

		// listen to the admin messages
		socket.on('admin', function(data){
			if (data.control == "changeSettings") { // TODO rename to changeSendFrequency
				SEND_FREQUENCY = data.data.freq;
			}
		});
	}

	// listen for movements and start sending them to the server. Optionally
	// send them to a callback as well.
	me.listenForMovements = function (clientCallback) {
        try
        {
		if (me.clientHasAcceleromters()) {
			startListeningForAccelerometers();
		} else {
			startListeningForMouseMovements();
		}

		me.startSendingOrientationToServer();

		// save the client callback if they have passed in one.
		if (clientCallback) clientCallbackFunction = clientCallback;
        }
        catch(error)
        {
            alert(error);
        }
	}
	
	// from the start stop game stuff.
	me.shutdown = function () {
		stopSendingOrientationToServer();
		
	}
	
	me.startSendingOrientationToServer = function () {
		// do it again in a few millis...
		orientationTimer = setInterval(sendOrientationToGameServer, SEND_FREQUENCY);
	}
	
	me.stopSendingOrientationToServer = function() {
		clearTimeout(orientationTimer);
	}
	
	me.getOrientation = function () {
		return accel;
	}

	me.sendAnswerToServer = function(data){
		sendAnswerToServer(data);
	}

	// SRA: removing because I think MMH should listen for the changes and 
	// the app should display them if it wants to.
	
 	//me.sendMovement = function (tiltLR, tiltFB, dir, motionUD){
 	//		storeOrientation(tiltLR, tiltFB, dir, motionUD) 
 	//}

	/*
	 * Here we must list all the possible user agents that contain accelerometers.
	 */
	me.clientHasAcceleromters = function() {
		var accelerometerDevices = [
			"iPhone",
			"iPod",
			"iPad"];
		
		// TODO support the above array
		if (navigator.userAgent.indexOf("iPhone") != -1) {
			return true;
		}
		return false;
	}

	//
	// Private stuff
	//
	var socket = null;
	var SEND_FREQUENCY = 100; // can get throttled
	var accel = {};
	var orientationTimer = null;
	var clientCallbackFunction = null;

	// Listening for accelerometer changes
	function startListeningForAccelerometers() {
		if (window.DeviceOrientationEvent) {
			//document.getElementById("doEvent").innerHTML = "DeviceOrientation";
			// Listen for the deviceorientation event and handle the raw data
			window.addEventListener('deviceorientation', function(eventData) {
				// gamma is the left-to-right tilt in degrees, where right is positive
				var tiltLR = eventData.gamma;

				// beta is the front-to-back tilt in degrees, where front is positive
				var tiltFB = eventData.beta;
				
				// alpha is the compass direction the device is facing in degrees
				var dir = eventData.alpha
				
				// deviceorientation does not provide this data
				var motUD = null;
				
				// call our orientation event handler
				storeOrientation(tiltLR, tiltFB, dir, motUD);
				}, false);
		} else if (window.OrientationEvent) {
			alert("This browser needs a little work before it will work properly");
			//document.getElementById("doEvent").innerHTML = "MozOrientation";
			window.addEventListener('MozOrientation', function(eventData) {
				// x is the left-to-right tilt from -1 to +1, so we need to convert to degress
				var tiltLR = eventData.x * 90;
				
				// y is the front-to-back tilt from -1 to +1, so we need to convert to degress
				// We also need to invert the value so tilting the device towards us (forward) 
				// results in a positive value. 
				var tiltFB = eventData.y * -90;
				
				// MozOrientation does not provide this data
				var dir = null;
				
				// z is the vertical acceleration of the device
				var motUD = eventData.z;
				
				storeOrientation(tiltLR, tiltFB, dir, motUD);
				}, false);
		} else {
			//document.getElementById("doEvent").innerHTML = "Not supported on your device or browser.  Sorry."
			alert("Sorry, your browser doesn't support access to acceleromters");
		}
	}

	function startListeningForMouseMovements() {
		window.onmousemove = function(e) {
			e = e || window.event;
			storeOrientation(
				(e.x / window.innerWidth ) * 180 - 90,
				(e.y / window.innerHeight ) * 180 - 90,
				0,
				0
			);
		};
	}
	
	function stopListeningForMouseMovements() {
		document.onmousemove = null;
	}
	
	// This is just the last change recorded. The last one recorded gets sent
	// according to the throttle.
	function storeOrientation(tiltLR, tiltFB, dir, motionUD) {
		accel = {
			tiltLR: tiltLR,
			tiltFB: tiltFB,
			dir: dir,
			motionUD: motionUD
		}
	}

	//
	// This is a periodic function.
	//
	function sendOrientationToGameServer() {
		// send the current data we have at this point in time 
		// note, it does not send every reading we have had since the last send.
		socket.emit("accel", accel);
		
		clientMovementCallback(accel);
	}
	
	// Call the cilents call back if they are interested in using the movements.
	function clientMovementCallback(accel) {
		if (clientCallbackFunction) clientCallbackFunction(accel);
	}

	function sendAnswerToServer(data){
        socket.emit("answer",data);
	}
	
	return me;
}());