const _clrs = [
	[8, 8, 8],
	[247, 247, 247]
]


let inc = 0.05;
let scl = 40;
let cols, rows;

let _offset = 4
let fr;

let zoff = 0;


let _particles = [];

let _flowField

//————————————————————————————————————————————— draw
function setup() {
	createCanvas(1080, 1080);
	cols = floor(width / scl);
	rows = floor(height / scl);
	fr = createP('');

	// flowfield = new Array(cols * rows);
	_flowField = new VectorField()

	for (let i = 0; i < params.totalParticles; i++) {
		_particles[i] = new Particle(i);
	}

	background(_clrs[0])

	createGUI()
}

function draw() {
	// update particles size
	if (_particles.length != params.totalParticles) {
		if (_particles.length < params.totalParticles) {
			for (let i = 0; i < params.totalParticles - _particles.length; i++) {
				_particles.push(new Particle(i));
			}
		} else {
			for (let i = 0; i < _particles.length - params.totalParticles; i++) {
				_particles.pop();
			}
		}
	}

	if (params.mode != 2) background(_clrs[0])

	stroke(..._clrs[1], 255);
	strokeWeight(1)
	if (params.debug && params.mode != 2) _flowField.show()

	// show magnets
	magnets.forEach(elm => {
		elm.update()
		if (params.debug && params.mode != 2) elm.show()
	})

	// summarize and show master field
	_flowField.degauss();
	for (let i = 0; i < magnets.length; i++) {
		const m = magnets[i];
		_flowField.add(m.vf);
	}

	if (params.noiseField) {
		let yoff = 0;
		for (let y = _offset; y < rows - _offset; y++) {
			let xoff = 0;
			for (let x = _offset; x < cols - _offset; x++) {
				let index = x + y * cols;
				let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
				let v = p5.Vector.fromAngle(angle);
				v.setMag(params.noiseStr);
				_flowField.v[index].add(v)
				xoff += inc;
			}
			yoff += inc;

			// update field
			zoff += 0.0002;
		}
	}

	if (params.mode == 2) {
		stroke(..._clrs[1], 25);
	} else {
		stroke(..._clrs[1], 255);
	}
	strokeWeight(1);

	// const fl = _flowField.v.slice(0)
	// console.log(_flowField.v[rows / 2 + cols / 2 * cols])
	for (let i = 0; i < _particles.length; i++) {
		// particles[i].separation(particles);
		const p = _particles[i]
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