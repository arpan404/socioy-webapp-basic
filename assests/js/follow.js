import proxy from "./proxy.js";

if (document.querySelector("#logout-btn")) {
  const logoutBtn = document.querySelector("#logout-btn");
  logoutBtn.addEventListener("click", () => {
    window.location.replace(`${proxy}/logout`);
  });
}
if (document.querySelector("#follow-btn")) {
  const followBtn = document.querySelector("#follow-btn");
  const followingDataContainer = document.querySelector(
    ".user-profile-following-data"
  );
  const followerDataContainer = document.querySelector(
    ".user-profile-follower-data"
  );
  followBtn.addEventListener("click", (e) => {
    if (
      followBtn.dataset.type === "follow" ||
      followBtn.dataset.type === "follow-back"
    ) {
      if (followBtn.dataset.type === "follow") {
        followBtn.classList.add("status-following");
        followBtn.value = "Following";
      } else {
        followBtn.classList.remove("status-being-followed");
        followBtn.classList.add("status-friends");
        followBtn.value = "Friends";
      }
      fetch(`${proxy}/api/follow`, {
        method: "POST",
        body: JSON.stringify({
          uid: followBtn.dataset.uid,
          type: "follow",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status !== "success") {
            if (data.message) {
              if (data.message === "already followed") {
                if (followBtn.dataset.type === "follow") {
                  followBtn.classList.add("status-following");
                  followBtn.value = "Following";
                  followBtn.dataset.type = "following";
                } else {
                  followBtn.classList.remove("status-being-followed");
                  followBtn.classList.add("status-friends");
                  followBtn.value = "Friends";
                  followBtn.dataset.type = "friends";
                }
              }
            } else {
              if (followBtn.dataset.type === "follow") {
                followBtn.classList.remove("status-following");
                followBtn.value = "Follow";
              } else {
                followBtn.classList.add("status-being-followed");
                followBtn.classList.remove("status-friends");
                followBtn.value = "Follow Back";
              }
            }
          } else {
            if (followBtn.dataset.type === "follow") {
              followBtn.classList.add("status-following");
              followBtn.value = "Following";
              followBtn.dataset.type = "following";
            } else {
              followBtn.classList.remove("status-being-followed");
              followBtn.classList.add("status-friends");
              followBtn.value = "Friends";
              followBtn.dataset.type = "friends";
            }
            followerDataContainer.innerHTML = data.followers;
            followingDataContainer.innerHTML = data.followings;
          }
        });
    } else if (
      followBtn.dataset.type === "friends" ||
      followBtn.dataset.type === "following"
    ) {
      if (followBtn.dataset.type === "following") {
        followBtn.classList.remove("status-following");
        followBtn.value = "Follow";
      } else {
        followBtn.classList.add("status-being-followed");
        followBtn.classList.remove("status-friends");
        followBtn.value = "Follow Back";
      }

      fetch(`${proxy}/api/follow`, {
        method: "POST",
        body: JSON.stringify({
          uid: followBtn.dataset.uid,
          type: "unfollow",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status !== "success") {
            if (followBtn.dataset.type === "following") {
              followBtn.classList.add("status-following");
              followBtn.value = "Following";
            } else {
              followBtn.classList.remove("status-being-followed");
              followBtn.classList.add("status-friends");
              followBtn.value = "Friends";
            }
          } else {
            if (followBtn.dataset.type === "following") {
              followBtn.classList.remove("status-following");
              followBtn.value = "Follow";
              followBtn.dataset.type = "follow";
            } else {
              followBtn.classList.add("status-being-followed");
              followBtn.classList.remove("status-friends");
              followBtn.value = "Follow Back";
              followBtn.dataset.type = "follow-back";
            }
            followerDataContainer.innerHTML = data.followers;
            followingDataContainer.innerHTML = data.followings;
          }
        });
    }
  });
}
