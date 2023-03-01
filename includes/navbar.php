<?php
$user_fetch_suggestion = $conn->query("SELECT * FROM loginInfo ORDER BY joinedDate DESC LIMIT 10");
?>
<nav class="navbar">
    <div class="relative w-full" id="nav-contents-container">
        <div class="nav-site-name-container">
            <span class="nav-site-name cursor-pointer select-none" id="site-name">Soc<span>ioy</span></span>
        </div>
        <div class="nav-search-field-container relative">
            <input type="text" name="search-field" id="search-field" class="nav-search-field" placeholder="Search Socioy" autocomplete="off" />
            <span class="remove-circle-container">
                <i class="bx bx-x-circle remove-circle" id="clear-btn"></i>
            </span>
        </div>
        <div class="nav-contents-container flex">
            <i class="bx bx-search nav-search-icon" id="nav-search-btn"></i>
            <a href="/chat">
                <i class="bx bxs-message-square-dots nav-message-icon" id="nav-message-icon"></i>
            </a>
            <a href="/profile">
                <i class="bx bxs-user nav-user-icon" id="nav-user-icon"></i>
            </a>
        </div>
    </div>
    <div class="search-open-container-mobile relative" id="mobile-search-container">
        <i class="bx bx-chevron-left back-btn-search" id="back-btn-search"></i>
        <input type="text" id="search-field-mobile" class="nav-search-field-mobile" placeholder="Search Socioy" autocomplete="off" name="search-field-for-mobile" />
        <i class="bx bx-x clear-btn-mobile" id="clear-btn-mobile"></i>
    </div>
</nav>
<div class="search-result-container hide-scroll relative" id="search-result-container">
    <div class="search-close-btn" id="search-close-btn">Close</div>
    <div class="search-content-container relative" id="search-content-container">
        <div class="search-contents">
            <div class="search-result-main-container"></div>

            <div class="suggested-user-main-container">
                <div class="suggested-account-text">
                    <span> Suggestions </span>
                </div>
                <?php
                while ($row = $user_fetch_suggestion->fetch_assoc()) {
                    echo ' <div class="result-user-container">
                <a href="./profile?uid=' . $row['userUID'] . '" class="link-to-user">
                  <div class="result-account-container">
                    <img
                      src="./cdn/' . $row['profileImage'] . '"
                      class="result-user-profile"
                    />
                    <div class="result-user-details-container">
                      <div class="result-name-container">
                        <span>' . $row['firstname'] . '</span>
                        <span>' . $row['lastname'] . '</span>
                      </div>
                      <div class="result-username">@' . $row['username'] . '</div>
                    </div>
                  </div>
                </a>
              </div>';
                }
                ?>
            </div>
        </div>
    </div>
</div>