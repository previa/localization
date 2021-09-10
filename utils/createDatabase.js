var config = require('../config/config.js');
var fs = require('fs');

/* TODO: ERROR LOGGING SHOULD BE LOGGED IN FILE NOT THE CONSOLE */


module.exports = function(connection) {

connection.connect(function(err) {
  if(err) {
    console.error('[DATABASE] Error connecting: ' + err.stack);
    return;
  }

  console.log('[DATABASE] Connected with MySQL as id ' + connection.threadId);
});

/* Create DB if not exist */
connection.query('CREATE DATABASE IF NOT EXISTS Pozyx;', function(error, results, fields) {
  if(error) {
    throw error;
  } else if(results.warningCount == 0) {
    console.log('[DATABASE] Database ' + config.dbName + ' was created');
  } else {
    console.log('[DATABASE] Database ' + config.dbName + ' already exitst');
  }
});

connection.query('USE ' + config.dbName, function(error, results, fields) {
  if(error) {
    throw error;
  }
});

connection.query('CREATE TABLE IF NOT EXISTS Tag ( \
  tagID INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, \
  name VARCHAR(45), \
  hardwareVersion TINYINT, \
  firmwareVersion TINYINT, \
  batteryLevel FLOAT(4), \
  updateRate INTEGER,\
  iconPath VARCHAR(255), \
  iconColor VARCHAR(45), \
  mac VARCHAR(45));', function(error, results, fields) {
    if(error) {
      throw error;
    } else if(results.warningCount == 0) {
      console.log('[DATABASE] New table Tag was added');
    } else {
      console.log('[DATABASE] Skipping table Tag (already exists)');
    }
});

connection.query('CREATE TABLE IF NOT EXISTS Environment ( \
  environmentID INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, \
  name VARCHAR(25), \
  description  VARCHAR(255));', function(error, results, fields) {
  if(error) {
    throw error;
  } else if(results.warningCount == 0) {
    console.log('[DATABASE] New table Environment was added');
  } else {
    console.log('[DATABASE] Skipping table Environment (already exists)');
  }
});

connection.query("INSERT INTO Environment (`environmentID`, `name`, `description`) VALUES ('1', 'global', 'global');", function(error, results, fields) {
  if(error) {
    console.log('[DATABASE] Skipping Environment record (already exists)');
  } else if(results.warningCount == 0) {
    console.log('[DATABASE] New Environment record was added');
  }
});

connection.query('CREATE TABLE IF NOT EXISTS Zone( \
  zoneID INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, \
  name VARCHAR(25), \
  area DOUBLE);', function(error, results, fields) {
      if(error) {
        throw error;
      } else if(results.warningCount == 0) {
        console.log('[DATABASE] New table Zone was added');
      } else {
        console.log('[DATABASE] Skipping table Zone (already exists)');
      }
});

connection.query('CREATE TABLE IF NOT EXISTS ZoneBorderPoint( \
  zoneBorderPointID INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, \
  x INTEGER, \
  y INTEGER, \
  z INTEGER);', function(error, results, fields) {
    if(error) {
      throw error;
    } else if(results.warningCount == 0) {
      console.log('[DATABASE] New table ZoneBorderPoint was added');
    } else {
      console.log('[DATABASE] Skipping table ZoneBorderPoint (already exists)');
    }
});

connection.query('CREATE TABLE IF NOT EXISTS Anchor( \
  anchorID INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, \
  name VARCHAR(25), \
  hardwareVersion TINYINT, \
  firmwareVersion TINYINT, \
  x INTEGER, \
  y INTEGER, \
  z INTEGER, \
  last_seen DATETIME(3), \
  status TINYINT);', function(error, results, fields) {
    if(error) {
      throw error;
    } else if(results.warningCount == 0) {
      console.log('[DATABASE] New table Anchor was added');
    } else {
      console.log('[DATABASE] Skipping table Anchor (already exists)');
    }
});

connection.query('CREATE TABLE IF NOT EXISTS Label( \
  labelID INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, \
  name VARCHAR(25), UNIQUE(name));', function(error, results, fields) {
    if(error) {
      throw error;
    } else if(results.warningCount == 0) {
      console.log('[DATABASE] New table Label was added');
    } else {
      console.log('[DATABASE] Skipping table Label (already exists)');
    }
});

connection.query('CREATE TABLE IF NOT EXISTS Pozyx.Position( \
  positionID INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, \
  x INTEGER, \
  y INTEGER, \
  z INTEGER, \
  timestamp DATETIME(3));', function(error, results, fields) {
    if(error) {
      throw error;
    } else if(results.warningCount == 0) {
      console.log('[DATABASE] New table Position was added');
    } else {
      console.log('[DATABASE] Skipping table Position (already exists)');
    }
});

connection.query('CREATE TABLE IF NOT EXISTS TagLabel( \
  tagLabelID INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT);', function(error, results, fields) {
    if(error) {
      throw error;
    } else if(results.warningCount == 0) {
      console.log('[DATABASE] New table TagLabel was added');
    } else {
      console.log('[DATABASE] Skipping table TagLabel (already exists)');
    }
});

/* Adding the foreign key constraints.*/
connection.query('ALTER TABLE Zone ADD environmentID INTEGER;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table Zone: ' + error.code);
  } else {
    console.log('[DATABASE] The table Zone was altered');
  }
});

connection.query('ALTER TABLE Zone ADD CONSTRAINT zone_environment FOREIGN KEY (environmentID) REFERENCES Environment(environmentID);',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table Zone: ' + error.code);
  } else {
    console.log('[DATABASE] The table Zone was altered');
  }
});

connection.query('ALTER TABLE ZoneBorderPoint ADD zoneID INTEGER;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table ZoneBorderPoint: ' + error.code);
  } else {
    console.log('[DATABASE] The table ZoneBorderPoint was altered');
  }
});

connection.query('ALTER TABLE ZoneBorderPoint ADD CONSTRAINT zoneborderpoint_zone FOREIGN KEY (zoneID) REFERENCES Zone(zoneID) ON DELETE CASCADE;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table ZoneBorderPoint: ' + error.code);
  } else {
    console.log('[DATABASE] The table ZoneBorderPoint was altered');
  }
});

connection.query('ALTER TABLE Anchor ADD environmentID INTEGER;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table Anchor: ' + error.code);
  } else {
    console.log('[DATABASE] The table Anchor was altered');
  }
});

connection.query('ALTER TABLE Anchor ADD CONSTRAINT anchor_environment FOREIGN KEY (environmentID) REFERENCES Environment(environmentID) ON DELETE CASCADE;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table Anchor: ' + error.code);
  } else {
     console.log('[DATABASE] The table Anchor was altered');
  }
});

connection.query('ALTER TABLE Anchor ADD CONSTRAINT anchor_status CHECK(status < 3 and status >= 0);',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table Anchor: ' + error.code);
  }
});

connection.query('ALTER TABLE Tag ADD environmentID INTEGER;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table Tag: ' + error.code);
   } else {
    console.log('[DATABASE] The table Tag was altered');
  }
});

connection.query('ALTER TABLE Tag ADD CONSTRAINT tag_environment FOREIGN KEY (environmentID) REFERENCES Environment(environmentID) ON DELETE CASCADE;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table Tag: ' + error.code);
  } else {
    console.log('[DATABASE] The table Tag was altered');
  }
});

connection.query('ALTER TABLE Position ADD tagID INTEGER;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table Position: ' + error.code);
  } else {
    console.log('[DATABASE] The table Position was altered');
  }
});

connection.query('ALTER TABLE Position ADD CONSTRAINT position_tag FOREIGN KEY (tagID) REFERENCES Tag(tagID)  ON DELETE CASCADE;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table Position: ' + error.code);
  } else {
    console.log('[DATABASE] The table Position was altered');
  }
});

connection.query('ALTER TABLE TagLabel ADD tagID INTEGER;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table TagLabel: ' + error.code);
  } else {
    console.log('[DATABASE] The table TagLabel was altered');
  }
});

connection.query('ALTER TABLE TagLabel ADD CONSTRAINT tag_taglabel   FOREIGN KEY (tagID) REFERENCES Tag(tagID) ON DELETE CASCADE;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table TagLabel: ' + error.code);
  } else {
    console.log('[DATABASE] The table TagLabel was altered');
  }
});

connection.query('ALTER TABLE TagLabel ADD labelID INTEGER;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table TagLabel: ' + error.code);
  } else {
    console.log('[DATABASE] The table TagLabel was altered');
  }
});

connection.query('ALTER TABLE TagLabel ADD CONSTRAINT label_taglabel   FOREIGN KEY (labelID)   REFERENCES Label(labelID) ON DELETE CASCADE;',function(error,results,fields) {
  if(error) {
    console.log('[DATABASE] Skipping alter table TagLabel: ' + error.code);
  } else {
    console.log('[DATABASE] The table TagLabel was altered');
  }
});

//connection.end();
/* Adding the dummy data. This is temporary.*/
//fs.readFile(__dirname+'/dummy.sql','utf8',(err,data)=>{
//  if(err) throw err;
//  var statements = data.split('\n');
//  for(var i=0;i<statements.length; i++){
//    connection.query(statements[i],function(error,results,fields){
//      if(error) console.log(error.message);
//      else console.log('[DATABASE] Record added.')
//    });
//  }
//  connection.end();
//});

connection.end();
}
