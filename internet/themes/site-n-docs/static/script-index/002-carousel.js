(() => {
  let i = Math.round(9*Math.random());
  setInterval(changeImageForCarousel, 10000);
  function changeImageForCarousel() {
    document.getElementById("home").style.backgroundImage = 'url("/images/index/' + i + '.jpg")';
    i++;
    if (i > 9) {
      i = 1;
    }
  }
  changeImageForCarousel();
})();