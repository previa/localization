/**
* Module used by the swagger-router to map the api calls to methods. To
* see which method corresponds with which api-call please
* consult @see {@link ../specification/swaggerv3.json}.

* @author Alexander Vandenbulcke
* @author Niels Verhaegen
* @version 0.1
*/

'use strict';

var util = require('util');
var DAO = require('../../utils/DAO/EnvironmentDAO.js');
var Error = require('../../src/models/Error.js');

var dao = new DAO();

/* Make these functions public */
module.exports = {
  getEnvironmentById:getEnvironmentById,
  updateEnvironment:updateEnvironment,
  addEnvironment:addEnvironment,
  getPointsByEnvironment:getPointsByEnvironment
};


/**
  Returns the environment that corresponds with the given id.
  The id is provided in the request.
  @param {request} req
  @param {response} res
*/
function getEnvironmentById(req, res){
  // The environment id.
  let id = req.swagger.params.environmentID.value;
  // Call getbyid from DAO.
  dao.getEnvironmentById(id, function(result, error){
    if(error){
      // Internal server error.
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result.environmentID == -1){
      // No data find.
      res.statusCode=409;
      res.end(JSON.stringify(new Error("No environment with the given id.")));
    } else{
      res.statusCode = 200;
      // Return the found object.
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Add the environment.
  The environment is provided in the request.
  @param {request} req
  @param {response} res
*/
function addEnvironment(req,res){
  var environment = req.swagger.params.environment.value;

  dao.addEnvironment(environment, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result == -1) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify("No environment found with ID: " + environment.environmentID));
    } else {
      /* Return ok status. */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Update the environment that is provided within the request.
  @param {request} req
  @param {response} res
*/
function updateEnvironment(req,res){
  let environment = req.swagger.params.environment.value;
  // Call remove from DAO.
  dao.updateEnvironment(environment, function(result, error){
    if(error){
      // Internal server error.
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(!result){
      // No data found.
      res.statusCode=409;
      res.end(JSON.stringify(new Error("The environment couldn't be changed.")));
    } else{
      res.statusCode = 204;
      // Return the found object.
      res.end();
    }
  });
}

/**
  Returns the borderpoints that corresponds with the given environment.
  The id is provided in the request.
  @param {request} req
  @param {response} res
*/
function getPointsByEnvironment(req, res){
  // The environment id.
  let id = req.swagger.params.environmentID.value;
  // Call getbyid from DAO.
  dao.getPointsByEnvironment(id, function(result, error){
    if(error){
      // Internal server error.
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result.environmentID == -1){
      // No data find.
      res.statusCode=409;
      res.end(JSON.stringify(new Error("No points for environment.")));
    } else{
      res.statusCode = 200;
      // Return the found object.
      res.end(JSON.stringify(result));
    }
  });
}
