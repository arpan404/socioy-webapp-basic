<?php
include("../../includes/db.inc.php");
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['firstname']) && isset($data['lastname']) && isset($data['username']) && isset($data['email']) && isset($data['password']) && isset($data['confirmPassword'])) {
    if (strlen($data['firstname']) > 1 && strlen($data['lastname']) > 1 && strlen($data['username']) > 2 && filter_var($data['email'], FILTER_VALIDATE_EMAIL) && ($data['password'] === $data['confirmPassword']) && strlen($data['password']) > 7 && strlen($data['confirmPassword']) > 7 && strlen($data['firstname']) <= 15 && strlen($data['lastname']) <= 15 && strlen($data['password']) <= 50 && strlen($data['confirmPassword']) <= 50 && strlen($data['email']) <= 30 && strlen($data['username']) <= 15) {
        $firstname = $data['firstname'];
        $lastname = $data['lastname'];
        $username = $data['username'];
        $email = $data['email'];
        $password = hash('sha256', $data['password']);
        $checkuser = $conn->query("SELECT * FROM loginInfo WHERE username = '$username' OR email = '$email'");
        if ($checkuser->num_rows > 0) {
            echo json_encode(array("status" => "user exists"));
            die;
        }
        $stmt = $conn->prepare("INSERT INTO loginInfo(firstname, lastname, username, email, password, userUID) VALUES(?,?,?,?,?,?)");
        $uid = hash('md5', ($username . $email . date("Y/m/d") . date("h:i:sa")));
        $stmt->bind_param("ssssss", $firstname, $lastname, $username, $email, $password, $uid);
        $stmt->execute();
        $token = $uid . "-&&&&&+" . $password;
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
        echo json_encode(array("status" => "success", "data" => array("firstname" => $data['firstname'], "lastname" => $data['lastname'], "username" => $data['username'], "email" => $data['email'], "uid" => $uid, "token" => $cookie_for_user)));
    } else {
        echo json_encode(array("status" => "access denied"));
    }
} else {
    echo json_encode(array("status" => "access denied"));
}
