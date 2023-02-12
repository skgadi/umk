const menuVue = new Vue({
  el: "#main-menu",
  data: {
    tools: menu,
    statusVisible: 0,
    updateCounter: 0,
    wMode: false
  },
  watch: {
    wMode: function () {
      mainSystem.graph.wMode = this.wMode;
    }
    /*settings: {
        deep: true,
        handler: function() {
            this.updateCounter++;
        }
    }*/
  },
  computed: {
    lang: function () {
      this.updateCounter;
      return settings.lang;
    }
  },
  methods: {
    update: function () {
      this.updateCounter++;
    },
    showStatus: function (txt) {
      if (!!this.statusVisible) {
        this.removeStatus(this.statusVisible);
      }
      this.statusVisible = footerVue.addHint("<span><i class='fas fa-info-circle'></i>&nbsp;</span><span>" + txt + "</span>");
    },
    removeStatus: function () {
      footerVue.removeHint(this.statusVisible);
      this.statusVisible = 0;
    },
    evalFunc: function (funToExe) {
      eval(funToExe);
      let classes = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < classes.length; i++) {
        classes[i].style.visibility = "hidden";
        setTimeout((ele = classes[i]) => {
          ele.style.visibility = "unset";
        }, 500);
      }
    }
  }
});