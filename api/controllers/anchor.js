'use strict';

var util = require('util');
var DAO = require('../../utils/DAO/AnchorDAO.js');
var Error = require('../../src/models/Error.js');


var dao = new DAO();

/**
  Make these functions public. This is
  necessary for the swagger-router.
*/
module.exports = {
  getAnchorById: getAnchorById,
  removeAnchorById: removeAnchorById,
  updateAnchor: updateAnchor,
  getAnchorByName: getAnchorByName,
  getAllAnchors:getAllAnchors,
  addAnchor: addAnchor,
  getAnchorsForEnvironment : getAnchorsForEnvironment
};

/**
  Method: Delete
  Path: /anchor/{anchorID}
  Description: Removes the anchor with the given ID.
  @param {req} request
  @param {res} response
*/
function removeAnchorById(req, res) {
  var id = req.swagger.params.anchorID.value;

  /* Remove anchor from DB */
  dao.removeAnchorById(id, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(!result) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify("No anchor found with ID: " + id));
    } else {
      /* Return true */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Method: Get
  Path: /anchor/{anchorID}
  Description: Gets the anchor that is associated with the given ID.
  @param {req} request
  @param {res} response
 */
function getAnchorById(req, res) {
  // Variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  /* Locally store the parameters */
  let id = req.swagger.params.anchorID.value;

  /* Get anchor from DB */
  dao.getAnchorById(id, function(result,error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result.anchorID == -1) {
      /* No data found */
      res.statusCode = 409;
      res.end(JSON.stringify(new Error("No anchor found with ID: " + id)));
    } else {
      /* Send the found anchor */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Method: Get
  Path: /anchor/name/{anchor_name}
  Description: Retrieves the anchor by name.
  @param {req} request
  @param {res} response
*/
function getAnchorByName(req,res){
  var name = req.swagger.params.anchor_name.value;

  /* Get anchor from DB */
  dao.getAnchorByName(name, function(result,error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result.anchorID == -1) {
      /* No data found */
      res.statusCode = 409;
      res.end(JSON.stringify("No anchor found with name: " + name));
    } else {
      /* Send the found anchor */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Method: Get
  Path: /anchor
  Description: Return every anchor.
  @param {req} request
  @param {res} response
*/
function getAllAnchors(req,res){

  /* Get all anchors from DB */
  dao.getAllAnchors(function(result,error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else {
      /* Send the found anchors */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Method: Post
  Path: /anchor
  Description: Post an anchor to the db.
  @param {req} request
  @param {res} response
*/
function addAnchor(req,res){
  var anchor = req.swagger.params.body.value;

  /* Update Anchor */
  dao.addAnchor(anchor, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(!result) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify("Unable to add anchor with ID: " + anchor.id));
    } else {
      /* Return true */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Method: Put
  Path: /anchor
  Description: Change the properties of an anchor.
  @param {req} request
  @param {res} response
*/
function updateAnchor(req,res){
  var anchor = req.swagger.params.anchor.value;

  /* Update Anchor */
  dao.updateAnchor(anchor, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(!result) {
      /* No data found to change */
      res.statusCode = 409;
      res.end(JSON.stringify("No anchor found with ID: " + anchor.id));
    } else {
      /* Return true as response.*/
      res.statusCode = 204;
      res.end();
    }
  });
}

/**
  Method: Get
  Path: /environment/anchor/{environmentID}
  Description: Get every anchor coupled to the requested environment.
  @param {req} request
  @param {res} response
*/
function getAnchorsForEnvironment(req,res){
  var environment = req.swagger.params.environmentID.value;

  /* Get all anchors for environment from DB */
  dao.getAnchorsForEnvironment(environment, function(result,error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else {
      /* Send the found anchors */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });

}
