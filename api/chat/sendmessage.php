<?php

include("../../includes/db.inc.php");
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data) && isset($_COOKIE["token"])) {
    $cookie_token = $_COOKIE["token"];
    $ciphering = "AES-256-CTR";
    $iv_length = openssl_cipher_iv_length($ciphering);
    $options = 0;
    $decryption_iv = '@!3$vc3!5#123321';
    $decryption_key = "Cbk*n7cacnXM1F7c9i@W";
    $decrypted_token = openssl_decrypt(
        $cookie_token,
        $ciphering,
        $decryption_key,
        $options,
        $decryption_iv
    );
    $userUID = explode("-&&&&&+", $decrypted_token)[0];
    $userPassword = explode("-&&&&&+", $decrypted_token)[1];

    $check_user = $conn->query("SELECT * FROM loginInfo WHERE password = '$userPassword' AND userUID = '$userUID'");
    if ($check_user->num_rows === 0) {
        echo json_encode(array("status" => "access-denied"));
        die();
    } else {
        $messageTo = $data['messageTo'];
        $check_is_following = $conn->query("SELECT * FROM followingDATA WHERE follower = '$userUID' AND following = '$messageTo'");
        $check_is_being_followed = $conn->query("SELECT * FROM followingDATA WHERE following = '$userUID' AND follower = '$messageTo'");
        if ($check_is_being_followed->num_rows > 0 && $check_is_following->num_rows > 0) {
            $current_time = time();
            $message = $data['message'];
            $optional_letters= "qwertyuiopasafhghxcbxnzmzmnak1i7t753581103813ughjxbnvxbaaosijsis";

            $messageID = substr(str_shuffle($optional_letters), 0, 10).sha1($userUID) . sha1($messageTo) . sha1($current_time).substr(str_shuffle($optional_letters), 0, 9);
            $message_type = $data['type'];
            $message_status= "unread";
            $stmt = $conn->prepare("INSERT INTO messageData(messageID, messageFROM, messageTO, message, messageType, sentOn, status) VALUES(?,?,?,?,?,?,?)");
            $stmt->bind_param("sssssis", $messageID, $userUID, $messageTo, $message,$message_type, $current_time, $message_status);
            $stmt->execute();
            echo json_encode(array("status" => "success", "messageID" => $messageID));
        } else {
            echo json_encode(array("status" => "failed", "type" => "users are not friends"));
        }
    }
} else {
    echo json_encode(array("status" => "access-denied"));
}
