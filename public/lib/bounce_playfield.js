/*
 * Mass Mobile Hallucination.
 * Copyright (c) 2012 MYOB Australia Ltd.
 * 
 * BouncePlayField.js - implementation of the bounce game. Client side playfield.
 *
 * 14-06-12 AidanC first version - rewriting bounce to run inside a replaceable div with local variables etc...
 */
var BouncePlayfield = (function () {
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
    me.updates = function (updates) {
        processPositionUpdates(updates)
    }
    me.admin = function (message) {
        alert("Bounce playfield got an admin message: " + messages);
    }

    me.init = function (theSocket) {

        socket = theSocket;

        // tell the server we don't want totals (only real time updates)
        socket.emit("admin", "no_totals");

        // Start the timer that measures timing statistics
        stats();
        initSlider();
        internalinit();

        setInterval(drawGameBoard, 20);

        // redraw the board when we come back here. On the first time it might do nothing.
        updateBoard();
    }


    function initSlider() {

        $("#slider").slider({
            range: "min",
            value: 0,
            min: -5,
            max: +5,
            slide: updateSliderValue
        });
    }

    function updateSliderValue(event, ui) {
        $("#sliderValue").html(ui.value);
        userInput = ui.value;
    }

    function internalinit() {
        ctx = $('#bouncecanvas')[0].getContext("2d");

        ANIMATION.setCanvas(ctx);
        WIDTH = $("#bouncecanvas").width();
        HEIGHT = $("#bouncecanvas").height();
        x = 140;
        y = 150;
        dx = 1;
        dy = 2;
        //  setInterval(drawGameBoard, 20);

        // redraw the board when we come back here. On the first time it might do nothing.
        updateBoard();

    }

    me.shutdown = function () {
        // stop the stats timer
        //		clearTimeout(timer);
    }

    // place players randomly on the screen
    me.initPlayers = function (players) {

    };

    //
    // Privates 
    //

    //canvas
    var ctx;
    //width canvas
    var WIDTH;
    //height canvas
    var HEIGHT;
    var score = 0;
    var highestScore = 0;
    var userInput = 0;
    var x = 140;
    var y = 150;
    var dx = 1;
    var dy = 2;
    var ctx;
    var WIDTH;
    var HEIGHT;
    var intervalId = 0;


    var paddlex;
    var paddleh;
    var paddlew;

    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 25;
        paddlew = 75;
    }

    function movePaddle() {
        //apply changes to paddle but make sure it stays inside the box !
        var newpaddlex = paddlex + userInput;
        if (newpaddlex < 0) {
            newpaddlex = 0;
        } else if (newpaddlex + paddlew > WIDTH) {
            newpaddlex = WIDTH - paddlew;
        }
        paddlex = newpaddlex;
    }

    BALL_RADIUS = 110;

    function drawGameBoard() {

        debugStats();
        movePaddle();
        ANIMATION.clear(0, 0, WIDTH, HEIGHT);

        ANIMATION.circle(x, y, BALL_RADIUS, '#00f');
        //red half of paddle
        var padwidth = (paddlew / 2);
        var padheight = HEIGHT - paddleh;

        ANIMATION.rectangle(paddlex, padheight, padwidth, paddleh, '#f00');
        //green half of paddle
        ANIMATION.rectangle((paddlex + padwidth), padheight, padwidth, paddleh, '#0f0');

        checkBounce();
    }

    function checkBounce() {

        // Hit a left/right wall
        if (x + dx > WIDTH - BALL_RADIUS || x + dx < BALL_RADIUS) dx = -dx;

        // Hit the roof
        // Hit the roof
        if (y + dy < BALL_RADIUS) {
            dy = -dy;
        } else if (
        // hit a paddle?
        (y + dy >= HEIGHT - paddleh - BALL_RADIUS // ball lower edge will be below the paddle surface
        &&
        x + dx >= paddlex && x + dx < paddlex + paddlew) || (y + dy >= HEIGHT - paddleh - BALL_RADIUS * .8 // ball 3rd of the way below the top of the paddle
        &&
        (x + dx >= paddlex - BALL_RADIUS && x + dx < paddlex + paddlew + BALL_RADIUS)) // touching a paddle corner
        ) {
            score++;

            dy = -dy;
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
            // you've missed the ball, bozo! (the next else-if clause will kick in>
        } else if (y + dy > HEIGHT - BALL_RADIUS) {
            //game over, so stop the animation
            //game over, I think it would be good to have a bit of a delay before the next game starts...
            clearInterval(intervalId);
            score = 0;
            startGame();
            dy = -dy;
            y = BALL_RADIUS;
        }

        x += dx;
        y += dy;


        if (score > highestScore) {
            highestScore = score;
            $("#highestScore").html(highestScore);
        }
        $("#score").html(score);
    }

    function startGame() {
        internalinit();
        init_paddle();
    }

    function pause() {
        alert('paused !!');
    }

    function debugStats() {
        var values = 'X = ' + x + '   y=' + y + ' dx=' + dx + ' dy=' + dy + '  paddlex=' + paddlex;
        $("#bouncelog").html(values);
    }



    me.processPositionUpdates = function (updates) {

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

    function updateBoard() {

    }

    // write the stats to the playfield
    function stats() {

    }

    return me;
}());