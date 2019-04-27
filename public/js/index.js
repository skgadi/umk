function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}
// Modal Image Gallery
function onClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
}

// Change style of navbar on scroll
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {myFunction()};
function myFunction() {
    var navbar = document.getElementById("myNavbar");
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
		var currentScrollPos = window.pageYOffset;
		if (prevScrollpos > currentScrollPos) {
			document.getElementById("TitleOnTop").style.display = "block";
			navbar.style.display = 'block';
			navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
		} else {
			navbar.style.display = 'none';
		}
		prevScrollpos = currentScrollPos;
    } else {
		document.getElementById("TitleOnTop").style.display = "none";
		navbar.style.display = 'block';
        navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
    }
}
