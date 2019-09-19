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

        //Obtaining blocksPerCategory var
        for (var i = 0; i < this.bSummary.length; i++) {
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
    methods: {
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
        var tempDOMSToRemove = document.getElementsByClassName(
            "tempAllLibraryBlocks"
        );
        while (tempDOMSToRemove[0]) {
            console.log(tempDOMSToRemove[0]);
            tempDOMSToRemove[0].parentNode.removeChild(tempDOMSToRemove[0]);
        }
        var AllLibraryBlocks = document.getElementsByClassName(
            "libraryBlock"
        );
        for (var i = 0; i < AllLibraryBlocks.length; i++) {
            var img = AllLibraryBlocks[i];
            var dragElt = document.createElement("div");
            dragElt.classList.add("tempAllLibraryBlocks");
            dragElt.style.border =
                "dashed " + img.getAttribute("umk_color") + " 1px";
            dragElt.style.width = img.getAttribute("umk_width") + "px";
            dragElt.style.height = img.getAttribute("umk_height") + "px";
            var ds = mxUtils.makeDraggable(
                img,
                mainSystem.graph,
                function () {},
                dragElt,
                0,
                0,
                true,
                true
            );
            ds.setGuidesEnabled(mainSystem.graph.guidesEnabled);
        }
    },
    computed: {
        searchResults: function () {
            return this.bSummary.filter(function (item) {
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
        graph: mainSystem.graph
    },
    mounted: function () {
        this.refreshGraph();
    },
    methods: {
        refreshGraph: function () {
            mainSystem.graph.setBackgroundColor();
            mainSystem.graph.refresh();
        }
    }
});