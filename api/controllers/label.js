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
var DAO = require('../../utils/DAO/LabelDAO.js');
var Error = require('../../src/models/Error.js');

var dao = new DAO();

/* Make these functions public */
module.exports = {
  getLabelById:getLabelById,
  addLabelsToTag: addLabelsToTag,
  removeLabelById: removeLabelById,
  getLabelByName:getLabelByName,
  getAllLabels:getAllLabels,
  addLabel:addLabel,
  updateLabel: updateLabel,
  getLabelsForTag: getLabelsForTag,
  removeTagLabel:removeTagLabel
};

/**
  Fetch the labels coupled to the tag which is
  given by the tagid.
  @param {req} request
  @param {res} response
*/
function getLabelsForTag(req,res){
  // The tag id.
  let tagID = req.swagger.params.tagID.value;

  dao.getLabelsForTag(tagID, function(result, error){
    if(error){
      // Internal server error.
      res.statusCode = 409  ;
      res.end(JSON.stringify(error.message));
    } else if(!result){
      // No data find.
      res.statusCode=409;
      res.end(JSON.stringify(new Error("No labels could be found.")));
    } else{
      res.statusCode = 200;
      // Return the found objects.
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Add label to the tags.
  @param {req} request
  @param {res} response
*/
function addLabelsToTag(req,res){
  let tagID = req.swagger.params.tagID.value;
  let label = req.swagger.params.label.value;
  let labelID = label.labelID;

  //First add the label to the db.
  dao.addLabel(label, function(result, error){
    // In any case add the labels to the tag.
    if(result != -1){
      labelID = result;
      dao.addLabelsToTag(tagID,labelID, function(result, error){
        if(error){
          // Internal server error.
          res.statusCode = 409;
          res.end(JSON.stringify(error.message));
        } else if(!result){
          // No data find.
          res.statusCode=409;
          res.end(JSON.stringify(new Error("Label couldn't be added.")));
        } else{
          res.statusCode = 204;
          // Return the found objects.
          res.end();
        }
      });
    }
    else{
      dao.getLabelByName(label.name, function(result, error){
        labelID = result.labelID;
        dao.addLabelsToTag(tagID,labelID, function(result, error){
          if(error){
            // Internal server error.
            res.statusCode = 409;
            res.end(JSON.stringify(error.message));
          } else if(!result){
            // No data find.
            res.statusCode=409;
            res.end(JSON.stringify(new Error("Label couldn't be added.")));
          } else{
            res.statusCode = 204;
            // Return the found objects.
            res.end();
          }
        });
      });
    }

  });

}

/**
  Removes the label that corresponds with the id.
  The id is provided in the request.
  @param {request} req
  @param {response} res
*/
function removeLabelById(req,res){
  // The label id.
  let id = req.swagger.params.labelID.value;
  // Call remove from DAO.
  dao.removeLabelById(id, function(result, error){
    if(error){
      // Internal server error.
      res.statusCode = 409;
      res.end(JSON.stringify(error.message));
    } else if(!result){
      // No data found.
      res.statusCode=409;
      res.end(JSON.stringify(new Error("No label with the given id.")));
    } else{
      res.statusCode = 204;
      // Return the found object.
      res.end();
    }
  });
}

/**
  Returns the label that corresponds with the given id.
  The id is provided in the request.
  @param {request} req
  @param {response} res
*/
function getLabelById(req, res){
  // The label id.
  let id = req.swagger.params.labelID.value;
  // Call getbyid from DAO.
  dao.getLabelById(id, function(result, error){
    if(error){
      // Internal server error.
      res.statusCode = 409;
      res.end(JSON.stringify(error.message));
    } else if(result.labelID == -1){
      // No data find.
      res.statusCode=409;
      res.end(JSON.stringify(new Error("No label with the given id.")));
    } else{
      res.statusCode = 200;
      // Return the found object.
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Get the label that corresponds with the name.
  The id is provided in the request.
  @param {request} req
  @param {response} res
*/
function getLabelByName(req,res){
  // The label id.
  let name = req.swagger.params.label_name.value;
  // Call getByName from DAO.
  dao.getLabelByName(name, function(result, error){
    if(error){
      // Internal server error.
      res.statusCode = 409;
      res.end(JSON.stringify(error.message));
    } else if(result.labelID == -1){
      // No data find.
      res.statusCode=409;
      res.end(JSON.stringify(new Error("No label with the given id.")));
    } else{
      res.statusCode = 200;
      // Return the found object.
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Gets all the labels that are defined.
  @param {request} req
  @param {response} res
*/
function getAllLabels(req, res){
  dao.getAllLabels(function(result,error){
    if(error){
      // Internal server error.
      res.statusCode = 409;
      res.end(JSON.stringify(error.message));
    } else if(result.length == 0){
      // No data find.
      res.statusCode=409;
      res.end(JSON.stringify(new Error("No labels.")));
    } else{
      res.statusCode = 200;
      // Return the found object.
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Add the label.
  The label is provided in the request.
  @param {request} req
  @param {response} res
*/
function addLabel(req,res){
  // The label id.
  let label = req.swagger.params.label_value.value;
  // Call remove from DAO.
  dao.addLabel(label, function(result, error){
    if(error){
      // Internal server error.
      res.statusCode = 409;
      res.end(JSON.stringify(error.message));
    } else if(result == -1){
      // No data find.
      res.statusCode=409;
      res.end(JSON.stringify(new Error("Label wasn't be added.")));
    } else{
      res.statusCode = 200;
      // Return the found object.
      res.end(JSON.stringify(result));
    }
  });
}

/**
  Update the label that is provided within the request.
  @param {request} req
  @param {response} res
*/
function updateLabel(req,res){
  // The label id.
  let label = req.swagger.params.label_value.value;
  // Call remove from DAO.
  dao.updateLabel(label, function(result, error){
    if(error){
      // Internal server error.
      res.statusCode = 409;
      res.end(JSON.stringify(error.message));
    } else if(!result){
      // No data find.
      res.statusCode=409;
      res.end(JSON.stringify(new Error("The label couldn't be changed.")));
    } else{
      res.statusCode = 204;
      // Return the found object.
      res.end();
    }
  });
}

/**
  Remove the tag/label combination from the database.
  @param {request} req
  @param {response} res
*/
function removeTagLabel(req,res){
  let labelID = req.swagger.params.labelID.value;
  let tagID = req.swagger.params.tagID.value;

  dao.removeTagLabel(labelID,tagID,function(result,error){
    if(error){
      // Internal server error.
      res.statusCode = 409;
      res.end(JSON.stringify(error.message));
    } else if(!result){
      // No data find.
      res.statusCode=409;
      res.end(JSON.stringify(new Error("The tag label combination couldn't be removed.")));
    } else{
      res.statusCode = 204;
      // Return the found removed.
      res.end();
    }
  });
}
