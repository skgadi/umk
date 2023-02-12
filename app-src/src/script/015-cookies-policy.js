cPolicyVue = new Vue({
  el: "#cookies-policy",
  data: {
    display: false
  },
  watch: {
    "display": function () {
      kbshort.suspend(this.display, function (evt) {});
    }
  },
  mounted: function () {
    if (!isElectron()) {
      this.checkAcceptance();
    }
  },
  methods: {
    acceptBtn: function () {
      setCookie("cpAccepted", "true");
      this.checkAcceptance();
    },
    checkAcceptance: function () {
      if (getCookie("cpAccepted") !== "true") {
        this.display = true;
      } else {
        this.display = false;
      }
    },
    showPolicy: function (whichOne=0) {
      let url;
      switch (whichOne) {
        case 1:
          url = "https://privacyterms.io/view/MwJs4mLi-vUWipMQF-SQzBG4/";
          break;
        default:
          url = "https://privacyterms.io/view/9pkoo0ZL-hGYS9ZZE-9x1erJ/";
          break;
      }
    }
  }
});