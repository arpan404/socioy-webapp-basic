<?php
include "./includes/autologin.php";
include "./includes/db.inc.php";
if (!isset($_SESSION['login'])) {
  if (!($_SESSION['login'] === true && isset($_SESSION['firstname']) && isset($_SESSION['login']) && isset($_SESSION['lastname']) && isset($_SESSION['email']) && isset($_SESSION['username']))) {
    header("Location: /login");
    exit;
  }
}
$uid = $_SESSION['userUID'];
if (isset($_GET['uid'])) {
  $uid = $_GET['uid'];
}
$fetch_user = "SELECT * FROM loginInfo WHERE userUID = '$uid'";
$fetch_user_result = $conn->query($fetch_user);
if (!($fetch_user_result->num_rows > 0)) {
  header("Location: /404");
  exit;
};
$fetched_user_details = $fetch_user_result->fetch_assoc();
$first_name = $fetched_user_details['firstname'];
$last_name = $fetched_user_details['lastname'];
$user_name = $fetched_user_details['username'];
$profile_image = $fetched_user_details['profileImage'];

$fetch_following_data = "SELECT * FROM followingDATA WHERE follower = '$uid'";
$fetch_following_data_result = $conn->query($fetch_following_data);
$followingNumber = $fetch_following_data_result->num_rows;

$fetch_follower_data = "SELECT * FROM followingDATA WHERE following='$uid'";
$fetch_follower_data_result = $conn->query($fetch_follower_data);
$followerNumber = $fetch_follower_data_result->num_rows;

$isFriend = false;

$sessionUID = $_SESSION['userUID'];
$isfollowing_query = "SELECT * FROM followingDATA WHERE follower = '$sessionUID' AND following = '$uid'";
$isfollowing_result = $conn->query($isfollowing_query);

$is_being_followed_query = "SELECT * FROM followingDATA WHERE follower = '$uid' AND following = '$sessionUID'";
$is_being_followed_result = $conn->query($is_being_followed_query);


if ($isfollowing_result->num_rows > 0 && $is_being_followed_result->num_rows > 0) {
  $isFriend = true;
}

function format_number($n)
{
  if ($n > 0 && $n < 1000) {
    $n_format = floor($n);
    $suffix = '';
  } else if ($n >= 1000 && $n < 1000000) {
    $n_format = round($n / 1000, 1);
    $suffix = 'K';
  } else if ($n >= 1000000 && $n < 1000000000) {
    $n_format = round($n / 1000000, 1);
    $suffix = 'M';
  } else if ($n >= 1000000000 && $n < 1000000000000) {
    $n_format = round($n / 1000000000, 1);
    $suffix = 'B';
  } else {
    return false;
  }
  return !empty($n_format . $suffix) ? $n_format . $suffix : false;
}

$current_time = time();
$oneday_ago_time = $current_time - 86400;
$has_moment = "SELECT * FROM momentData WHERE postBy = '$uid' AND postedOn >= $oneday_ago_time ORDER BY postedOn DESC";
$has_moment_fetched = $conn->query($has_moment);
$has_moment_result = $has_moment_fetched->num_rows;

function get_time_of_upload($n)
{
  $current_time = time();
  $before = $current_time - $n;
  if ($before <= 59 && $n >= 0) {
    return "Just Now";
  } else if ($before > 59 && $before < 120) {
    return floor($before / 60) . " minute ago";
  } else if ($before >= 120 && $before < 3600) {
    return floor($before / 60) . " minutes ago";
  } else if ($before >= 3600 && $before < 7200) {
    return "1 hour ago";
  } else {
    return floor($before / 3600) . " hours ago";
  }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <title><?php echo ucfirst(strtolower($first_name)) . " " . ucfirst(strtolower($last_name)) ?> | Socioy</title>
  <?php require_once("./includes/commonHeader.php"); ?>
  <link rel="stylesheet" href="./assests/css/navbar.css" />
  <link rel="stylesheet" href="./assests/css/moments.css" />
  <link rel="stylesheet" href="./assests/css/profile.css" />
  <script src="./assests/js/navbar.js" defer type="module"></script>
  <script src="./assests/js/search.js" defer type="module"></script>
  <script src="./assests/js/follow.js" defer type="module"></script>
  <script src="./assests/js/profile.js" defer type="module"></script>
  <script src="./assests/js/loadmoments.js" defer></script>
  <script src="./assests/js/activenow.js" defer type="module"></script>
  <meta name="theme-color" content="#141414" />

  <?php if (!(isset($_GET['uid']) && $_GET['uid'] !== $_SESSION['userUID'])) {
    echo '
  <script src="./assests/js/editprofile.js" defer type="module"></script>
  ';
  } ?>
</head>

<body class="relative">
  <?php require_once("./includes/navbar.php") ?>
  <section class="profile-page-main-container">
    <div class="user-profile-details-main-container">
      <div class="user-profile-image-container relative">
        <img src="<?php echo './cdn/' . $profile_image ?>" class="user-profile-image <?php if ($has_moment_result > 0) {
                                                                                        echo 'user-has-shared-moment';
                                                                                      } ?>" />
        <?php if (!(isset($_GET['uid']) && $_GET['uid'] !== $_SESSION['userUID'])) {
          echo ' <div class="profile-edit-btn-container" id ="profile-edit-button">
          <i class="bx bxs-edit-alt"></i>
        </div>';
        } ?>
      </div>
      <div class="user-profile-details-container select-none">
        <div class="user-profile-full-name">
          <?php
          echo ucfirst(strtolower($first_name)) . " " . ucfirst(strtolower($last_name));
          ?>
        </div>
        <div class="user-profile-username" data-uid="<?php echo $uid; ?>">@<?php echo strtolower(($user_name)) ?></div>
        <div class="user-profile-following-follower-data-container">
          <div class="user-profile-data-container">
            <div class="user-profile-following-container">
              <div class="user-profile-following-text">Following</div>
              <div class="user-profile-following-data"><?php
                                                        if ($followingNumber > 0) {
                                                          echo format_number($followingNumber);
                                                        } else {
                                                          echo 0;
                                                        }
                                                        ?></div>
            </div>
            <div class="user-profile-follower-container">
              <div class="user-profile-follower-text">Followers</div>
              <div class="user-profile-follower-data"><?php
                                                      if ($followerNumber > 0) {
                                                        echo format_number($followerNumber);
                                                      } else {
                                                        echo 0;
                                                      }
                                                      ?></div>
            </div>
          </div>
        </div>
      </div>
      <?php if (isset($_GET['uid']) && $_GET['uid'] !== $_SESSION['userUID']) {
        if ($isfollowing_result->num_rows > 0 && $is_being_followed_result->num_rows > 0) {
          echo '
  <div class="user-profile-follow-button-container select-none">
  <input class="user-profile-follow-button status-friends" type="button" value="Friends" id="follow-btn" data-type = "friends" data-uid = "' . $_GET['uid'] . '">
</div>
  ';
        } else if ($isfollowing_result->num_rows > 0 &&  $is_being_followed_result->num_rows === 0) {
          echo '
          <div class="user-profile-follow-button-container select-none">
          <input class="user-profile-follow-button status-following" type="button" value="Following" id="follow-btn" data-type = "following" data-uid = "' . $_GET['uid'] . '">
        </div>
          ';
        } else if ($isfollowing_result->num_rows === 0 &&  $is_being_followed_result->num_rows > 0) {
          echo '
          <div class="user-profile-follow-button-container select-none">
          <input class="user-profile-follow-button status-being-followed" type="button" value="Follow Back" id="follow-btn" data-type = "follow-back" data-uid = "' . $_GET['uid'] . '">
        </div>
          ';
        } else {
          echo '
          <div class="user-profile-follow-button-container select-none">
          <input class="user-profile-follow-button" type="button" value="Follow" id="follow-btn" data-type = "follow" data-uid = "' . $_GET['uid'] . '">
        </div>
          ';
        }
      } else {
        echo '<div class="user-profile-follow-button-container select-none">
        <input class="user-profile-follow-button" type="button" value="Log Out" id ="logout-btn">
      </div>';
      }
      ?>
    </div>
  </section>
  <?php if (!(isset($_GET['uid']) && $_GET['uid'] !== $_SESSION['userUID'])) {
  } ?>
  <div class="edit-overlay"></div>
  <section class="edit-profile-main-container-section">
    <div class="edit-profile-main-box">
      <div class="edit-profile-text-box-container relative">
        <div class="edit-profile-text select-none">Edit Profile</div>
        <div class="profile-edit-close-btn">
          <i class='bx bx-x'></i>
        </div>
      </div>
      <div class="edit-profile-divider"></div>
      <div class="edit-profile-option-main-container">
        <div class="edit-profile-image-main-container">
          <div class="edit-profile-image-box-container relative">
            <img src="<?php echo './cdn/' . $profile_image ?>" class="edit-profile-profile-image" />
            <div class="edit-profile-image-change-icon">
              <i class='bx bx-refresh'></i>
            </div>
            <div class="edit-profile-file-input-container">
              <input type="file" name="profileImage" accept="image/jpg , image/png, image/webmp , image/jpeg" class="edit-profile-file-input" />
            </div>
          </div>
        </div>
        <div class="edit-profile-password-main-container">
          <div class="edit-profile-password-text select-none">
            Wanna change password?
          </div>
          <div class="edit-profile-password-fields-container">
            <input class="edit-profile-password-field" id="edit-profile-old-password" name="current-password" type="password" placeholder="Current Password..." />
            <input class="edit-profile-password-field" id="edit-profile-new-password" name="new-password" type="password" placeholder="New Password..." />
            <div class="edit-profile-password-error-container select-none">
            </div>
          </div>
        </div>
        <div class="edit-profile-button-container">
          <input class="edit-profile-save-changes-button not-edited-save-changes-button" type="button" value="Cancel" />
        </div>
      </div>
    </div>
    </div>
  </section>

  <div class="follow-overlay"></div>
  <section class="following-follower-data-main-container">
    <div class="following-follower-data">
      <div class="following-follow-text-container relative">
        <div class="following-follow-text select-none">
          Followers
        </div>
        <div class="following-close-btn">
          <i class='bx bx-x'></i>
        </div>
      </div>
      <div class="following-divider"></div>
      <div class="data-main-container">
      </div>
  </section>
  <?php
  if ($has_moment_result > 0) {
    echo '  <main class="shared-feed-moments-main-container moments-container-profile-page">';
    while ($row = $has_moment_fetched->fetch_assoc()) {
      if (isset($_GET['uid'])) {
        if ($_GET['uid'] !== $_SESSION['userUID']) {
          if ($row['isPrivate'] === "true") {
            if (!$isFriend) {
              continue;
            }
          }
        }
      }
      echo '
      <div class="shared-feed-moment-container">
      <div class="shared-by-details-container">
        <a href="/profile';
      if (isset($_GET['uid'])) {
        echo '?uid=' . $uid;
      }

      echo '">
          <div class="shared-by-user-details">
            <div class="shared-by-user-image-container">
              <img
                src="';
      echo './cdn/' . $profile_image;
      echo '"
                class="shared-by-user-image"
              />
            </div>
            <div class="shared-by-name-container">
              <div class="shared-by-user-full-name">';
      echo ucfirst(strtolower($first_name)) . " " . ucfirst(strtolower($last_name));
      echo '</div>
              <div class="shared-by-user-username">';
      echo "@" . strtolower(($user_name)) . '</div>
            </div>
          </div>
        </a>
      </div>

      <div class="shared-feed-moment-image-container">
        <div class="moment-loading-image-container">
          <img
            src="./assests/images/loading.gif"
            class="moment-loading-image"
          />
        </div>
        <img
          class="shared-feed-moment-image"
          src="';
      echo "./cdn/" . $row['imageName'];
      echo '"
          loading="lazy"
        />
      </div>
      <div class="shared-feed-moment-caption-container">
        <div class="shared-feed-moment-caption">
          ' . $row['caption'] . '
        </div>
      </div>
      <div class="shared-feed-moment-time-container">
        <div class="shared-feed-moment-time select-none">' . get_time_of_upload($row['postedOn']) . '</div>
      </div>
    </div>';
    }
    echo '</main>';
  }
  ?>
</body>

</html>