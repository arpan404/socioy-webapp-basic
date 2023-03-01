<?php
include("../includes/db.inc.php");
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data) && isset($_COOKIE["token"])) {
    $searchTerm = $data['searchTerm'];
    $whichGroup = 0;
    $whichGroup = $whichGroup * 10;
    $searchTerm = mysqli_real_escape_string($conn, $searchTerm);

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
        echo json_encode(array("search" => array("totalResults" => 0)));
        die();
    } else {
        $sqlQuery = "SELECT *, 
        case when username = '$searchTerm' then 1
             when concat(firstname, ' ', lastname) = '$searchTerm' then 2
             when email LIKE '%$searchTerm%' then 3
             when firstname LIKE '%$searchTerm%' then 4
             when lastname LIKE '%$searchTerm%' then 5
             else 6
             end as priority
            FROM loginInfo
            WHERE username = '$searchTerm'
            OR username LIKE '%$searchTerm%'
            OR concat(firstname, ' ', lastname) LIKE '%$searchTerm%'
            OR email LIKE '%$searchTerm%'
            OR firstname LIKE '%$searchTerm%'
            OR lastname LIKE '%$searchTerm%'
             ORDER BY priority  LIMIT 15";
        $result = mysqli_query($conn, $sqlQuery);
        if ($result->num_rows > 0) {
            $result_number = 0;
            $total_friends_results = [];
            while ($row = $result->fetch_assoc()) {
                $userUID_search = $row['userUID'];
                $check_is_following = $conn->query("SELECT * FROM followingDATA WHERE follower = '$userUID' AND following = '$userUID_search'");
                $check_is_being_followed = $conn->query("SELECT * FROM followingDATA WHERE following = '$userUID' AND follower = '$userUID_search'");
                if ($check_is_following->num_rows > 0 && $check_is_being_followed->num_rows > 0) {
                    $user_data = array("uid" => $row['userUID'], "firstname" => $row['firstname'], "lastname" => $row['lastname'], "username" => $row['username'], "profile" => $row['profileImage']);
                    array_push($total_friends_results, $user_data);
                    $result_number++;
                }
            }
            if ($result_number === 0) {
                echo json_encode(array("search" => array("totalResults" => 0)));
            } else {
                echo json_encode(array("search" => array("totalResults" => $result_number, "results" => $total_friends_results)));
            }
        } else {
            echo json_encode(array("search" => array("totalResults" => 0)));
        }
    }
} else {
    echo json_encode(array("search" => array("totalResults" => 0)));
}
