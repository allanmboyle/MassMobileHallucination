/*
 * Mass Mobile Hallucination.
 * Copyright (c) 2012 MYOB Australia Ltd.

 */


var Settings = (function () {
    var me = {};

    me.getSettings = function () {
        return _settings;
    } ;

    me.setSettings = function (data) {
        _settings.radius = data.radius;
    } ;

    //privates

    var _settings = {
        radius :10
    }

    return me;
}());


var PongPlayfield = (function () {

    var me = {};
    var socket;
    //
    // Publics
    //  
    me.newUser = function (data) {
        newUser(data);
    }
    me.woosOut = function (data) {
        woosOut(data);
    }
    me.players = function (players) {
        players(data) ;
    }
    me.totalUpdates = function (totals) {
        processTotalUpdates(totals);
    }
    me.positionUpdates = function (updates) {
        processPositionUpdates(updates);
    }
    me.admin = function (message) {
        if (message.game != undefined && message.game =="pong")
        {
            applyConfigurationSettings(message);
        }
    }

    me.processUserAnswer = function (answer) {
        //not used
    }

    me.init = function (theSocket) {
        socket = theSocket;
        // this game is only interested in totals, not individual updates...
        socket.emit("admin", "yes_totals");
        socket.emit("admin", "no_updates");
        initialiseGameVariables();
        drawGameBoard();
        //this game work by redrawing canvas every 30 milliseconds and applying  movement changes to paddle position
        setInterval(drawGameBoard, 30);
     //   setInterval(drawGameBoard, 10);
    }

    me.shutdown = function () {
        // stop the stats timer
        //      clearTimeout(timer);
    }

    // place players randomly on the screen
    me.initPlayers = function (players) {

    };

    //
    // Privates 
    //


    var config = function(){
        return Settings.getSettings();
    }


    var updateConfig = function(data)
    {
        Settings.setSettings(data);
    }


    var player1Input = 0;
    var player2Input = 0;

    var startX = 400;
    var startY = 300;

    var x = startX;
    var y = startY;

   // var ball_radius = config().radius;
    var dx = .75;
    var dy = 1.5;
    var paddleHeight =150;
    var paddleWidth =36;

    var canvasWidth;
    var canvasHeight;
    var intervalId = 0;

    var paddle1Y=0;
    var paddle2Y=0;
    var player1score = 0;
    var player1score = 0;
    var player2score = 0;

    var boardOpacity = 1.0;



    function applyConfigurationSettings(data)
    {
        updateConfig(data);

        //ball_radius = data.ballRadius;
        dx = data.dx;
        dy = data.dy;
        paddleHeight  = data.paddleHeight;
        paddleWidth = data.paddleWidth;
    }


    function movePaddle() {

        //apply changes to paddle but make sure it stays inside the box !
        var newpaddle1Y = paddle1Y + player1Input;
        if (newpaddle1Y < 0) {
            newpaddle1Y = 0;
        } else if (newpaddle1Y + paddleHeight > canvasHeight) {
            newpaddle1Y = canvasHeight - paddleHeight;
        }
        paddle1Y = newpaddle1Y;

        var newpaddle2Y = paddle2Y + player2Input;
        if (newpaddle2Y < 0) {
            newpaddle2Y = 0;
        } else if (newpaddle2Y + paddleHeight > canvasHeight) {
            newpaddle2Y = canvasHeight - paddleHeight;
        }
        paddle2Y = newpaddle2Y;

    }


    function drawGameBoard() {

        debugStats();
        movePaddle();
        ANIMATION.clear(0, 0, canvasWidth, canvasHeight);

        //black background
        ANIMATION.rectangleWithOpacity(0, 0, canvasWidth, canvasHeight,'00','00','00',boardOpacity);

        //white ball
        ANIMATION.circle(x, y, config().radius, '#FFFFFF');

        //player one red paddle
        ANIMATION.rectangle(0, paddle1Y, paddleWidth, paddleHeight, '#f00');

        //player two green paddle
        ANIMATION.rectangle(canvasWidth -paddleWidth, paddle2Y, paddleWidth, paddleHeight, '#629632');

        checkBounce();

        drawScore();
    }


    function drawScore(){
        ANIMATION.setText("44px Verdana",player1score + "  :  " + player2score  ,340,50,'#fff');
    }

    function checkBounce() {

        var pointOver = false;

        //Y coordinate update is dead easy if the ball hits the roof or the floor just reverse it
        if (y + dy  > canvasHeight - config().radius || y + dy - config().radius < 0)
        {
            dy = -dy;
        }
        y += dy;


        //right wall

        // is the edge of the ball in the hit zone

        if ((x + dx + config().radius) >= (canvasWidth - paddleWidth))
        {
          // if the right paddle is in positing bounce otherwise its out
         // var posx = x + dx;
          var posy = y + dy;

            //is the Y position in between the paddles
            if ((posy >= paddle2Y) && (posy<= paddle2Y + paddleHeight))
            {
                //bounce!
                dx = -dx;
            }
            else
            {
                //ball needs to be 1/3 or the radius past paddle
                if ((x + dx + config().radius) - (canvasWidth - paddleWidth) > .3 * config().radius)
                {
                    pointOver = true;
                    player1score++;

                }
            }
        }


        //left wall
        if ((x + dx - config().radius) <= (paddleWidth))
        {
            // if the right paddle is in positing bounce otherwise its out
        //    var posx = x + dx;
            var posy = y + dy;

            if ((posy >= paddle1Y) && (posy<= paddle1Y + paddleHeight))
            {
                //bounce!
                dx = -dx;
            }
            else
            {
                //ball needs to be 1/3 or the radius past paddle
                if (paddleWidth - (x + dx - config().radius)>= .3 *config().radius )
                {
                    pointOver = true;
                    player2score ++;
                }
            }
        }


        if (!pointOver)
        {
        x += dx;
            return;
        }

      // make the canvas flash !
        setTimeout(function(){ boardOpacity = 0.6; },25);
        setTimeout(function(){ boardOpacity = 0.65; },50);
        setTimeout(function(){ boardOpacity = 0.7; },75);
        setTimeout(function(){ boardOpacity = 0.75; },100);
        setTimeout(function(){ boardOpacity = 0.8; },125);
        setTimeout(function(){ boardOpacity = 0.84; },150);
        setTimeout(function(){ boardOpacity = 0.85; },175);
        setTimeout(function(){ boardOpacity = 1.0; },175);

        clearInterval(intervalId);
        initialiseGameVariables();
    }

    function initialiseGameVariables() {
        var ctx = document.getElementById("pongcanvas").getContext("2d");
        ANIMATION.setCanvas(ctx);
        canvasWidth = document.getElementById("pongcanvas").width;
        canvasHeight = document.getElementById("pongcanvas").height;

        x = startX;
        y = startY;
        dx = .75;
        dy = 1.5;

        document.body.addEventListener('keydown', onkeydown, false) ;
        document.body.addEventListener('keyup', onkeyup, false) ;

    }

    function onkeydown (e) {

        switch(e.keyCode) {
            //Q
            case 81:{
                player1Input = -5;
                break;
            }
            //A
            case 65:{
                player1Input = +5;
                break;
            }
            //L
            case 76:{
                player2Input = +5;
                break;
            }
            //P
            case 80:{
                player2Input = -5;
                break;
            }
            case 32:{
                alert('temp pause for debugging...');

                alert((x + dx + config().radius));
                alert((canvasWidth - paddleWidth))  ;
                clearInterval(intervalId);
            }
        }
    }

    function onkeyup (e) {

        switch(e.keyCode) {
            //Q
            case 81:{
                player1Input = 0;
                break;
            }
            //A
            case 65:{
                player1Input = 0;
                break;
            }
            //L
            case 76: {
                player2Input = 0;
                break;
            }
            //P
            case 80:    {
                player2Input = 0;
                break;
            }
        }
    }


    function debugStats() {
        var values = 'X = ' + x + '   y=' + y + ' dx=' + dx + ' dy=' + dy + '  paddle2Y=' + paddle2Y;
        document.getElementById("ponglog").innerHTML = values;
        var values = 'player1Input = ' + player1Input + '   player2Input = ' + player2Input;
        document.getElementById("ponglog1").innerHTML = values;
    }

    function processTotalUpdates (totals) {

      // this makes things blocky..
      //  player1Input = 0;
      //  player2Input = 0;


        //alert(JSON.stringify(totals));

        //if its null then do nothin!
       // if (totals.totalTiltFB == null) {
       //     return;
       // }

        //user input currently calibrated to +5 to -5 but maybe this should change??
        if (totals.left.totalTiltFB !=0)
        {
            player1Input = (totals.left.totalTiltFB / totals.left.count) / 90 * 5;
        }

        if (totals.right.totalTiltFB !=0)
        {
            player2Input = (totals.right.totalTiltFB / totals.right.count) / 90 * 5;
        }

    }


    function processPositionUpdates (updates) {
        //not used
    }

    // user changed their name
    function nameChange(data) {
       // not used
    }

    // handle the arrival of a new user to the game
    function newUser(data) {
       // not used
    }

    function woosOut(data) {
        //not used
    }
    return me;
}(Settings));