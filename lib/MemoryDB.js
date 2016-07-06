"use strict";
/**
 * This class stores the data in the server's
 * memory!
 *
 * Created by Ngoc Thinh on 2016-07-06.
 */

var DBAdapter   = require("./DBAdapter");

class MemoryDB extends DBAdapter {

    constructor(u, p, db, host, port) {
        super(u, p, db, host, port);

        this._user   = u;
        this._passwd = p;
        this._dbname = db;
        this._host   = host || "localhost";
        this._port   = port || 27017;

        this._data = [];

    }

    /**
     * No need to connect. Implementing to manage implement required interface. 
     * 
     * @param callback {function} called when the connection completes.
     *      Takes an error parameter.
     */
    connect(callback) {
        callback(null);
    }

    /**
     * Dummy method required for interface implementation.
     */
    close() {}

    /**
     * Returns the data from the memory data store.
     *
     * @param callback {function} called when query finishes.
     *      Takes two parameters: 1) error parameter, 2) data returned from query.
     */
    getAllAccounts(callback) {
        callback(null, this._data);
    }

    /**
     * Adds a task to memory data store.
     *
     * @param task {object} represents the task to be added to the DB.
     * @param callback {function} called when query finishes.
     *      Takes a single error parameter.
     */
    addAccount(Account, callback) {
        Account.id = (new Date()).getTime(); 
        this._data.push(Account);
        callback(null);
    }

    

}

module.exports = MemoryDB; 

