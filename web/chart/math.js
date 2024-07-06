const math = {}

math.Lerp = (a, b, t) => {
    return a + (b - a) * t
}

math.invLerp = (a, b, v) => {
    return (v - a) / (b - a)
}

math.formatNumber = (n, dec=0) => {
    return n.toFixed(dec)
}

if (typeof module !== 'undefined') {
    module.exports = math
}