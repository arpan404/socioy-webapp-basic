<?php
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
error_reporting(-1);

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
        echo json_encode(array("status" => "failed"));
        die();
    } else {
        $sender = $data['user'];
        $last = $data['last'];
        $check_is_following = $conn->query("SELECT * FROM followingDATA WHERE follower = '$userUID' AND following = '$sender'");
        $check_is_being_followed = $conn->query("SELECT * FROM followingDATA WHERE following = '$userUID' AND follower = '$sender'");
        if ($check_is_following->num_rows > 0 && $check_is_being_followed->num_rows > 0) {
            $conn->query("UPDATE messageData SET status = 'read' WHERE messageFROM = '$sender' AND messageTO = '$userUID'");
            $messages = $conn->query("SELECT * FROM messageData WHERE (messageFROM = '$sender' AND messageTO = '$userUID') AND sentOn > '$last' ORDER BY sentOn DESC");
            $total = 0;
            $message_details = [];
            while ($row = $messages->fetch_assoc()) {
                $new = array(
                    "from" => $row['messageFROM'], "to" => $row['messageTO'], "message" => $row['message'], "time" => $row['sentOn'], "type" => $row['messageType'], "id" => $row['messageID']
                );
                array_push($message_details, $new);
                $total++;
            }
            if ($total === 0) {
                echo json_encode((array("status" => "success", "results" => 0)));
            } else {
                echo json_encode((array("status" => "success", "results" => $total, "details" => $message_details)));
            }
        } else {
            echo json_encode(array("status" => "not success"));
        }
    }
} else {
    echo json_encode(array("status" => "failed"));
}
