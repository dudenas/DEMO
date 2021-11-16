let _trees
let _leaves;
let max_dist
let _finished
let _leafCount

let _quadtree

let _clrs = [
  hexToRgb("#001C34"),
  hexToRgb("#E9F0F2"),
  hexToRgb("#F62F63"),
  hexToRgb("#00A8B6"),
]

let _font

let _w, _h

let canvas

let _removeTrees = false
let _redraw = true
let _img

//————————————————————————————————————————————— preload
function preload() {
  _font = loadFont("data/Silka-Bold.otf")
  _img = loadImage('test.jpg')
}

//————————————————————————————————————————————— setup
function setup() {
  canvas = createCanvas(1080, 1080, P2D);
  _w = width
  _h = height
  // canvas.parent('main')
  canvas.id('myCanvas')
  pixelDensity(1)
  // init quadtree
  _quadtree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));

  createGUI()

  setupGraphics()

  rectMode(CENTER)

  // frameRate(30)
  // saveSetup()

  saveSketch = new p5(svgSketch)

  canvas.drop(gotFile);
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

  // let temp = createGraphics(width, height)
  if (params.colorMode != 3) background(..._clrs[0]);
  else {
    // background(0);
  }

  // image(photo, 0, 0)
  // clear()

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
    if (params.colorMode != 3) stroke(..._clrs[tree.color])
    else stroke(255)
    tree.show();
    if (!tree.finished) {
      tree.grow();
    } else if (!tree.branchSet && !_removeTrees) {
      tree.findBranch()
    }
  }

  if (_removeTrees) {
    let count = 0
    for (let idx in _trees) {
      const tree = _trees[idx]
      if (!tree.empty) {
        tree.removePath()
        tree.finished = true
      } else {
        count++
      }
    }
    if (count == _trees.length) {
      _redraw = true
      setupGraphics()
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
  if (_redraw) {
    _redraw = false
    _removeTrees = false
    max_dist = Math.sqrt(Math.pow(params.scl, 2) * 2) * params.maxDistVal
    // reset values
    _finished = false
    _leafCount = 0
    _trees = []
    _leaves = []

    let canvasI, canvasP
    if (params.mode == 'letter') {
      // create text
      const textDist = height / 5.4
      const offsetX = height / 10
      const pg = createGraphics(width, height);
      pg.textFont(_font)
      pg.background(0)
      pg.pixelDensity(1)
      pg.textSize(height)
      pg.textAlign(CENTER, CENTER)
      pg.textLeading(-100)
      pg.fill(255)
      pg.text("I", width / 2 - textDist - offsetX, height / 2.75)
      pg.text("P", width / 2 + textDist - offsetX, height / 2.75)
      // image(pg, 0, 0)
      pg.loadPixels()
      // create leaves
      const step = params.scl
      let idx = 0
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          const pixelIdx = (x + y * width) * 4 // rgba that is why you 
          const bri = pg.pixels[pixelIdx]
          if (bri == 255 && random(1) < params.randomDelete) {
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
    } else if (params.mode == 'image') {
      _img.resize(width, height)
      _img.loadPixels()
      const step = params.scl
      let idx = 0
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          const pixelIdx = (x + y * width) * 4 // rgba that is why you 
          const bri = _img.pixels[pixelIdx]
          if (bri == 255 && random(1) < params.randomDelete) {
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
    } else {
      // create leaves
      const step = params.scl
      let idx = 0
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < width; y += step) {
          const xoff = random(1) > 0.5 ? random(-params.randOffsetX, params.randOffsetX) : 0
          const yoff = xoff == 0 && random(1) > 0.5 ? random(-params.randOffsetY, params.randOffsetY) : 0
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
  } else {
    _removeTrees = true
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

function gotFile(file) {
  if (file.type === 'image') {
    _img = loadImage(file.data);
  }
}