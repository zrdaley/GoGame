"use strict";
/**
 * Created by Ngoc Nguyen on 2016-07-06.
 */

class DBAdapter{
    
    constructor(user, passwd, dbname, url, port){
        
    }

    /**
     * Connects to the database. 
     * @param callback {function} called when the connection completes.
     *      Takes an error parameter.
     */
    connect(callback){
        throw new Error("interface class, method not callable");
    }

    /**
     * Closes the database connection.
     */
    close(){
        throw new Error("interface class, method not callable");
    }

    /**
     * Queries the database for all tasks and returns them via the callback
     * function.
     *
     * @param callback {function} called when query finishes.
     *      Takes two parameters: 1) error parameter, 2) data returned from query.
     */
    getAllAccounts(callback){
        throw new Error("interface class, method not callable");
    }

    /**
     * Adds a task to the database.
     * 
     * @param task {object} represents the task to be added to the DB.
     * @param callback {function} called when query finishes.
     *      Takes a single error parameter. 
     */
    addAccount(task, callback){
        throw new Error("interface class, method not callable");
    }

    
}

module.exports = DBAdapter; 