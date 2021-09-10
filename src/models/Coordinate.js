var Coordinate = function(id, timestamp, x, y, z) {
  this.id = id || -1;
  this.timestamp = timestamp || 0;
  this.x = x || -1;
  this.y = y || -1;
  this.z = z || -1;

  /* Create a coordinate using an array */
  this.createFromArray = function(arr) {
    this.timestamp = parseFloat(arr[0]);
    this.id = arr[1];
    this.x = parseFloat(arr[2]);
    this.y = parseFloat(arr[3]);
    this.z = parseFloat(arr[4]);
  }
}

/* Override the default toString function */
Coordinate.prototype.toString = function() {
  return "id: " + this.id + " x: " + this.x + " y: " + this.y + " z: " + this.z;
}

module.exports = Coordinate;
