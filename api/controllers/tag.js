'use strict';

var util = require('util');
var DAO = require('../../utils/DAO/TagDAO.js');
var Error = require('../../src/models/Error.js');

var dao = new DAO();

/* Make these functions public */
module.exports = {
  getTagById: getTagById,
  removeTagById: removeTagById,
  updateTagById: updateTagById,
  getTagByName: getTagByName,
  getAllTags: getAllTags,
  addTag: addTag,
  getTagsForEnvironment: getTagsForEnvironment
};

function removeTagById(req, res) {
  var id = req.swagger.params.tagID.value;

  dao.removeTagById(id, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result.tagID == -1) {
      /* No data found */
      res.statusCode = 409;
      res.end(JSON.stringify(new Error("No tag found with ID: " + id)));
    } else {
      /* Send the found anchor */
      res.statusCode = 204;
      res.end();
    }
  });
}

function getTagById(req, res) {
  var id = req.swagger.params.tagID.value;

  dao.getTagById(id, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result.tagID == -1) {
      /* No data found */
      res.statusCode = 409;
      res.end(JSON.stringify(new Error("No tag found with ID: " + id)));
    } else {
      /* Send the found anchor */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

function updateTagById(req, res) {

  var tag = req.swagger.params.tag_value.value;

  dao.updateTagById(tag, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(!result) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify("No tag found with ID: " + tag.tagID));
    } else {
      /* Return true */
      res.statusCode = 204;
      res.end();
    }
  });
}

function getTagByName(req, res) {
  var name = req.swagger.params.tag_name.value;

  dao.getTagByName(name, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(result.tagID == -1) {
      /* No data found */
      res.statusCode = 409;
      res.end(JSON.stringify("No tag found with name: " + name));
    } else {
      /* Send the found anchor */
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
  });
}

function getAllTags(req, res) {
  dao.getAllTags(function(result, error) {
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

function addTag(req, res) {
  var tag = req.swagger.params.tag_value.value;

  dao.addTag(tag, function(result, error) {
    if(error) {
      /* Internal Server Error */
      res.statuscode = 409;
      res.end(JSON.stringify(error.code));
    } else if(!result) {
      /* No data found to remove */
      res.statusCode = 409;
      res.end(JSON.stringify("Unable to add tag with ID: " + tag.id));
    } else {
      /* Return true */
      res.statusCode = 204;
      res.end();
    }
  });
}

function getTagsForEnvironment(req, res) {
  var environment = req.swagger.params.environmentID.value;

  dao.getTagsForEnvironment(environment, function(result, error) {
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
