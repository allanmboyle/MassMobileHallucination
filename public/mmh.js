// mmh.js
//
// Share functions that are needed by many of the MassMobileHallucination clients. Its
// main responsiblities are to send
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
		
		listenForAccelerometers();
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
	var SEND_FREQUENCY = 40; // gets throttled
	var accel = {};

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
		socket.emit("accel", accel);
		
		// Only send if the data is not null. Its null on some browsers on laptops.
		//if (accel.tiltLR != null) {
		//	socket.emit("axis", {axis: "x", accel: accel.tiltLR});
		//	socket.emit("axis", {axis: "y", accel: accel.tiltFB});
		//	// TODO: send the others
		//}
		// do it again in a few millis...
		setTimeout(sendOrientationToGameServer, SEND_FREQUENCY);
	}

	return me;
}());