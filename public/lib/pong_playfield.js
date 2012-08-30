/*
 * Mass Mobile Hallucination.
 * Pong Play field
 *
 * Copyright (c) 2012 MYOB Australia Ltd.
 */
var Settings = (function () {
    var me = {};

    me.getSettings = function () {
        return _settings;
    };

    //a way to tweak the game settings when its still running - these
    //get processed the next time the GameLoop fires

    me.setSettings = function (data) {
        _settings.radius = data.radius;
        _settings.dx = data.dx;
        _settings.dy = data.dy;
        _settings.paddleHeight = data.paddleHeight;
        _settings.paddleWidth = data.paddleWidth;
        _settings.gameLoopInterval = data.gameLoopInterval;
        _settings.debugMode = data.debugMode;
    };

    //defaults settings for pong
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
    var gameInterval;

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

        //listen for keyboard input ( just for debugging folks !)
        document.body.addEventListener('keydown', onkeydown, false);
        document.body.addEventListener('keyup', onkeyup, false);

        if (!gameInterval) {
            gameInterval = setInterval(gameLoop, config().gameLoopInterval);
        }
    }

    me.shutdown = function () {
        clearInterval(gameInterval);
        gameInterval = false;
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


    var gameState ={
        NotStarted : 0,
        InPlay :1,
        PointOver : 2
    }


    //game object
    var game = {
        player1Input: 0,
        player2Input: 0,
        state : gameState.NotStarted
    }
    game.board = {
        width: 0,
        height: 0
    }
    game.score = {
        player1: 0,
        player2: 0,
        lastPointScorer : ""
    }
    game.ball = {
        x: 0,
        y: 0
    }
    game.paddle = {
        leftY: 0,
        rightY: 0
    }

    var dx = config().dx;
    var dy = config().dy;

    var intervalId = 0;
    var boardOpacity = 1.0;

    function applyConfigurationSettings(data) {
        updateConfig(data);
    }

    //generate a random integer in a given range
    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function generateStartingCoordinatesForBall(lastPointScorer)
    {
        var x =   400;
        var y = getRandomInt(280,340);
        var dx  = config().dx;
        var dy =  config().dy ;
        if (lastPointScorer == "p1")
        {
            dx = Math.abs(dx) * -1;
        }
        else
        {
            dx = Math.abs(dx);
        }
        var result = {x :x,
                      y : y,
                      dx : dx,
                      dy:dy}  ;
        return result;
        ;
    }



    function movePaddles() {
        //apply changes to paddle but make sure they  stays inside the board !
        var newpaddle1Y = game.paddle.leftY + game.player1Input;
        if (newpaddle1Y < 0) {
            newpaddle1Y = 0;
        } else if (newpaddle1Y + config().paddleHeight > game.board.width) {
            newpaddle1Y = game.board.width - config().paddleHeight;
        }
        game.paddle.leftY = newpaddle1Y;

        var newpaddle2Y = game.paddle.rightY + game.player2Input;
        if (newpaddle2Y < 0) {
            newpaddle2Y = 0;
        } else if (newpaddle2Y + config().paddleHeight > game.board.width) {
            newpaddle2Y = game.board.width - config().paddleHeight;
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

        if (game.state == gameState.PointOver)
        {
            pointOver();
        }
    }

    function pointOver()
    {
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

    function drawPaddles(){
        //player one red paddle
        ANIMATION.rectangle(0, game.paddle.leftY, config().paddleWidth, config().paddleHeight, '#f00');

        //player two green paddle
        ANIMATION.rectangle(game.board.height - config().paddleWidth, game.paddle.rightY, config().paddleWidth, config().paddleHeight, '#629632');

    }

    function drawBall(){
        //white ball
        ANIMATION.circle(game.ball.x, game.ball.y, config().radius, '#FFFFFF');
    }

    function drawBoard(){
        ANIMATION.clear(0, 0, game.board.height, game.board.width);

        //black background
        ANIMATION.rectangleWithOpacity(0, 0, game.board.height, game.board.width, '00', '00', '00', boardOpacity);
    }

    function drawScore(score) {
        ANIMATION.setText("44px Verdana", score.player1 + "  :  " + score.player2, 340, 50, '#fff');
    }

    function checkBounce() {
        var pointOver = false;

        //Y coordinate update is dead easy if the ball hits the roof or the floor just reverse it
        if (game.ball.y + dy > game.board.width - config().radius || game.ball.y + dy - config().radius < 0) {
            dy = -dy;
        }
        game.ball.y += dy;

        //right wall
        // is the edge of the ball in the hit zone

        if ((game.ball.x + dx + config().radius) >= (game.board.height - config().paddleWidth)) {
            // if the right paddle is in positing bounce otherwise its out
            var posy = game.ball.y + dy;

            //is the Y position in between the paddles
            if ((posy >= game.paddle.rightY) && (posy <= game.paddle.rightY + config().paddleHeight)) {
                //bounce!
                dx = -dx;
            } else {
                //ball needs to be 1/3 or the radius past paddle
                if ((game.ball.x + dx + config().radius) - (game.board.height - config().paddleWidth) > .3 * config().radius) {
                    pointOver = true;
                    game.score.player1++;
                    game.lastPointScorer = "p1";
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
                    game.lastPointScorer = "p2";
                }
            }
        }

        if (!pointOver) {
            game.ball.x += dx;
            return;
        }

        game.state = gameState.PointOver;
    }

    function initialiseGameVariables() {
        var ctx = document.getElementById("pongcanvas").getContext("2d");
        ANIMATION.setCanvas(ctx);
        var canvas =  document.getElementById("pongcanvas");

        game.board.height = canvas.width;
        game.board.width = canvas.height;

        var startingPosition = generateStartingCoordinatesForBall(game.lastPointScorer);

        game.ball.x = startingPosition.x;
        game.ball.y = startingPosition.y;
        dx = startingPosition.dx;
        dy = startingPosition.dy;

        game.state = gameState.InPlay;
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