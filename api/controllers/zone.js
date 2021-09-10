'use strict';

var util = require('util');
var DAO = require('../../utils/DAO/ZoneDAO.js');
var Error = require('../../src/models/Error.js');

var dao = new DAO();

/* Make these functions public */
module.exports = {
  getBorderPointsFromZone: getBorderPointsFromZone,
  getZoneById:getZoneById,
  removeZoneById:removeZoneById,
  updateZone:updateZone,
  addZone:addZone,
  getZoneForEnvironment:getZoneForEnvironment,
  getZoneBorderPointById: getZoneBorderPointById,
  addZoneBorderPoint: addZoneBorderPoint,
  removeZoneBorderPointById:removeZoneBorderPointById,
  updateZoneBorderPoint:updateZoneBorderPoint,
  addBorderpointsToZone: addBorderpointsToZone
};

/**
* Parameter: zoneID
*/
function getBorderPointsFromZone(req,res){
  var id = req.swagger.params.zoneID.value;

  dao.getZonePointsByZoneId(id, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result.length == 0) {
      /* No data found */
      res.statusCode = 409;
      res.end(JSON.stringify(new Error("No points found for this zone.")));
    } else {
      /* Send the found anchor */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

/** Parameter: zoneID */
function removeZoneById(req,res){
  var id = req.swagger.params.zoneID.value;

  dao.removeZoneById(id, function(result,error){
    if(error){
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    }
    else{
      //Zone is removed.
      if(result){
        res.statusCode=204;
        res.end();
      }
      else{
        //Not removed.
        res.statusCode=409;
        res.end();
      }
    }
  });
}

/** Parameter: zoneID */
function getZoneById(req,res){
  var id = req.swagger.params.zoneID.value;

  dao.getZoneById(id, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result.zoneID == -1) {
      /* No data found */
      res.statusCode = 409;
      res.end(JSON.stringify(new Error("No zone found with ID: " + id)));
    } else {
      /* Send the found anchor */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

/** Parameter: zone-object */
function addZone(req,res){
  var zone = req.swagger.params.zone.value;

  dao.addZone(zone, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result == -1) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify("No tag found with ID: " + zone.zoneID));
    } else {
      /* Return ok status. */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

/** Parameter: zoneID */
function updateZone(req,res){
  var zone = req.swagger.params.zone.value;

  dao.updateZone(zone, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(!result) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify("No tag found with ID: " + zone.zoneID));
    } else {
      /* Return ok status. */
      res.statusCode = 204;
      res.end();
    }
  });
}

/** Parameter: environmentID */
function getZoneForEnvironment(req,res){
  var id = req.swagger.params.environmentID.value;

  dao.getZoneForEnvironment(id, function(result,error){
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result.length == 0) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify(new Error("No zones found for the environment")));
    } else {
      /* Return ok status. */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

/**==========================================
Zone Border Points
==========================================**/

function addBorderpointsToZone(req,res){
    var points = req.swagger.params.point_list.value;
    var zoneid = req.swagger.params.zoneID.value;

    dao.addBorderPointlist(zoneid, points, function(result, error){
      if(error){
        /* Internal Server Error */
        res.statuscode = 409;
        res.end(JSON.stringify(error.code));
      } else if(!result) {
        /* No data found to remove */
        res.statusCode = 409;
        res.end(JSON.stringify("No zones found with ID: " + point.zoneID));
      } else {
        /* Return ok status. */
        res.statusCode = 200;
        res.end(JSON.stringify(result));
      }
    });
}

function addZoneBorderPoint(req,res){
  let point = req.swagger.params.point_value.value;

  dao.addBorderPoint(point, function(result, error){
    if(error){
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(!result) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify("No zones found with ID: " + point.zoneID));
    } else {
      /* Return ok status. */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

function updateZoneBorderPoint(req,res){
  var zonebp = req.swagger.params.point_value.value;

  dao.updateZoneBorderPoint(zonebp, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(!result) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify("No zonebp found with ID: " + zonebp.zoneBorderPointID));
    } else {
      /* Return ok status. */
      res.statusCode = 204;
      res.end();
    }
  });
}

function removeZoneBorderPointById(req,res){
  var zonebp = req.swagger.params.zoneBorderPointID.value;

  dao.removeZoneBorderPointById(zonebp, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(!result) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify("No zonebp found with ID: " + zonebp.zoneBorderPointID));
    } else {
      /* Return ok status. */
      res.statusCode = 204;
      res.end();
    }
  });
}

function getZoneBorderPointById(req,res){
  let id = req.swagger.params.zoneBorderPointID.value;

  dao.getBorderPoint(id, function(result, error){
    if(error){
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result.zoneBorderPointID == -1) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify(new Error("No zone borderpoint found with ID: " + id)));
    } else {
      /* Return ok status. */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}
