window.MathJax = {
    tex: {
        inlineMath: [
            ['$', '$'],
            ['\\(', '\\)']
        ],
        displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"]
        ]
    },
    options: {
        renderActions: {
            addMenu: [],
            checkLoading: []
        }
    }
};
/*
MathJax.Hub.Config({
    showMathMenu: false,
    messageStyle: "none",
    menuSettings: {
        inTabOrder: false
    },
    extensions: ["tex2jax.js"],
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
        preview: "none",
        inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"]
        ],
        displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"]
        ]
    }
});
*/