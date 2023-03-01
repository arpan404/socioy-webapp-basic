import proxy from "./proxy.js";
import alterSearchResultBox from "./search.js";
const siteName = document.getElementById("site-name");
const searchBtnMobile = document.querySelector("#nav-search-btn");
const backBtn = document.getElementById("back-btn-search");
const mobileClearBtn = document.getElementById("clear-btn-mobile");
const searchFieldMobile = document.getElementById("search-field-mobile");
const clearBtn = document.getElementById("clear-btn");
const searchField = document.getElementById("search-field");
clearBtn.style.display = "none";
const searchCloseBtn = document.getElementById("search-close-btn");
const searchResultContainer = document.getElementById(
  "search-result-container"
);
const searchContentContainer = document.getElementById(
  "search-content-container"
);
searchField.addEventListener("focus", () => {
  searchResultContainer.style.display = "flex";
  searchContentContainer.style.display = "block";
});

searchCloseBtn.addEventListener("click", () => {
  document.body.style.overflow = "scroll";
  searchResultContainer.style.display = "none";
  searchContentContainer.style.display = "none";
  searchFieldMobile.value = "";
  mobileClearBtn.style.display = "none";
  searchField.value = "";
  clearBtn.style.display = "none";
  document
    .getElementById("nav-contents-container")
    .classList.remove("hide-for-showing-search-mbl");
  document
    .getElementById("mobile-search-container")
    .classList.remove("show-search-mobile");
  alterSearchResultBox("", "initial");
});

searchField.addEventListener("input", () => {
  if (searchField.value.length !== 0) {
    clearBtn.style.display = "block";
    mobileClearBtn.style.display = "block";
    alterSearchResultBox(searchField.value, "search");
  } else {
    clearBtn.style.display = "none";
    mobileClearBtn.style.display = "none";
    alterSearchResultBox("", "initial");
  }
  searchFieldMobile.value = searchField.value;
});

clearBtn.addEventListener("click", () => {
  searchField.value = "";
  clearBtn.style.display = "none";
  searchFieldMobile.value = "";
  mobileClearBtn.style.display = "none";
  searchField.focus();
  alterSearchResultBox("", "initial");
});

siteName.addEventListener("click", () => {
  window.location.href = proxy;
});

searchBtnMobile.addEventListener("click", () => {
  document.body.style.overflow = "hidden";
  document
    .getElementById("nav-contents-container")
    .classList.add("hide-for-showing-search-mbl");
  document
    .getElementById("mobile-search-container")
    .classList.add("show-search-mobile");
  if (searchFieldMobile.value.length !== 0) {
    mobileClearBtn.style.display = "block";
  } else {
    mobileClearBtn.style.display = "none";
    alterSearchResultBox("", "initial");
  }
  searchFieldMobile.focus();
  searchResultContainer.style.display = "flex";
  searchContentContainer.style.display = "block";
});

backBtn.addEventListener("click", () => {
  document
    .getElementById("nav-contents-container")
    .classList.remove("hide-for-showing-search-mbl");
  document
    .getElementById("mobile-search-container")
    .classList.remove("show-search-mobile");
  searchFieldMobile.value = "";
  searchField.value = "";
  mobileClearBtn.style.display = "none";
  clearBtn.style.display = "none";
  searchResultContainer.style.display = "none";
  searchContentContainer.style.display = "none";
  document.body.style.overflow = "scroll";
  alterSearchResultBox("", "initial");
});

searchFieldMobile.addEventListener("input", () => {
  if (searchFieldMobile.value.length !== 0) {
    mobileClearBtn.style.display = "block";
    clearBtn.style.display = "block";
    alterSearchResultBox(searchFieldMobile.value, "search");
  } else {
    mobileClearBtn.style.display = "none";
    clearBtn.style.display = "none";
    alterSearchResultBox("", "initial");
  }
  searchField.value = searchFieldMobile.value;
});
searchFieldMobile.addEventListener("focusout", () => {
  document.body.style.overflow = "hidden";
});

mobileClearBtn.addEventListener("click", () => {
  searchFieldMobile.value = "";
  mobileClearBtn.style.display = "none";
  searchField.value = "";
  clearBtn.style.display = "none";
  searchFieldMobile.focus();
  alterSearchResultBox("", "initial");
});

window.addEventListener("resize", () => {
  if (window.screen.width <= 700) {
    if (
      searchResultContainer.style.display === "flex" &&
      searchContentContainer.style.display === "block"
    ) {
      document.body.style.overflow = "hidden";
      document
        .getElementById("nav-contents-container")
        .classList.add("hide-for-showing-search-mbl");
      document
        .getElementById("mobile-search-container")
        .classList.add("show-search-mobile");

      if (searchFieldMobile.value.length !== 0) {
        mobileClearBtn.style.display = "block";
      } else {
        mobileClearBtn.style.display = "none";
      }
      searchFieldMobile.focus();
      searchResultContainer.style.display = "flex";
      searchContentContainer.style.display = "block";
    }
  } else {
    if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "scroll";
    }
  }
});
