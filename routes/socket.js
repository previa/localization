module.exports = function(io, socketCommands, coord) {
  //var temp_coord = { x: 5.5555555, y: 6, z: 9 }; // TODO: FIX DUPLICATE
  io.on('connection', function(client) {
    client.on(socketCommands.getCoordinates, function(msg, callback) {
      callback = callback || function() {};

      client.emit(socketCommands.getCoordinates, coord);

      callback(null, "Done.");
    });
  });
}
