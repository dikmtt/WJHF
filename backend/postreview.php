<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

// Array for JSON response
$response = array();

// Check for required fields
if(isset($_POST['user_id']) && isset($_POST['hotel_id']) && isset($_POST['comment']) && isset($_POST['rating'])) {
    $user_id = (int) $_POST['user_id'];
    $hotel_id = (int) $_POST['hotel_id'];
    $comment = $_POST['comment'];
    $rating = (int) $_POST['rating'];
    $date = date("Y-m-d");

    require_once __DIR__ . '/dbconfig.php';

    // Connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    // MySQL inserting a new row
    $result = "INSERT INTO reviews(user_id, hotel_id, comment, rating, date_posted)
            VALUES(?, ?, ?, ?, ?)";
    $stmt = $db->prepare($result);
    $stmt->bind_param('iisis', $user_id, $hotel_id, $comment, $rating, $date);
    
    // Check if row is inserted or not
    if ($stmt->execute()) {
        $response["success"] = 1;
        $response["message"] = "Data ulasan berhasil dimasukkan";
    } else {
        $response["success"] = 0;
        $response["message"] = "Terdapat kesalahan";
    }
    echo json_encode($response);
} else {
    $response["success"] = 0;
    $response["message"] = "Data tidak lengkap";
    echo json_encode($response);
}
?>
