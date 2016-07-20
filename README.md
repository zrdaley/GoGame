#Go Application
A go web application created as a requirement of the Summer 2016 SENG299 course at the University of Victoria.

This application allows a user to play go in two player mode or against the provided AI (https://github.com/sdiemert/goai).

## Contributing Members
Andrew Wiggins, Zenara Daley, Mathew Szymanowski, Jinmin Huang, & Thinh Nguyen

## Set Up Instructions
### Access Engineering Network
Log into the UVic engineering network directly, or see link below for remote access. 
http://www.uvic.ca/systems/services/internettelephone/remoteaccess/

*Note: Due to the use of the provided AI, the game will not function properly outside of the engineering network.*

### NodeJS and MongoDB
Ensure that [NodeJS](https://nodejs.org/en/) and [Node Package Manager (npm)](https://www.npmjs.com) are both installed and ready for use. 

Furthermore, MongoDB is required for this program. Visit [MongoDB](https://www.mongodb.com) for instructions on installation.

### Set Up Database
The following instructions assume the user has mongoDB installed and ready for use on their computer.

In a terminal/command prompt window, run the command `mongo`. 

*Note: following steps can be skipped by running the program and creating a new account, however they ensure the program will run without database problems.*

Inside mongo, the command `show dbs` will show the local databases available. 

`use Group11Go` will create a new collection titled "Group11Go" if it isn't already created. If done correctly, the window will print ```switched to db Group11Go```.

Inside of the Group11Go db, type `db.createCollection(allAccounts)`.

###Start The Server
In a terminal or command prompt window, navigate to the working directory 

>myPath/SENG299

Start the server with the command 

```
node server.js
```

The following message should appear if the start up was a success: `Listening on port 30110 INFO: Connected to database.`

###Open Application
Open a web browser and navigate to
```
http://localhost:30110
```
The application should now be available to play Go!
