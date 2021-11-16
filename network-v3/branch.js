const _speed = 0.01

function Branch(parent, pos) {
  this.pos = pos;
  this.origPos = this.pos.copy()
  this.parent = parent;
  this.child = null
  this.children = []
  this.count = 0;
  this.len = params.scl;
  this.isGrowing = false
  this.growingCount = 0
  this.transitioned = false

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

  this.show = function (p) {
    if (p) {
      if (parent != null) {
        // if this is the last node where the leaf should be created
        if (this.child == null && params.showEndings && this.special > 1 && (params.showEndingsEllipse || params.showEndingsRectangle)) {
          // half ellipses half squares
          if ((this.look < 3 && params.showEndingsEllipse) || !params.showEndingsRectangle) {
            for (let i = 1; i <= this.special; i++) {
              let percent = 1
              if (this.animate && params.animate) {
                percent = map(sin(((this.fc * 0.25 * params.animate + i * .1) % 1) * TWO_PI), -1, 1, 0, 1)
              } else {
                percent = map(sin(((this.fc * 0.25 / 4 * params.animate + i * .1) % 1) * TWO_PI), -1, 1, 0, 1)
              }
              p.ellipse(this.pos.x, this.pos.y, this.len * i * percent, this.len * i * percent);
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

              p.translate(this.pos.x, this.pos.y)
              p.rotate(percent * params.animate)
              p.rectMode(CENTER)
              p.rect(0, 0, temp, temp);
              p.rotate(-1 * percent * params.animate)
              p.translate(-this.pos.x, -this.pos.y)
            }
          }
          // else show paths
        } else {
          if (this.look == 0 && params.showSegments) {
            // if the calculation is done, do this
            if (this.calculatedSegments) this.showLineSegments(p)
          } else if (this.look == 1 && params.showPoints) {
            this.showPoints(p)
          } else if (this.look == 2 && params.showCross) {
            this.showCross(p)
          } else if (this.look == 3 && params.showDoubleLine) {
            this.showSaw(p)
          } else if (params.showLine) {
            p.line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
          }
        }
      }
    } else {
      if (this.isGrowing) {
        this.growingCount++
        if (this.growingCount % params.growingTime == 0) {
          this.isGrowing = false
        }
        const lerpPos = p5.Vector.lerp(this.parent.pos, this.pos, this.growingCount / params.growingTime)
        line(lerpPos.x, lerpPos.y, this.parent.pos.x, this.parent.pos.y);
      } else {
        // if it is has a parent so it is not the first node
        if (parent != null) {
          // if this is the last node where the leaf should be created
          if (this.child == null && params.showEndings && this.special > 1 && (params.showEndingsEllipse || params.showEndingsRectangle)) {
            // half ellipses half squares
            if ((this.look < 3 && params.showEndingsEllipse) || !params.showEndingsRectangle) {
              for (let i = 1; i <= this.special; i++) {
                let percent = 1
                let transitionPercent = 1
                if (!this.transitioned) {
                  this.growingCount++
                  if (this.growingCount % (params.growingTime * 10) == 0) {
                    this.transitioned = true
                  }
                  transitionPercent = (this.growingCount - params.growingTime) / (params.growingTime * 9)
                }

                if (this.animate && params.animate) {
                  percent = map(sin(((this.fc * 0.25 * params.animate + i * .1) % 1) * TWO_PI), -1, 1, 0, 1) * transitionPercent
                } else {
                  percent = map(sin(((this.fc * 0.25 / 4 * params.animate + i * .1) % 1) * TWO_PI), -1, 1, 0, 1) * transitionPercent
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
      }

      this.fc += this.speed
    }
  };

  this.showPoints = function (p) {
    if (p) {
      for (let i = 0; i < params.divideCount; i++) {
        const lerpPos = p5.Vector.lerp(this.pos, this.parent.pos, (i / params.divideCount / 1.0 + this.fc * params.animate) % 1.0)
        p.ellipse(lerpPos.x, lerpPos.y, 1, 1);
      }
    } else {
      for (let i = 0; i < params.divideCount; i++) {
        const lerpPos = p5.Vector.lerp(this.pos, this.parent.pos, (i / params.divideCount / 1.0 + this.fc * params.animate) % 1.0)
        ellipse(lerpPos.x, lerpPos.y, 1, 1);
      }
    }
  }

  this.showCross = function (p) {
    if (p) {
      p.translate(this.pos.x, this.pos.y)
      if (this.animate) p.rotate(PI / 2 + this.fc * params.animate)
      else p.rotate(PI / 4 + this.fc * params.animate)
      p.line(-params.scl / params.lineLen, 0, params.scl / params.lineLen, 0);
      p.line(0, -params.scl / params.lineLen, 0, params.scl / params.lineLen);

      // get back to the right position
      if (this.animate) p.rotate(-PI / 2 - this.fc * params.animate)
      else p.rotate(-PI / 4 - this.fc * params.animate)
      p.translate(-this.pos.x, -this.pos.y)
    } else {
      push()
      translate(this.pos.x, this.pos.y)
      if (this.animate) rotate(PI / 2 + this.fc * params.animate)
      else rotate(PI / 4 + this.fc * params.animate)
      line(-params.scl / params.lineLen, 0, params.scl / params.lineLen, 0);
      line(0, -params.scl / params.lineLen, 0, params.scl / params.lineLen);
      pop()
    }
  }

  this.showLineSegments = function (p) {
    for (let i = 0; i < params.divideCount; i++) {
      const segment = this.segments[i]
      if (p) {
        if (!isNaN(segment.angle)) {
          p.translate(segment.x, segment.y)
          p.rotate(segment.angle + PI / 2)

          p.line(-params.scl / params.lineLen, 0, params.scl / params.lineLen, 0);

          p.rotate((segment.angle + PI / 2) * -1)
          p.translate(-segment.x, -segment.y)
        }
      } else {
        push()
        translate(segment.x, segment.y)
        rotate(segment.angle + PI / 2)
        line(-params.scl / params.lineLen, 0, params.scl / params.lineLen, 0);
        pop()
      }
    }
  }

  this.showSaw = function (p) {
    const v1 = p5.Vector.sub(this.pos.copy(), this.parent.pos.copy())
    v1.rotate(HALF_PI)
    v1.setMag(params.scl / 3)
    const v2 = this.pos.copy().add(v1)
    const v3 = this.parent.pos.copy().add(v1)

    if (p) {
      p.line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
      p.line(v2.x, v2.y, v3.x, v3.y);
    } else {
      line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
      line(v2.x, v2.y, v3.x, v3.y);
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