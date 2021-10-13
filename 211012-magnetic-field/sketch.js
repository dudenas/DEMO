const _clrs = [
	[8, 8, 8],
	[247, 247, 247]
]


let inc = 0.05;
let scl = 40;
let cols, rows;

let _offset = 4

let zoff = 0;

let fr;

let particles = [];

let flowfield;

let _maxForce = 0.5
let _mode = 1

let _flowField
let _debug = true
let _noiseField = false
let _noiseStr = 1

let _totalParticles = 5000

//————————————————————————————————————————————— draw
function setup() {
	createCanvas(1080, 1080);
	cols = floor(width / scl);
	rows = floor(height / scl);
	fr = createP('');

	// flowfield = new Array(cols * rows);
	_flowField = new VectorField()

	for (let i = 0; i < _totalParticles; i++) {
		particles[i] = new Particle(i);
	}

	background(_clrs[0])
}

function draw() {
	_maxForce = map(mouseX, 0, width, 0, 1)
	_noiseStr = map(mouseY, 0, height, 0, 1)
	if (_mode != 2) background(_clrs[0])

	stroke(..._clrs[1], 255);
	strokeWeight(1)
	if (_debug && _mode != 2) _flowField.show()

	// show magnets
	magnets.forEach(elm => {
		elm.update()
		if (_debug && _mode != 2) elm.show()
	})

	// summarize and show master field
	_flowField.degauss();
	for (let i = 0; i < magnets.length; i++) {
		const m = magnets[i];
		_flowField.add(m.vf);
	}

	if (_noiseField) {
		let yoff = 0;
		for (let y = _offset; y < rows - _offset; y++) {
			let xoff = 0;
			for (let x = _offset; x < cols - _offset; x++) {
				let index = x + y * cols;
				let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
				// let angle = -PI / 2;
				let v = p5.Vector.fromAngle(angle);
				v.setMag(_noiseStr);
				// flowfield[index] = v;
				_flowField.v[index].add(v)
				xoff += inc;
			}
			yoff += inc;

			// update field
			zoff += 0.0002;
		}
	}

	if (_mode == 2) {
		stroke(..._clrs[1], 25);
	} else {
		stroke(..._clrs[1], 255);
	}
	strokeWeight(1);

	// const fl = _flowField.v.slice(0)
	// console.log(_flowField.v[rows / 2 + cols / 2 * cols])
	for (let i = 0; i < particles.length; i++) {
		// particles[i].separation(particles);
		const p = particles[i]
		p.follow(_flowField.v);
		p.update();
		p.edges();
		p.show();
		for (let n = 0; n < magnets.length; n++) {
			const m = magnets[n]
			p.closeToMagnet(m)
		}
	}

	fr.html(floor(frameRate()));
}

function keyPressed() {
	if (key == '1') _mode = 1;
	if (key == '2') {
		background(_clrs[0])
		_mode = 2;
	}
	if (key == 'n') {
		_noiseField = !_noiseField
	}
	if (key == 'd') _debug = !_debug;
	if (key == ' ') {
		currMagnet = 0
		magnets = []
	}
}