function RotatingTri(height, x, y, change) {
  Triangle.call(this, height, x, y);
}

RotatingTri.prototype = Object.create(Triangle.prototype);
RotatingTri.prototype.constructor = RotatingTri;

RotatingTri.prototype.update = function() {
  this.headPos.add(0, this.height);
  this.tail1.add(0, this.height * 3);
  this.tail2.add(0, this.height * 3);
  this.lifeCount--;
  this.draw();
};

RotatingTri.prototype.findTail = function() {
  this.tail1 = createVector(0, this.headPos.y);
  this.tail2 = createVector(windowWidth, this.headPos.y);
};