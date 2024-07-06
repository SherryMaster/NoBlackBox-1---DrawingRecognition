function createRow(container, studentName, samples){
    const row = document.createElement("div")
    row.classList.add("row")
    container.appendChild(row)

    const row_label = document.createElement("div")
    row_label.innerHTML = studentName
    row_label.classList.add("rowLabel")
    row.appendChild(row_label)

    for(let sample of samples){
        const {id, label} = sample

        const sampleContainer = document.createElement("div")
        sampleContainer.classList.add("sampleContainer")
        sampleContainer.id = "sample_"+id

        sampleLabel = document.createElement("div")
        sampleLabel.innerHTML = label
        sampleLabel.classList.add("sampleLabel")
        sampleContainer.appendChild(sampleLabel)

        const img = document.createElement("img")
        img.src = constants.IMG_DIR+"/"+id+".png"
        img.classList.add("thumb")
        sampleContainer.appendChild(img)
        row.appendChild(sampleContainer)
    }
}