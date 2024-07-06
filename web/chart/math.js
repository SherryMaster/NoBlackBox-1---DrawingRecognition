const math = {}

math.lerp = (a, b, t) => {
    return a + (b - a) * t
}

math.formatNumber = (n, dec=0) => {
    return n.toFixed(dec)
}

if (typeof module !== 'undefined') {
    module.exports = math
}