const date = new Date()
const minutes = date.getMinutes()
if (minutes % 2 == 0) {
    _clrs[1] = hexToRgb('#33FFAD')
    _clrs[2] = hexToRgb('#80FFCC')
    _clrs[3] = hexToRgb('#2DBA82')
} else {
    _clrs[1] = hexToRgb('#ECC30B')
    _clrs[2] = hexToRgb('#F37748')
    _clrs[3] = hexToRgb('#D56062')
}