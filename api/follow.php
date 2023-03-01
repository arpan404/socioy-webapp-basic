<?php

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
            $user_details = $check_user->fetch_assoc();
            $user_id = $user_details['userUID'];
            $following_uid = $data['uid'];
            $check_following_user = $conn->query("SELECT * FROM loginInfo WHERE userUID = '$following_uid'");
            if ($check_following_user->num_rows > 0) {

                if ($data['type'] === "follow") {
                    $check_following_data = $conn->query("SELECT * FROM followingDATA WHERE follower = '$user_id' AND following = '$following_uid'");
                    if ($check_following_data->num_rows === 0) {
                        $stmt = $conn->prepare("INSERT INTO followingDATA(follower, following) VALUES(?,?)");
                        $stmt->bind_param("ss", $user_id, $following_uid);
                        $stmt->execute();
                        $follower_query = $conn->query("SELECT * FROM followingDATA WHERE following = '$following_uid'");
                        $following_query = $conn->query("SELECT * FROM followingDATA WHERE follower = '$following_uid'");
                        $new_followers = $follower_query->num_rows;
                        $new_following = $following_query->num_rows;
                        $new_followers = $new_followers > 0 ? format_number($new_followers) : "0";
                        $new_following = $new_following > 0 ? format_number($new_following) : "0";
                        echo json_encode(array("status" => "success", "followers" => $new_followers, "followings" => $new_following));
                    } else {
                        echo json_encode(array("status" => "access denied", "message" => "already followed"));
                        die();
                    }
                } else if ($data['type'] = "unfollow") {
                    $unfollow_query = $conn->query("DELETE FROM followingDATA WHERE follower = '$user_id' AND following = '$following_uid'");
                    $follower_query = $conn->query("SELECT * FROM followingDATA WHERE following = '$following_uid'");
                    $following_query = $conn->query("SELECT * FROM followingDATA WHERE follower = '$following_uid'");
                    $new_followers = $follower_query->num_rows;
                    $new_following = $following_query->num_rows;
                    $new_followers = $new_followers > 0 ? format_number($new_followers) : "0";
                    $new_following = $new_following > 0 ? format_number($new_following) : "0";
                    echo json_encode(array("status" => "success", "followers" => $new_followers, "followings" => $new_following));
                } else {
                    echo json_encode(array("status" => "access denied"));
                    die();
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
