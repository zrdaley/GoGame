"use strict";

var express    = require("express");
var bodyParser = require("body-parser");


var app = express();


app.use(bodyParser.json());

app.use(express.static('public'));


/**
 * Handle a request for task data.
 */
app.get("/index.html", function (req, res) {
    console.log("GET Request to: /index.html");


    
});


/**
 * Handle a request for task data.
 */
app.get("/data", function (req, res) {
    console.log("GET Request to: /data");


    
});

/**
 * Adds a new user to the database
 */
app.post("/makePlayer", function (req, res) {

    console.log("POST Request to: /makePlayer");
    
    
    res.status(200).send();
});


app.listen(process.env.PORT || 3000, function () {
    
    console.log("Listening on port 3000");
    

});