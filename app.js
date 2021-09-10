"use strict"
var config = require('./config/config.js');
var express = require('express');

var app = express();

var routes = require('./routes/routes.js');
var socket = require('./routes/socket.js');

/* The Open API entrance variable */
var api = require('./api.js');

// The file socket_commands.js contains the possible events that can
// be fired through te socket.
var socketCommands = require('./config/socket_commands.js');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var mysql = require('mysql');

// This file is used to propagate the simulated movements of a tag.
// The values are generated.
var sendCoordinatesFromFileToSockets = require('./utils/emitCoordinatesFromFile.js');

var createDatabase = require('./utils/createDatabase.js');

/* The DB connection variable */
const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  port: config.dbPort,
});

/* Create the database and tables, if not exists. Connection is ended when done.*/
createDatabase(connection);

// Set the path variable (this is used for routing)
app.set('path', __dirname);

// Add the socket commands to the server
socket(io, socketCommands, { x: -1, y: -1, z: -1});

/*  Add the API routes using OpenAPI middleware. The needed resources can be
    found in the ./api folder.
      * controllers: this subdirectory contains all the api call functionality.
      * specification: the specification is declared in the file that is used in api.js as specification.*/
api(app, routes);

/* Starts the server */
server.listen(config.port, function() {
  console.log('Pozyx server: ' + config.port);
  /* Emit coordinates from file */
  sendCoordinatesFromFileToSockets(config.socketEmitTime, io);
});
