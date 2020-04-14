// Executes all the callbacks registered in windResizeCallbacks
window.addEventListener('resize', (event) => {
    windResizeCallbacks.forEach(cBack => {
        cBack(event);
    });
});
