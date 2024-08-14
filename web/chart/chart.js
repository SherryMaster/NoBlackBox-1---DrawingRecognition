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
        this.margin = options.size * 0.1
        this.transparency = 0.5

        this.dataTrans = {
            offset: [0, 0],
            scale: 1
        }

        this.dragInfo = {
            dragging: false,
            dragStart: [0, 0],
            dragEnd: [0, 0],
            dragOffset: [0, 0]
        }

        this.pixelBounds = this.#getPixelBounds()
        this.dataBounds = this.#getDataBounds()
        this.defaultDataBounds = this.dataBounds

        this.#draw()

        this.#addEventListeners()
    }

    #addEventListeners(){
        const {canvas, dataTrans, dragInfo} = this
        canvas.onmousedown = (evt)=>{
            const dataLoc = this.#getMouse(evt, true);
            dragInfo.dragStart = dataLoc
            dragInfo.dragging = true
        }

        canvas.onmousemove = (evt)=>{
            if(dragInfo.dragging){
                const dataLoc = this.#getMouse(evt, true);
                dragInfo.dragEnd = dataLoc
                dragInfo.dragOffset = math.subtract(dragInfo.dragStart, dragInfo.dragEnd)

                const newOffset = math.add(dataTrans.offset, dragInfo.dragOffset)

                this.#updateDataBounds(newOffset, dataTrans.scale)
                this.#draw()
            }
        }

        canvas.onmouseup = ()=>{
            dataTrans.offset = math.add(dataTrans.offset, dragInfo.dragOffset)
            dragInfo.dragging = false
        }

        canvas.onwheel = (evt)=>{
            const dir = Math.sign(evt.deltaY)
            const step = 0.02
            dataTrans.scale += evt.deltaY * step
            dataTrans.scale = Math.max(step, Math.min(2, dataTrans.scale))

            console.log(dataTrans.scale)
            
            this.#updateDataBounds(dataTrans.offset, dataTrans.scale)

            this.#draw()
            evt.preventDefault()
        }
    }

    #updateDataBounds(newOffset, scale){
        const {dataBounds, defaultDataBounds: def} = this
        dataBounds.left = def.left + newOffset[0]
        dataBounds.right = def.right + newOffset[0]
        dataBounds.top = def.top + newOffset[1]
        dataBounds.bottom = def.bottom + newOffset[1]
        
        const centre = [
            (dataBounds.left + dataBounds.right) / 2,
            (dataBounds.top + dataBounds.bottom) / 2
        ]

        dataBounds.left = math.lerp(centre[0], dataBounds.left, scale)
        dataBounds.right = math.lerp(centre[0], dataBounds.right, scale)
        dataBounds.top = math.lerp(centre[1], dataBounds.top, scale)
        dataBounds.bottom = math.lerp(centre[1], dataBounds.bottom, scale)

    }

    #getMouse(evt, data=false){
        const {canvas} = this
        const rect = canvas.getBoundingClientRect();
        const pixelLoc = [
            evt.clientX-rect.left,
            evt.clientY-rect.top
        ]
        if(data){
            const dataLoc = math.remapPoint(this.pixelBounds, this.defaultDataBounds, pixelLoc)
            return dataLoc
        }
        return pixelLoc
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
        const x = samples.map(samples=>samples.point[0])
        const y = samples.map(samples=>samples.point[1])

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
        this.#drawAxes()
        ctx.globalAlpha = this.transparency
        this.#drawPoints()
        ctx.globalAlpha = 1
    }

    #drawAxes(){
        const {ctx, canvas, axisLabels, margin} = this
        const {left, right, top, bottom} = this.pixelBounds

        graphics.drawText(
            ctx,
            {
                text: axisLabels[0],
                loc: [canvas.width/2, bottom+margin/2],
                size: margin*0.5
            }
        )

        ctx.save()
        ctx.translate(left - margin/2, canvas.height/2)

        ctx.rotate(-Math.PI/2)
        graphics.drawText(
            ctx,
            {
                text: axisLabels[1],
                loc: [0, 0],
                size: margin*0.5
            }
        )
        ctx.restore()

        ctx.beginPath()
        ctx.moveTo(left, top)
        ctx.lineTo(left, bottom)
        ctx.lineTo(right, bottom)
        ctx.setLineDash([6, 4])
        ctx.strokeStyle = "lightgray"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.setLineDash([])

        const dataMin = math.remapPoint(this.pixelBounds, this.dataBounds, [left, bottom])
        graphics.drawText(
            ctx,
            {
                text: math.formatNumber(dataMin[0]),
                loc: [left, bottom+margin/10],
                size: margin*0.3,
                align: "left",
                baseline: "top"
            }
        )

        ctx.save()
        ctx.translate(left, bottom-margin/10)
        ctx.rotate(-Math.PI/2)
        graphics.drawText(
            ctx,
            {
                text: math.formatNumber(dataMin[1]),
                loc: [0, 0],
                size: margin*0.3,
                align: "left",
                baseline: "bottom"
            }
        )
        ctx.restore()

        const dataMax = math.remapPoint(this.pixelBounds, this.dataBounds, [right, top])
        graphics.drawText(
            ctx,
            {
                text: math.formatNumber(dataMax[0]),
                loc: [right, bottom+margin/10],
                size: margin*0.3,
                align: "right",
                baseline: "top"
            }
        )

        ctx.save()
        ctx.translate(left, top)
        ctx.rotate(-Math.PI/2)
        graphics.drawText(
            ctx,
            {
                text: math.formatNumber(dataMax[1]),
                loc: [0, 0],
                size: margin*0.3,
                align: "right",
                baseline: "bottom"
            }
        )
        ctx.restore()
    }

    #drawPoints(){
        const {ctx, samples, dataBounds, pixelBounds} = this

        for (const sample of samples){
            const {point, label} = sample

            const pixelLoc = math.remapPoint(dataBounds, pixelBounds, point)
            graphics.drawPoint(ctx, pixelLoc)

        }
    }
}