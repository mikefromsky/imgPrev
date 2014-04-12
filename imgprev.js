var imgPrev = (function() {

    var fileList = [],
        innerPreview, innerDropbox, innerNameList
        initDropbox = function(dB) {
            if (dB) innerDropbox = dB;
        },
        initPreview = function(iP) {
            if (iP) innerPreview = iP;
        },
        addPreview = function(fileIndex, file) {
            if (innerPreview) {
                var img = document.createElement("img"),
                    containerDiv = document.createElement("div"),
                    nameElement = document.createElement("div"),
                    close = document.createElement('span');
                nameElement.innerHTML = file.name;
                nameElement.classList.add('label');
                nameElement.classList.add('label-default');
                close.innerHTML = ' x ';
                close.setAttribute("data-close", fileIndex);
                close.classList.add("close-preview");
                nameElement.appendChild(close);
                img.classList.add("img-thumbnail");
                img.file = file;
                img.width = 150;
                img.setAttribute('data-i', fileIndex)
                containerDiv.setAttribute("data-i", fileIndex);
                containerDiv.appendChild(img);
                containerDiv.appendChild(nameElement);
                innerPreview.appendChild(containerDiv);
                var reader = new FileReader();
                reader.onload = (function(aImg) {
                    return function(e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);
                close.addEventListener('click', function(e) {
                    deletePreviewAndFileFromQueue(fileIndex, e.target);
                })
            }
        },
        deletePreview = function(i) {
            var blockToRemove = document.querySelector("[data-i='" + i + "']")
            blockToRemove.parentNode.removeChild(blockToRemove);
        },
        deletePreviewAndFileFromQueue = function(index, nameElement) {
            var closeIndex = nameElement.dataset.close;
            deletePreview(closeIndex);
            console.log("closeIndex: ", closeIndex);
            // fileList.splice(closeIndex, 1)
            delete fileList[closeIndex];
            console.warn("afterDeleting: ", fileList);
        },
        dragenter = function(e) {
            e.stopPropagation();
            e.preventDefault();
        },
        dragover = function(e) {
            e.stopPropagation();
            e.preventDefault();
        },
        drop = function(e) {
            console.log('drop');
            e.stopPropagation();
            e.preventDefault();
            var dt = e.dataTransfer;
            files = dt.files;
            handleFiles(files);
        },
        makeFileArray = function() {
            if (fileList.length > 0) {
                var clearArray = [];
                for (var i = 0; i < fileList.length; i++) {
                    if (typeof fileList[i] !== "undefined") {
                        clearArray.push(fileList[i]);
                    }
                }
                return clearArray;
            } else return null;
        },
        handleFiles = function(files) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var imageType = /image.*/;
                if (!file.type.match(imageType)) {
                    continue;
                }
                fileList.push(file); // pushing current file into global file array
                var fileIndex = fileList.length - 1;
                addPreview(fileIndex, file);
            }
        }
    return {
        init: function(elements) {
            initDropbox(elements.dropbox);
            initPreview(elements.preview);
            if (elements.button && elements.input) {
                try {
                    elements.button.addEventListener("click", function(e) {
                        elements.input.click();
                    }, false);
                    elements.input.addEventListener("change", function() {
                        console.log(this.files);
                        handleFiles(this.files);
                    })
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.error("No input or button!");
            }
            if (innerDropbox) {
                elements.dropbox.addEventListener("dragenter", dragenter, false);
                elements.dropbox.addEventListener("dragover", dragover, false);
                elements.dropbox.addEventListener("drop", drop, false);
            }
        },
        getFilesArray: function() {
            return makeFileArray();
        }
    }
})()

window.onload = function() {
    imgPrev.init({
        "input": document.getElementById("file"),
        "button": document.getElementById("choose"),
        "dropbox": document.getElementById("dropb"),
        "preview": document.getElementById("prev")
    });
    document.getElementById("test").addEventListener("click", function() {
        alert("See browser console.")
        console.info("Files: ", imgPrev.getFilesArray())
    }, false)

}