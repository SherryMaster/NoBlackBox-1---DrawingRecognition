class SketchPad {
    constructor(container, size=400) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style = `
            background-color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            border-radius: 8px;
            touch-action: none;
        `;

        container.appendChild(this.canvas);

        this.undoBtn = document.createElement("button");
        this.undoBtn.innerHTML = "Undo";
        this.undoBtn.classList.add("action-button");
        
        this.clearBtn = document.createElement("button");
        this.clearBtn.innerHTML = "Clear";
        this.clearBtn.classList.add("action-button");

        const controls = document.createElement("div");
        controls.classList.add("controls");
        controls.appendChild(this.undoBtn);
        controls.appendChild(this.clearBtn);
        container.appendChild(controls);

        this.ctx = this.canvas.getContext("2d");
        
        this.reset();
        this.#addEventListeners();
        
        // Initialize undo button as disabled
        this.undoBtn.disabled = true;
    }

    reset() {
        this.paths = [];
        this.isDrawing = false;
        this.#reDraw();
    }

    #addEventListeners() {
        this.canvas.onmousedown = (evt) => {
            const mouse = this.#getMouse(evt);
            this.paths.push([mouse]);
            this.isDrawing = true;
        }

        this.canvas.onmousemove = (evt) => {
            if(this.isDrawing) {
                const mouse = this.#getMouse(evt);
                const lastPath = this.paths[this.paths.length - 1];
                lastPath.push(mouse);
                this.#reDraw();
            }
        }

        document.onmouseup = () => {
            this.isDrawing = false;
        }

        // Touch events
        this.canvas.ontouchstart = (evt) => {
            const loc = evt.touches[0];
            this.canvas.onmousedown(loc);
            evt.preventDefault();
        }

        this.canvas.ontouchmove = (evt) => {
            const loc = evt.touches[0];
            this.canvas.onmousemove(loc);
            evt.preventDefault();
        }

        document.ontouchend = () => {
            document.onmouseup();
        }

        this.undoBtn.onclick = () => {
            this.paths.pop();
            this.#reDraw();
        }

        this.clearBtn.onclick = () => {
            this.paths = [];
            this.#reDraw();
        }
    }

    #getMouse = (evt) => {
        const rect = this.canvas.getBoundingClientRect();
        return [
            Math.round(evt.clientX - rect.left),
            Math.round(evt.clientY - rect.top)
        ];
    }

    #reDraw = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        draw.paths(this.ctx, this.paths);
        
        // Enable/disable undo button based on paths
        this.undoBtn.disabled = this.paths.length === 0;
        this.clearBtn.disabled = this.paths.length === 0;
    }
}
