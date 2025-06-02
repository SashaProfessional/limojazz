const hamburgerIcon = document.querySelector(".top-bar .hamburger a");
const overlayMenu = document.querySelector(".overlay-menu");

hamburgerIcon.addEventListener("click", function (e) {
  e.preventDefault();

  overlayMenu.classList.toggle("open");

  const iconEl = hamburgerIcon.querySelector("i");

  if (overlayMenu.classList.contains("open")) {
    iconEl.classList.replace("fa-bars", "fa-times");
  } else {
    iconEl.classList.replace("fa-times", "fa-bars");
  }
});
