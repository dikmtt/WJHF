<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

$response = array();

if(isset($_POST['hotel_id']) && isset($_POST['user_id']) && isset($_POST['type'])) {
    $hotel_id = (int)$_POST['hotel_id'];
    $user_id = (int)$_POST['user_id'];
    $type = $_POST['type'];

    require_once __DIR__ . '/dbconfig.php';
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or die(mysqli_connect_error());

    if($type == "check") {
        $query = "SELECT 1 FROM favs WHERE user_id = ? AND hotel_id = ? LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bind_param('ii', $user_id, $hotel_id);
        $stmt->execute();
        $stmt->store_result();
        $response["isFav"] = ($stmt->num_rows > 0) ? 1 : 0;

        //get total favs of hotel
        $query2 = "SELECT * FROM favs WHERE hotel_id = ?";
        $stmt2 = $db->prepare($query2);
        $stmt2->bind_param('i', $hotel_id);
        $stmt2->execute();
        $stmt2->store_result();
        $response["totalFavs"] =($stmt2->num_rows);
    } 
    else if ($type == "fav") {
        //check if there already is a row where the user id and hotel id are the ones being passed
        $checkQuery = "SELECT 1 FROM favs WHERE hotel_id = ? AND user_id = ?";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bind_param('ii', $hotel_id, $user_id);
        $checkStmt->execute();
        $checkStmt->store_result();
        
        //if there are none, insert new fav
        if($checkStmt->num_rows == 0) {
            $query = "INSERT INTO favs(hotel_id, user_id) VALUES(?, ?)";
            $stmt = $db->prepare($query);
            $stmt->bind_param('ii', $hotel_id, $user_id);
            $stmt->execute();
            $response["isFav"] = 1;
        }
    } 
    else if($type == "unfav") {
        $query = "DELETE FROM favs WHERE user_id = ? AND hotel_id = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param('ii', $user_id, $hotel_id);
        $stmt->execute();
        $response["isFav"] = 0;
    }

    $response["success"] = 1;
    $response["message"] = "Aktivitas favorit hotel berhasil";
} else {
    $response["success"] = 0;
    $response["message"] = "Data tidak lengkap";
}

echo json_encode($response);
?>