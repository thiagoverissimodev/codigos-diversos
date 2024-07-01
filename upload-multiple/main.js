const dropArea = document.querySelector(".drag-files")
dropArea.addEventListener("dragover", () => {
    dropArea.classList.add("dragover")
})

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover")
})
function reloadPageAfterDelay(delay) {
setTimeout(function() {
    // Recarrega a página
    location.reload();
}, delay);
}
const fileInput = document.querySelector('#file-input')
const boxFiles = document.querySelector('.box')
const containerFiles = document.querySelector('.container-files')
const btnRemove = document.querySelector('.btn-remove')
const description = document.createElement('p')
fileInput.addEventListener('change', function createNewBox(){
    const files = fileInput.files;
    if (!files) return;
    for(let i = 0; i < files.length; i++) {
        let fileName = files[i].name;
        let fileSize = parseFloat((files[i].size / (1024 * 1024))).toFixed(2)

        let fileNameFormatted = formateFileName(fileName)

        const newBox = document.createElement('div')
        newBox.classList.add('box','uploading')
        if (newBox.dataset.boxIndex === undefined) {
            newBox.dataset.boxIndex = i;
        }
        newBox.innerHTML = `
        
            <div class="icon">
                <svg class="icon-file" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M200,224H56a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96l56,56V216A8,8,0,0,1,200,224Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="152 32 152 88 208 88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
            </div>
            <div class="info">
                <div class="filename">${fileNameFormatted}</div>
                <div class="filesize">
                    <span class="loaded">3 MB /</span>
                    <span class="total">${fileSize} MB</span>
                </div>
                <div class="bar" style="position:relative">
                    <div class="progressBar"></div>
                    <span class="porcentage">46%</span>
                </div>
            </div>
            <div class="btn-remove">
                <svg xmlns="http://www.w3.org/2000/svg" title="Clique aqui para remover esta imagem" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
            </div>

        `
        // containerFiles.appendChild(newBox);
        showProgress(newBox, files[i].size)
        const btnRemove = newBox.querySelector('.btn-remove');
        btnRemove.addEventListener('click', removeBox);

        removeDescription();
    };
})


const limit = 34

function formateFileName(fileName) {
    const aboveLimit = fileName.length > limit
    const dotsOrEmpty = aboveLimit ? '...' : ''

    const fileNameFormatted = fileName.substring(0, limit) + dotsOrEmpty

    return fileNameFormatted
}

function removeBox(event) {
    const files = document.querySelector('#file-input')
    const box = event.target.closest('.box')
    
    if (box) {
        box.classList.add('box-leave')
        const filesArray = Array.from(files.files);
        if (filesArray.length > 0) {
            filesArray.splice(box.dataset.boxIndex, 1);
            updateFileInput(filesArray);
        }
        setTimeout(() => {
            if (box && box.parentNode) {
                box.parentNode.removeChild(box);
                updateBoxIndex();
            }
            addDescriptionIfContainerIsEmpty()
        },500)
    }
    
}
function addDescriptionIfContainerIsEmpty(){
    if (containerFiles.children.length === 0 ) {
        description.classList.add('description')
        description.innerHTML = `
        Nenhuma imagem foi importada. Por favor, selecione uma imagem.`

        containerFiles.appendChild(description)
    }
}
function removeDescription() {
    if(containerFiles.contains(description)) {
        containerFiles.removeChild(description)
    }
}
function showProgress(newBox, fileSize) {
    const loadedSpan = newBox.querySelector('.loaded')
    const iconFile = newBox.querySelector('.icon-file')
    const progressBar = newBox.querySelector('.progressBar')
    const porcentageSpan = newBox.querySelector('.porcentage')
    const icon = newBox.querySelector('.icon')

    let loaded = 0
    let porcentage = 0
    let total = fileSize
    
    const intervalTime = 100
    const totalTime = 2000

    const loadedIncrement = total * intervalTime / totalTime
    const porcentageIncrement = 100 * intervalTime / totalTime

    const updateValues = setInterval(() => {
        loaded += loadedIncrement
        porcentage += porcentageIncrement
    
        if (loaded >= total && porcentage >= 100) {
        porcentage = 100
        loaded = total
        // icon.src = './assets/iconGreen.svg'
        newBox.classList.add('done')
        iconFile.classList.add('done')

        clearInterval(updateValues)
        }
    
        loadedSpan.textContent = `${(loaded / (1024 * 1024)).toFixed(2)}MB / `
        // progressBar.textContent = `${porcentage}%`
        progressBar.style.width = `${porcentage}%`
        // document.getElementById('progressBar').value = `${porcentage}%`
        porcentageSpan.textContent = `${Math.round(porcentage)}%`
    
        }, intervalTime)

        containerFiles.appendChild(newBox)
        return newBox
}
    function updateFileInput(filesArray) {
        const newFileInput = document.createElement('input');
        newFileInput.type = 'file';
        newFileInput.multiple = true;
        const dataTransfer = new DataTransfer();
        filesArray.forEach(file => {
            dataTransfer.items.add(file);
        });
        newFileInput.files = dataTransfer.files;

        // Replace the old input element with the new one
        const oldInput = document.getElementById('file-input');
        oldInput.parentNode.replaceChild(newFileInput, oldInput);
        newFileInput.id = 'file-input'; // Reassign the ID to the new element
    }
    function updateBoxIndex(){
        const dragApp = document.querySelector("#drag-app");
        const boxs = dragApp.querySelectorAll('.box')
        const filesArray = Array.from(boxs)
        console.log(boxs);
        console.log(filesArray);
        filesArray.forEach((file,index)=> {
            file.dataset.boxIndex = index
        });
    }
