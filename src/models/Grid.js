var Grid = function(parent) {
  this.visible = true;
  this.parent = parent;
  this.lines = [];

  this.renderGrid = function(num_rectangles_wide, num_rectangles_tall) {
    var width_per_rectangle = (parent.bounds.width* 3) / num_rectangles_wide;
    var height_per_rectangle = (parent.bounds.height* 3) / num_rectangles_tall;
    for (var i = 0; i <= num_rectangles_wide; i++) {
      var xPos = parent.bounds.left - parent.bounds.width + i * width_per_rectangle;
      var topPoint = new Point(xPos, parent.bounds.top- parent.bounds.height);
      var bottomPoint = new Point(xPos, parent.bounds.bottom +parent.bounds.height);
      var aLine = new Path.Line(topPoint, bottomPoint);
      aLine.opacity = 0.35;
      aLine.strokeColor = '#232323 ';
      aLine.dashArray = [15,45];
      this.lines.push(aLine);
    }
    for (var i = 0; i <= num_rectangles_tall; i++) {
      var yPos = parent.bounds.top -parent.bounds.height + i * height_per_rectangle;
      var leftPoint = new Point(parent.bounds.left - parent.bounds.width, yPos);
      var rightPoint = new Point(parent.bounds.right +parent.bounds.width, yPos);
      var aLine = new Path.Line(leftPoint, rightPoint);
      aLine.opacity = 0.35;
      aLine.strokeColor = '#232323 ';
      aLine.dashArray = [15,45];
      this.lines.push(aLine);
    }
  }

    this.setVisible = function(val) {
      this.lines.forEach(function(element) {
        element.visible = val;
      });
    }
}

module.exports = Grid;
