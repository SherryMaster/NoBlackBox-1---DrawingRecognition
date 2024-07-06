const features = {};

features.getPathCount=(path)=>{
    return path.length
}

features.getPointCount=(path)=>{
    const points = path.flat()
    return points.length
}


if (typeof module !== 'undefined') {
    module.exports = features;
}