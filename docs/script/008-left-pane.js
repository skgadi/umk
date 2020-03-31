const blocksVue = new Vue({
    el:"#lp-content",
    data: {
        updateCounter: 0,
        statusVisible: 0,
        searchText: "",
        categories: bSummary.categories,
        blksSummary: bSummary.blocks,
        blksPerCategories: bSummary.getBlocksForCategories(),
        disp: {}
    },
    mounted: function() {
        this.disp[bSummary.getCategoriesIdList()[0]] = true;
        this.updateCounter++;
    },
    methods: {
        showStatus: function(txt) {
            if (!!this.statusVisible) {
                this.removeStatus(this.statusVisible);
            }
            this.statusVisible = footerVue.addHint("<span><i class='fas fa-info-circle'></i>&nbsp;</span><span>"+txt+"</span>");
        },
        removeStatus: function(){
            footerVue.removeHint(this.statusVisible);
            this.statusVisible=0;
        },
        searchbarText: function (foc=true) {
            kbshort.suspend(foc, function(evt){
                if (evt.keyCode === 27) {
                    blocksVue.$set(blocksVue.$data, "searchText", "");   
                }
            });
        },
        getBlocksFor: function (id) {
            this.blksSummary
        }
    }
});