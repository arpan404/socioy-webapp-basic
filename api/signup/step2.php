<?php
include("../../includes/db.inc.php");
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['username']) && isset($data['email'])) {
    $username = $data['username'];
    $email = $data['email'];
    $check_username = "SELECT * FROM loginInfo WHERE username = '$username'";
    $check_email = "SELECT * FROM loginInfo WHERE email = '$email'";
    $username_result = $conn->query($check_username);
    $email_result = $conn->query($check_email);
    if ($username_result->num_rows === 0 && $email_result->num_rows === 0) {
        echo json_encode(array("status" => "success", "data" => array("username" => "available", "email" => "available")));
    } else if ($username_result->num_rows > 0 && $email_result->num_rows === 0) {
        echo json_encode(array("status" => "success", "data" => array("username" => "not available", "email" => "available")));
    } else if ($username_result->num_rows === 0 && $email_result->num_rows > 0) {
        echo json_encode(array("status" => "success", "data" => array("username" => "available", "email" => "not available")));
    } else {
        echo json_encode(array("status" => "success", "data" => array("username" => "not available", "email" => "not available")));
    }
} else {
    echo json_encode(array("status" => "access denied"));
}
