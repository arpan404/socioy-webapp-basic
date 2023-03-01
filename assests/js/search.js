import proxy from "./proxy.js";
const searchResultMainBox = document.querySelector(".search-contents");
const searchResultMainContainer = document.querySelector(
  ".search-result-main-container"
);
const suggestedAccountsMainContainer = document.querySelector(
  ".suggested-user-main-container"
);

const alterSearchResultBox = (searchTerm, type) => {
  if (type === "initial") {
    searchResultMainContainer.innerHTML = "";
    suggestedAccountsMainContainer.style.display = "block";
    if (document.querySelector(".search-result-text")) {
      document.querySelector(".search-result-text").style.display = "none";
    }
  } else {
    if (searchTerm.length > 0) {
      searchResultMainContainer.innerHTML = "";
      suggestedAccountsMainContainer.style.display = "none";
      if (!document.querySelector(".search-result-text")) {
        const newSearchResultTextContainer = document.createElement("div");
        newSearchResultTextContainer.setAttribute(
          "class",
          "search-result-text"
        );
        searchResultMainBox.insertBefore(
          newSearchResultTextContainer,
          searchResultMainBox.children[0]
        );
      } else {
        document.querySelector(".search-result-text").style.display = "block";
      }
      if (!document.querySelector(".result-searching-container")) {
        const newSearchingResultContainer = document.createElement("div");
        newSearchingResultContainer.setAttribute(
          "class",
          "result-searching-container"
        );
        searchResultMainBox.insertBefore(
          newSearchingResultContainer,
          searchResultMainBox.children[1]
        );
      }
      document.querySelector(".result-searching-container").innerHTML = ` <div>
      Searching for '${
        searchTerm.length <= 14 ? searchTerm : searchTerm.slice(0, 12) + "..."
      }'
    </div><svg
      viewBox="0 0 120 30"
      xmlns="http://www.w3.org/2000/svg"
      fill="#fff"
    >
      <circle cx="15" cy="15" r="15">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="60" cy="15" r="9" fill-opacity="0.3">
        <animate
          attributeName="r"
          from="9"
          to="9"
          begin="0s"
          dur="0.8s"
          values="9;15;9"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="0.5"
          to="0.5"
          begin="0s"
          dur="0.8s"
          values=".5;1;.5"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="105" cy="15" r="15">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
   `;
      document.querySelector(".search-result-text").innerHTML =
        "<span>Search Results</span>";
      fetch(`${proxy}/api/search`, {
        method: "POST",
        body: JSON.stringify({
          searchTerm: searchTerm,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          searchResultMainContainer.innerHTML = "";
          setTimeout(() => {
            document.querySelector(".result-searching-container").innerHTML =
              "";
            if (data.search.totalResults > 0) {
              data.search.results.map((e) => {
                if (
                  searchResultMainContainer.querySelector(
                    `[data-uid="${e.uid}"]`
                  ) === null
                ) {
                  searchResultMainContainer.innerHTML += `
                        <div class="result-user-container" data-uid ="${e.uid}">
                        <a href="/profile?uid=${e.uid}" class="link-to-user">
                          <div class="result-account-container">
                            <img
                              src="./cdn/${e.profile}"
                              class="result-user-profile"
                            />
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
                } else {
                  searchResultMainContainer
                    .querySelector(`[data-uid="${e.uid}"]`)
                    .remove();
                  searchResultMainContainer.innerHTML += `
                  <div class="result-user-container" data-uid ="${e.uid}">
                  <a href="/profile?uid=${e.uid}" class="link-to-user">
                    <div class="result-account-container">
                      <img
                        src="./cdn/${e.profile}"
                        class="result-user-profile"
                      />
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
                }
              });
            } else {
              searchResultMainContainer.innerHTML = `<div class="result-user-no-result-container">
              <div>
                No user found for '${
                  searchTerm.length <= 14
                    ? searchTerm
                    : searchTerm.slice(0, 12) + "..."
                }'
                </div>
              </div>`;
              suggestedAccountsMainContainer.style.display = "block";
            }
          }, 300);
        });
    } else {
      searchResultMainContainer.innerHTML = "";
      suggestedAccountsMainContainer.style.display = "block";
      if (document.querySelector(".search-result-text")) {
        document.querySelector(".search-result-text").style.display = "none";
      }
    }
  }
};
const fetchMore = (term, offet) => {};
export default alterSearchResultBox;
