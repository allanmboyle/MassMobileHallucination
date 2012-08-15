/*
 * Mass Mobile Hallucination.
 * Copyright (c) 2012 MYOB Australia Ltd.

 */
var PongPlayfield = (function () {
    var me = {};
    var socket;

    //
    // Publics
    //  
    me.newUser = function (data) {
        newUser(data)
    }
    me.woosOut = function (data) {
        woosOut(data)
    }
    me.players = function (players) {
        players(data)
    }
    me.totalUpdates = function (totals) {
        processTotalUpdates(totals)
    }
    me.positionUpdates = function (updates) {
        processPositionUpdates(updates)
    }
    me.admin = function (message) {
        alert("Pong playfield got an admin message: " + messages);
    }

    me.processUserAnswer = function (answer) {}

    me.init = function (theSocket) {
        socket = theSocket;
        // this game is only interested in totals, not individual updates...
        socket.emit("admin", "yes_totals");
        socket.emit("admin", "no_updates");
        initialiseGameVariables();
        drawGameBoard();
        //this game work by redrawing canvas every 30 milliseconds and applying  movcment changes to paddle position
        setInterval(drawGameBoard, 30);
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

    //canvas
    var ctx;
    var used;
    var score = 0;
    var highestScore = 0;


    var player1Input = 0;
    var player2Input = 0;

    var startX = 400;
    var startY = 300;

    var x = startX;
    var y = startY;

    var dx = .5;
    var dy = 1;

    var canvasWidth;
    var canvasHeight;
    var intervalId = 0;
    var paddlex;

    var paddle1Y=0;
    var paddle2Y=0;
    var paddleh;
    var paddlew;

    function movePaddle() {
/*
        //apply changes to paddle but make sure it stays inside the box !
        var newpaddlex = paddlex + player1Input;
        if (newpaddlex < 0) {
            newpaddlex = 0;
        } else if (newpaddlex + paddlew > canvasWidth) {
            newpaddlex = canvasWidth - paddlew;
        }
        paddlex = newpaddlex;*/

        //apply changes to paddle but make sure it stays inside the box !
        var newpaddle1Y = paddle1Y + player1Input;
        if (newpaddle1Y < 0) {
            newpaddle1Y = 0;
        } else if (newpaddle1Y + paddleh > canvasHeight) {
            newpaddle1Y = canvasHeight - paddleh;
        }
        paddle1Y = newpaddle1Y;

        var newpaddle2Y = paddle2Y + player2Input;
        if (newpaddle2Y < 0) {
            newpaddle2Y = 0;
        } else if (newpaddle2Y + paddleh > canvasHeight) {
            newpaddle2Y = canvasHeight - paddleh;
        }
        paddle2Y = newpaddle2Y;

    }

    BALL_RADIUS = 10;

    function drawGameBoard() {

        debugStats();
        movePaddle();
        ANIMATION.clear(0, 0, canvasWidth, canvasHeight);

        //black background
        ANIMATION.rectangle(0, 0, canvasWidth, canvasHeight, '#000000');

        //white ball
        ANIMATION.circle(x, y, BALL_RADIUS, '#FFFFFF');

        var padheight = canvasHeight - paddleh;

        //player one red paddle
        ANIMATION.rectangle(0, paddle1Y, paddlew, paddleh, '#f00');

        //player two green paddle
        ANIMATION.rectangle(canvasWidth -paddlew, paddle2Y, paddleh, paddleh, '#629632');

        checkBounce();

        drawScore();
    }


    function drawScore(){
        ANIMATION.setText("26px cinnamoncake, Verdana","Score:   0",340,30);
    }


    function checkBounce() {


        if (x + dx  > canvasWidth - BALL_RADIUS  || x + dx - BALL_RADIUS < 0)
            dx = -dx;
        if (y + dy  > canvasHeight - BALL_RADIUS || y + dy - BALL_RADIUS < 0)
            dy = -dy;

        x += dx;
        y += dy;

        return;

        //hit the top or the bottom

        if (y + dy < BALL_RADIUS) {
            dy = -dy;
        }


        // Hit a left/right wall
        if (x + dx > canvasWidth - BALL_RADIUS || x + dx < BALL_RADIUS) dx = -dx;

        // Hit the roof
        // Hit the roof
        if (y + dy < BALL_RADIUS) {
            dy = -dy;
        }
        else if (
        // hit a paddle?
        (y + dy >= canvasHeight - paddleh - BALL_RADIUS // ball lower edge will be below the paddle surface
        &&
        x + dx >= paddlex && x + dx < paddlex + paddlew) || (y + dy >= canvasHeight - paddleh - BALL_RADIUS * .8 // ball 3rd of the way below the top of the paddle
        &&
        (x + dx >= paddlex - BALL_RADIUS && x + dx < paddlex + paddlew + BALL_RADIUS)) // touching a paddle corner
        ) {
            score++;

            dy = -dy;
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
            // you've missed the ball, bozo! (the next else-if clause will kick in>
        } else if (y + dy > canvasHeight - BALL_RADIUS) {
            //game over, so stop the animation
            //game over, I think it would be good to have a bit of a delay before the next game starts...
            clearInterval(intervalId);
            score = 0;
            initialiseGameVariables();
            dy = -dy;
            y = BALL_RADIUS;
        }

        x += dx;
        y += dy;


        if (score > highestScore) {
            highestScore = score;
            document.getElementById("highestScore").innerHTML = highestScore;
        }
        document.getElementById("score").innerHTML = score;
    }

    function initialiseGameVariables() {
        ctx = document.getElementById("pongcanvas").getContext("2d");
        ANIMATION.setCanvas(ctx);
        canvasWidth = document.getElementById("pongcanvas").width;
        canvasHeight = document.getElementById("pongcanvas").height;

        x = startX;
        y = startY;
        dx = .5;
        dy = 1;

        paddlex = canvasWidth / 2;
        paddleh = 100;

        paddlew = 20;

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
        var values = 'X = ' + x + '   y=' + y + ' dx=' + dx + ' dy=' + dy + '  paddlex=' + paddlex;
        document.getElementById("ponglog").innerHTML = values;
        var values = 'player1Input = ' + player1Input;
        document.getElementById("ponglog1").innerHTML = values;
    }

    function processTotalUpdates (totals) {

        player1Input = 0;

        //if its null then do nothin!
        if (totals.totalTiltLR == null) {
            return;
        }

        //user input currently callibrated to +5 to -5 but maybe this should change??
        player1Input = (totals.totalTiltLR / totals.count) / 90 * 5;

    }


    function processPositionUpdates (updates) {
        //not used
    }

    // user changed their name
    function nameChange(data) {

    }

    // handle the arrival of a new user to the game
    function newUser(data) {

    }

    // Color them out on woosing out of the game
    function woosOut(data) {

    }
    return me;
}());