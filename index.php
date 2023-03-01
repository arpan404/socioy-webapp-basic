<?php
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
error_reporting(-1);

include "./includes/autologin.php";
include "./includes/db.inc.php";
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
if (!isset($_SESSION['login'])) {
  if (!($_SESSION['login'] === true && isset($_SESSION['firstname']) && isset($_SESSION['login']) && isset($_SESSION['lastname']) && isset($_SESSION['email']) && isset($_SESSION['username']))) {
    header("Location: /login");
    exit;
  }
}
$userUID = $_SESSION['userUID'];
$user_details_fetch_home = $conn->query("SELECT * FROM loginInfo WHERE userUID = '$userUID'")->fetch_assoc();


?>

<!DOCTYPE html>
<html lang="en">

<head>
  <title>Socioy</title>
  <?php require_once("./includes/commonHeader.php") ?>
  <link rel="stylesheet" href="./assests/css/index.css" />
  <link rel="stylesheet" href="./assests/css/navbar.css" />
  <link rel="stylesheet" href="./assests/css/moments.css" />
  <script src="./assests/js/navbar.js" defer type="module"></script>
  <script src="./assests/js/postmoments.js" defer type="module"></script>
  <script src="./assests/js/search.js" defer type="module"></script>
  <script src="./assests/js/moments.js" defer></script>
  <script src="./assests/js/loadmoments.js" defer></script>
  <script src="./assests/js/activenow.js" defer type="module"></script>
  <meta name="theme-color" content="#141414" />
</head>

<body class="relative">
  <?php require_once("./includes/navbar.php"); ?>
  <section class="main-body-section">
    <div class="moments-main-container">
      <div class="moment-button-container">
        <div>
          <div class="previous-button-moments">
            <div id="moment-previous-btn" style="display: none;">
              <i class="bx bx-chevron-left"></i>
            </div>
          </div>
          <div class="next-button-moments">
            <div id="moment-next-btn" style="display: none;">
              <i class="bx bx-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="users-shared-moments-container hide-scroll relative">
        <div class="moment-self-user-container relative">
          <img src="./cdn/<?php echo $user_details_fetch_home['profileImage'] ?>" class="moment-self-user-profile" data-username="<?php echo $user_details_fetch_home['username'] ?>" data-name="<?php echo  ucfirst(strtolower($user_details_fetch_home['firstname'])) . " " . ucfirst(strtolower($user_details_fetch_home['lastname'])) ?>" />
          <input type="file" id="moment-file-picker" class="moment-file-picker" accept=".jpg, .png, .webp, .gif, .jpeg, .svg" />
          <div class="add-moment-button">
            <i class="bx bx-plus-circle"></i>
          </div>
          <div class="moment-text">Moment</div>
          <div class="moment-self-user-username">
            <center>Add yours</center>
          </div>
        </div>
        <?php
        $current_time = time();
        $limit_time = $current_time - 86400;
        $fetch_feed_user = $conn->query("SELECT followingDATA.follower, followingDATA.following, loginInfo.userUID, loginInfo.profileImage, loginInfo.username, loginInfo.firstname, loginInfo.lastname, momentData.imageName, momentData.caption, momentData.isPrivate, momentData.postedOn FROM followingDATA INNER JOIN loginInfo ON followingDATA.following=loginInfo.userUID INNER JOIN momentData ON followingDATA.following = momentData.postBy WHERE momentData.postedOn>=$limit_time AND followingDATA.follower = '$userUID'");

        if ($fetch_feed_user->num_rows === 0) {
          $fetch_feed_user = $conn->query("SELECT loginInfo.userUID, loginInfo.profileImage, loginInfo.username, loginInfo.firstname, loginInfo.lastname, momentData.imageName, momentData.caption, momentData.isPrivate, momentData.postedOn FROM loginInfo INNER JOIN momentData ON loginInfo.userUID = momentData.postBy WHERE momentData.postedOn>=$limit_time AND momentData.isPrivate='false' LIMIT 25");
        }
        if ($fetch_feed_user->num_rows > 0) {
          $story_feed_array = array();
          while ($row = $fetch_feed_user->fetch_assoc()) {
            if (!in_array($row['userUID'], $story_feed_array) && $row['userUID'] !== $userUID) {
              array_push($story_feed_array, $row['userUID']);
              echo '  <a href="./profile?uid=' . $row['userUID'] . '" style="max-height:fit-content;max-width:fit-content;"> <div class="moment-user-container">
              <img src="./cdn/' . $row['profileImage'] . '" class="moment-user-profile has-moment" />
              <div class="moment-user-username">
             <center> ' . $row['username'] . '</center> 
              </div>
            </div></a>';
            }
          }
        }
        ?>
      </div>
    </div>
  </section>
  <div class="overlay-for-post-modal"></div>
  <div class="moment-post-box-container select-none">
    <div class="moment-post-box">
      <div class="moment-upload-image-container">
        <img id="moment-upload-image" class="moment-upload-image" />
      </div>
      <div class="moment-upload-caption-container">
        <input type="text" class="moment-upload-caption" placeholder="Add a caption..." name="caption" autocomplete="off" id="moment-caption" />
      </div>
      <div class="upload-letter-count" style="display: none">0 / 100</div>
      <div class="post-option-container">
        <label class="rocker rocker-small">
          <input type="checkbox" class="checkbox-post-option" id="post-to-option" />
          <span class="switch-left">Yes</span>
          <span class="switch-right">No</span>
        </label>
        <div class="frnds-text">Share only to your friends</div>
      </div>
      <div class="moment-upload-button-container">
        <div class="moment-cancel-button">
          <i class="bx bx-x"></i>
        </div>
        <div class="moment-upload-button" id="upload-moment-button">
          Share Now
        </div>
      </div>
    </div>
  </div>

  <main class="shared-feed-moments-main-container">
    <?php
    $showNotFound = false;
    $current_time = time();
    $limit_time = $current_time - 86400;
    $fetch_feed_user = $conn->query("SELECT followingDATA.follower, followingDATA.following, loginInfo.userUID, loginInfo.profileImage, loginInfo.username, loginInfo.firstname, loginInfo.lastname, momentData.imageName, momentData.caption, momentData.isPrivate, momentData.postedOn FROM followingDATA INNER JOIN loginInfo ON followingDATA.following=loginInfo.userUID INNER JOIN momentData ON followingDATA.following = momentData.postBy WHERE momentData.postedOn>=$limit_time AND followingDATA.follower = '$userUID' ORDER BY momentData.postedOn DESC");

    if ($fetch_feed_user->num_rows === 0) {
      $fetch_feed_user = $conn->query("SELECT loginInfo.userUID, loginInfo.profileImage, loginInfo.username, loginInfo.firstname, loginInfo.lastname, momentData.imageName, momentData.caption, momentData.isPrivate, momentData.postedOn FROM loginInfo INNER JOIN momentData ON loginInfo.userUID = momentData.postBy WHERE momentData.postedOn>=$limit_time AND momentData.isPrivate='false'ORDER BY momentData.postedOn DESC  LIMIT 25 ");
    }
    if ($fetch_feed_user->num_rows > 0) {
      while ($row = $fetch_feed_user->fetch_assoc()) {
        $moment_sharer = $row['userUID'];
        $isfollowing_query = $conn->query("SELECT * FROM followingDATA WHERE follower = '$userUID' AND following ='$moment_sharer'");
        $is_being_followed_query = $conn->query("SELECT * FROM followingDATA WHERE follower = '$moment_sharer' AND following = '$userUID'");
        $isFriend =  false;
        if ($isfollowing_query->num_rows > 0 && $is_being_followed_query->num_rows > 0) {
          $isFriend = true;
        }
        if ($row['isPrivate'] === "true") {
          if ($moment_sharer === $userUID || $isFriend) {
            echo '
          <div class="shared-feed-moment-container">
          <div class="shared-by-details-container">
            <a href="./profile?uid=' . $moment_sharer . '">
              <div class="shared-by-user-details">
                <div class="shared-by-user-image-container">
                  <img src="./cdn/' . $row['profileImage'] . '" class="shared-by-user-image" />
                </div>
                <div class="shared-by-name-container">
                  <div class="shared-by-user-full-name">' . ucfirst(strtolower($row['firstname'])) . " " . ucfirst(strtolower($row['lastname'])) . '</div>
                  <div class="shared-by-user-username">@' . strtolower($row['username']) . '</div>
                </div>
              </div>
            </a>
          </div>
    
          <div class="shared-feed-moment-image-container">
            <div class="moment-loading-image-container">
              <img src="./assests/images/loading.gif" class="moment-loading-image" />
            </div>
            <img class="shared-feed-moment-image" src="./cdn/' . $row['imageName'] . '" loading="lazy" />
          </div>
          <div class="shared-feed-moment-caption-container">
            <div class="shared-feed-moment-caption">
            ' . $row['caption'] . '
            </div>
          </div>
          <div class="shared-feed-moment-time-container">
            <div class="shared-feed-moment-time select-none">' . get_time_of_upload($row['postedOn']) . '</div>
          </div>
        </div>
          ';
          } else {
            continue;
          }
        } else {
          echo '
          <div class="shared-feed-moment-container">
          <div class="shared-by-details-container">
            <a href="./profile?uid=' . $moment_sharer . '">
              <div class="shared-by-user-details">
                <div class="shared-by-user-image-container">
                  <img src="./cdn/' . $row['profileImage'] . '" class="shared-by-user-image" />
                </div>
                <div class="shared-by-name-container">
                  <div class="shared-by-user-full-name">' . ucfirst(strtolower($row['firstname'])) . " " . ucfirst(strtolower($row['lastname'])) . '</div>
                  <div class="shared-by-user-username">@' . strtolower($row['username']) . '</div>
                </div>
              </div>
            </a>
          </div>
    
          <div class="shared-feed-moment-image-container">
            <div class="moment-loading-image-container">
              <img src="./assests/images/loading.gif" class="moment-loading-image" />
            </div>
            <img class="shared-feed-moment-image" src="./cdn/' . $row['imageName'] . '" loading="lazy" />
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
      }
    } else {
      $showNotFound = true;
    }

    ?>
  </main>
  <?php
  if ($showNotFound) {
    echo '<section class="no-moments-found">
    <div>
      <span>
        Currently, no posts are available for you.
      </span>
    </div>
    </section>';
  }
  ?>



</body>

</html>