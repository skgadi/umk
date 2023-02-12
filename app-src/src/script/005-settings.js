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
    "cThemes":{"mode":{"dark":"dark","dark2":"dark","dark3":"dark","dark4":"dark","dark5":"dark","light":"light","light2":"light","light3":"light","light4":"light","light5":"light","test":"light","darktest":"dark"},"en-us":{"theme-dark":"Dark theme 1","theme-dark2":"Dark theme 2","theme-dark3":"Dark theme 3","theme-dark4":"Dark theme 4","theme-dark5":"Dark theme 5","theme-light":"Light theme 1 (default)","theme-light2":"Light theme 2","theme-light3":"Light theme 3","theme-light4":"Light theme 4","theme-light5":"Light theme 5","theme-test":"Light theme 6","theme-darktest":"Dark theme 5"},"es-mx":{"theme-dark":"Tema oscuro 1","theme-dark2":"Tema oscuro 2","theme-dark3":"Tema oscuro 3","theme-dark4":"Tema oscuro 4","theme-dark5":"Tema oscuro 5","theme-light":"Tema ligero 1 (predeterminado)","theme-light2":"Tema ligero 2","theme-light3":"Tema ligero 3","theme-light4":"Tema ligero 4","theme-light5":"Tema ligero 5","theme-test":"Tema ligero 6","theme-darktest":"Tema oscuro 5"}},
    stings: settings,
    display: false
  },
  mounted: function () {
    this.setGUITheme();
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
      if (!settingsVue.display) {
        mainSystem.refresh();
      }
    },
    "stings": {
      deep: true,
      handler: function () {
        //console.log(this.stings);
        setCookie("settings", JSON.stringify2(this.stings));
        popup.sendSettingsToAll();
      }
    },
    "stings.lang": {
      handler: function () {
        menuVue.update();
      }
    },
    "stings.theme": {
      handler: function () {
        this.setGUITheme();
      }
    },
    "stings.showExeOrder": function () {
      simVue.displayExecutionOrder();
    }
  },
  methods: {
    setGUITheme: function () {
      document.getElementsByTagName('html')[0].className = this.stings.theme;
    },
    showGUI: function (show = true) {
      this.display = show;
    },
    updateHideBtnText: function () {
      document.getElementById("hide-left-text").innerText = GUIText[this.stings.lang].hide;
      document.getElementById("hide-right-text").innerText = GUIText[this.stings.lang].hide;
    }
  }
});