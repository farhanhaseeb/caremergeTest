var cheerio = require("cheerio");

function Utils(){
    
}

Utils.prototype.bodyParser = function(url, data){
    var title = "NO RESPONSE";
    if(data){
        var $ = cheerio.load(data);
        title = $("title").text();
    }
    return '<li> ' + url + ' - "' + title + '" </li>';    
}

module.exports = new Utils();