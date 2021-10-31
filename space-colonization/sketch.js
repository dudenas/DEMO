// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

let _trees
let _leaves;
let max_dist
let _finished
let _leafCount

let _quadtree

const _clrs = [
  [8, 8, 8],
  [247, 247, 247]
]

//————————————————————————————————————————————— setup
function setup() {
  createCanvas(1080, 1080);
  // init quadtree
  _quadtree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));

  createGUI()

  setupGraphics()

  rectMode(CENTER)

}

//————————————————————————————————————————————— draw
function draw() {
  // update gui
  updateGUI()

  // redraw graphics if preset is changed
  if (_lastPreset != gui.preset) {
    setupGraphics()
  }
  _lastPreset = gui.preset

  background(..._clrs[0]);
  // show leaves
  noStroke();
  fill(..._clrs[1]);
  for (var i = 0; i < _leaves.length; i++) {
    const leaf = _leaves[i]
    if (!leaf.reached) leaf.show();
  }

  // show graphics
  stroke(..._clrs[1])
  noFill()
  // let total = 0
  for (let idx in _trees) {
    const tree = _trees[idx]
    tree.show();
    if (!tree.finished) {
      tree.grow();
    }
    // total += tree.branches.length
  }

  // console.log(total)
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
  noiseSeed(random(1000))

  // recalculate values
  max_dist = Math.sqrt(Math.pow(params.scl, 2) * 2) * params.maxDistVal

  // reset values
  _finished = false
  _leafCount = 0
  _trees = []
  _leaves = []

  // create leaves
  const step = params.scl
  let idx = 0
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < width; y += step) {
      const xoff = random(1) > 0.5 ? random(-params.randOffsetX, params.randOffsetX) : 0
      const yoff = xoff == 0 && random(1) > 0.5 ? random(-params.randOffsetY, params.randOffsetY) : 0;

      const nx = x + xoff
      const ny = y + yoff
      const noiseVal = noise(nx * params.noiseVariation, ny * params.noiseVariation)
      if (noiseVal > params.noiseThreshold) {
        const pos = createVector(nx, ny)
        _leaves.push(new Leaf(pos, idx));
        idx++
      }
    }
  }

  // create trees
  for (let i = 0; i < params.treeCount; i++) {
    const randomLeaf = random(_leaves)
    const pos = randomLeaf.pos
    const tree = new Tree(pos);
    _trees.push(tree)
  }

  // quadtree clear
  _quadtree.clear();
  for (const leaf of _leaves) {
    _quadtree.addItem(leaf.pos.x, leaf.pos.y, leaf);
  }
}