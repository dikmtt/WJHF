<?php
// CORS headers for cross-origin requests
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

// JSON response array
$response = array();

// Check for required fields
if (isset($_POST['hotel_id'])) {
    $hotel_id = (int) $_POST['hotel_id'];

    // Include the database configuration file
    require_once __DIR__ . '/dbconfig.php';

    // Connect to the database
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or die(mysqli_connect_error());

    // Query to delete the hotel
    $stmt = $db->prepare("DELETE FROM hotels WHERE id = ?");
    $stmt->bind_param("i", $hotel_id);
    $stmt->execute();

    // Check if the hotel was deleted successfully
    if ($stmt->affected_rows > 0) {
        $response["success"] = 1;
        $response["message"] = "Data hotel berhasil dihapus";
    } else {
        $response["success"] = 0;
        $response["message"] = "Terdapat kesalahan";
    }

    $stmt->close();
    $db->close();
} else {
    $response["success"] = 0;
    $response["message"] = "Data tidak lengkap";
}

echo json_encode($response);