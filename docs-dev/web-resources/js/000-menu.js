(() => {
  let prevScrollpos = window.pageYOffset;
  window.onscroll = function () {
    const navbar = document.getElementById("myNavbar");
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
      let currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("TitleOnTop").style.display = "block";
        navbar.style.display = 'block';
        navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
      } else {
        navbar.style.display = 'none';
      }
      prevScrollpos = currentScrollPos;
      //console.log(currentScrollPos);
    } else {
      document.getElementById("TitleOnTop").style.display = "none";
      navbar.style.display = 'block';
      navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
    }
    //console.log(prevScrollpos);
  };
})()