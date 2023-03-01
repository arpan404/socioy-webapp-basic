import proxy from "../proxy.js";

const mainDataBox = document.querySelector("#main-box-chat");
const chatBox = document.querySelector(".chat-box-main-chatting-box");
const sendBtn = document.querySelector("#send-btn");
const messageInputBox = document.querySelector("#message-field");
const searchField = document.querySelector(".chat-search-field");
const activeNowField = document.querySelector("#active-now-box");
const chatListContainer = document.querySelector("#chat-list-container");
const chatSearchContainer = document.querySelector("#chat-search-container");
const chatSearchStatus = document.querySelector(".search-status");
const chatSearchResults = document.querySelector(".chat-search-contents");
const chatBoxNameContainer = document.querySelector(
  ".chat-box-user-details-fullname-right-section"
);
const leftSection = document.querySelector(".chat-box-left-section");
const rightSection = document.querySelector(".chat-box-right-section");
const messageBackBtn = document.querySelector(".back-btn");
messageBackBtn.addEventListener("click", () => {
  leftSection.classList.add("active");
  rightSection.classList.remove("active");
});
const chatBoxUserNameContainer = document.querySelector(
  ".chat-box-user-details-username-right-section"
);
const messageUserProfile = document.querySelector("#right-image");

const myUID = mainDataBox.dataset.current;

const receiveMessages = () => {
  setInterval(() => {
    fetchRecievingMessage();
  }, 200);
};

const fetchRecievingMessage = () => {
  fetch(`${proxy}/api/chat/receivechats`, {
    method: "POST",
    body: JSON.stringify({
      user: mainDataBox.dataset.selecteduser,
      last: mainDataBox.dataset.last,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success" && data.results > 0) {
        let details = data.details.reverse();
        details.map((e) => {
          if (chatBox.querySelector(`[data-msg="${e.id}"]`) === null) {
            if (e.type === "normal") {
              chatBox.innerHTML += `
              <div class="chat-message-container received" data-msg="${e.id}">
              <div class="chat-message received">
                ${e.message}
              </div>
            </div>`;
            } else {
              chatBox.innerHTML += `
              <div class="chat-message-container received" data-msg="${e.id}">
              <div class="chat-message received" style="background-color: black">
              <i class="fa-solid fa-heart heart-emoji cursor-pointer select-none"></i>
              </div>
            </div>
              `;
            }
          }
          chatBox.scrollBy(0, chatBox.offsetHeight);
        });

        mainDataBox.dataset.last = details[details.length - 1].time;
      }
      if (data.status === "not success" || data.status === "failed") {
        window.location.reload();
      }
    });
};

const loadMessage = () => {
  chatBox.innerHTML = "";
  fetch(`${proxy}/api/chat/fetchchats`, {
    method: "POST",
    body: JSON.stringify({
      user: mainDataBox.dataset.selecteduser,
      type: "first",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success" && data.results > 0) {
        let details = data.details.reverse();
        mainDataBox.dataset.first = details[0].time;
        details.map((e) => {
          if (e.to === myUID) {
            if (e.type === "normal") {
              chatBox.innerHTML += `
              <div class="chat-message-container received" data-msg="${e.id}">
              <div class="chat-message received">
                ${e.message}
              </div>
            </div>`;
            } else {
              chatBox.innerHTML += `
              <div class="chat-message-container received" data-msg="${e.id}">
              <div class="chat-message received" style="background-color: black">
              <i class="fa-solid fa-heart heart-emoji cursor-pointer select-none"></i>
              </div>
            </div>
              `;
            }
          } else {
            if (e.type === "normal") {
              chatBox.innerHTML += `
              <div class="chat-message-container sent" data-msg="${e.id}">
              <div class="chat-message sent">
                ${e.message}
              </div>
            </div>`;
            } else {
              chatBox.innerHTML += `
              <div class="chat-message-container sent" data-msg="${e.id}">
              <div class="chat-message sent" style="background-color: black">
              <i class="fa-solid fa-heart heart-emoji cursor-pointer select-none"></i>
              </div>
            </div>
              `;
            }
          }
          chatBox.scrollBy(0, chatBox.offsetHeight);
        });
        mainDataBox.dataset.last = details[details.length - 1].time;
      }
      if (data.status === "not success" || data.status === "failed") {
        window.location.reload();
      }
      receiveMessages();
    });
};

const setEventToALl = () => {
  let selectionOptions = document.querySelectorAll(".chat-selection");
  for (let i = 0; i < selectionOptions.length; i++) {
    selectionOptions[i].addEventListener("click", (e) => {
      leftSection.classList.remove("active");
      rightSection.classList.add("active");
      rightSection.setAttribute("style","");
      let clickedUser = mainDataBox.dataset.selecteduser;
      if (e.target.dataset.hasOwnProperty("userid")) {
        if (clickedUser !== e.target.dataset.userid) {
          clickedUser = e.target.dataset.userid;
          mainDataBox.dataset.selecteduser = e.target.dataset.userid;

          chatBoxNameContainer.innerHTML =
            e.target.dataset.firstname + " " + e.target.dataset.lastname;
          chatBoxUserNameContainer.innerHTML = "@" + e.target.dataset.username;
          messageUserProfile.setAttribute(
            "src",
            `./cdn/${e.target.dataset.profile}`
          );
          loadMessage();
        }
      } else {
        let nearestParent = e.target.closest(`[data-userid]`);
        if (clickedUser !== nearestParent.dataset.userid) {
          mainDataBox.dataset.selecteduser = nearestParent.dataset.userid;
          chatBoxNameContainer.innerHTML =
            nearestParent.dataset.firstname +
            " " +
            nearestParent.dataset.lastname;
          chatBoxUserNameContainer.innerHTML =
            "@" + nearestParent.dataset.username;
          messageUserProfile.setAttribute(
            "src",
            `./cdn/${nearestParent.dataset.profile}`
          );
          loadMessage();
        }
      }
    });
  }
};

setEventToALl();

// chatting main finishes here

const sendMessage = (message, to, type) => {
  if (type === "normal") {
    chatBox.innerHTML += `
    <div class="chat-message-container sent">
    <div class="chat-message sent">
      ${message}
    </div>
  </div>
    `;
  } else {
    chatBox.innerHTML += `
    <div class="chat-message-container sent" >
    <div class="chat-message sent" style="background-color: black">
    <i class="fa-solid fa-heart heart-emoji cursor-pointer select-none"></i>
    </div>
  </div>
    `;

  }

  chatBox.scrollBy(0, chatBox.offsetHeight);
  fetch(`${proxy}/api/chat/sendmessage`, {
    method: "POST",
    body: JSON.stringify({
      message: message,
      messageTo: to,
      type: type,
    }),
  })
    .then((response) => response.json())
    .then((data) => {});
};

sendBtn.addEventListener("click", () => {
  if (sendBtn.dataset.type === "send") {
    sendMessage(
      messageInputBox.value,
      mainDataBox.dataset.selecteduser,
      "normal"
    );
    messageInputBox.value = "";
    messageInputBox.style.height = "37px";
    sendBtn.classList.add("fa-heart");
    sendBtn.classList.add("heart-emoji");
    sendBtn.classList.remove("fa-paper-plane");
    sendBtn.classList.remove("send-emoji");
    sendBtn.dataset.type = "heart";
  } else {
    sendMessage("Reaction", mainDataBox.dataset.selecteduser, "reaction");
  }
});

// sending messages finishes here

searchField.addEventListener("input", (e) => {
  if (e.target.value.length !== 0) {
    activeNowField.classList.remove("active");
    chatListContainer.classList.remove("active");
    chatSearchContainer.classList.add("active");
    searchUser(e.target.value);
  } else {
    chatSearchContainer.classList.remove("active");
    activeNowField.classList.add("active");
    chatListContainer.classList.add("active");
  }
});

const searchUser = (term) => {
  chatSearchResults.innerHTML = "";
  chatSearchStatus.innerHTML = "Searching ....";
  fetch(`${proxy}/api/searchchat`, {
    method: "POST",
    body: JSON.stringify({
      searchTerm: term,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.search.totalResults === 0) {
        chatSearchStatus.innerHTML = "No user found";
      } else {
        chatSearchStatus.innerHTML = "";

        data.search.results.map((e) => {
          if (
            chatSearchResults.querySelector(`[data-uid="${e.uid}"]`) === null
          ) {
            chatSearchResults.innerHTML += `<div class="message-box-container-left-section search chat-selection"  data-userid = "${
              e.uid
            }" data-profile="${e.profile}" data-firstname="${
              e.firstname
            }" data-lastname="${e.lastname}" data-username="${e.username}">
                      <div class="chat-box-left-chat-container search relative select-none">
                      <div class="chat-box-left-section-chat-box search">
                        <div class="chat-box-left-section-chat-box-profile-container search">
                          <img src="./cdn/${
                            e.profile
                          }" class="chat-box-left-section-chat-box-profile-image search" />
                        </div>
                        <div class="chat-box-left-section-chat-box-messgae-details-container search">
                          <div class="chat-box-left-section-chat-box-message-details-name search">${
                            e.firstname + " " + e.lastname
                          }</div>
                          <div class="chat-box-left-section-chat-box-message-details-message search">
                            <div class="chat-box-left-message-text search">
                           ${e.username}
                            </div>
                          </div>
  
                        </div>
                      </div>
                    </div>
                  </div>`;
          }
        });
      }
      setEventToALl();
    });
};

const messageBox = document.querySelector("#message-field");
const messageFieldContainer = document.querySelector(
  ".chat-box-main-chatting-box"
);
const messageBoxContainer = document.querySelector(
  ".chatting-options-container-main"
);

const homeBtn = document.querySelector("#home-btn");

homeBtn.addEventListener("click", () => {
  window.location.replace(proxy);
});
messageBox.addEventListener("input", () => {
  messageBox.style.height = "";
  messageBox.style.height = messageBox.scrollHeight + "px";
  messageFieldContainer.style.paddingBottom =
    messageBoxContainer.offsetHeight + 80 + "px";
  if (messageBox.value.length !== 0) {
    sendBtn.classList.remove("fa-heart");
    sendBtn.classList.remove("heart-emoji");
    sendBtn.classList.add("fa-paper-plane");
    sendBtn.classList.add("send-emoji");
    sendBtn.dataset.type = "send";
  } else {
    sendBtn.classList.add("fa-heart");
    sendBtn.classList.add("heart-emoji");
    sendBtn.classList.remove("fa-paper-plane");
    sendBtn.classList.remove("send-emoji");
    sendBtn.dataset.type = "heart";
  }
});

const mainDataContainer = document.querySelector("#main-box-chat");
const userDetailRightSectionContainer = document.querySelector(
  ".chat-box-user-details-container"
);
userDetailRightSectionContainer.addEventListener("click", () => {
  window.location.href = `${proxy}/profile?uid=${mainDataContainer.dataset.selecteduser}`;
});

// ui
