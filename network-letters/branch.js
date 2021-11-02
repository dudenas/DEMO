const _speed = 0.01

function Branch(parent, pos) {
  this.pos = pos;
  this.origPos = this.pos.copy()
  this.parent = parent;
  this.child = null
  this.children = []
  this.count = 0;
  this.len = params.scl;

  // special case to draw special rects
  if (random(1) < params.endings) this.special = floor(random(2, random(2, 5)))
  else this.special = 1

  if (random(1) < 0.01) this.unique = true

  this.animate = random(1) > 0.5

  this.speed = random(_speed / 2., _speed * 2)

  this.look = floor(random(5))
  this.fc = Math.random(1)

  this.next = function (leaf) {
    var nextBranch = new Branch(this, leaf.pos);
    this.child = nextBranch
    this.children.push(this.child)
    return nextBranch;
  };

  this.show = function () {
    // if it is has a parent so it is not the first node
    if (parent != null) {
      // if this is the last node where the leaf should be created
      if (this.child == null && params.showEndings && this.special > 1) {
        // half ellipses half squares
        if (this.look < 3) {
          for (let i = 1; i <= this.special; i++) {
            let percent = 1
            if (this.animate && params.animate) {
              percent = map(sin(((this.fc * 0.25 + i * .1) % 1) * TWO_PI), -1, 1, 0, 1)
            } else {
              percent = map(sin(((this.fc * 0.25 / 4 + i * .1) % 1) * TWO_PI), -1, 1, 0, 1)
            }
            ellipse(this.pos.x, this.pos.y, this.len * i * percent, this.len * i * percent);
          }
        } else {
          let prev = params.scl
          for (let i = 1; i <= this.special; i++) {
            let percent = 0
            if (this.animate) {
              percent = map(sin(((this.fc * 0.25 + i * .1) % 1) * TWO_PI), -1, 1, 0, PI)
            } else {
              percent = map(sin(((this.fc * 0.25 / 4 + i * .1) % 1) * TWO_PI), -1, 1, 0, PI)
            }

            // little calculation in order to have squares within squares which would not collide when rotating
            let temp = params.scl
            if (i > 1) {
              temp = sqrt(pow(prev, 2) * 2)
              prev = temp
            }
            push()
            translate(this.pos.x, this.pos.y)
            rotate(percent * params.animate)
            rect(0, 0, temp, temp);
            pop()
          }
        }
        // else show paths
      } else {
        if (this.look == 0 && params.showSegments) {
          // if the calculation is done, do this
          if (this.calculatedSegments) this.showLineSegments()
          else {
            this.calculateLineSegments()
          }
        } else if (this.look == 1 && params.showPoints) {
          this.showPoints()
        } else if (this.look == 2 && params.showCross) {
          this.showCross()
        } else if (this.look == 3 && params.showDoubleLine) {
          this.showSaw()
        } else if (params.showLine) {
          line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
        }
      }
    }

    this.fc += this.speed
  };

  // this.show = function () {
  //   // if it is has a parent so it is not the first node
  //   if (parent != null) {
  //     line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
  //   }

  //   this.fc += this.speed
  // };

  this.showPoints = function () {
    for (let i = 0; i < params.divideCount; i++) {
      const lerpPos = p5.Vector.lerp(this.pos, this.parent.pos, (i / params.divideCount / 1.0 + this.fc * params.animate) % 1.0)
      ellipse(lerpPos.x, lerpPos.y, 1, 1);
    }
  }

  this.showCross = function () {
    push()
    translate(this.pos.x, this.pos.y)
    if (this.animate) rotate(PI / 2 + this.fc * params.animate)
    else rotate(PI / 4 + this.fc * params.animate)
    line(-params.scl / params.lineLen, 0, params.scl / params.lineLen, 0);
    line(0, -params.scl / params.lineLen, 0, params.scl / params.lineLen);
    pop()
  }

  this.showLineSegments = function () {
    for (let i = 0; i < params.divideCount; i++) {
      const segment = this.segments[i]
      push()
      translate(segment.x, segment.y)
      rotate(segment.angle + PI / 2)
      line(-params.scl / params.lineLen, 0, params.scl / params.lineLen, 0);
      pop()
    }
  }

  this.showSaw = function () {
    const v1 = p5.Vector.sub(this.pos.copy(), this.parent.pos.copy())
    v1.rotate(HALF_PI)
    v1.setMag(params.scl / 3)
    const v2 = this.pos.copy().add(v1)
    const v3 = this.parent.pos.copy().add(v1)
    line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
    line(v2.x, v2.y, v3.x, v3.y);
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