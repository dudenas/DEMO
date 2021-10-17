const poleSize = 30;
let magnets = []
let currMagnet = 0

////////////////////////
class Magnet {
    constructor(pos, dir, moveMode) {
        this.pos = pos ? pos : createVector(0, 0); // position of magnet
        this.posNeg = createVector(0, 0); // position of negative pole
        this.posPos = createVector(0, 0); // potition of positive pole
        this.dir = dir ? dir : createVector(1, 0); // direction facing
        this.vf = new VectorField();
        this.moveMode = moveMode ? moveMode : 0
    }

    update() {
        // set magnet to mouse location
        if (this.moveMode == 0) {
            this.pos.x = mouseX;
            this.pos.y = mouseY;
        }

        // rotate magnet by mouse location (and set poles)
        if (this.moveMode == 1) {
            this.dir.x = mouseX - this.pos.x;
            this.dir.y = mouseY - this.pos.y;
            this.dir.normalize();
            this.posNeg.x = this.posPos.x = this.dir.x;
            this.posNeg.y = this.posPos.y = this.dir.y;
            this.posNeg.mult(-poleSize * 2);
            this.posPos.mult(poleSize * 2);
            this.posNeg.add(this.pos);
            this.posPos.add(this.pos);
            this.vf.polarize(this.posPos, this.posNeg);
        }

        if (this.moveMode == 2) {
            this.vf.polarize(this.posPos, this.posNeg);
        }
    }

    initOldMagnet() {
        this.dir.normalize();
        this.posNeg.x = this.posPos.x = this.dir.x;
        this.posNeg.y = this.posPos.y = this.dir.y;
        this.posNeg.mult(-poleSize * 2);
        this.posPos.mult(poleSize * 2);
        this.posNeg.add(this.pos);
        this.posPos.add(this.pos);
        this.vf.polarize(this.posPos, this.posNeg);
    }

    show() {
        // draw magnet
        stroke(_clrs[1]);
        // strokeWeight(1);
        noFill()
        push();
        translate(this.pos.x, this.pos.y);
        rotate(atan2(this.dir.y, this.dir.x));
        rect(-poleSize * 2, -poleSize, poleSize * 4, poleSize * 2);
        pop();

        // draw poles
        if (this.moveMode > 0) {
            fill(_clrs[0])
            ellipse(this.posPos.x, this.posPos.y, poleSize, poleSize);
            ellipse(this.posNeg.x, this.posNeg.y, poleSize, poleSize);
            line(this.posPos.x - 3, this.posPos.y, this.posPos.x + 3, this.posPos.y);
            line(this.posPos.x, this.posPos.y - 3, this.posPos.x, this.posPos.y + 3);
            line(this.posNeg.x - 3, this.posNeg.y, this.posNeg.x + 3, this.posNeg.y);
        }
    }
}

function mousePressed() {
    // update the current magnet (or get a new one)
    if (magnets.length > 0 && withinCanvas()) {
        const m = magnets[currMagnet];
        m.moveMode++;
        if (m.moveMode > 1) {
            magnets.push(new Magnet());
            currMagnet++;
        }
    } else if (withinCanvas()) {
        magnets.push(new Magnet());
    }
}

function withinCanvas() {
    return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height
}