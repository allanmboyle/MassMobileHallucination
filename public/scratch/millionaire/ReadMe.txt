Rough thoughts

playfield

O On start up it probably needs to wait a few secs with a splash screen as it broadcasts to all players. lets see
	- SRA: no broadcast required. People's handsets simply change to ABCD. 
	- AC agreed


0 15 questions all with ABCD answers this can easily be stuffed inside an array on the server
	- SRA: Not on the server, in the playfield. Server is game agnostic.
	-AC - yep agreed, this is how I saw it working too not sure why I typed server !!!

0 If a newplayer tries to join after quiz starts tough luck you are too late !

o I think there is a second socket.io api for more reliable messages - how much overhead does it introduce ?
	- SRA: There is a call for more un_reliable calls, volatile (probably UDP?)
	-AC ok
	

O Ask a question... players get ABCD on their consoles ...
o Time up for a question on screen ! ( wait some more time to habdle the latency then time up on server)
	- SRA: Host presses button when everyone is ready
	- AC - nice, a low tech solution !

o Playfield knows the answers , as each question is answered correctly it sends the next one down to the player...
	- SRA: Nothing is sent to the player, only a You Lose or You Win message. Certainly no need for the answers.
	- AC I wonder if its worth sending messages like "Q2 has 4 answers A,B,C,D"... this way it can be more easily  reuse this for surveys etc or is this just YAGNI??
	- That is a great idea to make it a tab more generic. And probably not too hard to do when we are ready so maybe start without and add later.

0 how long does it take to cycle thru all players and message them individually ??
	- SRA: trivial amount because its all network so its background.
o maybe there is an api to boradcast to all loosers in bulk ??
	- SRA: I suspect not
0 need to display the numbner of contestants after each round

SRA's thoughts.
o On the playfield there 
	- the current question, 
	- a description of the 4 answers
	- a number representing how many of the current players have submitted an answers
	- a button which says "Lock It In Tony"

o When the presenter hits Lock It in the following happens:
	- The playfield switches tep no the Game Status Page
	- On the game status page is who answered correctly (names) and who answered incorrectly
	- If there is only one player left the page displays "WINNER"
	- If there are NO players left, then all the losers are still in and the game continues with the next question
		-AC yep good idea

	- If there are 1 or more players left, then all the losers are notified of their loss.
	- Any players who did not provide an answer are out
o Players can change their answer anytime up until "Lock It In Tony" is hit.