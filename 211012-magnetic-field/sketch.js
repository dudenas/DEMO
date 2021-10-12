const _clrs = [
	[8, 8, 8],
	[247, 247, 247]
]

// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/BjoM9oKOAKY

let inc = 0.1;
let scl = 40;
let cols, rows;

let _offset = 6

let zoff = 0;

let fr;

let particles = [];

let flowfield;
let _debug = false
let _totalParticles = 4000

//————————————————————————————————————————————— draw
function setup() {
	createCanvas(1080, 1080);
	cols = floor(width / scl);
	rows = floor(height / scl);
	fr = createP('');

	flowfield = new Array(cols * rows);

	for (let i = 0; i < _totalParticles; i++) {
		particles[i] = new Particle(i);
	}
	background(51);
}

function draw() {
	background(_clrs[0])
	let yoff = 0;
	for (let y = _offset; y < rows - _offset; y++) {
		let xoff = 0;
		for (let x = _offset; x < cols - _offset; x++) {
			let index = x + y * cols;
			let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
			// let angle = -PI / 2;
			let v = p5.Vector.fromAngle(angle);
			v.setMag(1);
			flowfield[index] = v;
			xoff += inc;

			// debug
			if (_debug) {
				stroke(_clrs[1]);
				push();
				translate(x * scl, y * scl);
				rotate(v.heading());
				strokeWeight(1);
				line(0, 0, scl / 2, 0);
				pop();
			}
		}
		yoff += inc;

		zoff += 0.0002;
	}

	stroke(_clrs[1]);
	strokeWeight(1);
	for (let i = 0; i < particles.length; i++) {
		// particles[i].separation(particles);
		particles[i].follow(flowfield);
		particles[i].update();
		particles[i].edges();
		particles[i].show();
	}

	fr.html(floor(frameRate()));
}