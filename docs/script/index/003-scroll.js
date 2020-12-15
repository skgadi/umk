//const $navigationLinks = document.querySelectorAll('#local-nav-links > a');
(() => {


  // cache the navigation links 
  var $navigationLinks = $('#local-nav-links > a');
  // cache (in reversed order) the sections
  var $sections = $($(".section").get().reverse());

  // map each section id to their corresponding navigation link
  var sectionIdTonavigationLink = {};
  $sections.each(function () {
    var id = $(this).attr('id');
    sectionIdTonavigationLink[id] = $('#local-nav-links > a[href=\\#' + id + ']');
  });

  // throttle function, enforces a minimum time interval
  function throttle(fn, interval) {
    var lastCall, timeoutId;
    return function () {
      var now = new Date().getTime();
      if (lastCall && now < (lastCall + interval)) {
        // if we are inside the interval we wait
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
          lastCall = now;
          fn.call();
        }, interval - (now - lastCall));
      } else {
        // otherwise, we directly call the function 
        lastCall = now;
        fn.call();
      }
    };
  }

  function highlightNavigation() {
    // get the current vertical position of the scroll bar
    var scrollPosition = $(window).scrollTop();

    // iterate the sections
    $sections.each(function () {
      var currentSection = $(this);
      // get the position of the section
      var sectionTop = currentSection.offset().top-10;

      // if the user has scrolled over the top of the section  
      if (scrollPosition >= sectionTop) {
        // get the section id
        var id = currentSection.attr('id');
        // get the corresponding navigation link
        var $navigationLink = sectionIdTonavigationLink[id];
        // if the link is not active-nav-item
        if (!$navigationLink.hasClass('active-nav-item')) {
          // remove .active-nav-item class from all the links
          $navigationLinks.removeClass('active-nav-item');
          // add .active-nav-item class to the current link
          $navigationLink.addClass('active-nav-item');
        }
        // we have found our section, so we return false to exit the each loop
        return false;
      }
    });
  }

  $(window).scroll(throttle(highlightNavigation, 100));

  // if you don't want to throttle the function use this instead:
  // $(window).scroll( highlightNavigation );
})();