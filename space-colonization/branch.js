// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY
const _speed = 0.01

function Branch(parent, pos) {
  this.pos = pos;
  this.origPos = this.pos.copy()
  this.parent = parent;
  this.child = null
  this.count = 0;
  this.len = floor(random() * max_dist);
  if (random(1) < 0.2) this.len *= floor(random(1, 4))
  this.look = floor(random(3))
  this.fc = Math.random(1)

  this.next = function (leaf) {
    var nextBranch = new Branch(this, leaf.pos);
    this.child = nextBranch
    return nextBranch;
  };

  this.show = function () {
    if (parent != null) {
      if (this.child == null && this.look < 2) {
        if (this.look == 0) ellipse(this.pos.x, this.pos.y, this.len, this.len);
        else rect(this.pos.x, this.pos.y, this.len, this.len);
      } else {
        // ellipse(this.pos.x, this.pos.y, 2, 2);
        if (this.look == 0) this.showLineSegments()
        else if (this.look == 1) {
          line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
        } else {
          this.showPoints()
        }
      }
    }

    this.fc += _speed
  };

  this.showPoints = function () {
    for (let i = 0; i < 3; i++) {
      const lerpPos = p5.Vector.lerp(this.pos, this.parent.pos, (i / 3. + this.fc) % 1.0)
      ellipse(lerpPos.x, lerpPos.y, 1, 1);
    }
  }

  this.showLineSegments = function () {
    for (let i = 0; i < 3; i++) {
      const lerpPos = p5.Vector.lerp(this.pos, this.parent.pos, (i / 3.))
      const v1 = p5.Vector.sub(this.pos.copy(), this.parent.pos.copy())
      const v2 = createVector(1, 0)
      let angle = v2.angleBetween(v1)
      push()
      translate(lerpPos.x, lerpPos.y)
      rotate(angle + PI / 2)
      line(-params.scl / 8, 0, params.scl / 8, 0);
      pop()
    }
  }
}