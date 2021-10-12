function Particle(idx) {
    this.pos = firstPlace()
    this.vel = createVector(0, 0);
    this.acc = p5.Vector.random2D();
    this.maxspeed = 4;
    this.maxforce = random(.5, 1);
    this.idx = idx;
    this.h = 1
    this.maxh = Math.floor(random(25, 50))

    this.prevPos = this.pos.copy();

    this.update = function () {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);

    };

    this.show = function () {
        if (this.h < this.maxh) {
            // this.prevPos.setMag(1 / this.h)
            this.prevPos = p5.Vector.lerp(this.prevPos, this.pos, this.h / this.maxh)
            line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        } else {
            this.pos = firstPlace()
            this.h = 1
        }
        this.updatePrev();
    };

    this.separation = function (boids) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = distsq(
                this.pos.x,
                this.pos.y,
                other.pos.x,
                other.pos.y
            );
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.pos, other.pos);

                diff.div(d * d);
                steering.add(diff);
                total++;
            }
        }
        // if (this.idx == 1) console.log(total)
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxspeed);
            steering.sub(this.vel);
            steering.limit(this.maxforce);
        }
        this.applyForce(steering);
    }

    this.follow = function (vectors) {
        var x = floor(this.pos.x / (scl));
        var y = floor(this.pos.y / (scl));
        var index = x + y * cols;
        var force = vectors[index];
        if (force != undefined) {
            // console.log(x, cols, y, rows)
            force.limit(this.maxforce)
        } else {
            this.h++
        }
        // force.mult(random(1, 1))
        this.applyForce(force);
    };

    this.applyForce = function (force) {
        this.acc.add(force);
    };


    this.updatePrev = function () {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    };

    this.edges = function () {
        if (this.pos.x > width) {
            // this.pos.x = 0;
            // this.updatePrev();
            this.h = this.maxh
        }
        if (this.pos.x < 0) {
            // this.pos.x = width;
            // this.updatePrev();
            this.h = this.maxh
        }
        if (this.pos.y > height) {
            // this.pos.y = 0;
            // this.updatePrev();
            this.h = this.maxh
        }
        if (this.pos.y < 0) {
            // this.pos.y = height;
            // this.updatePrev();
            this.h = this.maxh
        }
    };
}

function distsq(x1, y1, x2, y2) {
    return sq(x1 - x2) + sq(y1 - y2);
}

function firstPlace() {
    const x = random(scl * _offset, width - scl * _offset)
    const y = random(scl * _offset, height - scl * _offset)
    return createVector(x, y)
}