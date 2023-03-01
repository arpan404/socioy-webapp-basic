<?php

include("../includes/db.inc.php");
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['password']) && isset($data['newPassword']) && isset($_COOKIE['token'])) {
    if (strlen($data['newPassword']) > 7 && strlen($data['password']) > 7) {
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
        $password = $data['password'];
        $hashed_password = hash('sha256', $password);
        $new_hashed_password = hash("sha256", $data['newPassword']);
        $fetch_user_to_check_token_validity = $conn->query("SELECT * FROM loginInfo WHERE userUID = '$userUID'");
        if ($fetch_user_to_check_token_validity->num_rows > 0) {
            $user_details = $fetch_user_to_check_token_validity->fetch_assoc();
            if ($user_details['password'] === $hashed_password) {
                $update_user_password_query = $conn->query("UPDATE loginInfo SET password = '$new_hashed_password' WHERE userUID ='$userUID'");
                $token = $user_details['userUID'] . "-&&&&&+" . $new_hashed_password;
                $ciphering = "AES-256-CTR";
                $iv_length = openssl_cipher_iv_length($ciphering);
                $options = 0;
                $encryption_iv = '@!3$vc3!5#123321';
                $encryption_key = "Cbk*n7cacnXM1F7c9i@W";
                $cookie_for_user = openssl_encrypt(
                    $token,
                    $ciphering,
                    $encryption_key,
                    $options,
                    $encryption_iv
                );
                echo json_encode(array("status" => "success", "token" => $cookie_for_user));
            } else {
                echo json_encode(array("status" => "failed", "message" => "incorrect password"));
                die();
            }
        } else {
            echo json_encode(array("status" => "access denied", "message" => "invalid passwords or token"));
            die();
        }
    } else {
        echo json_encode(array("status" => "access denied", "message" => "invalid passwords or token"));
        die();
    }
} else {
    echo json_encode(array("status" => "access denied"));
}
