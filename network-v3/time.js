let date = new Date()
let minutes = date.getMinutes()
if (minutes % 2 == 0) {
    _clrs[1] = hexToRgb('#00A8B5')
    _clrs[2] = hexToRgb('#FFFFFF')
    _clrs[3] = hexToRgb('#1A3EEA')
} else {
    _clrs[1] = hexToRgb('#F52F62')
    _clrs[2] = hexToRgb('#FFFFFF')
    _clrs[3] = hexToRgb('#5F1040')
}

setInterval(() => {
    setupGraphics()
}, 1000 * 15)

setInterval(() => {
    date = new Date()
    minutes = date.getMinutes()
    if (minutes % 2 == 0) {
        _clrs[1] = hexToRgb('#00A8B5')
        _clrs[2] = hexToRgb('#FFFFFF')
        _clrs[3] = hexToRgb('#1A3EEA')
    } else {
        _clrs[1] = hexToRgb('#F52F62')
        _clrs[2] = hexToRgb('#FFFFFF')
        _clrs[3] = hexToRgb('#5F1040')
    }
}, 1000)