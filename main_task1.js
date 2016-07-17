var express = require('express'),
http = require('http'),
fs = require('fs'),
parserRoute = require('./routes/task1'),
app = express()
port = 3030;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/I/want/title', parserRoute);

app.use("*", function(req, res, next){
    res.writeHead(404, {'Content-type': 'text/html'});
    res.end("Page Not Found");
    next();
});

var httpServer = http.createServer(app);
    
httpServer.listen(port, function(){
	console.log("server listening on port: " + port);
});