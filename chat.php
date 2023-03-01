<?php
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
error_reporting(-1);
include "./includes/autologin.php";
include "./includes/db.inc.php";
if (!isset($_SESSION['login'])) {
  if (!($_SESSION['login'] === true && isset($_SESSION['firstname']) && isset($_SESSION['login']) && isset($_SESSION['lastname']) && isset($_SESSION['email']) && isset($_SESSION['username']))) {
    header("Location: /login");
    exit;
  }
}
function convert_epoch_to_relative_time($timestamp)
{
  $current_time = time();
  $time_difference = $current_time - $timestamp;
  if ($time_difference < 60) {
    return "$time_difference sec";
  } elseif ($time_difference < 3600) {
    return round($time_difference / 60) . " min";
  } elseif ($time_difference < 86400) {
    return round($time_difference / 3600) . " hr";
  } else {
    return date("d M", $timestamp);
  }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <?php require_once("./includes/commonHeader.php") ?>
  <title>Chat | Socioy</title>
  <link rel="stylesheet" href="/assests/css/chatui.css" />
  <link rel="stylesheet" href="/assests/css/navbar.css" />
  <script src="./assests/js/navbar.js" defer type="module"></script>
  <script src="./assests/js/search.js" defer type="module"></script>
  <script src="./assests/js/chat/chat.js" defer type="module"></script>
  <script src="./assests/js/activenow.js" defer type="module"></script>
  <meta name="theme-color" content="#000000" />
</head>

<body>
  <?php require_once("./includes/navbar.php") ?>
  <?php
  $userUID = $_SESSION['userUID'];
  $user_details = $conn->query("SELECT * FROM loginINFO WHERE userUID = '$userUID'")->fetch_assoc();

  ?>
  <main class="chat-main-page-container" id="main-box-chat" data-user="<?php echo $user_details['profileImage']; ?>" data-current="<?php echo $user_details['userUID']; ?>" data-selecteduser="<?php echo $user_details['userUID']; ?>" data-last="111111111111111111111" data-first="0">
    <div class="chat-main-box-container">
      <div class="chat-main-box">
        <div class="chat-box-left-section active">
          <div class="chat-box-left-section-chats-text-container relative">
            <span class="select-none">
              Chats
            </span>
            <i class='bx bxs-home-heart home-btn' id="home-btn"></i>
          </div>
          <div class="chat-box-left-section-chats-search">
            <input type="text" placeholder="Search Chats or Friends" name="chats" class="chat-search-field" />
          </div>


          <div class="chat-box-left-section-chat-container search  hide-scroll" id="chat-search-container">
            <div class="chat-box-search-container">
              <div class="search-result-status">
                <span class="search-status">
                </span>
              </div>
              <div class="chat-search-contents">
              </div>

            </div>
          </div>


          <div class="chat-box-left-section-active-now-container active" id="active-now-box">
            <div class="chat-box-left-section-active-now-text select-none">
              Active Now
            </div>

            <div class="chat-box-active-now-users-container active-now-container hide-scroll select-none" id="active-now-container">
              <?php
              $userUID = $_SESSION['userUID'];
              $user_details = $conn->query("SELECT * FROM loginINFO WHERE userUID = '$userUID'")->fetch_assoc();
              $current_time_active = time() - 30;
              $user_lists_query = $conn->query("SELECT * FROM loginInfo WHERE lastactive >= $current_time_active");
              if ($user_lists_query->num_rows > 0) {
                $result_number = 0;
                while ($row = $user_lists_query->fetch_assoc()) {
                  $userUID_active = $row['userUID'];
                  $check_is_following = $conn->query("SELECT * FROM followingDATA WHERE follower = '$userUID' AND following = '$userUID_active'");
                  $check_is_being_followed = $conn->query("SELECT * FROM followingDATA WHERE following = '$userUID' AND follower = '$userUID_active'");
                  if ($check_is_following->num_rows > 0 && $check_is_being_followed->num_rows > 0) {
                    echo '<div class="active-user-container chat-selection" data-userid = "' . $row['userUID'] . '" data-username = "' . $row['username'] . '" data-firstname="' . $row['firstname'] . '" data-lastname ="' . $row['lastname'] . '" data-profile="' . $row['profileImage'] . '">
                    <img src="./cdn/' . $row['profileImage'] . '" class="active-now-user-profile-image">
                    <div class="active-now-symbol">
                    <div></div>
                    </div>
                    </div>';
                    $result_number++;
                  }
                }
                if ($result_number === 0) {
                  echo '<div class="active-user-container">
                  <img src="./cdn/' . $user_details['profileImage'] . '" class="active-now-user-profile-image">
                  <div class="active-now-symbol">
                  <div></div>
                  </div>
                  </div>';
                }
              } else {
                echo '<div class="active-user-container">
                <img src="./cdn/' . $user_details['profileImage'] . '" class="active-now-user-profile-image">
                <div class="active-now-symbol">
                <div></div>
                </div>
                </div>';
              }
              ?>
            </div>

          </div>
          <div class="chat-box-left-section-chat-container active hide-scroll" id="chat-list-container">

            <div>
              <?php
              $fetch_messages_details = $conn->query("SELECT * FROM messageData WHERE messageFROM = '$userUID' OR messageTO = '$userUID' ORDER BY sentOn DESC");
              $users_list = [];
              if ($fetch_messages_details->num_rows > 0) {
                while ($row = $fetch_messages_details->fetch_assoc()) {
                  if ($row['messageFROM'] === $userUID) {
                    if (!(in_array($row['messageTO'], $users_list))) {
                      $receiverID = $row['messageTO'];
                      $check_is_following = $conn->query("SELECT * FROM followingDATA WHERE follower = '$userUID' AND following = '$receiverID'");
                      $check_is_being_followed = $conn->query("SELECT * FROM followingDATA WHERE following = '$userUID' AND follower = '$receiverID'");
                      if ($check_is_following->num_rows > 0 and $check_is_being_followed->num_rows) {
                      }
                      $fetch_user_details_reciever = $conn->query("SELECT * FROM loginInfo WHERE userUID = '$receiverID'")->fetch_assoc();
                      echo '
                    <div class="message-box-container-left-section chat-selection" data-userid="' . $fetch_user_details_reciever['userUID'] . '" data-profile = "' . $fetch_user_details_reciever['profileImage'] . '" data-firstname="' . $fetch_user_details_reciever['firstname'] . '" data-lastname="' . $fetch_user_details_reciever['lastname'] . '" data-username = "' . $fetch_user_details_reciever['username'] . '" data-time="' . $row['sentOn'] . '">
                    <div class="chat-box-left-chat-container relative select-none">
                      <div class="chat-box-left-chat-container-new-chat-indicator">
                        <div>
                        </div>
                      </div>
                      <div class="chat-box-left-section-chat-box">
                        <div class="chat-box-left-section-chat-box-profile-container">
                          <img src="./cdn/' . $fetch_user_details_reciever['profileImage'] . '" class="chat-box-left-section-chat-box-profile-image" />
                        </div>
                        <div class="chat-box-left-section-chat-box-messgae-details-container">
                          <div class="chat-box-left-section-chat-box-message-details-name">'
                        .
                        ucfirst(strtolower($fetch_user_details_reciever['firstname'])) . " " . ucfirst(strtolower($fetch_user_details_reciever['lastname']))
                        .
                        '</div>
                          <div class="chat-box-left-section-chat-box-message-details-message">
                            <div class="chat-box-left-message-text">
                              ' . "You : " . $row['message'] . '
                            </div>
                            <div class="chat-box-left-mesage-date">
                              &#183; ' . convert_epoch_to_relative_time($row['sentOn']) . '
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ';
                      array_push($users_list, $row['messageTO']);
                    } else {
                      continue;
                    }
                  } else if ($row['messageTO'] === $userUID) {
                    if (!(in_array($row['messageFROM'], $users_list))) {
                      $receiverID = $row['messageFROM'];
                      $check_is_following = $conn->query("SELECT * FROM followingDATA WHERE follower = '$userUID' AND following = '$receiverID'");
                      $check_is_being_followed = $conn->query("SELECT * FROM followingDATA WHERE following = '$userUID' AND follower = '$receiverID'");
                      if ($check_is_following->num_rows > 0 and $check_is_being_followed->num_rows) {
                      }
                      $fetch_user_details_reciever = $conn->query("SELECT * FROM loginInfo WHERE userUID = '$receiverID'")->fetch_assoc();
                      echo '
                    <div class="message-box-container-left-section chat-selection" data-userid="' . $fetch_user_details_reciever['userUID'] . '" data-profile = "' . $fetch_user_details_reciever['profileImage'] . '" data-firstname="' . $fetch_user_details_reciever['firstname'] . '" data-lastname="' . $fetch_user_details_reciever['lastname'] . '" data-username = "' . $fetch_user_details_reciever['username'] . '" data-time="' . $row['sentOn'] . '">
                    <div class="chat-box-left-chat-container relative select-none">
                      <div class="chat-box-left-chat-container-new-chat-indicator ';
                      echo $row['status'] === "unread" ? "active" : "";
                      echo '">
                        <div>
                        </div>
                      </div>
                      <div class="chat-box-left-section-chat-box">
                        <div class="chat-box-left-section-chat-box-profile-container">
                          <img src="./cdn/' . $fetch_user_details_reciever['profileImage'] . '" class="chat-box-left-section-chat-box-profile-image" />
                        </div>
                        <div class="chat-box-left-section-chat-box-messgae-details-container">
                          <div class="chat-box-left-section-chat-box-message-details-name">'
                        .
                        ucfirst(strtolower($fetch_user_details_reciever['firstname'])) . " " . ucfirst(strtolower($fetch_user_details_reciever['lastname']))
                        .
                        '</div>
                          <div class="chat-box-left-section-chat-box-message-details-message ';
                      echo $row['status'] === "unread" ? "unread" : "";

                      echo '">
                            <div class="chat-box-left-message-text">
                              ' . $row['message'] . '
                            </div>
                            <div class="chat-box-left-mesage-date">
                              &#183; ' . convert_epoch_to_relative_time($row['sentOn']) . '
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ';
                      array_push($users_list, $row['messageFROM']);
                    } else {
                      continue;
                    }
                  } else {
                    continue;
                  }
                }
              }
              ?>
            </div>


          </div>
        </div>

        <div class="chat-box-right-section relative" style="display: none !important;">
          <div class="chat-box-user-details-main-container pc select-none">
            <div class="chat-box-details-box-container-with-btn">
              <div class="back-btn-container">
                <i class='bx bx-chevron-left back-btn'></i>
              </div>
              <div class="chat-box-user-details-container">
                <div class="chat-box-user-profile-container">
                  <img src="./cdn/default-profile.png" id="right-image" />
                </div>
                <div class="chat-box-user-details-container-right">
                  <div class="chat-box-user-details-fullname-right-section">
                    <?php echo $_SESSION['firstname'] . " " . $_SESSION['lastname']; ?>
                  </div>
                  <div class="chat-box-user-details-username-right-section">
                    @<?php echo $_SESSION['username']; ?>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="chatting-options-container-main select-none">
            <div class="chatting-options">
              <textarea name="message" id="message-field" placeholder="Aa" class="messageBox-input-field select-text"></textarea>
              <div class="send-btn-container">
                <i class="fa-solid fa-heart heart-emoji cursor-pointer select-none" id="send-btn" data-type="heart"></i>
              </div>
            </div>
          </div>


          <div class="chat-box-main-chatting-box">

          </div>
        </div>
      </div>
    </div>
    </div>

  </main>
  </div>
</body>

</html>