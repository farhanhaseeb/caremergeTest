var express = require('express'),
fs = require('fs'),
http = require("http"),
https = require("https"),
Q = require("q"),
Utils = require("../utility/utils"),
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
            var promises = [];
            
            urls.forEach(function(url){
                var p = Q.promise(function(resolve, reject, notify){
                    var curl = ! /^(http|https):\/\//.test(url) ? 'http://' + url : url;
                    http.get(curl, function(result){
                        var data = "";
                        result.on("data", function(chunk){
                            data += chunk;
                        });

                        result.on("end", function(){
                            title = Utils.bodyParser(curl, data);
                            resolve(title);
                        });
                    }).on("error", function(e){                       
                        title = '<li>' + curl + ' - "NO RESPONSE"</li>';
                        resolve(title);
                    });
                    
                });
                promises.push(p);
            });
            
            Q.all(promises).then(function(p){
                 p = p.join("");
                var response = '<html><head></head><body> <h1> Following are the title of given websites: </h1><ul>' + p + '</ul></body></html';
                res.end(response);
            }).done();
            
            
        };
    filteration();
});

module.exports = router;
