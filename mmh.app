console.log("sdfs");

var server 	= require('http').createServer(serverHandler),  
	io		= require('socket.io').listen(server),
	fs		= require("fs");

server.listen(8080);

function serverHandler (req, res) {
	fs.readFile(__dirname + '/index.html',
		function (err, data) {
			if (err) {
			  res.writeHead(500);
			  return res.end('Error loading index.html');
			} else {
				res.writeHead(200);
				res.end(data);
			}
  		}
	);
}

io.sockets.on('connection', function (socket) {
	console.log("We have a connection!");

  	socket.emit('news', { hello: 'world' });

  	socket.on('namechange', function (name) {
		socket.set("username", name);
    	console.log("Name change: " + name);
  	});

  	socket.on('left', function (data) {
		socket.get("username", function (err, name) { 
	    	console.log("left from " + name);
  		});
	});

  	socket.on('right', function (data) {
		socket.get("username", function (err, name) { 
    		console.log("right from " + name);
  		});
  	});
});
