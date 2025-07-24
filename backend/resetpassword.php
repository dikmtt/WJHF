<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

// Array for JSON response
$response = array();

// Check for required fields
if(isset($_POST['email']) && isset($_POST['isfirstsubmit'])) {
    $email = $_POST['email'];
    $isfirstsubmit = (int) $_POST['isfirstsubmit'];
    if($isfirstsubmit === 1 && isset($_POST['password'])) {
        $password = $_POST['password'];
    }

    require_once __DIR__ . '/dbconfig.php';

    // Connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    if($isfirstsubmit === 0) {
        $query = "SELECT * from users where email = ?";
        $stmt1 = $db->prepare($query);
        $stmt1->bind_param('s', $email);
        $stmt1->execute();
        $row_stmt1 = $stmt1->get_result();
        if($row_stmt1->num_rows === 0) {
            $response["user_exists"] = 0;
        } else {
            $response["user_exists"] = 1;
        }
        echo json_encode($response);
    } else {
        // Encrypt password using hash
        $en_pass = password_hash($password, PASSWORD_BCRYPT);

        // MySQL inserting a new row
        $result = "UPDATE users SET password = ? WHERE email = ?";
        $stmt = $db->prepare($result);
        $stmt->bind_param('ss', $en_pass, $email);
        
        // Check if row is inserted or not
        if ($stmt->execute()) {
            $response["success"] = 1;
            $response["message"] = "Password user berhasil diganti";
        } else {
            $response["success"] = 0;
            $response["message"] = "Terdapat kesalahan";
        }
        echo json_encode($response);
    }
} else {
    $response["success"] = 0;
    $response["message"] = "Data tidak lengkap";
    echo json_encode($response);
}
?>
