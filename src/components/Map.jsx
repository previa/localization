'use strict'
import React, {Component} from 'react';
import IO from 'socket.io-client';
import Paper from 'paper';
import Coordinate from '../models/Coordinate';
import Tag from '../models/Tag';
import Anchor from '../models/Anchor'
import Zone from '../models/Zone';
import Grid from '../models/Grid';
import Config from '../../config/config.js';
import vex from 'vex-js';
import vexdialog from 'vex-dialog';

var vexInfoDialog;

class Map extends Component {

    constructor(props) {
      super(props);
      this.state = {
        tags: [],
        raster: null,
        grid: null,
        SocketListener: true,
        begonnen:0,
        start: 0,
        temp_zone: null,
        cursorHighlight: null,
        lineToMouse: null,
        gettingTags: false
      }
      Paper.install(window);
    }

    render() {
      return (
        <div id="map_container">
          <div id="controls">
            <span onClick={() => {this.zoomIn()}} id="zoomIn" >+</span>
            <span onClick={() => {this.zoomOut()}} id="zoomOut">-</span>

            <span onClick={() => {this.toggleSocket()}} id="SocketPause" className={this.state.SocketListener ? '' : 'blink'}>
              <i className={this.state.SocketListener ? 'fa fa-pause' : 'fa fa-play'} aria-hidden="true"></i>
              {this.state.SocketListener ? 'Pause' : 'Resume' }
            </span>
          </div>

          <canvas id="map-canvas" data-paper-resize/>
        </div>
        );
    }

    componentDidUpdate(prevProps, prevState) {
      this.handleCreateZoneChange();
    }

    handleCreateZoneChange() {
      //Look for change in state
      if (this.props.createZone) {
        this.toggleZoneSelection();
      }
    }

    componentWillUnmount() {
      //If user is creating a zone, disable when moving to other page!
      if (this.props.createZone) {
        this.props.toggleZoneCreation();
        this.cleanUpZoneDrawings();
        if(this.state.temp_zone) {
          this.state.temp_zone.removePath();
          this.state.temp_zone = null;
        }
      }

      if(this.props.currentTagMac != null) {
        this.props.closeTagDetails();
      }
      this.props.resetAnchors();
      this.props.resetZones();
      this.props.resetTags();
    }

    componentDidMount() {
       Paper.setup('map-canvas');
       this.renderImage();
       this.listenToSocket();
       this.addOnClickEvents();
       this.props.getAnchors(1);
       this.props.getZones(1);
       this.props.getTags(1);
    }

    // Render the grid (raster) and the image.
    // Set the canvas dimensions to the image size
    renderImage() {
      var that = this;
      // Create new Raster to draw image in
      this.state.raster = new Raster('/public/img/grondplan.jpg');
      // When Raster is loaded in the DOM
      this.state.raster.onLoad = function() {
        that.centerImage();
        that.props.renderGrid(new Grid(that.state.raster));
      }.bind(that);
    }

    centerImage() {
      /* Set the map on the right zoom */
      if(this.state.raster.view.bounds.width < this.state.raster.size.width) {
        while(this.state.raster.view.bounds.width < this.state.raster.size.width) {
          this.zoomOut();
        }
      }

      if(this.state.raster.view.bounds.height < this.state.raster.size.height) {
        while(this.state.raster.view.bounds.height < this.state.raster.size.height) {
          this.zoomOut();
        }
      }

      /* Set the map on the center */
      view.setCenter(0,0);
    }

    postNewBorderPoint(zoneID, xValue,yValue){
      fetch('api/point', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zoneBorderPointID: 0,
          zoneID: zoneID,
          x: parseInt(xValue),
          y: parseInt(yValue),
          z: 0})
      }).then(function(response){
      })
    }

    postNewZone(zone){
      var that = this;
      var id;
      fetch('api/zone/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zoneID: 0,
          "zoneID": 0,
          "environmentID": 1,
          "name": zone.name,
          "area": 0
        })
      }).then(function(response){
        response.json().then(function(data) {
            // Notify that a new zone was created
            that.props.addZone(zone);

            zone.points.forEach(function(element){
              that.postNewBorderPoint(data ,element.x, element.y);
            });

            that.state.temp_zone.removePath();
            that.state.temp_zone = null;
            that.props.getZones(1);
          })
      })
    }

  listenToSocket() {
    //listen to back-end for incoming tag locations
    var socket = IO.connect();
    var aan = true;
    //TODO: reference to constants in /routes
    socket.on('new_coordinates', data => {
      var that = this;
      /* Set index */
      let index = data.id;
      /* Temporary limit on painted objects */
      if(data.id) {
        /* Check if tag is already added */
        if(!this.props.tags[index] && this.props.tagsLoaded) {
          var tag = new Tag();
          tag.mac = index;
          tag.name = index;
          /* If it does not exist add it */
          this.props.addTag(tag);
          /* Add it to the db */
          this.props.toggleTagsLoaded(false);
          this.props.tags[index].addThisToDB(function() {
            that.props.toggleTagsLoaded(true);
          });
        }

        if(this.props.tags[index] != 'undefined' && typeof this.props.tags[index] !== 'undefined') {
          if(!this.props.tags[index].path) {
            /* Create the path that needs to be painted */
            this.props.tags[index].createPath();
            /* Create the circle that needs to be painted */
            this.props.tags[index].createCircle(function(event, tag) {
              /* Close if open first */
              if(that.props.currentTagMac) {
                that.props.closeTagDetails();
              }
              that.props.openTagDetail(tag);
            }.bind(that));
          }
        }

        /* Create the temporary coordinate variable */
        let temp_coord = new Coordinate(data.id, 0, data.x - 577, data.y - 380, data.z);

        if(this.props.tags[index] !== "undefined" && typeof this.props.tags[index] !== 'undefined') {
          if(this.state.SocketListener) {
            /* Add the coordinate to the coordinate list of the tag */
            this.props.tags[index].addCoordinateToList(temp_coord);
            this.props.tags[index].online = true;
          } else {
            this.props.tags[index].removePath();
          }
        }
      }
    });
  }

  handleZoneCreationClick(point) {
    /* Check if new zone or not */
    if(this.state.temp_zone == null) {
      this.state.temp_zone = new Zone();
      this.state.temp_zone.startZone(point);
      vex.close(vexInfoDialog);
    } else {
      this.state.temp_zone.addPoint(point, this.closeDialog.bind(this));
      if(this.state.lineToMouse != null) {
        this.state.lineToMouse.firstSegment.point = new Point(point.x, point.y);
      }
    }
  }

  handleZoneCreationMove(point) {
    var temp_point = new Point(point.x, point.y);
    /* Show the cursor highlight */
    if(this.state.cursorHighlight == null) {
      this.state.cursorHighlight = new Path.Circle({radius: 5, strokeColor: '#0AFF00', strokeWidth: 2, position: temp_point});
    } else {
      this.state.cursorHighlight.position = temp_point;
    }

    /* Show line form last point to cursor */
    /* Only if first click happend (zone object created) */
    if(this.state.temp_zone != null) {
      if(this.state.lineToMouse == null) {
        this.state.lineToMouse = new Path.Line(new Point(this.state.temp_zone.points[this.state.temp_zone.points.length - 1].x, this.state.temp_zone.points[this.state.temp_zone.points.length - 1].y), temp_point);
        this.state.lineToMouse.strokeColor = '#0AFF00';
      } else {
        /* Check for live snapping */
        if(this.state.temp_zone.checkForSnap(temp_point)) {
          this.state.lineToMouse.lastSegment.point = new Point(this.state.temp_zone.points[0].x, this.state.temp_zone.points[0].y);
          this.state.cursorHighlight.visible = false;
        } else {
          this.state.cursorHighlight.visible = true;
          this.state.lineToMouse.lastSegment.point = temp_point;
        }
      }
    }
  }

  closeDialog(zone) {
    var that = this;
    that.props.toggleZoneCreation();
    this.cleanUpZoneDrawings();

    vex.dialog.buttons.YES.text = 'Confirm';
    vex.dialog.buttons.NO.text = 'Cancel';
    vex.dialog.prompt({
      message: 'Please enter a name for the new zone:',
      placeholder: 'Zone name',
      callback: function (value) {
        if(value) {
          that.state.temp_zone.name = value;
          that.postNewZone(that.state.temp_zone);
        } else {
          that.state.temp_zone.removePath();
          that.state.temp_zone = null;
        }
      }
   });

  }

  cleanUpZoneDrawings() {
    vex.close(vexInfoDialog);
    if(this.state.cursorHighlight) {
      this.state.cursorHighlight.remove();
      this.state.cursorHighlight = null;
    }
    if(this.state.lineToMouse) {
      this.state.lineToMouse.remove();
      this.state.lineToMouse = null;
    }
  }

  zoomIn() {
    this.state.raster.view.zoom *= Config.scalingFactor;
    this.state.raster.view.draw();
  }

  zoomOut() {
    this.state.raster.view.zoom /= Config.scalingFactor;
    this.state.raster.view.draw();
  }

  changeCenter(deltaX, deltaY) {
    this.state.raster.view.setCenter(deltaX,deltaY);
    this.state.raster.view.draw();
  }

  //pauzeren socket
  toggleSocket() {
    this.setState({SocketListener: !this.state.SocketListener});
  }

  toggleZoneSelection() {
    vex.dialog.buttons.YES.text = 'Ok';
    vexInfoDialog = vex.dialog.alert({
      message: 'Click on the map to mark out a new zone.',
      className: 'vex-theme-bottom-right-corner'
    });
  }

   /* Adds the click events */
   addOnClickEvents() {
    let that = this;
    /* Shows the position on canvas (x,y) in console */
    /* view is created by Paper.setup() and is the element it's bound to */
    view.onClick = function(event) {
      //that.handleClick(event.point);
      if(that.props.createZone) {
        that.handleZoneCreationClick(event.point);
      }
    }

    view.onMouseMove = function(event){
      if(that.props.createZone) {
        that.handleZoneCreationMove(event.point);
      }
    }

    view.onMouseLeave = function(event){
      if (that.state.cursorHighlight) {
        that.state.cursorHighlight.visible = false;
      }
    };

    view.onMouseEnter = function(event) {
      if(that.state.cursorHighlight) {
        that.state.cursorHighlight.visible = true;
      }
    }

    this.state.raster.onClick = function(event) {

    }

    document.onkeydown = function(event) {
      if(event.keyCode == 37) { /* Left */
        that.state.raster.view.setCenter(that.state.raster.view.center.x - Config.mapMovementConstant, that.state.raster.view.center.y);
      } else if(event.keyCode == 38) { /* Up */
        that.state.raster.view.setCenter(that.state.raster.view.center.x, that.state.raster.view.center.y - Config.mapMovementConstant);
      } else if(event.keyCode == 39) { /* Right */
        that.state.raster.view.setCenter(that.state.raster.view.center.x + Config.mapMovementConstant, that.state.raster.view.center.y);
      } else if(event.keyCode == 40) { /* Down */
        that.state.raster.view.setCenter(that.state.raster.view.center.x, that.state.raster.view.center.y + Config.mapMovementConstant,);
      }
    }.bind(that);
  }
}

export default Map;
