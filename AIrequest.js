
function getRandomMove(size, board, x, y, c, pass, path, cb){
	var http = require('http');
	var postData = {
		'size':  size,
		'board': board,
		"last": {
       		"x" : x,
        	"y" : y,
        	"c" : c,
        	"pass" : pass,
    }
	}
	var move;
	var options = {
		host:'roberts.seng.uvic.ca',
		path: path,
		port: '30000',
		method: 'POST',
		headers:{
			'Content-type': 'application/json'
		}
	}
	
	var callback = function(response){
		var string = "";
		response.on('data', function(chunk){
			console.log('data');
			string += chunk.toString();
		});
		response.on('end', function(){
			console.log('end');
			console.log(string);
			if(response.statusCode === 200){
				cb(JSON.parse(string));
			}else{
				console.log("The status code does not equal 200, in AIrequest.js. The statusCode is: " +response.statusCode);
				cb(response.statusCode);
			}
		});
	}

    var req = http.request(options,callback);
    req.on('error',function(e){
		console.log('problem with request: ${e.message}');
	});
    req.write(JSON.stringify(postData));
    req.end();

}

module.exports = {
    getRandomMove : getRandomMove
}

