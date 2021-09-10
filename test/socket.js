var chai = require('chai');
var mocha = require('mocha');
var should = chai.should();
var config = require('./../config/config.js');
var socketCommands = require('./../config/socket_commands.js');

var io = require('socket.io-client');

describe("Receiving coordinates from socket", function() {
  var client;
  var options = {
    transports: ['websocket'],
    'force new connection': true
  };

  beforeEach(function() {
    client = io.connect("http://localhost:"+config.socketPort, options);
  });

  /* Check if coordinates length is correct */
  it("Coordinates length", function(done) {
    client.once('connect', function() {
      client.once(socketCommands.getCoordinates, function(message) {
        Object.keys(message).length.should.equal(3);
        client.disconnect();
        done();
      });

      client.emit("get_coordinates");
    });
  });

  /* Check if coordinates values are correct */
  it("Coordinates values ", function(done) {
    client.once('connect', function() {
      client.once(socketCommands.getCoordinates, function(message) {
        (typeof(message.x)).should.equal('number');
        (typeof(message.y)).should.equal('number');
        (typeof(message.z)).should.equal('number');
        client.disconnect();
        done();
      });

      client.emit("get_coordinates");
    });
  });
});
