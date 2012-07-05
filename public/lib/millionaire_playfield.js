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
    me.processTotalUpdates = function (totals) {

    }
    me.processPositionUpdates = function (totals) {

    }

    me.askQuestion = function () {
        askQuestion();
    }

    me.admin = function (message) {
        alert("Millionaire playfield got an admin message: " + messages);
    }
    me.init = function (theSocket) {
        socket = theSocket;
        loadQuestions();
        //socket.emit("admin", "yes_totals");
        //socket.emit("admin", "no_updates");

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

    var score = 0;

    var questionList = [];
    var currentQuestion = null;
    var currentAnswers = null;

    //what question are we on?
    var questionNo = 0;

    var gameStatus = {
        NotStarted: 0,
        GameStarted: 1,
        TieBreaker: 2,
        Finished: 3
    };


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

    // user changed their name
    function nameChange(data) {

    }

    // handle the arrival of a new user to the game
    function newUser(data) {

    }

    // Color them out on woosing out of the game
    function woosOut(data) {}
    return me;
}());