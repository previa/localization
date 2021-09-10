"use strict"
/* Needed for temporary csv read.*/
var fs = require('fs');
var EventEmitter = require('events');
var locationReceived = new EventEmitter();
var socketCommands = require('../config/socket_commands.js');
var Coordinate = require('../src/models/Coordinate.js');
var config = require('../config/config.js');

module.exports = function(time, io) {
  /* TODO: LOOP OVER FILE, DONT GO OVER IT JUST ONCE */
  /* TODO: Generate data matching the canvas size */
  fs.readFile(config.generatedCoordinates,'utf8', function(err,data) {
    let arr = data.split("\n");
    var i = 0;
    setInterval(function(){
    	if(i == arr.length) {
        i = 0;
      } else {
        let coord = new Coordinate();
        coord.createFromArray(arr[i].split(','));
        locationReceived.emit('new_location', coord);
        i++;
      }
    }, time);
  });

  /* Send coordinates when new coordinates are received from file. */
  locationReceived.on('new_location', function(coord) {
      io.sockets.emit(socketCommands.newCoordinates, coord);
  });
}
