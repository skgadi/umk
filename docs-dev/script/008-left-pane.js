const blocksVue = new Vue({
  el: "#lp-content",
  data: {
    updateCounter: 0,
    statusVisible: 0,
    searchText: "",
    categories: bSummary.categories,
    blksSummary: bSummary.blocks,
    blksPerCategories: bSummary.getBlocksForCategories(),
    disp: {
      "search": true
    },
    iconText: {
      icon1: "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><g><rect rx='10' height='100' width='100' fill-opacity='0.15' fill='",
      icon2: "'/></g><g stroke-linecap='round' width='100' height='100' stroke='",
      icon3: "' stroke-width='10' fill='none'>",
      icon4: "</g></svg>"
    },
    searchResults: []
  },
  updated: function () {
    let AllLibraryBlocks = document.getElementsByClassName(
      "libraryBlock"
    );
    for (let i = 0; i < AllLibraryBlocks.length; i++) {
      new blockOnDOM(AllLibraryBlocks[i]);
    }
  },
  watch: {
    searchText: function () {
      this.searchResults = [];
      let results = [];
      for (let i = 0; i < Object.keys(this.blksSummary).length; i++) {
        let key = Object.keys(this.blksSummary)[i];
        let searchableText = JSON.stringify(Object.values(this.blksSummary[key].name)) + JSON.stringify(Object.values(this.blksSummary[key].desc)) + this.blksSummary[key].keywords;
        if (searchableText.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > 0) results.push(key);
      }
      setTimeout((results) => {
        //console.log(results);
        blocksVue.$set(blocksVue.$data,"searchResults",results);
      }, 100, results);
      //this.searchResults = results;
    }
  },
  computed: {
    /*searchResults: function () {
      let results = [];
      for (let i = 0; i < Object.keys(this.blksSummary).length; i++) {
        let key = Object.keys(this.blksSummary)[i];
        let searchableText = JSON.stringify(Object.values(this.blksSummary[key].name)) + JSON.stringify(Object.values(this.blksSummary[key].desc)) + this.blksSummary[key].keywords;
        if (searchableText.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > 0) results.push(key);
      }
      return results;
    }*/
  },
  mounted: function () {
    this.disp[bSummary.getCategoriesIdList()[0]] = true;
    this.updateCounter++;
  },
  methods: {
    showHide: function (itemID) {
      const divId = 'categories_list_' + itemID;
      const iconId = 'categories_list_icon_' + itemID;
      if (document.getElementById(divId).style.display === "none") {
        document.getElementById(divId).style.display = "block";
        document.getElementById(iconId).innerHTML = "<i class='fas fa-fw fa-caret-down'></i>";
      } else {
        document.getElementById(divId).style.display = "none";
        document.getElementById(iconId).innerHTML = "<i class='fas fa-fw fa-caret-right'></i>";
      }
    },
    focusBar: function () {
      document.getElementById("search-input").focus();
    },
    showStatus: function (block) {
      if (!!this.statusVisible) {
        this.removeStatus(this.statusVisible);
      }
      this.statusVisible = footerVue.addHint("<span><i class='fas fa-fw fa-puzzle-piece'></i>&nbsp;" + block.name[settings.lang] + "&nbsp;&mdash;&nbsp;" + block.desc[settings.lang] + "</span>");
    },
    removeStatus: function () {
      footerVue.removeHint(this.statusVisible);
      this.statusVisible = 0;
    },
    sBFocus: function (foc = true) {
      kbshort.suspend(foc, function (evt) {
        if (evt.keyCode === 27) {
          blocksVue.$set(blocksVue.$data, "searchText", "");
        }
      });
    },
    getBlockImage: function (block) {
      return (
        "data:image/svg+xml;base64," +
        window.btoa(
          this.iconText.icon1 +
          block.bg +
          this.iconText.icon2 +
          block.bg +
          this.iconText.icon3 +
          block.icon +
          this.iconText.icon4
        )
      );
    }
  }
});