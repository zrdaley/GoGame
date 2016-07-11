"use  strict";

var express = require("express");
var bodyParser = require("body-parser");

var Storage = require('./lib/MongoDB');

var app = express();

var db = new Storage(null, null, 'go');

var boardSize;

app.use(bodyParser.json());

app.use(express.static('public'));

app.get("/login", function(req, res){
	console.log("GET Request to: /login");

	// connect to mongodb, but we don't have function in mongodb
	// go and finish them first
	db.getAllAccounts(function(err,data){
		if(err){
			res.status(500).send();
		}else{
			res.status(200).json(data);
		}
	});
});


app.post("/add", function (req, res) {

    console.log("POST Request to: /add");

    db.addAccount(req.body, function(err){
        if(err){
            res.status(500).send();
        }else{
            res.status(200).send();
        }
    });

    res.status(200).send();
});

app.post("/dog", function (req, res) {

    console.log("POST Request to: /dog");

    res.status(200).send();
});

app.get("/dog", function (req, res) {
	console.log("Board Size in Get: " + boardSize);
	res.json(boardSize);
});

app.listen(process.env.PORT || 30110, function(){
	console.log("Listening on port 30110");
	db.connect(function(){
		console.log("connected to database");
	});
});
