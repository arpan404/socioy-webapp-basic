import proxy from "./proxy.js";

const editProfileImagePicker = document.querySelector(
  ".edit-profile-file-input"
);
const editProfileImageElement = document.querySelector(
  ".edit-profile-profile-image"
);
let originalProfileImage = editProfileImageElement.getAttribute("src");
const saveChangesButton = document.querySelector(
  ".edit-profile-save-changes-button"
);

const editPasswordFieldOld = document.querySelector(
  "#edit-profile-old-password"
);
const editPasswordFieldNew = document.querySelector(
  "#edit-profile-new-password"
);
const editErrorContainer = document.querySelector(
  ".edit-profile-password-error-container"
);
const editCloseModalButton = document.querySelector(".profile-edit-close-btn");
const editIconProfile = document.querySelector("#profile-edit-button");
const editModalOverlay = document.querySelector(".edit-overlay");
const editModal = document.querySelector(
  ".edit-profile-main-container-section"
);
const checkWhenToShowSaveButton = () => {
  if (
    editProfileImagePicker.files[0] ||
    (editPasswordFieldNew.value.length > 0 &&
      editPasswordFieldOld.value.length > 0)
  ) {
    saveChangesButton.value = "Save Changes";
    saveChangesButton.classList.remove("not-edited-save-changes-button");
  } else {
    saveChangesButton.value = "Cancel";
    saveChangesButton.classList.add("not-edited-save-changes-button");
  }
};
editPasswordFieldNew.addEventListener("input", () => {
  editPasswordFieldNew.value = editPasswordFieldNew.value.trim();
  checkWhenToShowSaveButton();
});
editPasswordFieldOld.addEventListener("input", () => {
  editPasswordFieldOld.value = editPasswordFieldOld.value.trim();
  checkWhenToShowSaveButton();
});
editCloseModalButton.addEventListener("click", () => {
  closeEditModal();
});
editPasswordFieldOld.addEventListener("focusout", () => {
  document.body.scrollTop = 0;
  document.body.style.overflow = "hidden";
  document.body.style.overflowY = "hidden";
});
editPasswordFieldNew.addEventListener("focusout", () => {
  document.body.scrollTop = 0;
  document.body.style.overflow = "hidden";
  document.body.style.overflowY = "hidden";
});
editIconProfile.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.body.style.overflow = "hidden";
  document.body.style.overflowY = "hidden";
  editProfileImagePicker.value = "";
  editErrorContainer.innerHTML = "";
  saveChangesButton.value = "Cancel";
  saveChangesButton.classList.add("not-edited-save-changes-button");
  editPasswordFieldOld.value = "";
  editPasswordFieldNew.value = "";
  editModalOverlay.classList.add("active");
  editModal.style.display = "flex";
  editProfileImageElement.setAttribute("src", originalProfileImage);
});

saveChangesButton.addEventListener("click", () => {
  if (saveChangesButton.value === "Save Changes") {
    saveChangesButton.value = "Saving Changes";
    saveChangesButton.style.cursor = "wait";
    if (
      editProfileImagePicker.files[0] &&
      (editPasswordFieldNew.value === "" ||
        editPasswordFieldNew.value === " ") &&
      (editPasswordFieldOld.value === "" || editPasswordFieldOld.value === " ")
    ) {
      uploadProfileImage();
    } else if (
      editPasswordFieldOld.value.length > 0 &&
      editPasswordFieldNew.value.length > 0 &&
      !editProfileImagePicker.files[0]
    ) {
      changePassword();
    } else if (
      editPasswordFieldOld.value.length > 0 &&
      editPasswordFieldNew.value.length > 0 &&
      editProfileImagePicker.files[0]
    ) {
      changeProfileAndPassword();
    } else {
      saveChangesButton.value = "Cancel";
      saveChangesButton.style.cursor = "pointer";
    }
  } else {
    closeEditModal();
  }
});

editProfileImagePicker.onchange = (e) => {
  editProfileImageElement.setAttribute(
    "src",
    URL.createObjectURL(editProfileImagePicker.files[0])
  );
  saveChangesButton.classList.remove("not-edited-save-changes-button");
  saveChangesButton.value = "Save Changes";
};

const changeProfileAndPassword = () => {
  saveChangesButton.value = "Saving Changes";
  saveChangesButton.style.cursor = "wait";
  editPasswordFieldOld.disabled = true;
  editPasswordFieldNew.disabled = true;
  const profileImageFormData = new FormData();
  profileImageFormData.append("profileImage", editProfileImagePicker.files[0]);
  fetch(`${proxy}/api/profileupload`, {
    method: "POST",
    body: profileImageFormData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        originalProfileImage = "./cdn/" + data.profile;
        editProfileImageElement.setAttribute("src", originalProfileImage);
        document
          .querySelector(".user-profile-image")
          .setAttribute("src", originalProfileImage);
        if (document.querySelectorAll(".shared-by-user-image")) {
          let userSharedMomentProfile = document.querySelectorAll(
            ".shared-by-user-image"
          );
          for (let i = 0; i < userSharedMomentProfile.length; i++) {
            userSharedMomentProfile[i].setAttribute(
              "src",
              originalProfileImage
            );
          }
        }

        if (editPasswordFieldNew.value.length < 8) {
          editErrorContainer.innerHTML =
            "<span>New password must be at least 8 character long.</span>";
        } else if (editPasswordFieldOld.value.length < 8) {
          editErrorContainer.innerHTML =
            "<span>You have entered wrong password.</span>";
        } else {
          fetch(`${proxy}/api/changepassword`, {
            method: "POST",
            body: JSON.stringify({
              newPassword: editPasswordFieldNew.value,
              password: editPasswordFieldOld.value,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "failed") {
                editErrorContainer.innerHTML =
                  "<span>You have entered wrong password.</span>";
                saveChangesButton.value = "Save Changes";
                saveChangesButton.classList.remove(
                  "not-edited-save-changes-button"
                );
              } else if (data.status === "success") {
                SetCookies("token", data.token);
                editErrorContainer.innerHTML =
                  "<span class ='success'>Changes are saved successfully.</span>";
                setTimeout(() => {
                  editErrorContainer.innerHTML = "";
                }, 2000);
                saveChangesButton.value = "Close";
                saveChangesButton.classList.add(
                  "not-edited-save-changes-button"
                );
                saveChangesButton.style.cursor = "pointer";
                editPasswordFieldNew.value = "";
                editPasswordFieldOld.value = "";
              } else {
                editErrorContainer.innerHTML =
                  "<span class ='success'>Something went wrong. Try again.</span>";
                saveChangesButton.value = "Save Changes";
                saveChangesButton.classList.remove(
                  "not-edited-save-changes-button"
                );
              }
            });
        }
        saveChangesButton.classList.add("not-edited-save-changes-button");
      } else {
        saveChangesButton.value = "Cancel";
        saveChangesButton.classList.add("not-edited-save-changes-button");
        editErrorContainer.innerHTML =
          "<span>Something went wrong. Try again.</span>";
      }
      saveChangesButton.style.cursor = "pointer";
      editPasswordFieldOld.disabled = false;
      editPasswordFieldNew.disabled = false;
    });
};
const changePassword = () => {
  editPasswordFieldOld.disabled = true;
  editPasswordFieldNew.disabled = true;
  if (editPasswordFieldNew.value.length < 8) {
    editErrorContainer.innerHTML =
      "<span>New password must be at least 8 character long.</span>";
    saveChangesButton.value = "Save Changes";
    saveChangesButton.classList.remove("not-edited-save-changes-button");
    saveChangesButton.style.cursor = "pointer";
  } else if (editPasswordFieldOld.value.length < 8) {
    editErrorContainer.innerHTML =
      "<span>You have entered wrong password.</span>";
    saveChangesButton.value = "Save Changes";
    saveChangesButton.classList.remove("not-edited-save-changes-button");
    saveChangesButton.style.cursor = "pointer";
  } else {
    fetch(`${proxy}/api/changepassword`, {
      method: "POST",
      body: JSON.stringify({
        newPassword: editPasswordFieldNew.value,
        password: editPasswordFieldOld.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "failed") {
          editErrorContainer.innerHTML =
            "<span>You have entered wrong password.</span>";
          saveChangesButton.value = "Save Changes";
          saveChangesButton.classList.remove("not-edited-save-changes-button");
          saveChangesButton.style.cursor = "pointer";
        } else if (data.status === "success") {
          SetCookies("token", data.token);
          editErrorContainer.innerHTML =
            "<span class ='success'>Your password has changed.</span>";
          setTimeout(() => {
            editErrorContainer.innerHTML = "";
          }, 2000);
          saveChangesButton.value = "Close";
          saveChangesButton.style.cursor = "pointer";
          editPasswordFieldNew.value = "";
          editPasswordFieldOld.value = "";
        } else {
          editErrorContainer.innerHTML =
            "<span class ='success'>Something went wrong. Try again.</span>";
          saveChangesButton.value = "Save Changes";
          saveChangesButton.style.cursor = "pointer";
        }
      });
  }
  editPasswordFieldOld.disabled = false;
  editPasswordFieldNew.disabled = false;
};
const uploadProfileImage = () => {
  saveChangesButton.value = "Saving Changes";
  saveChangesButton.style.cursor = "wait";
  editPasswordFieldOld.disabled = true;
  editPasswordFieldNew.disabled = true;
  const profileImageFormData = new FormData();
  profileImageFormData.append("profileImage", editProfileImagePicker.files[0]);
  fetch(`${proxy}/api/profileupload`, {
    method: "POST",
    body: profileImageFormData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        originalProfileImage = "./cdn/" + data.profile;
        editProfileImageElement.setAttribute("src", originalProfileImage);
        document
          .querySelector(".user-profile-image")
          .setAttribute("src", originalProfileImage);
        if (document.querySelectorAll(".shared-by-user-image")) {
          let userSharedMomentProfile = document.querySelectorAll(
            ".shared-by-user-image"
          );
          for (let i = 0; i < userSharedMomentProfile.length; i++) {
            userSharedMomentProfile[i].setAttribute(
              "src",
              originalProfileImage
            );
          }
        }
        editErrorContainer.innerHTML =
          "<span class='success'>Your profile picture has been uploaded.</span>";
        setTimeout(() => {
          editErrorContainer.innerHTML = "";
        }, 5000);
        saveChangesButton.value = "Close";
        saveChangesButton.classList.add("not-edited-save-changes-button");
      } else {
        saveChangesButton.value = "Cancel";
        saveChangesButton.classList.add("not-edited-save-changes-button");
        editErrorContainer.innerHTML =
          "<span>Something went wrong. Try again.</span>";
      }
      saveChangesButton.style.cursor = "pointer";
      editPasswordFieldOld.disabled = false;
      editPasswordFieldNew.disabled = false;
    });
};

const closeEditModal = () => {
  document.body.style.overflow = "scroll";
  document.body.style.overflowY = "scroll";
  editProfileImagePicker.value = "";
  editErrorContainer.innerHTML = "";
  saveChangesButton.value = "Cancel";
  saveChangesButton.classList.add("not-edited-save-changes-button");
  editPasswordFieldOld.value = "";
  editPasswordFieldNew.value = "";
  editModalOverlay.classList.remove("active");
  editModal.style.display = "none";
  editProfileImageElement.setAttribute("src", originalProfileImage);
};
function SetCookies(cname, cvalue, exdays = 30) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie =
    cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Strict";
}
