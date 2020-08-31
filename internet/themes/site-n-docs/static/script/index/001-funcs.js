function closemodal(evt) {
  for (let i = 0; i < evt.path.length; i++) {
    if (!!evt.path[i].className && evt.path[i].className.indexOf("w3-modal") >= 0 && evt.path[i].className.indexOf("w3-modal-content") < 0) {
      evt.path[i].style.display = "none";
      break;
    }
  }
}

function openmodal(evt) {
  for (let i = 0; i < evt.path.length; i++) {
    if (!!evt.path[i].className &&
      evt.path[i].tagName === "DIV" &&
      !!evt.path[i].nextSibling &&
      !!evt.path[i].nextSibling.className &&
      evt.path[i].nextSibling.className.indexOf("w3-modal") >= 0) {
      evt.path[i].nextSibling.style.display = "block";
      break;
    }
  }
}