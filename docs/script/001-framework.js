// Executes all the callbacks registered in windResizeCallbacks
window.addEventListener('resize', (event) => {
    windResizeCallbacks.forEach(cBack => {
        cBack(event);
    });
});
//Handles the keyboard shortcuts
(() => {
    menu.forEach((ele) => {
        ele.subMenu.forEach((ele2) => {
            
        });
    })
})();