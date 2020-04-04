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
});*/

function updateMathJax() {
    MathJax.typesetPromise();
    //MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

/**/