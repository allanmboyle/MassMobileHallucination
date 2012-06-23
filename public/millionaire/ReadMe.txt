Rough thoughts

playfield

O On start up it probably needs to wait a few secs with a splash screen as it broadcasts to all players. lets see
0 15 questions all with ABCD answers this can easily be stuffed inside an array on the server
0 If a newplayer tries to join after quiz starts tough luck you are too late !
o I think there is a second socket.io api for more reliable messages - how much overhead does it introduce ?
O Ask a question... players get ABCD on their consoles ...
o Time up for a question on screen ! ( wait some more time to habdle the latency then time up on server)
o Playfield knows the answers , as each question is answered correctly it sends the next one down to the player...
0 how long does it take to cycle thru all players and message them individually ??
o maybe there is an api to boradcast to all loosers in bulk ??
0 need to display the numbner of contestants after each round