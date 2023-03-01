const nextBtn = document.getElementById("moment-next-btn"),
  previousBtn = document.getElementById("moment-previous-btn"),
  momentContainer = document.querySelector(".users-shared-moments-container");
const checkScrollWidth = () => {
  const scrollWidth = momentContainer.scrollWidth;
  return scrollWidth;
};
document.body.onload=()=>{
  if (window.innerWidth < 600) {
    nextBtn.style.display = "none";
    previousBtn.style.display = "none";
  } else {
    let totalWidth = momentContainer.scrollWidth;
    let currentPositionLeft = momentContainer.scrollLeft;
    let difference = totalWidth - currentPositionLeft;
    if (difference === totalWidth) {
      previousBtn.style.display = "none";
      if (totalWidth > 600) {
        nextBtn.style.display = "flex";
      }
    } else if (difference < 600) {
      nextBtn.style.display = "none";
      if (difference < 600) {
        previousBtn.style.display = "flex";
      }
    } else {
      nextBtn.style.display = "flex";
      previousBtn.style.display = "flex";
    }
  }
}

if (checkScrollWidth() > 600) {
  if (window.innerWidth >= 600) {
    nextBtn.style.display = "flex";
  } else {
    previousBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
} else {
  nextBtn.style.display = "none";
  previousBtn.style.display = "none";
}

const momentScrollNext = () => {
  momentContainer.scrollBy(270, 0);
};
const momentScrollPrevious = () => {
  momentContainer.scrollBy(-270, 0);
};
nextBtn.addEventListener("click", () => {
  momentScrollNext();
});
previousBtn.addEventListener("click", () => {
  momentScrollPrevious();
});

momentContainer.addEventListener("scroll", () => {
  if (window.innerWidth >= 600) {
    let totalWidth = momentContainer.scrollWidth;
    let currentPositionLeft = momentContainer.scrollLeft;
    let difference = totalWidth - currentPositionLeft;
    if (difference === totalWidth) {
      previousBtn.style.display = "none";
      if (totalWidth > 600) {
        nextBtn.style.display = "flex";
      }
    } else if (difference < 600) {
      nextBtn.style.display = "none";
      if (difference < 600) {
        previousBtn.style.display = "flex";
      }
    } else {
      nextBtn.style.display = "flex";
      previousBtn.style.display = "flex";
    }
  } else {
    nextBtn.style.display = "none";
    previousBtn.style.display = "none";
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth < 600) {
    nextBtn.style.display = "none";
    previousBtn.style.display = "none";
  } else {
    let totalWidth = momentContainer.scrollWidth;
    let currentPositionLeft = momentContainer.scrollLeft;
    let difference = totalWidth - currentPositionLeft;
    if (difference === totalWidth) {
      previousBtn.style.display = "none";
      if (totalWidth > 600) {
        nextBtn.style.display = "flex";
      }
    } else if (difference < 600) {
      nextBtn.style.display = "none";
      if (difference < 600) {
        previousBtn.style.display = "flex";
      }
    } else {
      nextBtn.style.display = "flex";
      previousBtn.style.display = "flex";
    }
  }
});
