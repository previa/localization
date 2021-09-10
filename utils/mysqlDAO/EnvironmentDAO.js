var Environment = require('../../src/models/Environment.js');
var Point = require('../../src/models/ZoneBorderPoint.js')
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
* @callback environmentListCallback
* @param {environment[]} environmentList - When succeeded, this is a filled list of objects.
* @param {error} error - When 'null' the call succeeded,
* when 'not null' the labelobject will be invalid.
*/
/**
* Callback to execute after collecting a single object.
* @callback environmentCallback
* @param {environment} labelBorderPointList - When succeeded, this is a filled object.
* @param {error} error - When 'null' the call succeeded,
* when 'not null' the labelobject will be invalid.
*/

/**
* Callback to execute after collecting a single object.
* @callback zoneBorderPointCallback
* @param {zoneBorderPoint} zoneBorderPointList - When succeeded, this is a filled object.
* @param {error} error - When 'null' the call succeeded,
* when 'not null' the zoneobject will be invalid.
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
  * Collects the environment with the provided name from the database.
  * @param {integer} id - The id of the environment.
  * @param {environmentCallback} callback - The callback to be executed with the
  * result.
  */
  this.getEnvironmentById = function(id, callback){
    var requested_environment = null;
    var temp_error = null;

    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Environment WHERE environmentID = ?', [id], function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getEnvironmentById(): " + error.code);
          temp_error = new Error("The environment couldn't be fetched from the database."+error.code);
        } else if(results.length == 1) { /* Fill points array */
          var result = results[0];
          requested_environment = new Environment(
            result.environmentID,
            result.name,
            result.description
          );
        }
        /* Release the connection */
        connection.release();

        callback(requested_environment, temp_error);
      });
    });
  }

  /**
  * The environment with the provided id will be removed from the database.
  * @param {integer} id - The id of the environment to be removed.
  * @param {resultActionCallback} callback - The performed callback after
  * removal.
  */
  this.removeEnvironmentById = function(id, callback) {
    var temp_error = null;
    var removed = false;
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('DELETE FROM Environment WHERE environmentID = ?', [id], function(error, results, fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to removeEnvironmentById(): " + error.code);
          temp_error = new Error("The environmend isn't removed."+error.code);
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
  * Method update an environment with the provided id.
  * @param {environment} environment - The environment that needs to be updated.
  * @param {resultActionCallback} callback - The callback performed after updating.
  */
  this.updateEnvironment = function(environment, callback) {
    var temp_error = null;
    var updated = false;
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('UPDATE Environment SET name=?, description=? WHERE environmentID = ?',
                        [environment.name, environment.description, environment.environmentID],
      function(error, results, fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to update the environment" + error.code);
          temp_error = new Error("The environment wasn't updated."+error.code);
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
  * This function adds an environment to the collection of environments.
  * @param {resultActionCallback} callback - The function that is executed with the result.
  * @param {environment} environment - The environment to add.
  */
  this.addEnvironment = function(environment, callback) {
    var id = -1;
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('INSERT INTO environment (name, description) \
                        VALUES (?,?)',
                        [environment.name, environment.description],
      function(error,result,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to addEnvironment(): " + error.code);
          temp_error = new Error("The environment wasn't added."+error.code);
        } else if(result.affectedRows > 0) {
          id= result.insertId;
        }
        /* Release the connection */
        connection.release();

        callback(id, temp_error);
      });
    });
  }

  /**
  Get every environment provided.
  @param {environmentListCallback} callback The callback executed with the result.
  */
  this.getAllEnvironments = function(callback){
    var requested_environment_list = [];
    var temp_error  =null;
    this.pool.getConnection(function(err,connection){
      if(err) throw err;
      connection.query('SELECT * FROM Environment', function(error, results, fields){
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getAllEnvironments(): " + error.code);
          temp_error = new Error("The environments couldn't be fetched."+error.code);
        } else if(results.length > 0) {
          results.forEach(function(result) {
            requested_environment_list.push(new Environment(
              result.environmentID,
              result.name,
              result.description
            )
            );
          });
        }else {
          temp_error = new Error("No environments in the database.")
        }
        /* Release the connection */
        connection.release();

        callback(requested_environment_list, temp_error);
      });
    });
  }

  /**
  Get every point for the environment.
  @param {zoneBorderPointCallback} callback The callback executed with the result.
  */
  this.getPointsByEnvironment = function(id, callback){
    var requested_point_list = [];
    var temp_error  =null;
    this.pool.getConnection(function(err,connection){
      if(err) throw err;
      connection.query('SELECT * from Zone z join ZoneBorderPoint p on p.zoneID = z.zoneID where z.environmentID = ?', [id], function(error, results, fields){
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getPointsByEnvironment(): " + error.code);
          temp_error = new Error("The points for the environment couldn't be fetched from the database."+error.code);
        } else if(results.length > 0) {
          results.forEach(function(result) {
            requested_point_list.push(new Point(
              result.zoneBorderPointID,
              result.x,
              result.y,
              result.z,
              result.zoneID
            )
            );
          });
        }else {
          temp_error = new Error("No points in the database..")
        }
        /* Release the connection */
        connection.release();

        callback(requested_point_list, temp_error);
      });
    });
  }
};

module.exports = DAO;
