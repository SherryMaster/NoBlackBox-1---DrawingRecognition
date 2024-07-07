class Chart{
    constructor(container, samples, options){
        this.samples = samples

        this.axisLabels = options.axisLabels
        this.styles = options.styles

        this.canvas = document.createElement("canvas")
        this.canvas.width = options.size
        this.canvas.height = options.size
        this.canvas.style = `background-color: white;`

        container.appendChild(this.canvas)

        this.ctx = this.canvas.getContext("2d")
        this.transparency = 0.5

        this.pixelBounds = this.#getPixelBounds()
        this.dataBounds = this.#getDataBounds()

        this.#draw()
    }

    #getPixelBounds(){
        const {canvas, margin} = this;
        const bounds = {
            left: margin,
            right: canvas.width - margin,
            top: margin,
            bottom: canvas.height - margin
        }

        return bounds
    }

    #getDataBounds(){
        const {samples} = this
        const x = samples.map(sample=>sample.point[0])
        const y = samples.map(sample=>sample.point[1])

        const minX = Math.min(...x)
        const maxX = Math.max(...x)
        const minY = Math.min(...y)
        const maxY = Math.max(...y)

        const bounds = {
            left: minX,
            right: maxX,
            top: maxY,
            bottom: minY
        }

        return bounds
    }

    #draw(){
        const {ctx, canvas} = this;

        ctx.clearRect(0,0,canvas.width,canvas.height)
        ctx.globalAlpha = this.transparency
        this.#drawPoints()
        ctx.globalAlpha = 1
    }

    #drawPoints(){
        const {ctx, samples, dataBounds, pixelBounds} = this

        for (const sample of samples){
            const {point, label} = sample
            const x = point[0]
            const y = point[1]

            const pixelLoc = [
                math.remap(dataBounds.left, dataBounds.right, pixelBounds.left, pixelBounds.right, x),
                math.remap(dataBounds.top, dataBounds.bottom, pixelBounds.top, pixelBounds.bottom, y)
            ]

            graphics.drawPoint(ctx, pixelLoc)

        }
    }
}