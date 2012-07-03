/*
 * Mass Mobile Hallucination.
 * Copyright (c) 2012 MYOB Australia Ltd.
 * 
 * millionaire PlayField.js - who wants to be a millionaire implementation
 *
 * 24-06-12 AidanC first version 
 */

var ViewModel = function(question,a,b,c,d) {
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

    me.processUserAnswer = function (answer)
    {
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

    var questionList = {};
    var currentQuestion = null;
    var currentAnswers = null;

    //what question are we on?
    var questionNo =1;

    var gameStatus = 
    { 
        NotStarted:0, 
        GameStarted:1,
        TieBreaker:2,
        Finished:3
    }; 


    //would be nicer to seperate out the questions into a csv file and load em up at runtime

    function loadQuestions() {
                questionList.Q1 = {
                    question: "The main character in the 2000 movie 'Gladiator' fights what animal in the arena?",
                    optionA : "Sloth",
                    optionB : "Possum",
                    optionC : "Squirrel",
                    optionD : "Tiger",
                    answer: "D"
                };
                questionList.Q2 = {
                    question: "The answer is C, now go pick it!!",
                    optionA : "Not Me",
                    optionB : "Not Me",
                    optionC : "Correct One pick me, go on , pick me !!",
                    optionD : "Wrong one!",
                    answer: "C"
                };
                questionList.Q3 = {
                    question: "The answer is A, now go pick it!!",
                    optionA : "Its me this time",
                    optionB : "Not Me",
                    optionC : "another wrong un!",
                    optionD : "Wrong one!",
                    answer: "C"
                };
    }

    function askQuestion()
    {

    //temp cos there are only 3 qns d
     if (questionNo >3){
        questionNo=1; 
     }

        var qn = questionList['Q' + questionNo];

      ko.applyBindings(new ViewModel(qn.question,qn.optionA,qn.optionB,qn.optionC,qn.optionD));

        questionNo++;


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