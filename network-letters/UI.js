let params = {
    treeCount: 10,

    letterMode: true,

    noiseThreshold: 0.5,
    noiseVariation: 0.01,

    scl: 20,
    maxDistVal: 1.5,
    fps: 0,

    lineLen: 4,
    randOffsetX: 0,
    randOffsetY: 0,
    randomDelete: .8,
    divideCount: 2,
    endings: .2,

    colorMode: 1,

    // do i need this
    showLine: true,

    highlight: true,
    showCross: true,
    showPoints: true,
    showSegments: true,
    showEndings: true,
    showDoubleLine: true,
    animate: true,
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
    gui.add(params, 'letterMode').name('letterMode')
    gui.add(params, 'treeCount', 1, 20, 1).name('tree Count')

    // grid gui
    const folderGrid = gui.addFolder('Grid values')
    folderGrid.open()
    folderGrid.add(params, 'scl', 15, 50, 5).name('scale').onChange(() => {
        // update slider max values
        resetSliders("randOffsetX")
        resetSliders("randOffsetY")
    })

    folderGrid.add(params, 'randomDelete', 0.1, 1, 0.1).name('random delete')
    folderGrid.add(params, 'randOffsetX', 0, params.scl, 1).name('random offset X')
    folderGrid.add(params, 'randOffsetY', 0, params.scl, 1).name('random offset Y')
    folderGrid.add(params, 'maxDistVal', 1, 3, .1).name('max distance')

    // grfc gui
    const folderGrfc = gui.addFolder('Graphics values')
    folderGrfc.open()
    folderGrfc.add(params, 'animate', 0, params.animate, 1).name('animate')
    folderGrfc.add(params, 'highlight', params.highlights).name('highlight')
    folderGrfc.add(params, 'colorMode', 0, 2, 1).name('color Mode')
    folderGrfc.add(params, 'lineLen', 2, 10, 1).name('line length')
    folderGrfc.add(params, 'endings', 0, 1, .01).name('ending chance')

    folderGrfc.add(params, 'showCross', 0, params.showCross, 1).name('show Cross')
    folderGrfc.add(params, 'showPoints', 0, params.showPoints, 1).name('show Points')
    folderGrfc.add(params, 'showSegments', 0, params.showSegments, 1).name('show Segments')
    folderGrfc.add(params, 'showEndings', 0, params.showEndings, 1).name('show Endings')
    folderGrfc.add(params, 'showDoubleLine', 0, params.showDoubleLine, 1).name('show Double Line')

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

/* Here is the update */
var resetSliders = function (name) {
    const controlers = gui.__folders["Grid values"].__controllers
    for (var i = 0; i < controlers.length; i++) {
        if (controlers[i].property == name) {
            controlers[i].__max = params.scl
        }
    }
};

function updateGUI() {
    params.fps = frameRate().toFixed(0)
}


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