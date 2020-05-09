const GSKGenFuncs = {
  preventDefaults: function (event) { //prevent default activities
    event.preventDefault();
    event.stopPropagation();
  },
  isValidFileName: function (fname) { // checks if the entered filename's validity
    const rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
    const rg2 = /^\./; // cannot start with dot (.)
    const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
    return rg1.test(fname) && !rg2.test(fname) && !rg3.test(fname);
  },
  download: function (filename, text, type) {
    let element = document.createElement('a');
    let blob = new Blob([text], {
      type: type
    });
    let url = window.URL.createObjectURL(blob);

    element.style.display = 'none';
    element.href = url;
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    window.URL.revokeObjectURL(url);
  },
}