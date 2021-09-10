var config = {};

/* TODO: SPLIT IN BACKEND CONFIG AND REACT CONFIG */

/* The application port */
config.port = 8080;

/* The file upload folder */
config.publicImage = "/public/img/"

/* The Python Generator Output file */
config.generatedCoordinates = "utils/output.csv";

/* The socket emit time (in ms) */
config.socketEmitTime = 100;

/* Scaling factor */
config.scalingFactor = 1.10;
config.mapMovementConstant = 10;

/* Paint distance */
config.drawDistance = 250;

config.strokeWidth = 5;

/* Close button image */
config.closeButton = "close.png";
config.editButton = "edit.png";
config.anchor = "anchor.png";
config.tag = "tag.png";
config.deleteButton = "delete.png";

/* Nr of tags supported (this should become 20) */
config.nrOfTags = 1;

/* Database variables */
config.dbHost = 'localhost';
config.dbUser = 'root';
config.dbPassword = 'Test123!';
config.dbName = 'Pozyx';
config.dbPort = 3306;


config.getImage = function(name) {
  return this.publicImage + this[name];
}

config.getPublicImage = function(path) {
  return this.publicImage + path;
}

module.exports = config;
