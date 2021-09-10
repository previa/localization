"use strict"

var multer = require('multer');
var config = require('../config/config.js');
var fs = require('fs');

module.exports = function() {
  var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      if(!fs.existsSync(config.uploadImageFolder)) {
        fs.mkdirSync(config.uploadImageFolder);
      }
      callback(null, config.uploadImageFolder);
    },
    filename: function(req, file, callback) {
      console.log(file);
      callback(null, file.fieldname + '-' + Date.now() + '.jpg');
    }
  });

  var upload  = multer({ storage: storage}).single('map');
}
