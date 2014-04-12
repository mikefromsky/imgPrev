var imgPrev = (function() {

    var fileList = [],
        innerPreview, innerDropbox, innerNameList

        deleteFileAndNamesFromQueue = function(index, nameElement) {
            var closeIndex = nameElement.dataset.close;
            deletePreview(closeIndex);
            deleteName(index, nameElement)
            console.log("closeIndex: ", closeIndex);
            // fileList.splice(closeIndex, 1)
            delete fileList[closeIndex];
            console.warn("afterDeleting: ", fileList);
        },

        initDropbox = function(dB) {
            if (dB) innerDropbox = dB;
        },
        initPreview = function(iP) {
            if (iP) innerPreview = iP;
        },
        addPreview = function(fileIndex, file) {
            if (innerPreview) {
                var img = document.createElement("img");
                img.classList.add("img-thumbnail");
                img.file = file;
                img.width = 200
                img.setAttribute('data-i', fileIndex)
                innerPreview.appendChild(img);
                var reader = new FileReader();
                reader.onload = (function(aImg) {
                    return function(e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);
            }
        },
        deletePreview = function(i) {
            var imgToRemove = document.querySelector("[data-i='" + i + "']")
            imgToRemove.parentNode.removeChild(imgToRemove);
        },
        initNameList = function(nL) {
            if (nL) innerNameList = nL;
        },
        addNameWithCloseButton = function(index, fileName) {
            var element = document.createElement('div'),
                close = document.createElement('span');
            close.innerHTML = ' x ';
            element.setAttribute("data-i", index);
            close.setAttribute("data-close", index);
            element.innerHTML = fileName;
            element.appendChild(close);
            innerNameList.appendChild(element);

        },
        deleteName = function(index, nameElement) {

            var nameElementToRemove = nameElement.parentNode;
            nameElementToRemove.parentNode.removeChild(nameElementToRemove)
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
                addNameWithCloseButton(fileIndex, file.name);
                addPreview(fileIndex, file);
                var closeButton = document.querySelector("[data-close='" + fileIndex + "']");
                closeButton.addEventListener('click', function(e) {
                    deleteFileAndNamesFromQueue(fileIndex, e.target);
                })
            }
        }
    return {
        init: function(elements) {
            initDropbox(elements.dropbox);
            initNameList(elements.nameList)
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
        "preview": document.getElementById("prev"),
        "nameList": document.getElementById("name-list")
    });
    document.getElementById("test").addEventListener("click", function() {
        alert("See browser console.")
        console.log(imgPrev.getFilesArray())
    }, false)

}