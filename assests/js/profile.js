import proxy from "./proxy.js";
const uid = document.querySelector(".user-profile-username").dataset.uid;
const followingContainer = document.querySelector(
  ".user-profile-following-container"
);
const followerContainer = document.querySelector(
  ".user-profile-follower-container"
);
const dataContainer = document.querySelector(
  ".following-follower-data-main-container"
);
const closeFollowDataBtn = document.querySelector(".following-close-btn");
const overlayFollow = document.querySelector(".follow-overlay");
const titleModalText = document.querySelector(".following-follow-text");
const dataContainerBox = document.querySelector(".data-main-container");
closeFollowDataBtn.addEventListener("click", () => {
  dataContainer.style.display = "none";
  overlayFollow.classList.remove("active");
  document.body.style.overflowY = "scroll";
  document.body.style.overflow = "scroll";
  dataContainerBox.innerHTML = "";
});
followingContainer.addEventListener("click", () => {
  dataContainerBox.innerHTML = "";
  dataContainerBox.innerHTML = "";
  let newLoaderContainer = document.createElement("div");
  newLoaderContainer.setAttribute("class", "loader-container-follower-data");
  dataContainerBox.appendChild(newLoaderContainer, dataContainer.children[0]);
  dataContainerBox.style.alignItems = "center";
  dataContainerBox.style.justifyContent = "center";
  document.querySelector(".loader-container-follower-data").innerHTML = `
    <svg version="1.1" id="L1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
        <circle fill="none" stroke="#d9d9d9" stroke-width="6" stroke-miterlimit="15" stroke-dasharray="14.2472,14.2472" cx="50" cy="50" r="47" >
          <animateTransform 
             attributeName="transform" 
             attributeType="XML" 
             type="rotate"
             dur="5s" 
             from="0 50 50"
             to="360 50 50" 
             repeatCount="indefinite" />
      </circle>
      <circle fill="none" stroke="#d9d9d9" stroke-width="1" stroke-miterlimit="10" stroke-dasharray="10,10" cx="50" cy="50" r="39">
          <animateTransform 
             attributeName="transform" 
             attributeType="XML" 
             type="rotate"
             dur="5s" 
             from="0 50 50"
             to="-360 50 50" 
             repeatCount="indefinite" />
      </circle>
      <g fill="#d9d9d9">
      <rect x="30" y="35" width="5" height="30">
        <animateTransform 
           attributeName="transform" 
           dur="1s" 
           type="translate" 
           values="0 5 ; 0 -5; 0 5" 
           repeatCount="indefinite" 
           begin="0.1"/>
      </rect>
      <rect x="40" y="35" width="5" height="30" >
        <animateTransform 
           attributeName="transform" 
           dur="1s" 
           type="translate" 
           values="0 5 ; 0 -5; 0 5" 
           repeatCount="indefinite" 
           begin="0.2"/>
      </rect>
      <rect x="50" y="35" width="5" height="30" >
        <animateTransform 
           attributeName="transform" 
           dur="1s" 
           type="translate" 
           values="0 5 ; 0 -5; 0 5" 
           repeatCount="indefinite" 
           begin="0.3"/>
      </rect>
      <rect x="60" y="35" width="5" height="30" >
        <animateTransform 
           attributeName="transform" 
           dur="1s" 
           type="translate" 
           values="0 5 ; 0 -5; 0 5"  
           repeatCount="indefinite" 
           begin="0.4"/>
      </rect>
      <rect x="70" y="35" width="5" height="30" >
        <animateTransform 
           attributeName="transform" 
           dur="1s" 
           type="translate" 
           values="0 5 ; 0 -5; 0 5" 
           repeatCount="indefinite" 
           begin="0.5"/>
      </rect>
      </g>
    </svg>`;
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  titleModalText.innerHTML = "Following";
  dataContainer.style.display = "flex";
  overlayFollow.classList.add("active");
  document.body.style.overflowY = "hidden";
  document.body.style.overflow = "hidden";

  fetch(`${proxy}/api/followers`, {
    method: "POST",
    body: JSON.stringify({
      type: "followings",
      uid: uid,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        if (data.total === 0) {
          dataContainerBox.innerHTML = "";
          dataContainerBox.innerHTML =
            "<div class='no-follower-text'>User is not following anyone</div>";
        } else {
          dataContainerBox.innerHTML = "";
          dataContainerBox.setAttribute(
            "style",
            "display:flex;align-items:start;"
          );
          dataContainerBox.innerHTML =
            "<div class='data-container-for-follower-data-list'></div>";
          const containerForData = document.querySelector(
            ".data-container-for-follower-data-list"
          );

          data.details.map((e) => {
            containerForData.innerHTML += `
              <div class="result-user-container following-user-result-container" style="max-height:fit-content">
              <a href="/profile?uid=${e.uid}" class="link-to-user">
                <div class="result-account-container">
                  <img src="./cdn/${e.profile}" class="result-user-profile" />
                  <div class="result-user-details-container">
                    <div class="result-name-container">
                      <span>${e.firstname}</span>
                      <span>${e.lastname}</span>
                    </div>
                    <div class="result-username">@${e.username}</div>
                  </div>
                </div>
              </a>
            </div>
              `;
          });
          dataContainerBox.innerHTML;
        }
      }
    });
});
followerContainer.addEventListener("click", () => {
  dataContainerBox.innerHTML = "";
  dataContainerBox.innerHTML = "";
  let newLoaderContainer = document.createElement("div");
  newLoaderContainer.setAttribute("class", "loader-container-follower-data");
  dataContainerBox.appendChild(newLoaderContainer, dataContainer.children[0]);
  dataContainerBox.style.alignItems = "center";
  dataContainerBox.style.justifyContent = "center";
  document.querySelector(".loader-container-follower-data").innerHTML = `
  <svg version="1.1" id="L1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
      <circle fill="none" stroke="#d9d9d9" stroke-width="6" stroke-miterlimit="15" stroke-dasharray="14.2472,14.2472" cx="50" cy="50" r="47" >
        <animateTransform 
           attributeName="transform" 
           attributeType="XML" 
           type="rotate"
           dur="5s" 
           from="0 50 50"
           to="360 50 50" 
           repeatCount="indefinite" />
    </circle>
    <circle fill="none" stroke="#d9d9d9" stroke-width="1" stroke-miterlimit="10" stroke-dasharray="10,10" cx="50" cy="50" r="39">
        <animateTransform 
           attributeName="transform" 
           attributeType="XML" 
           type="rotate"
           dur="5s" 
           from="0 50 50"
           to="-360 50 50" 
           repeatCount="indefinite" />
    </circle>
    <g fill="#d9d9d9">
    <rect x="30" y="35" width="5" height="30">
      <animateTransform 
         attributeName="transform" 
         dur="1s" 
         type="translate" 
         values="0 5 ; 0 -5; 0 5" 
         repeatCount="indefinite" 
         begin="0.1"/>
    </rect>
    <rect x="40" y="35" width="5" height="30" >
      <animateTransform 
         attributeName="transform" 
         dur="1s" 
         type="translate" 
         values="0 5 ; 0 -5; 0 5" 
         repeatCount="indefinite" 
         begin="0.2"/>
    </rect>
    <rect x="50" y="35" width="5" height="30" >
      <animateTransform 
         attributeName="transform" 
         dur="1s" 
         type="translate" 
         values="0 5 ; 0 -5; 0 5" 
         repeatCount="indefinite" 
         begin="0.3"/>
    </rect>
    <rect x="60" y="35" width="5" height="30" >
      <animateTransform 
         attributeName="transform" 
         dur="1s" 
         type="translate" 
         values="0 5 ; 0 -5; 0 5"  
         repeatCount="indefinite" 
         begin="0.4"/>
    </rect>
    <rect x="70" y="35" width="5" height="30" >
      <animateTransform 
         attributeName="transform" 
         dur="1s" 
         type="translate" 
         values="0 5 ; 0 -5; 0 5" 
         repeatCount="indefinite" 
         begin="0.5"/>
    </rect>
    </g>
  </svg>`;
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  titleModalText.innerHTML = "Followers";
  dataContainer.style.display = "flex";
  overlayFollow.classList.add("active");
  document.body.style.overflowY = "hidden";
  document.body.style.overflow = "hidden";

  fetch(`${proxy}/api/followers`, {
    method: "POST",
    body: JSON.stringify({
      type: "followers",
      uid: uid,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        if (data.total === 0) {
          dataContainerBox.innerHTML = "";
          dataContainerBox.innerHTML =
            "<div class='no-follower-text'>No followers found</div>";
        } else {
          dataContainerBox.innerHTML = "";
          dataContainerBox.setAttribute(
            "style",
            "display:flex;align-items:start;"
          );
          dataContainerBox.innerHTML =
            "<div class='data-container-for-follower-data-list'></div>";
          const containerForData = document.querySelector(
            ".data-container-for-follower-data-list"
          );

          data.details.map((e) => {
            containerForData.innerHTML += `
            <div class="result-user-container following-user-result-container" style="max-height:fit-content">
            <a href="/profile?uid=${e.uid}" class="link-to-user">
              <div class="result-account-container">
                <img src="./cdn/${e.profile}" class="result-user-profile" />
                <div class="result-user-details-container">
                  <div class="result-name-container">
                    <span>${e.firstname}</span>
                    <span>${e.lastname}</span>
                  </div>
                  <div class="result-username">@${e.username}</div>
                </div>
              </div>
            </a>
          </div>
            `;
          });
          dataContainerBox.innerHTML;
        }
      }
    });
});
