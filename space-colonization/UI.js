let params = {
    treeCount: 5,
    noiseThreshold: 0.5,
    noiseVariation: 0.01,

    scl: 20,
    randOffsetX: 0,
    randOffsetY: 0,
    maxDistVal: 1.5,
    fps: 0
}

let gui

function createGUI() {
    // gui = new dat.GUI()
    gui = new dat.GUI({
        load: {
            "preset": "Default",
            "closed": false,
            "remembered": {
                "Default": {
                    "0": {
                        "x": 8
                    }
                }
            },
            "folders": {}
        }
    });

    gui.remember(params)

    // debug
    // gui.add(params, 'debug').name('debug')
    gui.add(params, "fps").listen()
    gui.add(params, 'treeCount', 1, 10, 1).name('tree Count')

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
    folderNoise.add(params, 'noiseVariation', 0, .1, 0.01).name('noise variation')

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
    // console.log(frameRate())
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