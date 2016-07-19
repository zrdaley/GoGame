#Go Application
A go web application created by Group 11 as a requirement of the Summer 2016 SENG299 course at the University of Victoria.

This application allows a user to play go in two player mode or against the provided AI (https://github.com/sdiemert/goai).

## Contributing Members
Andrew Wiggins, Zenara Daley, Mathew Szymanowski, Jinmin Huang, & Thinh Nguyen

## Set Up Instructions
### Access Engineering Network
Log into the UVic engineering network directly, or see link below for remote access. 
http://www.uvic.ca/systems/services/internettelephone/remoteaccess/

*Note: Due to the use of the provided AI, the game will not function properly outside of the engineering network.*

### Set Up Database
Instructions.

###Start The Server
In a terminal or command prompt window, navigate to the working directory 
```
>myPath/SENG299
```
Start the server with the command 
```
>node server.js
```

The following message should appear if the start up was a success:
```
Listening on port 30110
INFO: Connected to database.
connected to database"
```
###Open Application
Open a web browser and navigate to
```
http://localhost:30110
```
The application should now be available to play go!
