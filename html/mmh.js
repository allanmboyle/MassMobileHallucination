// mmh.js
//
// Share functions that are needed by many of the MassMobileHallucination clients. Its
// main responsiblities are to send
var MMH = (function (io) {
	
	var me = {};
	
	// 
	// Public methods
	// 
	
	me.init() {
		socket = io.connect('/players');
		init();
	}

	me.getOrientation() {
		return accel;
	}

	//
	// Private variables
	//
	var socket = null;
	// default to 40ms but can get throttled by the controller
	var SEND_FREQUENCY = 40;
	var accel = {};

	//
	// Private methods
	//
	
	// listen for setting changes from the controller
	socket.on('changeSettings', function(data){
		   SEND_FREQUENCY = data.freq;
	});

	// start listening for accelerometer changes
	function init() {
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
		}
	}

	function storeOrientation(tiltLR, tiltFB, dir, motionUD) {
		accel = {
			tiltLR: gameTiltLR,
			tiltFB: gameTiltFB,
			dir: gameDir,
			motionUD: gameMotionUD
		}
	}

	
	//
	// This is a periodic function.
	//
	function sendOrientationToGameServer() {
		socket.emit("axis", {axis: "x", accel: accel.tiltLR});
		socket.emit("axis", {axis: "y", accel: accel.tiltFB});
		// TODO: send the others
		
		// do it again in a few millis...
		setTimeout(sendOrientationToGameServer, SEND_FREQUENCY);
	}

	return me;
}(io));