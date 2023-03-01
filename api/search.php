<?php
include("../includes/db.inc.php");
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data) && isset($_COOKIE["token"])) {
    $searchTerm = $data['searchTerm'];
    $whichGroup = 0;
    $whichGroup = $whichGroup * 10;
    $searchTerm = mysqli_real_escape_string($conn, $searchTerm);

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
        $data_to_send = array("search" => array("totalResults" => $result->num_rows, "results" => []));
        while ($row = $result->fetch_assoc()) {
            $user_data = array("uid" => $row['userUID'], "firstname" => $row['firstname'], "lastname" => $row['lastname'], "username" => $row['username'], "profile" => $row['profileImage']);
            array_push($data_to_send['search']['results'], $user_data);
        }
        echo json_encode($data_to_send);
    } else {
        echo json_encode(array("search" => array("totalResults" => 0)));
    }
} else {
    echo json_encode(array("search" => array("totalResults" => 0)));
}
