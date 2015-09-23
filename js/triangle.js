function Triangle(height, x, y) {
  this.height = height;
  this.headPos = createVector(x, y);
  this.lifeCount = 80;
  this.findTail();
  this.draw();
}

Triangle.prototype.update = function(color) {
  this.draw(color);
  this.headPos.add(0, this.height);
  this.lifeCount--;
  this.tail1.add(-this.height, 0);
  this.tail2.add(this.height, 0);
};

Triangle.prototype.findTail = function() {
  this.tail1 = createVector(this.headPos.x - this.height, this.headPos.y - this.height);
  this.tail2 = createVector(this.headPos.x + this.height, this.headPos.y - this.height);
};

Triangle.prototype.draw = function(color) {
  color = color || superDark;
  stroke(color);
  line(this.headPos.x, this.headPos.y, this.tail1.x, this.tail1.y);
  stroke(color);
  line(this.headPos.x, this.headPos.y, this.tail2.x, this.tail2.y);
};