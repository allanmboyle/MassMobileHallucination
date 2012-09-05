/*
 * Mass Mobile Hallucination.
 *
 * Copyright (c) 2012 MYOB Australia Ltd.
 *
 * Drawing stuff on the canvas
 */
var ANIMATION = (function () {
	
	var me = {};
	var _canvas = null;

	me.setCanvas = function (canvas){
	_canvas = canvas;
    }

	me.circle = function(x,y,r,colour, img) {
	  _canvas.beginPath();
	  _canvas.arc(x, y, r, 0, Math.PI*2, true);
	  _canvas.closePath();
	  _canvas.fillStyle   = colour;
	  _canvas.fill();
      // _canvas.drawImage(img, x-r-2,y-r-2);
    }

    me.rectangle = function(x,y,w,h,colour) {
      _canvas.beginPath();
	  _canvas.rect(x,y,w,h);
	  _canvas.closePath();
	  _canvas.fillStyle   = colour;
	  _canvas.fill();
    }

    me.rectangleWithOpacity = function(x,y,w,h,r,g,b,opactiy) {
        _canvas.beginPath();
        _canvas.fillStyle   = "rgba(" + r + "," +  g + "," +  b + "," +  opactiy + ")";
        _canvas.rect(x,y,w,h);
        _canvas.closePath();

        _canvas.fill();
    }

    me.setText = function(font,text,x,y, colour)
    {
        _canvas.fillStyle = colour;
        _canvas.font = font;
        _canvas.fillText(text, x, y);
    }

    me.dottedMiddleLine = function(height,width,colour,depthFromEdges ) {

        var currentPoint = depthFromEdges;

        _canvas.beginPath();
        _canvas.strokeStyle =colour;
        _canvas.lineWidth   = 4;
        _canvas.moveTo( width / 2, depthFromEdges );

        while ( currentPoint < height -depthFromEdges ) {
            currentPoint += 6;
            _canvas.lineTo( width / 2, currentPoint );

            currentPoint += 10;
            _canvas.moveTo( width / 2, currentPoint );
        }

        _canvas.stroke();
    }



    me.clear =function (x,y,w,h) {
 	 _canvas.clearRect(x, y, w, h);
 	 _canvas.fillStyle   = '#FFFFFF'; // set canvas background color
	_canvas.fillRect  (0,   0, w, h);  // now fill the canvas
}
	return me;
}());