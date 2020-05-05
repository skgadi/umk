/*
Settings are distrubuted at various places
1. All settings with initial values are stored at 000-vars.js
2. Settings to store and retrive from cookies are available at 999-last.js
3. settings window is handled by 005-settings.js
4. some settings are updated at 013-right-pane.js 
*/


const settingsVue = new Vue({
  el: "#settings",
  data: {
    "cThemes":{"mode":{"dark":"dark","dark2":"dark","dark3":"dark","dark4":"dark","dark5":"dark","light":"light","light2":"light","light3":"light","light4":"light","light5":"light"},"en-us":{"theme-dark":"Dark theme 1 (default)","theme-dark2":"Dark theme 2","theme-dark3":"Dark theme 3","theme-dark4":"Dark theme 4","theme-dark5":"Dark theme 5","theme-light":"Light theme 1","theme-light2":"Light theme 2","theme-light3":"Light theme 3","theme-light4":"Light theme 4","theme-light5":"Light theme 5"},"es-mx":{"theme-dark":"Tema oscuro 1 (predeterminado)","theme-dark2":"Tema oscuro 2","theme-dark3":"Tema oscuro 3","theme-dark4":"Tema oscuro 4","theme-dark5":"Tema oscuro 5","theme-light":"Tema ligero 1","theme-light2":"Tema ligero 2","theme-light3":"Tema ligero 3","theme-light4":"Tema ligero 4","theme-light5":"Tema ligero 5"}},
    stings: settings,
    display: false
  },
  updated: function () {
    this.updateHideBtnText();
  },
  watch: {
    "display": function () {
      kbshort.suspend(this.display, function (evt) {
        if (evt.keyCode === 27) {
          settingsVue.showGUI(false);
        }
      });
    },
    "stings": {
      deep: true,
      handler: function () {
        //console.log(this.stings);
        setCookie("settings", JSON.stringify2(this.stings));
      }
    },
    "stings.lang": {
      handler: function () {
        menuVue.update();
      }
    },
    "stings.theme": {
      handler: function () {
        document.getElementsByTagName('html')[0].className = this.stings.theme;
      }
    },
    "stings.showExeOrder": function () {
      simVue.displayExecutionOrder();
    }
  },
  methods: {
    showGUI: function (show = true) {
      this.display = show;
    },
    updateHideBtnText: function () {
      document.getElementById("hide-left-text").innerText = GUIText[this.stings.lang].hide;
      document.getElementById("hide-right-text").innerText = GUIText[this.stings.lang].hide;
    }
  }
});