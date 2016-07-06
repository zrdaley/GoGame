"use strict";

class ServerInterface{
	constructor(url, port){
		this._url = url || "localhost";
		this._port = port || 30110;
	}
	_sendDatta(obj, path, callback){
		console.log("sending POST to " + path);

		var postXhr = new XMLHttpRequest();
        postXhr.open("POST", path, true);
        postXhr.setRequestHeader("Content-type", "application/json");
        postXhr.send(JSON.stringify(obj));

        postXhr.onreadystatechange = function(){

            // this function is executed when the request comes 
            // back from the server. 

            if (postXhr.readyState == 4 && postXhr.status == 200) {
                callback(null);
            }else if(postXhr.readyState == 4 && postXhr.status !== 200){
                callback(postXhr.status);
            }
        }
	}

	addAccount(name, password, cb){
		this._sendDatta(
			{name: name, password: password}, "/add",
			function(err){
				if(err){
					console.log("Error adding Account: "+ err);
					cb(err);
				}else{
					cb(null);
				}
			}
		);
	}

	getData(callback){
		console.log("Sending GET to /login");

		var xhr = new XMLHttpRequest();
        xhr.open("GET", "/login", true);
        xhr.send();

        xhr.onreadystatechange = function () {

            // this function is executed when the request comes
            // back from the server.

            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(null, JSON.parse(xhr.responseText));
            }else if(xhr.readyState == 4 && xhr.status !== 200){
                callback(xhr.status, null);
            }
        };
	}
}