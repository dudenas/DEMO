// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

const _trees = []
const _scl = 20
const max_dist = Math.sqrt(Math.pow(_scl, 2) * 2) * 1.5
const min_dist = 10;
const rand_dist = 0
const _leaves = [];

const _clrs = [
  [8, 8, 8],
  [247, 247, 247]
]

let fps

function setup() {
  createCanvas(1080, 1080);

  fps = createP('test')

  // create trees
  for (let i = 0; i < 5; i++) {
    const x = random(width)
    const y = random(height)
    const pos = createVector(x, y)
    const tree = new Tree(pos);
    _trees.push(tree)
  }

  // create leaves
  const step = _scl
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < width; y += step) {
      const xoff = random(1) > 0.5 ? random(-rand_dist, rand_dist) : 0
      const yoff = xoff == 0 && random(1) > 0.5 ? random(-rand_dist, rand_dist) : 0;
      // const xoff = random(1) > 0.5 ? random(-rand_dist, rand_dist) : 0
      // const yoff = 0

      const nx = x + xoff
      const ny = y + yoff
      const noiseVal = noise(nx * 0.05, ny * 0.05)
      if (noiseVal > 0.6) {
        const pos = createVector(nx, ny)
        _leaves.push(new Leaf(pos));
      }
    }
  }

  rectMode(CENTER)
}

function draw() {
  background(..._clrs[0]);
  noStroke();
  fill(..._clrs[1]);
  for (var i = 0; i < _leaves.length; i++) {
    _leaves[i].show();
  }

  stroke(..._clrs[1])
  noFill()
  for (let idx in _trees) {
    const tree = _trees[idx]
    tree.show();
    tree.grow();
  }

  fps.html(floor(frameRate()))
}