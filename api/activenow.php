<?php
include("../includes/db.inc.php");
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
    if ($check_user->num_rows > 0) {
        $current_time = time();
        $setActive = $conn->query("UPDATE loginINFO SET lastactive = $current_time WHERE userUID = '$userUID'");
        echo json_encode(array("status" => "success"));
    } else {
        echo json_encode(array("status" => "denied"));
    }
} else {
    echo json_encode(array("status" => "denied"));
}
