// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

let tree;
const _scl = 10
const max_dist = Math.sqrt(Math.pow(_scl, 2) * 2) * 1.5
const min_dist = 10;
const rand_dist = 0
const _clrs = [
  [8, 8, 8],
  [247, 247, 247]
]

let fps

function setup() {
  createCanvas(540, 540);

  fps = createP('test')

  tree = new Tree();

  const step = 10
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < width; y += step) {
      // const xoff = random(1) > 0.5 ? random(-rand_dist, rand_dist) : 0
      // const yoff = xoff == 0 && random(1) > 0.5 ? random(-rand_dist, rand_dist) : 0;
      const xoff = random(1) > 0.5 ? random(-rand_dist, rand_dist) : 0
      const yoff = 0

      const nx = x + xoff
      const ny = y + yoff
      const noiseVal = noise(nx * 0.05, ny * 0.05)
      if (noiseVal > 0.5) {
        const pos = createVector(nx, ny)
        tree.leaves.push(new Leaf(pos));
      }
    }
  }
}

function draw() {
  background(..._clrs[0]);
  tree.show();
  tree.grow();

  fps.html(floor(frameRate()))
}