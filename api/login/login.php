<?php
include("../../includes/db.inc.php");
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['user']) && isset($data['password'])) {
    if (strlen($data['user']) > 2 && strlen($data['password']) > 7) {
        $user = $data['user'];
        $password = $data['password'];
        $user = mysqli_real_escape_string($conn, $user);
        $checkuser = $conn->query("SELECT * FROM loginInfo WHERE username = '$user' OR email = '$user'");
        if ($checkuser->num_rows === 0) {
            echo json_encode(array("status" => "failed", "type" => "user not found"));
            die;
        }
        $userdetails = $checkuser->fetch_assoc();
        $hashed_password = hash('sha256', $password);
        if ($hashed_password === $userdetails['password']) {
            $token = $userdetails['userUID']. "-&&&&&+". $hashed_password;
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
            echo json_encode(array("status" => "failed", "type" => "incorrect password"));
            die;
        }
    } else {
        echo json_encode(array("status" => "access denied"));
    }
} else {
    echo json_encode(array("status" => "access denied"));
}
