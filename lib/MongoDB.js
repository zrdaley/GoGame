"use strict";
/**
 * You must implement the methods in this
 * file to interact with the Mongo database.
 * 
 * Created by ngoc thinh on 2016-07-06.
 */

// See https://github.com/mongodb/node-mongodb-native for details.
var MongoClient = require("mongodb").MongoClient;
var DBAdapter   = require("./DBAdapter");


class MongoDB extends DBAdapter {

    constructor(u, p, db, host, port) {
        super(u, p, db, host, port);

        this._user   = u;
        this._passwd = p;
        this._dbname = db || "timerdb";
        this._host   = host || "localhost";
        this._port   = port || 27017;

        this._db = null;

    }

    /**
     * Connects to the database.
     * @param callback {function} called when the connection completes.
     *      Takes an error parameter.
     */
    connect(callback) {
        
        var that = this; 

        MongoClient.connect(
            "mongodb://" + this._host + ":" + this._port + "/" + this._dbname,
            function (err, db) {

                if (err) {
                    console.log("ERROR: Could not connect to database.");
                    that._db = null;
                    callback(err);
                } else {
                    console.log("INFO: Connected to database.");
                    that._db = db;
                    callback(null);
                }

            }
        );

    }

    /**
     * Closes the connection to the database.
     */
    close() {
        this._db.close();
    }

    /**
     * Queries the database for all accounts and returns them via the callback
     * function.
     *
     * @param callback {function} called when query finishes.
     *      Takes two parameters: 1) error parameter, 2) data returned from query.
     */
    getAllAccounts(callback) {
        
        // create collection call "allAccounts"
        var collection = this._db.collection('allAccounts');
        
        collection.find({}).toArray(function(err, docs) {
            callback(err, docs);
        });
    }

    /**
     * Adds a task to the database.
     *
     * @param task {object} represents the task to be added to the DB.
     * @param callback {function} called when query finishes.
     *      Takes a single error parameter.
     */
    addAccount(account, callback) {
        
        var collection = this._db.collection('allAccounts');
        
        collection.insert(account, function(err, result) {
            console.log("Inserted a ROW into the allAccounts collection successfully.");
            //alert("congradualation, you have successfully created an account");
            callback(err);
        });
    }

    
}

module.exports = MongoDB; 
