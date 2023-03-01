<?php
include("../includes/db.inc.php");
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data) && isset($_COOKIE["token"])) {
    if (isset($_COOKIE["token"])) {
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
            echo json_encode(array("status" => "access denied"));
            die();
        } else {
            $userUID = $data['uid'];
            $check_user_exists = $conn->query("SELECT * FROM loginInfo WHERE userUID='$userUID'");
            if ($check_user_exists->num_rows > 0) {
                if ($data['type'] === "followers") {
                    $fetch_follower_uid = $conn->query("SELECT * FROM followingDATA WHERE following = '$userUID' ORDER BY followedDate DESC");
                    if ($fetch_follower_uid->num_rows === 0) {
                        echo json_encode(array("status" => "success", "total" => 0));
                    } else {
                        $total_followers = $fetch_follower_uid->num_rows;
                        $tosend = array("status" => "success", "total" => $total_followers, "details" => []);
                        while ($row = $fetch_follower_uid->fetch_assoc()) {
                            $follower_uid = $row['follower'];
                            $fetch_follower_details = $conn->query("SELECT * FROM loginInfo WHERE userUID ='$follower_uid'");
                            $single_follower_detail = $fetch_follower_details->fetch_assoc();
                            $follower_firstname = $single_follower_detail['firstname'];
                            $follower_lastname = $single_follower_detail['lastname'];
                            $follower_uid = $single_follower_detail['userUID'];
                            $follower_username = $single_follower_detail['username'];
                            $follower_profile = $single_follower_detail['profileImage'];
                            $tosendDetails = array("firstname" => $follower_firstname, "lastname" => $follower_lastname, "username" => $follower_username, "uid" => $follower_uid, "profile" => $follower_profile);
                            array_push($tosend['details'], $tosendDetails);
                        }
                        echo json_encode(($tosend));
                        die();
                    }
                } else if ($data['type'] === "followings") {
                    $fetch_following_uid = $conn->query("SELECT * FROM followingDATA WHERE follower = '$userUID' ORDER BY followedDate DESC");
                    if ($fetch_following_uid->num_rows === 0) {
                        echo json_encode(array("status" => "success", "total" => 0));
                    } else {
                        $total_followings = $fetch_following_uid->num_rows;
                        $tosend = array("status" => "success", "total" => $total_followings, "details" => []);
                        while ($row = $fetch_following_uid->fetch_assoc()) {
                            $following_uid = $row['following'];
                            $fetch_following_details = $conn->query("SELECT * FROM loginInfo WHERE userUID ='$following_uid'");
                            $single_following_detail = $fetch_following_details->fetch_assoc();
                            $following_firstname = $single_following_detail['firstname'];
                            $following_lastname = $single_following_detail['lastname'];
                            $following_uid = $single_following_detail['userUID'];
                            $following_username = $single_following_detail['username'];
                            $following_profile = $single_following_detail['profileImage'];
                            $tosendDetails = array("firstname" => $following_firstname, "lastname" => $following_lastname, "username" => $following_username, "uid" => $following_uid, "profile" => $following_profile);
                            array_push($tosend['details'], $tosendDetails);
                        }
                        
                        echo json_encode(($tosend));
                        die();
                    }
                }
            } else {
                echo json_encode(array("status" => "access denied"));
                die();
            }
        }
    } else {
        echo json_encode(array("status" => "access denied"));
        die();
    }
} else {
    echo json_encode(array("status" => "access denied"));
    die();
}
