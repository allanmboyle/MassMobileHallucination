MassMobileHellucination
=======================

A game for playing with lots of people on mobiles looking at the same web page at the same time.

Suited to conference talks. This is really just an all-JavaScript experiment.

TODOs
=====
x get a basic socket.io example working so I know how it works
x static file server for the mobile page and graphics - USED EXPRESS
x set up game viewing page
x socket commands for receving updated screen positions for online viewer
- game engine to play the game - MOVING TO CLIENT
x and update based on input and actions.
x sign up page to put in your name.
x Test controls with two buttons Left Right
o Gets accelerometer detection working for iphone/android and windows mobile
x sockets for receiving telematray data from mobiles
o give a diffent page for each mobile controller

The Model
=========
The server is going to be dumb. The game engine will be in the client. The server
will only act as a relay of client messages to the playfield. 

Downside: if the playfield browser craps out, the game is lost.
Upside: server does not have to maintain state and can be quite thin.

Requrements
===========
npm install socket.io
npm install express

Cheers,
Simon.
simonraikallen@gmail.com
