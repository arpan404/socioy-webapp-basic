<?php
include "db.inc.php";
session_start();
if (isset($_COOKIE["token"])) {
    $cookie_token = $_COOKIE["token"];
    $ciphering = "AES-256-CTR";
    $iv_length = openssl_cipher_iv_length($ciphering);
    $options = 0;

    $decryption_iv = '@!3$vc3!5#123321';
    $decryption_key = "Cbk*n7cacnXM1F7c9i@W";
    $token = openssl_decrypt(
        $cookie_token,
        $ciphering,
        $decryption_key,
        $options,
        $decryption_iv
    );
    $auto_userUID = explode("-&&&&&+", $token)[0];
    $auto_userPassword = explode("-&&&&&+", $token)[1];

    $auto_login_check_user = $conn->query("SELECT * FROM loginInfo WHERE password = '$auto_userPassword' AND userUID = '$auto_userUID'");
    if ($auto_login_check_user->num_rows === 0) {
        setcookie(
            "token",
            "",
            [
                'expires' => time() - 1000,
                'path' => '/',
                'secure' => true,
                'samesite' => 'Strict',
            ]
        );
        unset($_COOKIE['token']);
        session_destroy();
    } else {
        $auto_userdetails = $auto_login_check_user->fetch_assoc();
        $auto_first_name = $auto_userdetails['firstname'];
        $auto_last_name = $auto_userdetails['lastname'];
        $auto_email = $auto_userdetails['email'];
        $auto_username = $auto_userdetails['username'];
        $auto_uid = $auto_userdetails['userUID'];
        $auto_pwd = $auto_userdetails['password'];
        $token = $auto_uid . "-&&&&&+" . $auto_userPassword;
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
        $_SESSION['firstname'] = $auto_first_name;
        $_SESSION['login'] = true;
        $_SESSION['lastname'] = $auto_last_name;
        $_SESSION['email'] = $auto_email;
        $_SESSION['username'] = $auto_username;
        $_SESSION['userUID'] = $auto_uid;

        setcookie(
            "token",
            $cookie_for_user,
            [
                'expires' => time() + 86400 * 30,
                'path' => '/',
                'secure' => true,
                'samesite' => 'Strict',
            ]
        );
    }
}
