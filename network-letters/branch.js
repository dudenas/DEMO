const _speed = 0.01

function Branch(parent, pos) {
  this.pos = pos;
  this.origPos = this.pos.copy()
  this.parent = parent;
  this.child = null
  this.count = 0;
  this.len = floor(random() * max_dist);

  // special case to draw special rects
  if (random(1) < 0.2) this.special = floor(random(2, 4))
  else this.special = 1

  this.animate = random(1) > 0.5

  this.speed = random(_speed / 2, _speed * 2)
  // this.len *= this.special

  this.look = floor(random(3))
  this.fc = Math.random(1)

  this.next = function (leaf) {
    var nextBranch = new Branch(this, leaf.pos);
    this.child = nextBranch
    return nextBranch;
  };

  this.show = function () {
    // if it is has a parent so it is not the first node
    if (parent != null) {
      // if this is the last node where the leaf should be created
      if (this.child == null && this.look < 2) {
        if (this.look == 0) {
          for (let i = 1; i <= this.special; i++) {
            let percent = 1
            if (this.animate) {
              percent = map(sin(((this.fc * 0.25 + i * .1) % 1) * TWO_PI), -1, 1, 0, 1)
            }
            ellipse(this.pos.x, this.pos.y, this.len * i * percent, this.len * i * percent);
          }
        } else {
          for (let i = 1; i <= this.special; i++) {
            let percent = 0
            if (this.animate) {
              percent = map(sin(((this.fc * 0.25 + i * .1) % 1) * TWO_PI), -1, 1, 0, PI)
            }
            push()
            translate(this.pos.x, this.pos.y)
            rotate(percent)
            rect(0, 0, this.len * i, this.len * i);
            pop()
          }
        }
        // else show paths
      } else {
        if (this.look == 0) {
          // if the calculation is done, do this
          if (this.calculatedSegments) this.showLineSegments()
          else {
            this.calculateLineSegments()
          }

        } else if (this.look == 1) {
          line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
        } else {
          this.showPoints()
        }
      }
    }

    this.fc += this.speed
  };

  this.showPoints = function () {
    for (let i = 0; i < params.divideCount; i++) {
      const lerpPos = p5.Vector.lerp(this.pos, this.parent.pos, (i / params.divideCount / 1.0 + this.fc) % 1.0)
      ellipse(lerpPos.x, lerpPos.y, 1, 1);
    }
  }

  this.showCross = function () {

  }

  this.showLineSegments = function () {
    for (let i = 0; i < params.divideCount; i++) {
      const segment = this.segments[i]
      push()
      translate(segment.x, segment.y)
      rotate(segment.angle + PI / 2)
      line(-params.scl / 8, 0, params.scl / 8, 0);
      pop()
    }
  }

  // calculate only ones to increase performance
  this.calculateLineSegments = function () {
    this.calculatedSegments = true
    this.segments = []
    for (let i = 0; i < params.divideCount; i++) {
      const lerpPos = p5.Vector.lerp(this.pos, this.parent.pos, (i / params.divideCount / 1.0))
      const v1 = p5.Vector.sub(this.pos.copy(), this.parent.pos.copy())
      const v2 = createVector(1, 0)
      let angle = v2.angleBetween(v1)
      this.segments.push({
        x: lerpPos.x,
        y: lerpPos.y,
        angle: angle
      })
    }
  }
}