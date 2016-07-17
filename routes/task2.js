var express = require('express'),
fs = require('fs'),
http = require("http"),
https = require("https"),
async = require("async"),
Utils = require("../utility/utils"),
router = express.Router();


router.get("/", function(req, res){
    
    if(!req.query.hasOwnProperty("address")){
		res.writeHead(400, {'Content-type': 'text/plain'});
		res.end("400 - Bad Request, address parameter is missing.");
	}
    
	var address = req.query.address, response = '', li = "";
	urls = typeof address === "object" ? address.join(",") : address;
    var urls = urls.split(",");
    
    async.whilst(
        function () { return urls.length > 0; },
        function (callback) {
            var curl = ! /^(http|https):\/\//.test(urls[0]) ? 'http://' + urls[0] : urls[0];            
            urls.shift();            
            http.get(curl, function(result){
                var data = "";
                result.on("data", function(chunk){
                    data += chunk;
                });

                result.on("end", function(){
                    title = Utils.bodyParser(curl, data);
                    li = li + title;
                    callback(null, li);
                });
            }).on("error", function(e){                       
                li = li + '<li>' + curl + ' - "NO RESPONSE"</li>';
                callback(null, li);
            });
        },
        function (err, n) {
            if(err) throw err;
            
            var response = '<html><head></head><body> <h1> Following are the title of given websites: </h1><ul>' + n + '</ul></body></html';
            res.end(response);
        }
    );
    
});

module.exports = router;