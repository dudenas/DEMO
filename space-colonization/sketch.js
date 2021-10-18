// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

let _trees
let _leaves;
let max_dist
let _finnished
let _leafCount

const _clrs = [
  [8, 8, 8],
  [247, 247, 247]
]

//————————————————————————————————————————————— setup
function setup() {
  createCanvas(1080, 1080);

  createGUI()

  setupGraphics()

  rectMode(CENTER)
}

//————————————————————————————————————————————— draw
function draw() {
  // update gui
  updateGUI()

  background(..._clrs[0]);
  // show leaves
  noStroke();
  fill(..._clrs[1]);
  for (var i = 0; i < _leaves.length; i++) {
    _leaves[i].show();
  }

  // show graphics
  stroke(..._clrs[1])
  noFill()
  for (let idx in _trees) {
    const tree = _trees[idx]
    tree.show();
    if (!_finnished) tree.grow();
  }

  // check if to stop calculating
  if (_leafCount == _leaves.length && !_finnished) {
    _finnished = true
    console.log('calculations is finnished')
  }
  _leafCount = _leaves.length
}

//————————————————————————————————————————————— ENDDRAW
//————————————————————————————————————————————— ENDDRAW
//————————————————————————————————————————————— ENDDRAW
//————————————————————————————————————————————— ENDDRAW
//————————————————————————————————————————————— ENDDRAW
//————————————————————————————————————————————— ENDDRAW
//————————————————————————————————————————————— ENDDRAW

//————————————————————————————————————————————— setupgraphics
function setupGraphics() {
  // recalculate values
  max_dist = Math.sqrt(Math.pow(params.scl, 2) * 2) * params.maxDistVal

  // reset values
  _finnished = false
  _leafCount = 0
  _trees = []
  _leaves = []

  // create trees
  for (let i = 0; i < params.treeCount; i++) {
    const x = random(width)
    const y = random(height)
    const pos = createVector(x, y)
    const tree = new Tree(pos);
    _trees.push(tree)
  }

  // create leaves
  const step = params.scl
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < width; y += step) {
      const xoff = random(1) > 0.5 ? random(-params.randOffsetX, params.randOffsetX) : 0
      const yoff = xoff == 0 && random(1) > 0.5 ? random(-params.randOffsetY, params.randOffsetY) : 0;
      // const xoff = random(1) > 0.5 ? random(-rand_dist, rand_dist) : 0
      // const yoff = 0

      const nx = x + xoff
      const ny = y + yoff
      const noiseVal = noise(nx * params.noiseVariation, ny * params.noiseVariation)
      if (noiseVal > params.noiseThreshold) {
        const pos = createVector(nx, ny)
        _leaves.push(new Leaf(pos));
      }
    }
  }
}