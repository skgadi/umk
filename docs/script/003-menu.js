const menuVue = new Vue({
    el: "#tool-bar",
    data: {
        tools: menuText,
        statusVisible: 0 
    },
    methods: {
        showStatus: function(txt) {
            /*if (!!this.statusVisible) {
                this.removeStatus(this.statusVisible);
            }
            this.statusVisible = hintDisplay.addHint("<span><i class='fas fa-info-circle'></i>&nbsp;</span><span>"+txt+"</span>");
            */
        },
        removeStatus: function(){
            /*
            hintDisplay.removeHint(this.statusVisible);
            this.statusVisible=0;
            */
        }
    }
});