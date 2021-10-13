///////////////////////
class VectorField {
    constructor() {
        // Constructor
        this.v = new Array(cols * rows);
        for (let i = 0; i < cols * rows; i++) {
            this.v[i] = createVector(0, 0);
            // this.v[i] = p5.Vector.random2D().mult(.5);
        }
    }

    show() {
        // draw each arrow from center of each field "unit"

        for (let y = 0; y < cols; y++) {
            for (let x = 0; x < rows; x++) {
                push();
                translate(x * scl + scl / 2, y * scl + scl / 2);
                const idx = x + y * cols
                const pos = this.v[idx].copy()
                const tmp = pos.mult(scl);

                tmp.limit(scl * 1);
                arrow(tmp.x, tmp.y);
                pop();
            }
        }

        // let yoff = 0;
        // for (let y = _offset; y < rows - _offset; y++) {
        //     let xoff = 0;
        //     for (let x = _offset; x < cols - _offset; x++) {
        //         let index = x + y * cols;
        //         let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
        //         // let angle = -PI / 2;
        //         let v = p5.Vector.fromAngle(angle);
        //         v.setMag(1);
        //         this.v[index] = v;
        //         xoff += inc;

        //         // debug
        //         if (_debug) {
        //             stroke(_clrs[1]);
        //             push();
        //             translate(x * scl + scl / 2, y * scl + scl / 2);
        //             rotate(v.heading());
        //             strokeWeight(1);
        //             line(0, 0, scl / 2, 0);
        //             pop();
        //         }
        //     }
        //     yoff += inc;

        //     // update field
        //     // zoff += 0.0002;
        // }
    }

    polarize(posPos, posNeg) {
        // console.log(posPos)
        // update all vectors based on proximity to poles
        for (let y = _offset; y < cols - _offset; y++)
            for (let x = _offset; x < rows - _offset; x++) {
                let fPos = createVector(x * scl + scl / 2, y * scl + scl / 2);
                let dist1 = p5.Vector.sub(fPos, posPos);
                let dist2 = p5.Vector.sub(posNeg, fPos);
                let div1 = dist1.mag() / 10;
                let div2 = dist2.mag() / 10;
                dist1.normalize();
                dist2.normalize();
                dist1.div(div1);
                dist2.div(div2);
                this.v[y * cols + x] = p5.Vector.add(dist1, dist2);
                this.v[y * cols + x].mult(50);
                this.v[y * cols + x].limit(_maxForce);
            }
    }

    add(f) {
        // add another vector field to this one
        for (let i = 0; i < cols * rows; i++) {
            this.v[i].add(f.v[i]);
        }
    }

    degauss() {
        // sets all vectors to zero
        for (let i = 0; i < cols * rows; i++) {
            this.v[i].x = 0;
            this.v[i].y = 0;
        }
    }

}

function arrow(x, y) {
    // draws a simple arrow (assumes a translated origin)
    const len = sqrt(sq(x) + sq(y)) * .3;
    line(0, 0, x, y);
    push();
    translate(x, y);
    rotate(atan2(y, x));
    line(0, 0, -len, len * 0.35);
    line(0, 0, -len, len * -0.35);
    pop();
}