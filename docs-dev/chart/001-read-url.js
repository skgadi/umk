/*
const urlInfo = {
  inText: null,
  info: null,
  getInText: function () {
    this.inText = decodeURI(window.location.search.substring(1));
  },
  getInfo: function () {
    this.info = JSON.parse2(packer.unpack(urlInfo.inText));
  },
  getLocale: function () {
    let locale = this.info.lang;
    this.getJSON("dependencies/apexcharts/locales/"+locale+".json", function (a,recLang) {
      cItem.setLocale(recLang);
    });
  },
  getJSON: function (url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      let status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
  }
};
*/