<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

//array for JSON response
$response = array();

//check for required fields
if(isset($_POST['user_id']) && isset($_POST['username']) && 
    isset($_POST['bio']) && (isset($_FILES['profile_pic']) || isset($_POST['oldpp']))) {
    $userId = (int)$_POST['user_id'];
    $username = $_POST['username'];
    $bio = $_POST['bio'];
    if(isset($_FILES['profile_pic'])) {
        $image = $_FILES['profile_pic'];
    } else {
        $image = $_POST['oldpp'];
    }

    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    //save uploaded image
    if(isset($_FILES['profile_pic'])) {
        $source = $image['tmp_name'];
        $destination = 'uploads/profile_pics/' . $image['name'];
        move_uploaded_file($source, $destination);
    } else {
        $destination = $image;
    }

    //$isSucc = false;
    $query =  "UPDATE users SET username = ?, bio = ?, profile_pic = ? WHERE id = ?";
    //$array = array($username, $full_name, $bio, $destination, $userId);
    $stmt = $db->prepare($query);
    $stmt->bind_param("sssi", $username, $bio, $destination, $userId);
    //$stmt->execute();
    
    //check if row is inserted or not
    if($stmt->execute()) {
        $response["success"] = 1;
        $response["message"] = "Data user berhasil diedit";
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