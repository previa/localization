var Environment = function(id, name, description){
  this.environmentID = id || -1;
  this.name = name || "undefined";
  this.description = description ||"No info";
}

module.exports = Environment;
