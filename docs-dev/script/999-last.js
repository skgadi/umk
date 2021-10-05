//Check settings cookies
//rpSettingsKeys-> Right panel settings
(() => {
  try {
    const rpSettingsKeys = ["gLinesMinor", "gLinesMajor", "gLinesMega", "showOutline", "gridSize", "guidesEnabled", "showLabels", "showExeOrder", "snapToGrid"];
    const cSettings = (!!getCookie("settings")) ? JSON.parse2(getCookie("settings")) : Object.assign({}, settings);
    // console.log(JSON.stringify(JSON.parse2(getCookie("settings"))));
    // console.log(JSON.stringify(cSettings));

    Object.keys(cSettings).forEach(function (key) {
      if (typeof settings[key] != undefined) {
        //console.log(key);
        settings[key] = cSettings[key];
      }
      if (rpSettingsKeys.indexOf(key) >= 0) {
        editorVue.$set(editorVue.$data.rpSettings, key, cSettings[key]);
      }
    });
    settingsVue.updateHideBtnText();
  } catch (e) {
    console.log(e);
  }
})();






//todo below this



suspendUserInterface.suspendInterface();
kbshort.suspend(false);



var searchBox = document.querySelectorAll('.search-box input[type="text"] + span');
searchBox.forEach((elm) => {
  elm.addEventListener('click', () => {
    elm.previousElementSibling.value = '';
  });
});

window.onbeforeunload = function () {
  simVue.informSim('stop'); // Stop the simulation before exiting
  simVue.dbName = null;
  popup.closeAll(); //close all the popups
  if (!isElectron()) {
    return "Sure?"; //Enable this for confirming before exiting.
  }
};



/* recMessage */
window.addEventListener("message", function (event) {
  console.log(event)
}, true);


/*Drag and drop operations */
//['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
['dragenter', 'dragover', 'drop', 'dragexit'].forEach(eventName => {
  document.getElementsByTagName("BODY")[0].addEventListener(eventName, uyamak.lFManagerVue.dragOperation, false)
});

document.getElementsByTagName("BODY")[0].addEventListener("dragleave", GSKGenFuncs.preventDefaults, false);


['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.addEventListener(eventName, GSKGenFuncs.preventDefaults, false)
});

function alertWIP() {
  alert("\uD83D\uDEB7\uD83D\uDEB7\uD83D\uDEB7 Functionality unavailable:\n\
  \uD83D\uDEE0\uD83D\uDEE0\uD83D\uDEE0 We are working on this part of the code.\n\
  \uD83D\uDCC5\uD83D\uDCC5\uD83D\uDCC5 You can expect this functionality by mid-2021.\n\n\n\
  Inconvenience caused is regretted.");
}