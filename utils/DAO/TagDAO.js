var Tag = require('../../src/models/Tag.js');
var config = require('../../config/config.js');
var mysql = require('mysql');
/**
* Callback to execute altering data in the database..
* @callback resultActionCallback
* @param {boolean} succeeded - True when succeeded.
* @param {error} error - When 'null' the call succeeded.
*/

/**
* Callback to execute after collecting data.
* @callback tagListCallback
* @param {tag[]} tagList - When succeeded, this is a filled lsit of objects.
* @param {error} error - When 'null' the call succeeded,
* when 'not null' the tagobject will be invalid.
*/

/**
* Callback to execute after collecting a single object.
* @callback tagCallback
* @param {tag} tagList - When succeeded, this is a filled object.
* @param {error} error - When 'null' the call succeeded,
* when 'not null' the tagobject will be invalid.
*/


/**
  Create databasepool to connect when executing
  api-calls.
*/
const pool = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  port: config.dbPort,
  database: config.dbName
});




var DAO = function(){
  this.pool = pool;

  /**
  * Collects the tag with the provided id from the database.
  * @param {integer} id - The id of the tag to find.
  * @param {tagCallback} callback - The callback to be executed with the
  * result.
  */
  this.getTagById = function(id, callback) {
    var requested_tag = new Tag();
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Tag WHERE tagID = ?', [id], function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getTagById(): " + error.code);
          temp_error = new Error("The tag couldn't be loaded."+error.code);
        } else if(results.length == 1) { /* Fill tag element, if not the DB is corrupt */
          var result = results[0];
          requested_tag = new Tag(
            result.tagID,
            null,
            result.name,
            result.hardwareVersion,
            result.firmwareVersion,
            result.batteryLevel,
            result.updateRate,
            result.iconPath,
            result.iconColor,
            result.environmentID,
            result.mac);
        }
        /* Release the connection */
        connection.release();

        callback(requested_tag, temp_error);
      });
    });
  }

  /**
  * The tag with the provided id will be removed from the database.
  * @param {integer} id - The id of the tag to be removed.
  * @param {resultActionCallback} callback - The performed callback after
  * removal.
  */
  this.removeTagById = function(id, callback) {
    var temp_error = null;
    var removed = false;
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('DELETE FROM Tag WHERE tagID = ?', [id], function(error, results, fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to removeTagById(): " + error.code);
          temp_error = new Error("The tag couldn't be removed."+error.code);
        } else if(results.affectedRows == 1) {
          removed = true;
        }

        /* Release the connection */
        connection.release();

        callback(removed, temp_error);
      });
    });
  }

  /**
  * Method update a tag with the provided id.
  * @param {tag} tag - The tag that needs to be updated.
  * @param {resultActionCallback} callback - The callback performed after updating.
  */
  this.updateTagById = function(tag, callback) {
    var temp_error = null;
    var updated = false;
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('UPDATE Tag SET name=?, hardwareVersion=?, firmwareVersion=?, \
                        batteryLevel=?, updateRate=?, iconPath=?, iconColor=?, \
                        environmentID=? WHERE tagID = ?',
                        [tag.name, tag.hardwareVersion, tag.firmwareVersion, tag.batteryLevel,
                         tag.updateRate, tag.iconPath, tag.iconColor, tag.environmentID, tag.tagID],
      function(error, results, fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to updateTagById(): " + error.code);
          temp_error = new Error("The tag couldn't be updated."+error.code);
        } else if(results.affectedRows > 0) {
          updated = true;
        }

        /* Release the connection */
        connection.release();

        callback(updated, temp_error);
      });
    });
  }

  /**
  * Searches the tag that is coupled to the given name in the database.
  * @param {string} name - The name of the tag.
  * @param {tagCallback} callback - The callback executed after the fetch.
  */
  this.getTagByName = function(name, callback) {
    var requested_tag = new Tag();
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Tag WHERE name = ?', [name], function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getTagByName(): " + error.code);
          temp_error = new Error("The tag couldn't be loaded by name."+error.code);
        } else if(results.length == 1) { /* Fill anchor element, if not the DB is corrupt */
          var result = results[0];
          requested_tag = new Tag(
            result.tagID,
            null,
            result.name,
            result.hardwareVersion,
            result.firmwareVersion,
            result.batteryLevel,
            result.updateRate,
            result.iconPath,
            result.iconColor,
            result.environmentID,
            result.mac);
        }
        /* Release the connection */
        connection.release();

        callback(requested_tag, temp_error);
      });
    });
  }

  /**
  * This method fetches all the tags that are available.
  * This method is discouraged for large databases.
  * @param {tagListCallback} callback - The function that is executed with the result.
  */
  this.getAllTags = function(callback) {
    var requested_tag_list = [];
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Tag', function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getAllTags(): " + error.code);
          temp_error = new Error("The tags couldn't be loaded."+error.code);
        } else if(results.length >= 0) { /* Fill anchor array */
          results.forEach(function(result) {
            requested_tag_list.push(new Tag(
              result.tagID,
              null,
              result.name,
              result.hardwareVersion,
              result.firmwareVersion,
              result.batteryLevel,
              result.updateRate,
              result.iconPath,
              result.iconColor,
              result.environmentID,
              result.mac));
          });
        }
        /* Release the connection */
        connection.release();

        callback(requested_tag_list, temp_error);
      });
    });
  }



  /**
  * This function adds a tag to the collection of tags.
  * @param {resultActionCallback} callback - The function that is executed with the result.
  * @param {tag} tag - The tag to add.
  */
  this.addTag = function(tag, callback) {
    var added = false;
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('INSERT INTO Tag (name, hardwareVersion, firmwareVersion, batteryLevel, \
                        updateRate, iconPath, iconColor, environmentID, mac) \
                        VALUES (?,?,?,?,?,?,?,?,?)',
                        [tag.name,tag.hardwareVersion,tag.firmwareVersion,tag.batteryLevel,
                         tag.updateRate,tag.iconPath,tag.iconColor,tag.environmentID,tag.mac],
      function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to addTag(): " + error.code);
          temp_error = new Error("The tag couldn't be added"+error.code);
        } else if(results.affectedRows > 0) {
          added = true;
        }
        /* Release the connection */
        connection.release();

        callback(added, temp_error);
      });
    });
  }

  /**
  * Retreives all the tags that are situated in the environmentID that
  * is passed as argument.
  * @param {tagListCallback} callback - The function that is executed with the result.
  * @param {integer} environment - The environmentID.
  */
  this.getTagsForEnvironment = function(environment, callback) {
    var requested_tag_list = [];
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Tag WHERE environmentID=?', [environment], function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getTagsForEnvironment(): " + error.code);
          temp_error = new Error("The tags couldn't be loaded for the environment"+error.code);
        } else if(results.length >= 0) { /* Fill tag array */
          results.forEach(function(result) {
            requested_tag_list.push(new Tag(
              result.tagID,
              null,
              result.name,
              result.hardwareVersion,
              result.firmwareVersion,
              result.batteryLevel,
              result.updateRate,
              result.iconPath,
              result.iconColor,
              result.environmentID,
              result.mac));
          });
        }
        /* Release the connection */
        connection.release();

        callback(requested_tag_list, temp_error);
      });
    });
  }
}

module.exports = DAO;
