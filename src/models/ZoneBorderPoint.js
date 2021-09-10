var ZoneBorderPoint = function(zoneBorderPointID, zoneID, x, y, z ){
  this.zoneBorderPointID = zoneBorderPointID || -1;
  this.zoneID = zoneID || -1;
  this.x = x || null;
  this.y = y || null;
  this.z = z || null;
}

module.exports = ZoneBorderPoint;
