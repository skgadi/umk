const blocksVue = new Vue({
    el: "#lp-content",
    data: {
        updateCounter: 0,
        statusVisible: 0,
        searchText: "",
        categories: bSummary.categories,
        blksSummary: bSummary.blocks,
        blksPerCategories: bSummary.getBlocksForCategories(),
        disp: {"search": true},
        iconText: {
            icon1: "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><g><rect rx='10' height='100' width='100' fill-opacity='0.15' fill='",
            icon2: "'/></g><g stroke-linecap='round' width='100' height='100' stroke='",
            icon3: "' stroke-width='10' fill='none'>",
            icon4: "</g></svg>"
        }
    },
    computed: {
        searchResults: function () {
            let results = [];
            for (let i = 0; i < Object.keys(this.blksSummary).length; i++) {
                let key = Object.keys(this.blksSummary)[i];
                let searchableText = JSON.stringify(Object.values(this.blksSummary[key].name)) + JSON.stringify(Object.values(this.blksSummary[key].desc)) + this.blksSummary[key].keywords;
                if (searchableText.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) > 0) results.push(key);
            }
            return results;
        }
    },
    mounted: function () {
        this.disp[bSummary.getCategoriesIdList()[0]] = true;
        this.updateCounter++;
    },
    methods: {
        showStatus: function (block) {
            if (!!this.statusVisible) {
                this.removeStatus(this.statusVisible);
            }
            this.statusVisible = footerVue.addHint("<span><i class='far fa-fw fa-square'></i>&nbsp;" + block.name[settings.lang] + "&nbsp;&mdash;&nbsp;" + block.desc[settings.lang] + "</span>");
        },
        removeStatus: function () {
            footerVue.removeHint(this.statusVisible);
            this.statusVisible = 0;
        },
        searchbarText: function (foc = true) {
            kbshort.suspend(foc, function (evt) {
                if (evt.keyCode === 27) {
                    blocksVue.$set(blocksVue.$data, "searchText", "");
                }
            });
        },
        getBlockImage: function (block) {
            return (
                "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(
                    this.iconText.icon1 +
                    getComputedStyle(document.body).getPropertyValue('--text-muted') +
                    this.iconText.icon2 +
                    getComputedStyle(document.body).getPropertyValue('--text-muted') +
                    this.iconText.icon3 +
                    block.icon +
                    this.iconText.icon4
                )
            );
        }
    }
});