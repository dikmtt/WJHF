<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

// Array for JSON response
$response = array();

// Check for required fields
if(isset($_POST['email']) && isset($_POST['username']) && isset($_POST['password'])) {
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $bio = "Looking for hotels...";
    $profile_pic = "uploads/profile_pics/default.svg";

    $is_admin = 0;
    $emailbeforeat = explode('@', $email);
    if(str_contains($emailbeforeat[0], "admin")) {
        $is_admin = 1;
    }
    $date = date("Y-m-d");

    require_once __DIR__ . '/dbconfig.php';

    // Connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    // Encrypt password using hash
    $en_pass = password_hash($password, PASSWORD_BCRYPT);

    // MySQL inserting a new row
    $result = "INSERT INTO users(email, username, password, bio, profile_pic, is_admin, date_created)
            VALUES(?, ?, ?, ?, ?, ?, ?)";
    $stmt = $db->prepare($result);
    $stmt->bind_param('sssssis', $email, $username, $en_pass, $bio, $profile_pic, $is_admin, $date);
    
    // Check if row is inserted or not
    if ($stmt->execute()) {
        $response["success"] = 1;
        $response["message"] = "Data user berhasil dimasukkan";
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
