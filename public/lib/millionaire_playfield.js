/*
 * Mass Mobile Hallucination.
 * Copyright (c) 2012 MYOB Australia Ltd.
 * 
 * millionaire PlayField.js - who wants to be a millionaire implementation
 *
 * 24-06-12 AidanC first version 
 */
var ViewModel = function (question, a, b, c, d) {
        this.question = ko.observable(question);
        this.optionA = ko.observable(a);
        this.optionB = ko.observable(b);
        this.optionC = ko.observable(c);
        this.optionD = ko.observable(d);
    };

var MillionairePlayfield = (function () {
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

    me.processUserAnswer = function (answer) {
        processUserAnswer(answer);
    }


    me.totalUpdates = function (totals) {
       //
    }

    me.processPositionUpdates = function (totals) {

    }

    me.askQuestion = function () {
        askQuestion();
    }

    me.startQuiz = function () {
        startQuiz();
    }

    me.admin = function (message) {
        alert("Millionaire playfield got an admin message: " + message);
    }
    me.init = function (theSocket) {
        socket = theSocket;
        loadQuestions();
        socket.emit("admin", "no_totals");
        socket.emit("admin", "no_updates");

    }

    me.shutdown = function () {
        // stop the stats timer
        //      clearTimeout(timer);
    }

    // place players randomly on the screen
    me.initPlayers = function () {

    };

    //
    // Privates 
    //
    var gameStatus = {
        NotStarted: 0,
        GameStarted: 1,
        TieBreaker: 2,
        Finished: 3
    };


    var score = 0;

    var questionList = [];
    var currentQuestion = null;
    var currentAnswers = null;
    var gameState = gameStatus.NotStarted;

    //what question are we on?
    var questionNo = 0;

    var playersCurrentAnswers = [];


    //I'd live to chain this more elegantly so that the result of parseCSV is passed to generateQuestions
    function loadQuestionsFromCSV() {

        $.get("questions.csv", function (data) {
            var lines = parseCSV(data);
            generateQuestions(lines);
        });
    }

    function parseCSV(allText) {
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var lines = [];

        for (var i = 1; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {

                var tarr = [];
                for (var j = 0; j < headers.length; j++) {
                    //  tarr.push(headers[j]+":"+data[j]);
                    tarr.push(data[j]);
                }
                lines.push(tarr);
            }
        }
        return lines;
    }

    function generateQuestions(array) {
        array.forEach(function (item) {
            questionList.push({
                question: item[0],
                optionA: item[1],
                optionB: item[2],
                optionC: item[3],
                optionD: item[4],
                answer: item[5]
            })
        });
    }

    function loadQuestions() {
        loadQuestionsFromCSV();
    }

    function askQuestion() {
        var qn = questionList[questionNo];
        ko.applyBindings(new ViewModel(qn.question, qn.optionA, qn.optionB, qn.optionC, qn.optionD));
        questionNo++;
    }

    //nobody else can join as the quiz has begun !
    function startQuiz(){
        gameState = gameStatus.GameStarted;
        askQuestion();
    }

    // user changed their name
    function nameChange(data) {

    }

    function processUserAnswer(data){

    // for(var i = playersCurrentAnswers.length-1; i >= 0; i++)
    //     {  // STEP 1
           
    //         var item = playersCurrentAnswers[i];
    //        if(item.id == data.id)
    //        {     // STEP 201
    //         playersCurrentAnswers.splice(i,1);           // STEP 3
    //         }
    //     }

    //     playersCurrentAnswers.push({id:data.id,
    //                                 qn:data.qn,
    //                                 answer :data.answer
    //                                 });

        // to do
        //  check if im still accepting answers to the question
        // update or append the users answer to the array of answers ( they can answer more than once)
        alert('I got the answer ' + data.answer + ' id ' + data.id  );

    }

    //new player joining
    function newUser(data) {
    //if game is underway nobody else can join      
        if (gameState == gameStatus.NotStarted)
        {
 
            // all good lets add them to the list of players
           // var socketId = data.id;
           // socket.emit("sendtoUser",socketId, "tooLate");
 
        }
        else
        {
            //game has started so they can't join
            var socketId = data.id;
            socket.emit("sendtoUser",socketId, "tooLate");
        }
    }
    // Color them out on woosing out of the game
    function woosOut(data) {}
    return me;
}());