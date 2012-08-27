var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('NodeJS.exe running on Windows Azure!');
}).listen(8080);