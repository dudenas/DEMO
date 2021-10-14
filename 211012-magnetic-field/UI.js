let params = {
    magnetStr: 0.5,
    noiseStr: .5,
    noiseField: false,
    debug: true,
    mode: 1,
    magnetLen: 0,
    totalParticles: 5000,
    fps: 0,
    maxspeed: 4,
}

let _dataMagnets
let _currPreset
let gui

function preload() {
    _dataMagnets = loadJSON("JSON/magnets.json")
}

let test_val

function createGUI() {
    gui = new dat.GUI()

    // debug
    gui.add(params, 'debug').name('debug')
    gui.add(params, "fps").listen()
    // mode
    const mode = gui.add(params, 'mode', {
        "motion mode": 1,
        "draw mode": 2
    })
    // reset background
    mode.onChange(() => {
        background(_clrs[0])
    })
    // total particles
    gui.add(params, 'totalParticles', 100, 10000, 100).name('total particles')
    gui.add(params, 'maxspeed', 1, 5, 0.1).name('particle speed')

    // noise gui
    const folderNoise = gui.addFolder('Noise Field')
    folderNoise.open()
    folderNoise.add(params, 'noiseField').name('noise field')
    folderNoise.add(params, 'noiseStr', 0, 1, 0.01).name('noise strength')

    // magnet gui
    const folderMagnet = gui.addFolder('Magnet Field')
    folderMagnet.open()
    folderMagnet.add(params, 'magnetLen').name("total magnets").listen()
    folderMagnet.add(params, 'magnetStr', 0, 1, 0.01).name("magnet strength")
    params.resetMagnets =
        function () {
            currMagnet = 0
            magnets = []
        };
    folderMagnet.add(params, 'resetMagnets')
        .name('Reset Magnets');


    // magnetModes
    const folderMagnetSetUp = gui.addFolder('Magnet set-ups')
    folderMagnetSetUp.open()
    for (let i = 0; i < Object.keys(_dataMagnets).length; i++) {
        var obj = {
            fnct: function () {
                initMagnets(i)
            },
        };
        folderMagnetSetUp.add(obj, "fnct").name(`variation-${i}`);
        // var btn = document.createElement("BUTTON");
        // btn.innerHTML = `magnets variation ${i}`
        // btn.onclick = () => {
        //     initMagnets(i)
        // }
        // document.body.append(btn)
    }


}

function initMagnets(idx) {
    currMagnet = 0
    magnets = []
    for (let i = 0; i < Object.keys(_dataMagnets[idx]).length; i++) {
        const d = _dataMagnets[idx][i]
        const m = new Magnet(createVector(...d.pos), createVector(...d.dir), 2)
        m.initOldMagnet()
        currMagnet++
        magnets.push(m)
    }
    currMagnet--
}

function keyPressed() {
    // if (key == 's') {
    //     const jsonData = gui.getSaveObject()
    //     download(JSON.stringify(jsonData), 'test.json', 'JSON');
    // }
    if (key == 'm') {
        const jsonData = {}
        for (let i = 0; i < magnets.length - 1; i++) {
            const m = magnets[i]
            const pos = [m.pos.x, m.pos.y]
            const dir = [m.dir.x, m.dir.y]
            jsonData[i] = {
                pos,
                dir
            }
        }
        download(JSON.stringify(jsonData), `magnets${floor(random(1000))}.json`, 'JSON');
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