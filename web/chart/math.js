const math = {}

math.lerp = (a, b, t) => {
    return a + (b - a) * t
}

if (typeof module !== 'undefined') {
    module.exports = math
}