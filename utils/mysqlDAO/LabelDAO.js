var Label = require('../../src/models/Label.js');
var Error = require('../../src/models/Error.js');
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
* @callback labelListCallback
* @param {label[]} labelList - When succeeded, this is a filled list of objects.
* @param {error} error - When 'null' the call succeeded,
* when 'not null' the labelobject will be invalid.
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
  * Collects the label with the provided name from the database.
  * @param {string} name - The name of the label.
  * @param {labelBorderPointCallback} callback - The callback to be executed with the
  * result.
  */
  this.getLabelByName = function(name, callback){
    var requested_label = null;
    var temp_error = null;

    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Label WHERE name = ?', [name], function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getLabelByName(): " + error.code);
          temp_error = new Error("The label couldn't be fetched from the database."+error.code);
        } else if(results.length == 1) { /* Fill points array */
          var result = results[0];
          requested_label = new Label(
            result.labelID,
            result.name
          );
        }
        /* Release the connection */
        connection.release();

        callback(requested_label, temp_error);
      });
    });
  }

  /**
  * Collects the label with the provided id from the database.
  * @param {integer} id - The id of the label to find.
  * @param {labelCallback} callback - The callback to be executed with the
  * result.
  */
  this.getLabelById = function(id, callback) {
    var requested_label = new Label();
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('SELECT * FROM Label WHERE labelID = ?', [id], function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getLabelById(): " + error.code);
          temp_error = new Error("The label couldn't be loaded from the database with the given ID."+error.code);
        } else if(results.length == 1) { /* Fill label element, if not the DB is corrupt */
          var result = results[0];
          requested_label = new Label(
            result.labelID,
            result.name
          );
        }
        /* Release the connection */
        connection.release();

        callback(requested_label, temp_error);
      });
    });
  }

  /**
  * The label with the provided id will be removed from the database.
  * @param {integer} id - The id of the label to be removed.
  * @param {resultActionCallback} callback - The performed callback after
  * removal.
  */
  this.removeLabelById = function(id, callback) {
    var temp_error = null;
    var removed = false;
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('DELETE FROM Label WHERE labelID = ?', [id], function(error, results, fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to removeLabelById(): " + error.code);
          temp_error = new Error("Label was not removed from database."+error.code);
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
  * Method update a label with the provided id.
  * @param {label} label - The label that needs to be updated.
  * @param {resultActionCallback} callback - The callback performed after updating.
  */
  this.updateLabel = function(label, callback) {
    var temp_error = null;
    var updated = false;
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('UPDATE Label SET name=? WHERE labelID = ?',
                        [label.name, label.labelID],
      function(error, results, fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to update the label" + error.code);
          temp_error = new Error("The label was not updated."+error.code);
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
  * This function adds a label to the collection of labels.
  * @param {resultActionCallback} callback - The function that is executed with the result.
  * @param {label} label - The label to add.
  */
  this.addLabel = function(label, callback) {
      var labelID = -1;
      var temp_error = null;
      /* Get connection from pool */
      this.pool.getConnection(function(err, connection) {
        if(err) throw err;
        connection.query('INSERT INTO Label (name) \
                          VALUES (?)',
                          [label.name],
        function(error,results,fields) {
          /* This is an internal server error, this should never happen */
          if(error) {
            console.log("[DAO] Unable to addLabel(): " + error.code);
            temp_error = new Error("Label couldn't be added, name must be unique. "+error.code);
          } else if(results.affectedRows > 0) {
            labelID = results.insertId;
          }
          /* Release the connection */
          connection.release();

          callback(labelID, temp_error);
        });
      });
    }

    /**
    * Collects every label from the database.
    * @param {labelListCallback} callback - The callback to be executed with the
    * result.
    */

  /**
  Get every label provided.
  @param {labelListCallback} callback The callback executed with the result.
  */
  this.getAllLabels = function(callback){
    var requested_label_list = [];
    var temp_error  =null;
    this.pool.getConnection(function(err,connection){
      if(err) throw err;
      connection.query('SELECT * FROM Label', function(error, results, fields){
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to addLabel(): " + error.code);
          temp_error = new Error("The loading of the labels went wrong."+error.code);
        } else if(results.length > 0) {
          results.forEach(function(result) {
            requested_label_list.push(new Label(
              result.labelID,
              result.name
            )
            );
          });
        }else {
          temp_error = new Error("No labels.")
        }
        /* Release the connection */
        connection.release();

        callback(requested_label_list, temp_error);
      });
    });
  }

  /**
  Get every label that is coupled to the
  tag. The tag can be identified with
  the TagID which is passed as argument.
  @Param {}
  */
  this.getLabelsForTag = function(tagID, callback){
    var requested_label_list = [];
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('select l.labelID, l.name from Label l join TagLabel tl on l.labelID = tl.labelID join Tag t \
                        on tl.tagID = t.tagID where t.tagID = ?'
                        , [tagID]
                        , function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to getLabelById(): " + error.code);
          temp_error = new Error("The labels couldn't be loaded from the database."+error.code);
        } else
        if(results.length > 0) { /* Fill label element, if not the DB is corrupt */
          results.forEach((res)=>{
            requested_label_list.push(new Label(
              res.labelID,
              res.name
            ));
          });
        }
        else {
          temp_error = new Error('No labels declared for this tag.');
        }
        /* Release the connection */
        connection.release();

        callback(requested_label_list, temp_error);
      });
    });
  };

  /**
  Add the combination between tags and labels to the
  TagLabel table. This method requests that the
  label is already added.
  @Param {}
  */
  this.addLabelsToTag = function(tagID, labelID, callback){
    var added = false;
    var temp_error = null;
    /* Get connection from pool */
    this.pool.getConnection(function(err, connection) {
      if(err) throw err;
      connection.query('insert into TagLabel (tagID, labelID) values (?,?)'
                        , [tagID, labelID]
                        , function(error,results,fields) {
        /* This is an internal server error, this should never happen */
        if(error) {
          console.log("[DAO] Unable to addLabelsToTag(): " + error.code);
          temp_error = new Error("The label wasn't added to the tag."+error.code);
        } else if(results.affectedRows > 0) { /* Fill label element, if not the DB is corrupt */
          added = true;
        }
        /* Release the connection */
        connection.release();

        callback(added, temp_error);
      });
    });
  }
};

module.exports = DAO;
