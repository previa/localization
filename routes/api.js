/* Holds the location to where the image is saved */
var imageStorage = require('../utils/createImageStorage.js')();


module.exports = function(app) {

  /* Upload an image */
  app.post('/api/upload_map', function(req,res) {
    /* Use storage to upload image to */
    imageStorage.upload(req,res, function(err) {
      if(err) {
        return res.end('Error uploading file.' + err);
      }
      res.end('File is uploaded');
    });
  });
}
