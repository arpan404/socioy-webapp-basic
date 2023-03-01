import proxy from "./proxy.js";

let postKey = 1;
const inputMomentBtn = document.getElementById("moment-file-picker");
const postBoxContainer = document.querySelector(".moment-post-box-container");
const uploadImage = document.getElementById("moment-upload-image");
const caption = document.querySelector(".moment-upload-caption");
const countContainer = document.querySelector(".upload-letter-count");
const cancelButton = document.querySelector(".moment-cancel-button");
const overlay = document.querySelector(".overlay-for-post-modal");
const checkBox = document.querySelector("#post-to-option");
const uploadMomentButton = document.querySelector("#upload-moment-button");
let captionData = "";
const momentFeedContainer = document.querySelector(
  ".shared-feed-moments-main-container"
);
const profileImageElement = document.querySelector(".moment-self-user-profile");
uploadMomentButton.addEventListener("click", () => {
  const isMomentPrivate = checkBox.checked;
  const momentImage = inputMomentBtn.files[0];
  const momentCaption = caption.value;
  const momentFormData = new FormData();
  momentFormData.append("isPrivate", isMomentPrivate);
  momentFormData.append("momentImage", momentImage);
  momentFormData.append("caption", momentCaption);
  momentFormData.append("key", postKey);
  overlay.classList.remove("active");
  document.body.style.overflow = "scroll";
  uploadImage.removeAttribute("src");
  postBoxContainer.style.display = "none";
  checkBox.checked = false;
  countContainer.style.display = "none";
  countContainer.innerHTML = `0 / 100`;
  const newElement = document.createElement("div");
  newElement.setAttribute("data-key", postKey);
  momentFeedContainer.insertBefore(newElement, momentFeedContainer.children[0]);
  document.querySelector(
    `[data-key="${postKey}"]`
  ).innerHTML = `<div class="shared-feed-moment-container">
  <div class="shared-by-user-details">
    <div class="shared-by-user-image-container">
      <img src="${profileImageElement.getAttribute(
        "src"
      )}" class="shared-by-user-image" />
    </div>
    <div class="shared-by-name-container">
      <div class="shared-by-user-full-name">${
        profileImageElement.dataset.name
      }</div>
      <div class="shared-by-user-username">@${
        profileImageElement.dataset.username
      }</div>
    </div>
  </div>
  <div class="shared-feed-moment-image-container">
  <div></div>
    <img
      class="shared-feed-moment-image"
      src=${URL.createObjectURL(momentImage)}
    />
  </div>
  <div class="shared-feed-moment-caption-container">
    <div class="shared-feed-moment-caption">
    </div>
  </div>
  <div class="shared-feed-moment-time-container">
    <div class="shared-feed-moment-time uploading-text select-none">Uploading </div>
  </div>
</div>`;
  document.querySelector(
    `[data-key="${postKey}"] > .shared-feed-moment-container > .shared-feed-moment-caption-container > .shared-feed-moment-caption`
  ).innerHTML = momentCaption.trim();

  inputMomentBtn.value = "";
  caption.value = "";
  captionData = "";

  fetch(`${proxy}/api/post/uploadmoment`, {
    method: "POST",
    body: momentFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        document
          .querySelector(
            `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-image-container > .shared-feed-moment-image`
          )
          .setAttribute("src", proxy + "/cdn/" + data.data.imageName);
        document.querySelector(
          `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-time-container > .shared-feed-moment-time`
        ).innerHTML = "Just Now";
        document
          .querySelector(
            `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-time-container > .shared-feed-moment-time`
          )
          .classList.remove("uploading-text");
      } else {
        if (data.status === "access denied") {
          alert("Something went wrong. Try again later.");
        } else if (data.status === "failed") {
          if (data.message === "image upload failed") {
            document.querySelector(
              `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-time-container > .shared-feed-moment-time`
            ).innerHTML = "Failed to upload your moment";
            document
              .querySelector(
                `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-time-container > .shared-feed-moment-time`
              )
              .classList.remove("uploading-text");
            document
              .querySelector(
                `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-time-container > .shared-feed-moment-time`
              )
              .classList.add("failed-text");
          } else if (data.message === "image is too large") {
            document.querySelector(
              `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-time-container > .shared-feed-moment-time`
            ).innerHTML = "Failed to upload due to large file size";
            document
              .querySelector(
                `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-time-container > .shared-feed-moment-time`
              )
              .classList.remove("uploading-text");
            document
              .querySelector(
                `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-time-container > .shared-feed-moment-time`
              )
              .classList.add("failed-text");
          } else if (data.message === "extension not allowed") {
            document.querySelector(
              `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-time-container > .shared-feed-moment-time`
            ).innerHTML = "Failed to upload due to unsupported file type";
            document
              .querySelector(
                `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-time-container > .shared-feed-moment-time`
              )
              .classList.remove("uploading-text");
            document
              .querySelector(
                `[data-key="${data.key}"] > .shared-feed-moment-container > .shared-feed-moment-time-container > .shared-feed-moment-time`
              )
              .classList.add("failed-text");
          }
        }
      }
    })
    .catch((err) => {
      return;
    });
  postKey++;
});

cancelButton.addEventListener("click", () => {
  overlay.classList.remove("active");
  document.body.style.overflow = "scroll";
  uploadImage.removeAttribute("src");
  postBoxContainer.style.display = "none";
  checkBox.checked = false;
  countContainer.style.display = "none";
  countContainer.innerHTML = `0 / 100`;
  captionData = "";
  caption.value = "";
  inputMomentBtn.value = "";
});

inputMomentBtn.onchange = (e) => {
  uploadImage.setAttribute("src", URL.createObjectURL(inputMomentBtn.files[0]));
  postBoxContainer.style.display = "flex";
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
};

caption.addEventListener("input", () => {
  if (caption.value.trim().length <= 200) {
    captionData = caption.value;
    countContainer.innerHTML = `${caption.value.trim().length} / 200`;
  } else {
    caption.value = captionData;
    countContainer.innerHTML = `${caption.value.trim().length} / 200`;
  }
  if (caption.value.trim().length === 200) {
    countContainer.style.color = "rgb(255, 54, 54)";
  } else {
    countContainer.style.color = "rgb(216, 216, 216)";
  }
  if (caption.value.trim().length === 0) {
    countContainer.style.display = "none";
  } else {
    countContainer.style.display = "block";
  }
});
caption.addEventListener("focusout", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.body.style.overflow = "hidden";
});
