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

	me.init = function () {
		socket = io.connect('/players');

		// listen to the admin messages
		socket.on('admin', function(data){
			if (data.control == "changeSettings") {
				SEND_FREQUENCY = data.data.freq;
			}
		});
		
		if (clientHasAcceleromters()) {
			listenForAccelerometers();
		} else {
			listenForMouseMovements();
		}
		
	}

	// TODO stop sending orientation data. This needs to be called
	// from the start stop game stuff.
	me.shutdown = function () {
		clearTimeout(orientationTimer);
	}
	
	me.getOrientation = function () {
		return accel;
	}

	me.left = function() {
     	storeOrientation(-90, 0, 0, 0);
 	}

    me.right =function () {
     	storeOrientation(90, 0, 0, 0);
 	}

    me.tempInitKeyboardUser =function () {
     	sendOrientationToGameServer;
 	}

	//
	// Private stuff
	//
	var socket = null;
	var SEND_FREQUENCY = 100; // can get throttled
	var accel = {};
	var orientationTimer = null;

	// Listening for accelerometer changes
	function listenForAccelerometers() {
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

			// send the current orientation (left/right) periodically to the game server
			socket.emit("namechange", "iPhone Safarai");
			sendOrientationToGameServer();
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
				///??????
				}, false);
		} else {
			//document.getElementById("doEvent").innerHTML = "Not supported on your device or browser.  Sorry."
			alert("Sorry, your browser doesn't support access to acceleromters");
		}
	}

	function listenForMouseMovements() {
		window.onmousemove = function(e) {
			e = e || window.event;
			storeOrientation(
				(e.x / window.innerWidth ) * 180 - 90,
				(e.y / window.innerHeight ) * 180 - 90,
				0,
				0
			);
		};
		
		sendOrientationToGameServer();
	}
	
	function stopListeningForMouseMove() {
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
		// send the current data we have
		socket.emit("accel", accel);
		
		// do it again in a few millis...
		orientationTimer = setTimeout(sendOrientationToGameServer, SEND_FREQUENCY);
	}
	
	/*
	 * Here we must list all the possible user agents that contain accelerometers.
	 */
	function clientHasAcceleromters() {
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

	return me;
}());