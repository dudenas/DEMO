let params = {
    treeCount: 10,
    noiseThreshold: 0.5,
    noiseVariation: 0.01,

    scl: 15,
    randOffsetX: 0,
    randOffsetY: 0,
    maxDistVal: 1.5,
    fps: 0,

    overlap: .0,
    divideCount: 2
}

let gui
let _data
let _lastPreset

function preload() {
    _data = loadJSON('JSON/settings.json')
}

function createGUI() {
    // gui = new dat.GUI()
    gui = new dat.GUI({
        load: _data,
        preset: "Default"
    });

    _lastPreset = gui.preset

    gui.remember(params)

    // debug
    // gui.add(params, 'debug').name('debug')
    gui.add(params, "fps").listen()
    gui.add(params, 'treeCount', 1, 20, 1).name('tree Count')

    // grid gui
    const folderGrid = gui.addFolder('Grid values')
    folderGrid.open()
    folderGrid.add(params, 'scl', 10, 50, 5).name('scale').onChange(() => {
        // update slider max values
        resetSliders("randOffsetX")
        resetSliders("randOffsetY")
    })

    folderGrid.add(params, 'randOffsetX', 0, params.scl, 1).name('random offset X')
    folderGrid.add(params, 'randOffsetY', 0, params.scl, 1).name('random offset Y')
    folderGrid.add(params, 'maxDistVal', 1, 3, .1).name('max distance')

    // noise gui
    const folderNoise = gui.addFolder('Noise values')
    folderNoise.open()
    folderNoise.add(params, 'noiseThreshold', 0.3, .7, 0.01).name('noise threshold')
    folderNoise.add(params, 'noiseVariation', 0.005, .1, 0.001).name('noise variation')

    // redraw
    params.redraw =
        function () {
            setupGraphics()
        };
    gui.add(params, 'redraw')
        .name('redraw');
}

function updateGUI() {
    params.fps = frameRate().toFixed(0)
}

/* Here is the update */
var resetSliders = function (name) {
    const controlers = gui.__folders["Grid values"].__controllers
    for (var i = 0; i < controlers.length; i++) {
        if (controlers[i].property == name) {
            controlers[i].__max = params.scl
        }
    }
};

function keyPressed() {
    if (key == 's') {
        const jsonData = gui.getSaveObject()
        download(JSON.stringify(jsonData), 'settings.json', 'JSON');
    }
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {
        type: contentType
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}