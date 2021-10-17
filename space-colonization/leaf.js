// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Leaf(pos) {
  this.pos = pos ? pos : createVector(random(width), random(height));
  this.reached = false;

  this.show = function () {
    ellipse(this.pos.x, this.pos.y, 2, 2);
  };
}