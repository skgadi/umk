const urlInfo = {
  inText: null,
  info: null,
  getInText: function () {
    this.inText = decodeURI(window.location.search.substring(1));
  },
  getInfo: function () {
    this.info =  JSON.parse2(packer.unpack(urlInfo.inText));
  }
};