var Zone = require('../../src/models/Zone.js');
var ZoneBorderPoint = require('../../src/models/ZoneBorderPoint.js');
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
* @callback zoneListCallback
* @param {zone[]} zoneList - When succeeded, this is a filled list of objects.
* @param {error} error - When 'null' the call succeeded,
* when 'not null' the zoneobject will be invalid.
*/

/**
* Callback to execute after collecting a single object.
* @callback zoneCallback
* @param {zone} zoneList - When succeeded, this is a filled object.
* @param {error} error - When 'null' the call succeeded,
* when 'not null' the zoneobject will be invalid.
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
  * Collects the zoneborderpoints with the provided zoneid from the database.
  * @param {integer} id - The id of the zone to find the points from.
  * @param {zoneBorderPointCallback} callback - The callback to be executed with the
  * result.
  */
  this.getZonePointsByZoneId = function(id, callback){
    var requested_point_list = [];
    var temp_error = null;

    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM ZoneBorderPoint WHERE zoneID = ?', [id], function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getZonePointsByZoneId(): " + error.code);
          temp_error = new Error("The points couldn't be loaded for the zone."+error.code);
        } else if(results.length >= 0) { /* Fill points array */
          results.forEach(function(result) {
            requested_point_list.push(new ZoneBorderPoint(
              result.zoneBorderPointID,
              result.zoneID,
              result.x,
              result.y,
              result.z
            )
            );
          });
        }
        /* Release the connection */
        connection.release();

        callback(requested_point_list, temp_error);
      });
    });
  }

  /**
  * Collects the zone with the provided id from the database.
  * @param {integer} id - The id of the zone to find.
  * @param {zoneCallback} callback - The callback to be executed with the
  * result.
  */
  this.getZoneById = function(id, callback) {
    var requested_zone = new Zone();
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Zone WHERE zoneID = ?', [id], function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getZoneById(): " + error.code);
          temp_error = new Error("The zone couldn't be loaded by ID."+error.code);
        } else if(results.length == 1) { /* Fill zone element, if not the DB is corrupt */
          var result = results[0];
          requested_zone = new Zone(
            result.zoneID,
            result.environmentID,
            result.name,
            result.area
          );
        }
        /* Release the connection */
        connection.release();

        callback(requested_zone, temp_error);
      });
    });
  }

  /**
  * The zone with the provided id will be removed from the database.
  * @param {integer} id - The id of the zone to be removed.
  * @param {resultActionCallback} callback - The performed callback after
  * removal.
  */
  this.removeZoneById = function(id, callback) {
    var temp_error = null;
    var removed = false;
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('DELETE FROM ZoneBorderPoint WHERE zoneID=?', [id], function(error, results, fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to removeZoneById(): " + error.code);
          temp_error = new Error("Internal Server Error");
        } else if(results.affectedRows == 1) {
          removed = true;
        }
      });

      connection.query('DELETE FROM Zone WHERE zoneID = ?', [id], function(error, results, fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to removeZoneById(): " + error.code);
          temp_error = new Error("The zone couldn't be removed."+error.code);
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
  * Method update a zone with the provided id.
  * @param {zone} zone - The zone that needs to be updated.
  * @param {resultActionCallback} callback - The callback performed after updating.
  */
  this.updateZone = function(zone, callback) {
    var temp_error = null;
    var updated = false;
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('UPDATE Zone SET name=?, environmentID = ?, area = ? WHERE zoneID = ?',
                        [zone.name, zone.environmentID, zone.area, zone.zoneID],
      function(error, results, fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to updateZoneById(): " + error.code);
          temp_error = new Error("The zone couldn't be updated."+error.code);
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
    * This function adds a zone to the collection of zones.
    * @param {resultActionCallback} callback - The function that is executed with the result.
    * @param {zone} zone - The zone to add.
    */
    this.addZone = function(zone, callback) {
      var id = -1;
      var temp_error = null;
      /* Get connection from pool */
      this.pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query('INSERT INTO Zone (name, environmentID, area) \
                          VALUES (?,?,?)',
                          [zone.name, zone.environmentID, zone.area],
        function(error,results,fields) {
          /* This is an internal server error, this should never happen */
          if(error) {
            console.log("[DAO] Unable to addZone(): " + error.code);
            temp_error = new Error("The zone couldn't be added."+error.code);
          } else if(results.affectedRows > 0) {
            id = results.insertId;
          }
          /* Release the connection */
          connection.release();

          callback(id, temp_error);
        });
      });
    }

    /**
    * Retreives all the zones that are situated in the environmentID that
    * is passed as argument.
    * @param {zoneListCallback} callback - The function that is executed with the result.
    * @param {integer} environment - The environmentID.
    */
    this.getZoneForEnvironment = function(environment, callback) {
      var requested_zone_list = [];
      var temp_error = null;
      /* Get connection from pool */
      this.pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query('SELECT * FROM Zone WHERE environmentID=?', [environment], function(error,results,fields) {
          /* This is an internal server error, this should never happen */
          if(error) {
            console.log("[DAO] Unable to getTagsForEnvironment(): " + error.code);
            temp_error = new Error("The zone couldn't be loaded for the environment."+error.code);
          } else if(results.length >= 0) { /* Fill zone array */
            results.forEach(function(result) {
              requested_zone_list.push(new Zone(
                result.zoneID,
                result.environmentID,
                result.name,
                result.area
              )
              );
            });
          }
          /* Release the connection */
          connection.release();

          callback(requested_zone_list, temp_error);
        });
      });
    }

    /**
    * This function adds a zone borderpoint to a zone.
    * @param {resultActionCallback} callback - The function that is executed with the result.
    * @param {zoneBorderPoint} zoneBorderPoint - The zone to add.
    */
    this.addBorderPoint = function(zoneBorderPoint, callback) {
      var id = -1;
      var temp_error = null;
      /* Get connection from pool */
      this.pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query('INSERT INTO ZoneBorderPoint (zoneID, x, y, z) \
                          VALUES (?,?,?,?)',
                          [zoneBorderPoint.zoneID, zoneBorderPoint.x, zoneBorderPoint.y, zoneBorderPoint.z],
        function(error,results,fields) {
          /* This is an internal server error, this should never happen */
          if(error) {
            console.log("[DAO] Unable to addZoneBorderPoint(): " + error.code);
            temp_error = new Error("The point couldn't be added."+error.code);
          } else if(results.affectedRows > 0) {
            id = results.insertId;
          }
          /* Release the connection */
          connection.release();

          callback(id, temp_error);
        });
      });
    }

    /**
    * This function adds a zone borderpoint to a zone.
    * @param {integer} zoneID - The zoneid that will be provided for every point.
    * @param {resultActionCallback} callback - The function that is executed with the result.
    * @param {zoneBorderPoint} zoneBorderPoint - The zone to add.
    */
    this.addBorderPointlist = function(zoneID, zoneBorderPointlist, callback) {
      var zoneBorderPointlist = zoneBorderPointlist;
      var array= [zoneBorderPointlist.length];
      for (var i = 0; i < zoneBorderPointlist.length; i++) {
        array[i] = [4];
        array[i][0] = parseInt(zoneID);
        array[i][1] = zoneBorderPointlist[i].x;
        array[i][2] = zoneBorderPointlist[i].y;
        array[i][3] = zoneBorderPointlist[i].z;
      }
      var temp_error = null;
      /* Get connection from pool */
      this.pool.getConnection(function(err, connection) {
        if(err) throw err;
        var query = connection.query('INSERT INTO ZoneBorderPoint (zoneID, x, y, z) VALUES ?',
                          [array],
        function(error,results,fields) {
          /* This is an internal server error, this should never happen */
          if(error) {
            console.log("[DAO] Unable to addZoneBorderPoint(): " + error.code);
            temp_error = new Error("The points couldn't be added."+error.code);
          } else if(results.affectedRows > 0) {
            zoneID = results.insertId;
          }
          /* Release the connection */
          connection.release();

          callback(zoneID, temp_error);
        });
        console.log(query.sql);
      });
    }

    /**
    * Collects the point with the provided id from the database.
    * @param {integer} id - The id of the point to find.
    * @param {zoneBorderPointCallback} callback - The callback to be executed with the
    * result.
    */
    this.getBorderPoint = function(id, callback) {
      var requested_zone_borderpoint = new ZoneBorderPoint();
      var temp_error = null;
      /* Get connection from pool */
      this.pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query('SELECT * FROM ZoneBorderPoint WHERE zoneBorderPointID = ?', [id], function(error,results,fields) {
          /* This is an internal server error, this should never happen */
          if(error) {
            console.log("[DAO] Unable to getZoneById(): " + error.code);
            temp_error = new Error("The point couldn't be loaded."+error.code);
          } else if(results.length == 1) { /* Fill zone element, if not the DB is corrupt */
            var result = results[0];
            requested_zone_borderpoint = new ZoneBorderPoint(
              result.zoneBorderPointID,
              result.zoneID,
              result.x,
              result.y,
              result.z
            );
          }
          /* Release the connection */
          connection.release();

          callback(requested_zone_borderpoint, temp_error);
        });
      });
    }

    /**
    * Method update a zoneborderpoint with the provided id.
    * @param {zoneBorderPoint} zonebp - The zoneborderpoint that needs to be updated.
    * @param {resultActionCallback} callback - The callback performed after updating.
    */
    this.updateZoneBorderPoint = function(zonebp, callback) {
      var temp_error = null;
      var updated = false;
      this.pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query('UPDATE ZoneBorderPoint SET x = ?, y = ?, z = ?, zoneID = ? WHERE zoneBorderPointID = ?',
                          [zonebp.x, zonebp.y, zonebp.z, zonebp.zoneID, zonebp.zoneBorderPointID],
        function(error, results, fields) {
          /* This is an internal server error, this should never happen */
          if(error) {
            console.log("[DAO] Unable to updateZoneBorderPoint(): " + error.code);
            temp_error = new Error("The point couldn't be updated.");
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
    * The zone borderpoint with the provided id will be removed from the database.
    * @param {integer} id - The id of the zone borderpoint to be removed.
    * @param {resultActionCallback} callback - The performed callback after
    * removal.
    */
    this.removeZoneBorderPointById = function(id, callback) {
      var temp_error = null;
      var removed = false;
      this.pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query('DELETE FROM ZoneBorderPoint WHERE zoneBorderPointID = ?', [id], function(error, results, fields) {
          /* This is an internal server error, this should never happen */
          if(error) {
            console.log("[DAO] Unable to removeZoneBorderPointById(): " + error.code);
            temp_error = new Error("The point couldn't be removed."+error.code);
          } else if(results.affectedRows == 1) {
            removed = true;
          }

          /* Release the connection */
          connection.release();

          callback(removed, temp_error);
        });
      });
    }
};
module.exports = DAO;
