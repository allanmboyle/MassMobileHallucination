function MouseArrow() {
    // The arrow drawing we are rotating.
    var obj = {
        strokeColor: "#8ED6FF",
        fillColor: "#0000ff",
        x: -50,
        // Starting x
        y: -25,
        // Starting y
        _radians: 0,
        _angle: 0,
        // Rotation value required for the canvas rotate method.
        centerX: 0,
        // Center x point on canvas to draw
        centerY: 0,
        // Center y point on canvas to draw.
        mouse: {},

        _orientation: {},
        // Mouse object
        _dx: 0,
        _dy: 0,
        _width: 0,
        _height: 0,
        _canvas: null,
        _canvasElement: null,
        // State for playing or not playing the animations.
        trackMouse: null,
        eventAction: null,

        getOrientation: function () {
            x = this._angle;

            if (x >= -45 && x <= 45) {
                //right
                _orientation.tiltLR = 90;
                _orientation.tiltFB = 0;
                return _orientation;
            } else if (x <= -45 && x >= -135) {
                //up
                _orientation.tiltLR = 0;
                _orientation.tiltFB = 90;
                return _orientation;
            }
            //left
            else if (x <= 180 && x >= 135) {
                _orientation.tiltLR = -90;
                _orientation.tiltFB = 0;
                return _orientation;
            } else if (x >= -180 && x <= -135) {
                //left
                _orientation.tiltLR = -90;
                _orientation.tiltFB = 0;
                return _orientation;
            }
            //down
            _orientation.tiltLR = 0;
            _orientation.tiltFB = -90;
            return _orientation;

        },
        mouseUp: function (e) {
            trackMouse = !trackMouse;
        },

        angle: function () {
            return this._angle;
        },
        mouseMove: function (e) {
            if (e.pageX) {
                mouse.x = e.pageX;
            } else if (e.clientX) {
                mouse.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            }
            mouse.x = mouse.x - _canvasElement.offsetLeft;
            if (e.pageY) {
                mouse.y = e.pageY;
            } else if (e.clientY) {
                mouse.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            mouse.y = mouse.y - _canvasElement.offsetTop;
        },

        subscribeorientationchanged: function (fn) {
            this.eventAction = fn;
        },
        init: function (name) {
            mouse = {
                x: 0,
                y: 0
            };
            _orientation = {
                tiltLR: 0,
                tiltFB: 0
            };

            trackMouse = false;

            _canvas = document.getElementById(name).getContext("2d"); 
            _canvasElement = document.getElementById(name);
            _width = document.getElementById(name).width;
            _height = document.getElementById(name).height;
            this.centerX = _width / 2;
            this.centerY = _height / 2;

            _canvasElement.addEventListener("mousemove", this.mouseMove, false);
            _canvasElement.addEventListener("mouseup", this.mouseUp, false);
        },

        updatePosition: function (dx, dy) {
            //if (trackMouse) {
                // Distance from mouse x and center of canvas.
                this._dx = mouse.x - this.centerX;
                // Distance from mouse y and center of canvas.
                this._dy = mouse.y - this.centerY;
                // Radians for the canvas rotate method.
                this._radians = Math.atan2(this._dy, this._dx);
				this._radians = Math.atan2(dx, dy);

                this._angle = this._radians * (180 / Math.PI);

                //raise event that orientation has changed
                if (this.eventAction != null) {
                    this.getOrientation();
                    this.eventAction(_orientation.tiltLR, _orientation.tiltFB, 0, 0);
                }
            //}
        },

        drawArrow: function () // Draw.
        {
            _canvas.clearRect(0, 0, _width, _height);
            _canvas.strokeStyle = "red";
            _canvas.strokeRect(0, 0, _width, _height);
            _canvas.fillStyle = "#ccc";
            _canvas.fillRect(.5, .5, _width - 1, _height - 1);
            // Draw off canvas
            _canvas.save();
            //Translate canvas to center
            _canvas.translate(this.centerX, this.centerY);
            // Rotate
            _canvas.rotate(this._radians);
            // Create new drawing
            _canvas.beginPath();
            // Start point top left of arrow shaft.
            _canvas.moveTo(this.x, this.y);
            // Top left of arrow shaft plus top left of arrow head.         
            _canvas.lineTo(this.x + 50, this.y);
            _canvas.lineTo(this.x + 50, this.y - 25);
            // Arrow point.
            _canvas.lineTo(this.x + 100, this.y + 25);
            _canvas.lineTo(this.x + 50, this.y + 75);
            // Bottom left of arrow head and bottom left of arrow shaft.
            _canvas.lineTo(this.x + 50, this.y + 50);
            _canvas.lineTo(this.x, this.y + 50);
            // Close the bottom of arrow shaft.         
            _canvas.lineTo(this.x, this.y);
            _canvas.fillStyle = this.strokeColor;
            _canvas.fill();
            _canvas.strokeStyle = this.fillColor;
            _canvas.stroke();
            // Put it on the canvas
            _canvas.restore();
        }
    }
    return obj;
}