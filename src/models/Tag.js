'use strict'
var config = require('../../config/config.js');

var Tag = function(tagID, circle, name, hardwareVersion, firmwareVersion, batteryLevel, updateRate, iconPath, iconColor, environmentID, mac) {
  this.tagID = tagID || -1;
  this.name = name || "no_name";
  this.hardwareVersion = hardwareVersion || "0";
  this.firmwareVersion = firmwareVersion || "0";
  this.batteryLevel = batteryLevel || 100;
  this.updateRate = updateRate || 0;
  this.iconPath = iconPath || "tag.png";
  this.iconColor = iconColor || 'blue';
  this.environmentID = environmentID || 1;
  this.visible = true;
  this.mac = mac || "no_mac";
  this.labels = [];
  this.online = false;

  /* Check for visible change */
  this.setVisible = function(val) {
    this.visible = val;
    if(this.circle != null && this.path != null) {
      this.circle.visible = val;
      this.path.visible = val;
    }
  }

  this.getVisible = function() {
    return this.visible;
  }

  /* This is for drawing purposes only */
  this.coordinateList = [];
  this.circle = null;
  this.path = null;

  this.createCircle = function(callback) {
    let raster = new Raster({
      source: '/public/img/' + this.iconPath,
      position: new Point(0,0)
    });

    var that = this;

    /* Set the size for the icon */
    raster.scale(0.6);

    raster.onClick = function(event) {
      callback(event, that);
    }.bind(that);

    this.circle = raster;
  }

  this.createPath = function() {
    this.path = new Path();
    this.path.strokeWidth = config.strokeWidth;
    this.path.strokeColor = this.iconColor;
  }
  this.removePath = function(){
    this.path.remove();
    this.createPath();
  }

  this.createColumns = function() {
    return [ { header: 'Id', accessor: 'tagID'},
             { header: 'Name', accessor: 'name'},
             { header: 'MAC-Address', accessor: 'mac'},
             { header: 'Hardware Version', accessor: 'hardwareVersion'},
             { header: 'Firmware Version', accessor: 'firmwareVersion'},
             { header: 'Battery Level', accessor: 'batteryLevel'}];
  }

  this.selected = function(val) {
    let temp_image;
    if(val) {
      temp_image = "selectedtag.png";
    } else {
      temp_image = "tag.png";
    }
    if(this.circle) {
      this.circle.source = '/public/img/' + temp_image;
    }
  }

  this.addCoordinateToList = function(new_coord) {
    this.coordinateList.push(new_coord);
    /* Update the circle position if needed */
    if(this.visible) {
      if(this.circle) {
        this.circle.position = new Point(new_coord.x, new_coord.y);
      }
      /* Update the path position if needed */
      if(this.path) {
        this.path.add(new Point(new_coord.x, new_coord.y));
        /* Remove path if too long */
        if(this.path.length >= config.drawDistance){
          this.path.removeSegment(0);
        }
      }
    }
  }

  this.addLabel = function(label) {
    console.log(label);
  }

  this.setColor = function(color) {
    this.iconColor = color;
    this.path.strokeColor = color;
  }

  this.updateThisInDB = function() {
    fetch('api/tag/' + this.tagID, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tagID: this.tagID,
        name: this.name,
        hardwareVersion: this.hardwareVersion,
        firmwareVersion: this.firmwareVersion,
        batteryLevel: this.batteryLevel,
        updateRate: this.updateRate,
        iconPath: this.iconPath,
        iconColor: this.iconColor,
        environmentID: this.environmentID,
        mac: this.mac
      })
    }).then(function(response){
    })
  }

  this.addThisToDB = function(callback) {
    fetch('api/tag/', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tagID: this.tagID,
        name: this.name,
        hardwareVersion: this.hardwareVersion,
        firmwareVersion: this.firmwareVersion,
        batteryLevel: this.batteryLevel,
        updateRate: this.updateRate,
        iconPath: this.iconPath,
        iconColor: this.iconColor,
        environmentID: this.environmentID,
        mac: this.mac
      })
    }).then(function(response){
      callback();
    })
  }

  this.getLastCoordinate = function() {
    return this.coordinateList[this.coordinateList.length - 1];
  }
}

module.exports = Tag;
