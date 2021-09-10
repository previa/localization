var Anchor = require('../../src/models/Anchor.js')
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
* @callback anchorListCallback
* @param {anchor[]} anchorList - When succeeded, this is a filled list of objects.
* @param {error} error - When 'null' the call succeeded,
* when 'not null' the anchorobject will be invalid.
*/

/**
* Callback to execute after collecting a single object.
* @callback anchorCallback
* @param {anchor} anchorList - When succeeded, this is a filled object.
* @param {error} error - When 'null' the call succeeded,
* when 'not null' the anchorobject will be invalid.
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



var DAO = function() {
  /**
  * The connection object to the database.
  */
  this.pool = pool;

  /**
  * Collects the anchor with the provided id from the database.
  * @param {integer} id - The id of the anchor to find.
  * @param {anchorCallback} callback - The callback to be executed with the
  * result.
  */
  this.getAnchorById = function(id, callback) {
    var requested_anchor = new Anchor();
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Anchor WHERE anchorID = ?', [id], function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getAnchorById(): " + error.code);
          temp_error = new Error("The anchor couldn't be loaded by ID."+error.code);
        } else if(results.length == 1) { /* Fill anchor element, if not the DB is corrupt */
          var result = results[0];
          requested_anchor = new Anchor(
            result.anchorID,
            result.name,
            result.environmentID,
            result.hardwareVersion,
            result.firmwareVersion,
            result.x,
            result.y,
            result.z,
            result.last_seen,
            result.status);
        }
        /* Release the connection */
        connection.release();

        callback(requested_anchor, temp_error);
      });
    });
  }

  /**
  * The anchor with the provided id will be removed from the database.
  * @param {integer} id - The id of the anchor to be removed.
  * @param {resultActionCallback} callback - The performed callback after
  * removal.
  */
  this.removeAnchorById = function(id, callback) {
    var temp_error = null;
    var removed = false;
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('DELETE FROM Anchor WHERE anchorID = ?', [id], function(error, results, fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to removeAnchorById(): " + error.code);
          temp_error = new Error("The anchor wasn't removed from the database."+error.code);
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
  * Method update a anchor with the provided id.
  * @param {anchor} anchor - The anchor that needs to be updated.
  * @param {resultActionCallback} callback - The callback performed after updating.
  */
  this.updateAnchor = function(anchor, callback) {
    var temp_error = null;
    var updated = false;
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('UPDATE Anchor SET environmentID = ?,hardwareVersion= ?, \
                        firmwareVersion = ?, x = ?, y = ?, z = ?, last_seen = DATE_FORMAT(?, \'%Y-%m-%d %k:%i:%s.%f\'), \
                        status = ?, name = ? WHERE anchorID = ?',
                        [anchor.environmentID, anchor.hardwareVersion, anchor.firmwareVersion, anchor.x,
                         anchor.y, anchor.z, anchor.last_seen, anchor.status, anchor.name, anchor.anchorID],
      function(error, results, fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to updateAnchor(): " + error.code);
          temp_error = new Error("Anchor wasn't updated."+error.code);
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
  * Searches the anchor that is coupled to the given name in the database.
  * @param {string} name - The name of the anchor.
  * @param {anchorCallback} callback - The callback executed after the fetch.
  */
  this.getAnchorByName = function(name, callback) {
    var requested_anchor = new Anchor();
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Anchor WHERE name = ?', [name], function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getAnchorByName(): " + error.code);
          temp_error = new Error("Anchor couldn't be received by name."+error.code);
        } else if(results.length >= 1) { /* Fill anchor element, if not the DB is corrupt */
          var result = results[0];
          requested_anchor = new Anchor(
            result.anchorID,
            result.name,
            result.environmentID,
            result.hardwareVersion,
            result.firmwareVersion,
            result.x,
            result.y,
            result.z,
            result.last_seen,
            result.status);
        }
        /* Release the connection */
        connection.release();

        callback(requested_anchor, temp_error);
      });
    });
  }

  /**
  * This method fetches all the anchors that are available.
  * This method is discouraged for large databases.
  * @param {anchorListCallback} callback - The function that is executed with the result.
  */
  this.getAllAnchors = function(callback) {
    var requested_anchor_list = [];
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Anchor', function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getAllAnchors(): " + error.code);
          temp_error = new Error("Couldn't fetch the anchors from database."+error.code);
        } else if(results.length >= 0) { /* Fill anchor array */
          results.forEach(function(entry) {
            requested_anchor_list.push(new Anchor(
              entry.anchorID,
              entry.name,
              entry.environmentID,
              entry.hardwareVersion,
              entry.firmwareVersion,
              entry.x,
              entry.y,
              entry.z,
              entry.last_seen,
              entry.status));
          });
        }
        /* Release the connection */
        connection.release();

        callback(requested_anchor_list, temp_error);
      });
    });
  }

  /**
  * This function adds a anchor to the collection of anchors.
  * @param {resultActionCallback} callback - The function that is executed with the result.
  * @param {anchor} anchor - The anchor to add.
  */
  this.addAnchor = function(anchor, callback) {
    var added = false;
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('INSERT INTO Anchor (name, hardwareVersion, firmwareVersion,x,y,z, last_seen, status) \
                        VALUES (?,?,?,?,?,?,?,?)',
                        [anchor.name, anchor.hardwareVersion, anchor.firmwareVersion, anchor.x, anchor.y, anchor.z, anchor.last_seen, anchor.status],
      function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to addAnchor(): " + error.code);
          temp_error = new Error("Couldn't add the anchor to the database."+error.code);
        } else if(results.affectedRows > 0) { /* Fill anchor array */
          added = true;
        }
        /* Release the connection */
        connection.release();

        callback(added, temp_error);
      });
    });
  }

  /**
  * Retreives all the anchors that are situated in the environmentID that
  * is passed as argument.
  * @param {anchorListCallback} callback - The function that is executed with the result.
  * @param {integer} environment - The environmentID.
  */
  this.getAnchorsForEnvironment = function(environment, callback) {
    var requested_anchor_list = [];
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Anchor WHERE environmentID=?', [environment], function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getAnchorsForEnvironment(): " + error.code);
          temp_error = new Error("Couldn't get the anchors from the database."+error.code);
        } else if(results.length >= 0) { /* Fill anchor array */
          results.forEach(function(entry) {
            requested_anchor_list.push(new Anchor(
              entry.anchorID,
              entry.name,
              entry.environmentID,
              entry.hardwareVersion,
              entry.firmwareVersion,
              entry.x,
              entry.y,
              entry.z,
              entry.last_seen,
              entry.status));
          });
        }
        /* Release the connection */
        connection.release();

        callback(requested_anchor_list, temp_error);
      });
    });
  }

}

module.exports = DAO;
