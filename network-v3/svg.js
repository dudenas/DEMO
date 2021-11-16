let _saveSVG = false

let svgSketch = function (p) {
    //————————————————————————————————————————————— setup
    p.setup = function () {
        const canvas = p.createCanvas(_w, _h, p.SVG)
        // attach to the id
        const parent = document.getElementById('myCanvas')
        const child = canvas.canvas.wrapper
        parent.appendChild(child);
        child.style.display = 'none'


        p.pixelDensity(1)
        p.noLoop()
    }

    p.draw = function () {
        p.clear()
        // let temp = createGraphics(width, height)
        p.background(..._clrs[0]);

        // show leaves
        p.noStroke();
        p.fill(..._clrs[1], 125);
        for (var i = 0; i < _leaves.length; i++) {
            const leaf = _leaves[i]
            if (!leaf.reached) leaf.show(p);
        }

        // show graphics
        p.noFill()
        for (let idx in _trees) {
            const tree = _trees[idx]
            p.stroke(..._clrs[tree.color])
            tree.show(p);
        }


        if (_saveSVG) {
            const name = Math.floor(p.random(1000))
            p.save(`${name}.svg`)
            _saveSVG = false
        }
    }
}

let saveSketch