// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Branch(parent, pos) {
  this.pos = pos;
  this.parent = parent;
  this.child = null
  this.count = 0;
  this.len = floor(random() * max_dist);

  this.next = function (leaf) {
    var nextBranch = new Branch(this, leaf.pos);
    this.child = nextBranch
    return nextBranch;
  };

  this.show = function () {
    if (parent != null) {
      if (this.child == null) {
        // ellipse(this.pos.x, this.pos.y, this.len, this.len);
      }
      // ellipse(this.pos.x, this.pos.y, 2, 2);
      // this.showPoints()
      line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
      // point(this.pos.x, this.pos.y);
    }
  };

  this.showPoints = function () {
    for (let i = 0; i < 3; i++) {
      const lerpPos = p5.Vector.lerp(this.pos, this.parent.pos, i / 3.)
      point(lerpPos.x, lerpPos.y);
    }
  }
}