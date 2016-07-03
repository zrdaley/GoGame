"use strict";

class ServerInterface{

    constructor(url, port){
        this._url = url || "localhost"; 
        this._port = port || 3000; 
    }

    /**
     * @param obj {object} the data to send.
     * @param path {string} the server path to make the request to.
     * @param callback {function} called when the server responds.
     *      Takes 1 parameter, an error parameter which is null if everything is OK.
     */
    _sendData(obj, path, callback){

        console.log("sending POST to "+ path);
        
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

    /**
     * Makes a request to add a new player to the server
     */
    makePlayer(user, pass){
        
        this._sendData(
            {username: user, password: pass, wins: 0},
            "/makeplayer",
            function(err){
                if(err){
                    console.log("Error adding task: "+err);
                    cb(err);
                }else{
                    cb(null);
                }
            }
        );  
    }


}
