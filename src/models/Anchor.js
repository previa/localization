'use strict'
var Config = require('../../config/config.js');

var Anchor = function(anchorID,name,environmentID,hardwareVersion,firmwareVersion,x,y,z,last_seen, status) {
  this.anchorID = anchorID || -1;
  this.name= name || '';
  this.environmentID = environmentID || 0;
  this.hardwareVersion= hardwareVersion || '0';
  this.firmwareVersion= firmwareVersion || '0';
  this.x= x || -1;
  this.y= y || -1;
  this.z= z || -1;
  this.last_seen = last_seen || 0;
  this.status = status || 2; //Default not powered.
  this.visible = true;

  /* For painting on canvas only */
  this.paintObject = "undefined";

  this.getVisible = function() {
    return this.visible;
  }

  this.setVisible = function(val) {
    this.visible = val;
    this.paintObject.visible = val;
  }

  this.createColumns = function() {
    return [ { header: 'Id', accessor: 'anchorID'},
             { header: 'Name', accessor: 'name'},
             { header: 'Hardware Version', accessor: 'hardwareVersion'},
             { header: 'Firmware Version', accessor: 'firmwareVersion'},
             { header: 'X Position', accessor: 'x'},
             { header: 'Y Position', accessor: 'y'},
             { header: 'Z Position', accessor: 'z'}];
  }

  this.paintAnchor = function() {
    var that = this;

    var raster = new Raster({
      source:  Config.getImage('anchor'),
      position: new Point(this.x,this.y)
    });

    /* Set the size for the icon */
    raster.scale(0.6);

    /* Add click event if given */
    if(this.callback != null) {
      raster.onClick = function(event) {
        callback(event, that);
      }.bind(that);
    }

    this.paintObject = raster;
  }
}

module.exports = Anchor;
