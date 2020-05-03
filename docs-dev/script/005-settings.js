const settingsVue = new Vue({
  el: "#settings",
  data: {
    "cThemes": {
      "en-us": {
        "theme-dark": "Dark theme",
        "theme-light": "Cold regions",
        "theme-CRIMSON": "Crimson",
        "theme-theme1": "Theme 1",
        "theme-theme2": "Theme 2",
        "theme-theme3": "Theme 3",
        "theme-theme4": "Theme 4",
        "theme-theme5": "Theme 5",
        "theme-theme6": "Theme 6",
        "theme-theme7": "Theme 7",
        "theme-theme8": "Theme 8",
        "theme-theme9": "Theme 9",
        "theme-theme10": "Theme 10"
      },
      "es-mx": {
        "theme-dark": "Tema oscuro",
        "theme-light": "Regiones frías",
        "theme-CRIMSON": "Crimson",
        "theme-theme1": "Tema 1",
        "theme-theme2": "Tema 2",
        "theme-theme3": "Tema 3",
        "theme-theme4": "Tema 4",
        "theme-theme5": "Tema 5",
        "theme-theme6": "Tema 6",
        "theme-theme7": "Tema 7",
        "theme-theme8": "Tema 8",
        "theme-theme9": "Tema 9",
        "theme-theme10": "Tema 10"
      }
    },
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