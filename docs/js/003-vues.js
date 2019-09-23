//Code for handling blocks display
var allTheBlocks = new Vue({
    el: "#allTheBlocks",
    data: {
        categories: umkBlockCategories,
        bSummary: umkBlockSummary,
        dispCategories: new Array(umkBlockCategories.length).fill(false),
        updateCounter: 0,
        blocksPerCategory: {},
        searchText: ""
    },
    mounted: function () {
        this.dispCategories[0] = true;
        this.updateCounter++;

        this.obtainBlocksPerCategory();
    },
    methods: {
        updateDOMs: function () {
            this.updateCounter++;
        },
        obtainBlocksPerCategory: function () {
            for (var i in this.bSummary) {
                for (var j = 0; j < this.bSummary[i].category.length; j++) {
                    if (this.bSummary[i].category[j] !== "") {
                        if (
                            typeof this.blocksPerCategory[
                                this.bSummary[i].category[j]
                            ] === "undefined"
                        ) {
                            this.blocksPerCategory[
                                this.bSummary[i].category[j]
                            ] = new Array();
                        }
                        this.blocksPerCategory[this.bSummary[i].category[j]].push(
                            this.bSummary[i]
                        );
                    }
                }
            }    
        },
        toggleCategoryDisplay: function (idx) {
            this.dispCategories[idx] = !this.dispCategories[idx];
            this.updateCounter++;
        },
        getBlockImage: function (block) {
            return (
                "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(
                    iconText.icon1 +
                    block.bg +
                    iconText.icon2 +
                    block.fg +
                    iconText.icon3 +
                    block.icon +
                    iconText.icon4
                )
            );
        }
    },
    watch: {
        searchText: function () {
            this.updateCounter++;
        }
    },
    updated: function () {
        var AllLibraryBlocks = document.getElementsByClassName(
            "libraryBlock"
        );
        for (var i = 0; i < AllLibraryBlocks.length; i++) {
            new blockOnDOM(AllLibraryBlocks[i]);
        }
    },
    computed: {
        searchResults: function () {
            var bSummaryArray = new Array();
            for (i in this.bSummary) {
                bSummaryArray.push(this.bSummary[i]);
            }
            return bSummaryArray.filter(function (item) {
                return (
                    item.name
                    .toLowerCase()
                    .indexOf(allTheBlocks.$data.searchText.toLowerCase()) >= 0 ||
                    item.keywords
                    .toLowerCase()
                    .indexOf(allTheBlocks.$data.searchText.toLowerCase()) >= 0 ||
                    item.description
                    .toLowerCase()
                    .indexOf(allTheBlocks.$data.searchText.toLowerCase()) >= 0
                );
            });
        }
    }
});
var editorForGraph = new Vue({
    el: "#editorForGraph",
    data: {
        graph: mainSystem.graph,
        outline: mainSystem.outline
    },
    mounted: function () {
        this.refreshGraph();
    },
    methods: {
        refreshGraph: function () {
            mainSystem.refresh();
        }
    }
});