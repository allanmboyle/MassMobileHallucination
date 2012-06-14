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
        // Rotation value required for the canvas rotate method.
        centerX: 0,
        // Center x point on canvas to draw
        centerY: 0,
        // Center y point on canvas to draw.
        mouse: {},
        // Mouse object
        _dx: 0,
        _dy: 0,
        _canvas: null,
        _canvasElement: null,
        // State for playing or not playing the animations.
        trackMouse: null,

        mouseUp: function (e) {
            trackMouse = !trackMouse;
        },
        mouseMove: function (e) {
            if (e.pageX) {
                mouse.x = e.pageX;
            } else if (e.clientX) {
                mouse.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            }
            mouse.x = mouse.x - canvasElement.offsetLeft;
            if (e.pageY) {
                mouse.y = e.pageY;
            } else if (e.clientY) {
                mouse.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            mouse.y = mouse.y - canvasElement.offsetTop;
        },

        init: function (canvas, centerX, centerY, container) {
            mouse = {
                x: 0,
                y: 0
            };
            trackMouse = false;
            _canvas = canvas;
            this.centerX = centerX;
            this.centerY = centerY;
            _canvasElement = container;
            _canvasElement.addEventListener("mousemove", this.mouseMove, false);
            _canvasElement.addEventListener("mouseup", this.mouseUp, false);
        },

        updatePosition: function () {
            if (trackMouse) {
                // Distance from mouse x and center of canvas.
                this._dx = mouse.x - this.centerX;
                // Distance from mouse y and center of canvas.
                this._dy = mouse.y - this.centerY;
                // Radians for the canvas rotate method.
                this._radians = Math.atan2(this._dy, this._dx);
            }
        },

        position: function() {
            return this.mouse;
        },


        drawArrow: function () // Draw.
        {
            _canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            _canvas.strokeStyle = "red";
            _canvas.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            _canvas.fillStyle = "#ccc";
            _canvas.fillRect(.5, .5, CANVAS_WIDTH - 1, CANVAS_HEIGHT - 1);

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