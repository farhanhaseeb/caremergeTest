var express = require('express'),
Utils = require("../utility/utils"),
fs = require('fs'),
http = require("http"),
https = require("https"),
router = express.Router();


router.get("/", function(req, res){
	if(!req.query.hasOwnProperty("address")){
		res.writeHead(400, {'Content-type': 'text/plain'});
		res.end("400 - Bad Request, address parameter is missing.");
	}
    
	var address = req.query.address, response = '', li = "";
	urls = typeof address === "object" ? address.join(",") : address;
	
	var urls = urls.split(","),
        filteration = function(){
            if(urls.length){
                var curl = ! /^(http|https):\/\//.test(urls[0]) ? 'http://' + urls[0] : urls[0];
                urls.shift();
                //if(curl.indexOf("https:") !== -1){

                http.get(curl, function(result){
                    var data = "";
                    result.on("data", function(chunk){
                        data += chunk;
                    });

                    result.on("end", function(){
                        title = Utils.bodyParser(curl, data);
                        li = li + title;
                        filteration();
                    });
                }).on("error", function(e){                       
                    li = li + '<li>' + curl + ' - "NO RESPONSE"</li>';
                    filteration();
                });
                
            }else{
                res.end('<html><head></head><body> <h1> Following are the title of given websites: </h1><ul>' + li + '</ul></body</html>');
            }
        };
    filteration();
});


module.exports = router;