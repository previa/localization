var config = require('../../config/config.js');

var Zone = function(zoneID,environmentID,name, area, points, visible) {
  this.zoneID = zoneID || -1;
  this.environmentID = environmentID || 1;
  this.name = name || "unknown";
  this.area  = area || 0.0;
  this.visible = visible || true;
  this.points = points || [];
  this.path = null;
  this.strokeColor = "#0AFF00";
  this.snapDistance = 25;

  this.startZone = function(point) {
    this.path = new Path();
    this.path.add(point);
    this.points.push(point);
    this.path.strokeColor = this.strokeColor;
  }

  this.createPathFromPoints = function() {
    var that = this;
    this.path = new Path();
    this.path.strokeWidth = config.strokeWidth;
    Array.from(this.points).forEach(function(element) {
      that.path.add(new Point(element.x, element.y));
    }.bind(that));
    this.closePath();
    this.path.strokeColor = this.strokeColor;
  }

  this.checkForSnap = function(point) {
    return (point.x > this.points[0].x - this.snapDistance &&
       point.x < this.points[0].x + this.snapDistance &&
       point.y < this.points[0].y + this.snapDistance &&
       point.y > this.points[0].y - this.snapDistance);
  }

  this.addPoint = function(point, callback) {
    if(this.points.length > 0) {
      if(this.checkForSnap(point)) {
           this.closePath();
           callback(this);
         } else {
           this.path.add(point);
           this.points.push(point);
         }
    }
  }

  this.createColumns = function() {
    return [ { header: 'Id', accessor: 'zoneID'},
             { header: 'Name', accessor: 'name'}];
  }

  this.closePath = function() {
    this.path.closed = true;
  }

  this.removePath = function() {
    this.path.remove();
  }

  this.setVisible = function(val) {
    this.visible = val;
    this.path.visible = val;
  }

  this.setName = function(val) {
    this.name = val;
  }

  this.getVisible = function() {
    return this.visible;
  }
}

module.exports = Zone;
