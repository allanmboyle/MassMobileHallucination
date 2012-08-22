/*
 * Mass Mobile Hallucination.
 * Copyright (c) 2012 MYOB Australia Ltd.

 */
var Settings = (function () {
    var me = {};

    me.getSettings = function () {
        return _settings;
    };

    me.setSettings = function (data) {
        _settings.radius = data.radius;
        _settings.dx = data.dx;
        _settings.dy = data.dy;
        _settings.paddleHeight = data.paddleHeight;
        _settings.paddleWidth = data.paddleWidth;
        _settings.gameLoopInterval = data.gameLoopInterval;
        _settings.debugMode = data.debugMode;
    };

    //defaults
    var _settings = {
        radius: 20,
        dx: 2.0,
        dy: 5.0,
        paddleHeight: 100,
        paddleWidth: 25,
        gameLoopInterval: 30,
        debugMode: false
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
        //not used
    }
    me.woosOut = function (data) {
       // not used
    }
    me.players = function (players) {
        //not used
    }
    me.totalUpdates = function (totals) {
        processTotalUpdates(totals);
    }
    me.positionUpdates = function (updates) {
        //not used
    }
    me.admin = function (message) {
        if (message.game != undefined && message.game == "pong") {
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

        setInterval(gameLoop, config().gameLoopInterval);
    }

    me.shutdown = function () {
        // stop the stats timer
        //      clearTimeout(timer);
    }

    // place players randomly on the screen
    me.initPlayers = function (players) {
      //not used
    };

    //
    // Privates 
    //

    var config = function () {
        return Settings.getSettings();
    }

    var updateConfig = function (data) {
        Settings.setSettings(data);
    }

    //game object
    var game = {
        player1Input: 0,
        player2Input: 0
    }
    game.score = {
        player1: 0,
        player2: 0
    }
    game.ball = {
        x: 0,
        y: 0
    }
    game.paddle = {
        leftY: 0,
        rightY: 0
    }

    var startX = 400;
    var startY = 300;

    var dx = config().dx;
    var dy = config().dy;

    var canvasWidth;
    var canvasHeight;
    var intervalId = 0;
    var boardOpacity = 1.0;

    function applyConfigurationSettings(data) {
        updateConfig(data);
    }

    function movePaddles() {
        //apply changes to paddle but make sure it stays inside the box !
        var newpaddle1Y = game.paddle.leftY + game.player1Input;
        if (newpaddle1Y < 0) {
            newpaddle1Y = 0;
        } else if (newpaddle1Y + config().paddleHeight > canvasHeight) {
            newpaddle1Y = canvasHeight - config().paddleHeight;
        }
        game.paddle.leftY = newpaddle1Y;

        var newpaddle2Y = game.paddle.rightY + game.player2Input;
        if (newpaddle2Y < 0) {
            newpaddle2Y = 0;
        } else if (newpaddle2Y + config().paddleHeight > canvasHeight) {
            newpaddle2Y = canvasHeight - config().paddleHeight;
        }
        game.paddle.rightY = newpaddle2Y;
    }

    function gameLoop() {
        if (config().debugMode) {
            outputDebugInfoToPlayfield();
        }
        drawBoard();
        movePaddles();
        drawBall();
        drawPaddles();
        checkBounce();
        drawScore(game.score);
    }

    function drawPaddles(){
        //player one red paddle
        ANIMATION.rectangle(0, game.paddle.leftY, config().paddleWidth, config().paddleHeight, '#f00');

        //player two green paddle
        ANIMATION.rectangle(canvasWidth - config().paddleWidth, game.paddle.rightY, config().paddleWidth, config().paddleHeight, '#629632');

    }

    function drawBall(){
        //white ball
        ANIMATION.circle(game.ball.x, game.ball.y, config().radius, '#FFFFFF');
    }

    function drawBoard(){
        ANIMATION.clear(0, 0, canvasWidth, canvasHeight);

        //black background
        ANIMATION.rectangleWithOpacity(0, 0, canvasWidth, canvasHeight, '00', '00', '00', boardOpacity);
    }

    function drawScore(score) {
        ANIMATION.setText("44px Verdana", score.player1 + "  :  " + score.player2, 340, 50, '#fff');
    }

    function checkBounce() {
        var pointOver = false;

        //Y coordinate update is dead easy if the ball hits the roof or the floor just reverse it
        if (game.ball.y + dy > canvasHeight - config().radius || game.ball.y + dy - config().radius < 0) {
            dy = -dy;
        }
        game.ball.y += dy;


        //right wall

        // is the edge of the ball in the hit zone

        if ((game.ball.x + dx + config().radius) >= (canvasWidth - config().paddleWidth)) {
            // if the right paddle is in positing bounce otherwise its out
            var posy = game.ball.y + dy;

            //is the Y position in between the paddles
            if ((posy >= game.paddle.rightY) && (posy <= game.paddle.rightY + config().paddleHeight)) {
                //bounce!
                dx = -dx;
            } else {
                //ball needs to be 1/3 or the radius past paddle
                if ((game.ball.x + dx + config().radius) - (canvasWidth - config().paddleWidth) > .3 * config().radius) {
                    pointOver = true;
                    game.score.player1++;

                }
            }
        }

        //left wall
        if ((game.ball.x + dx - config().radius) <= (config().paddleWidth)) {
            // if the right paddle is in positing bounce otherwise its out
            var posy = game.ball.y + dy;

            if ((posy >= game.paddle.leftY) && (posy <= game.paddle.leftY + config().paddleHeight)) {
                //bounce!
                dx = -dx;
            } else {
                //ball needs to be 1/3 or the radius past paddle
                if (config().paddleWidth - (game.ball.x + dx - config().radius) >= .3 * config().radius) {
                    pointOver = true;
                    game.score.player2++;
                }
            }
        }

        if (!pointOver) {
            game.ball.x += dx;
            return;
        }

        // make the canvas flash !
        setTimeout(function () {
            boardOpacity = 0.6;
        }, 25);
        setTimeout(function () {
            boardOpacity = 0.65;
        }, 50);
        setTimeout(function () {
            boardOpacity = 0.7;
        }, 75);
        setTimeout(function () {
            boardOpacity = 0.75;
        }, 100);
        setTimeout(function () {
            boardOpacity = 0.8;
        }, 125);
        setTimeout(function () {
            boardOpacity = 0.84;
        }, 150);
        setTimeout(function () {
            boardOpacity = 0.85;
        }, 175);
        setTimeout(function () {
            boardOpacity = 1.0;
        }, 175);

        clearInterval(intervalId);
        initialiseGameVariables();
    }

    function initialiseGameVariables() {
        var ctx = document.getElementById("pongcanvas").getContext("2d");
        ANIMATION.setCanvas(ctx);
        canvasWidth = document.getElementById("pongcanvas").width;
        canvasHeight = document.getElementById("pongcanvas").height;

        game.ball.x = startX;
        game.ball.y = startY;
        dx = config().dx;
        dy = config().dy;

        document.body.addEventListener('keydown', onkeydown, false);
        document.body.addEventListener('keyup', onkeyup, false);
    }

    function onkeydown(e) {

        switch (e.keyCode) {
            //Q
            case 81:
            {
                game.player1Input = -5;
                break;
            }
            //A
            case 65:
            {
                game.player1Input = +5;
                break;
            }
            //L
            case 76:
            {
                game.player2Input = +5;
                break;
            }
            //P
            case 80:
            {
                game.player2Input = -5;
                break;
            }
            case 32:
            {
                alert('temp pause for debugging...');
            }
        }
    }

    function onkeyup(e) {

        switch (e.keyCode) {
            //Q
            case 81:
            {
                game.player1Input = 0;
                break;
            }
            //A
            case 65:
            {
                game.player1Input = 0;
                break;
            }
            //L
            case 76:
            {
                game.player2Input = 0;
                break;
            }
            //P
            case 80:
            {
                game.player2Input = 0;
                break;
            }
        }
    }

    function outputDebugInfoToPlayfield() {
        var values = 'X = ' + game.ball.x + '   y=' + game.ball.y + ' dx=' + dx + ' dy=' + dy + '  game.paddle.rightY=' + game.paddle.rightY;
        document.getElementById("ponglog").innerHTML = values;
        var values = 'player1Input = ' + game.player1Input + '   player2Input = ' + game.player2Input;
        document.getElementById("ponglog1").innerHTML = values;
    }

    function processTotalUpdates(totals) {

        //user input currently calibrated to +5 to -5 but maybe this should change??
        if (totals.left.totalTiltFB != 0) {
            game.player1Input = (totals.left.totalTiltFB / totals.left.count) / 90 * 5;
        }

        if (totals.right.totalTiltFB != 0) {
            game.player2Input = (totals.right.totalTiltFB / totals.right.count) / 90 * 5;
        }

    }
    return me;
}(Settings));