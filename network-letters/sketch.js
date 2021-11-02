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
  hexToRgb("#001C34"),
  hexToRgb("#E9F0F2"),
  hexToRgb("#F62F63"),
  hexToRgb("#00A8B6"),
]

let _font

//————————————————————————————————————————————— preload
function preload() {
  _font = loadFont("data/Silka-Bold.otf")
}

//————————————————————————————————————————————— setup
function setup() {
  createCanvas(1080, 1080, P2D);
  // init quadtree
  _quadtree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));

  createGUI()

  setupGraphics()

  rectMode(CENTER)

  // frameRate(30)
  // saveSetup()
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
  fill(..._clrs[1], 125);
  for (var i = 0; i < _leaves.length; i++) {
    const leaf = _leaves[i]
    if (!leaf.reached) leaf.show();
  }

  // show graphics
  noFill()
  // let total = 0
  for (let idx in _trees) {
    const tree = _trees[idx]
    stroke(..._clrs[tree.color])
    tree.show();
    if (!tree.finished) {
      tree.grow();
    } else if (!tree.branchSet) {
      tree.findBranch()
    }
  }

  saveDraw()
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

  // create text
  const pg = createGraphics(width, height);
  pg.textFont(_font)
  pg.background(0)
  pg.textSize(width)
  pg.textAlign(CENTER, CENTER)
  pg.fill(255)
  pg.text("IP", width / 2, height / 2.75)
  image(pg, 0, 0)

  pg.loadPixels()
  // create leaves
  const step = params.scl
  let idx = 0
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      const pixelIdx = (x + y * width) * 4 // rgba that is why you 
      const bri = pg.pixels[pixelIdx]
      if (bri == 255) {
        const xoff = random(1) > 0.5 ? random(-params.randOffsetX, params.randOffsetX) : 0
        const yoff = xoff == 0 && random(1) > 0.5 ? random(-params.randOffsetY, params.randOffsetY) : 0
        const nx = x + xoff
        const ny = y + yoff
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

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}