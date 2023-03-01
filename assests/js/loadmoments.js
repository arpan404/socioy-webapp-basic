const momentImage = document.querySelectorAll(".shared-feed-moment-image");
for (let i = 0; i < momentImage.length; i++) {
  momentImage[i].addEventListener("load", (e) => {
    momentImage[i].previousElementSibling.remove();
  });
  momentImage[i].addEventListener("error", (e) => {
    momentImage[i].style.display = "none";
  });
}
window.addEventListener("load", (event) => {
  for (let i = 0; i < momentImage.length; i++) {
    let isLoaded =
      momentImage[i].complete && momentImage[i].naturalHeight !== 0;
    if (isLoaded) {
      if (momentImage[i].previousElementSibling) {
        momentImage[i].previousElementSibling.remove();
      }
    }
  }
});
