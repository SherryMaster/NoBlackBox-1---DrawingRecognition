const graphics = {}

graphics.drawPoint = (ctx, loc, color="black", size=8) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(...loc, size/2, 0, Math.PI*2);
    ctx.fill();
}


graphics.drawText = (ctx, {text, loc, color="black", size=12, align="center", baseline="middle"}) => {
    ctx.fillStyle = color;
    ctx.font = `${size}px sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(text, ...loc);
}