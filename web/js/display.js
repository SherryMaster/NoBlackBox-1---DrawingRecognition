function createRow(container, studentName, samples) {
    const row = document.createElement("div");
    row.classList.add("row");
    container.appendChild(row);

    const rowLabel = document.createElement("div");
    rowLabel.innerHTML = studentName;
    rowLabel.classList.add("rowLabel");
    row.appendChild(rowLabel);

    const drawingsGrid = document.createElement("div");
    drawingsGrid.classList.add("drawings-grid");
    row.appendChild(drawingsGrid);

    for(let sample of samples) {
        const {id, label} = sample;

        const sampleContainer = document.createElement("div");
        sampleContainer.classList.add("sampleContainer");
        sampleContainer.id = "sample_" + id;

        const sampleLabel = document.createElement("div");
        sampleLabel.innerHTML = label;
        sampleLabel.classList.add("sampleLabel");
        sampleContainer.appendChild(sampleLabel);

        const img = document.createElement("img");
        img.src = constants.IMG_DIR + "/" + id + ".png";
        img.classList.add("thumb");
        sampleContainer.appendChild(img);
        
        drawingsGrid.appendChild(sampleContainer);
    }
}
