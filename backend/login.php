<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

//array for JSON response
$response = array();

//check for required fields
if(isset($_POST['email']) && isset($_POST['password'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    $isSucc = false;
    $query =  "SELECT * FROM users where email = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    if($row) {
        if(!password_verify($password, $row['password'])) {
            $isSucc = false;
        }
        else {
            $isSucc = true;
            $response["user"] = array();

            //Add date joined
            $user = array();
            $user["id"] = $row["id"];
            $user["email"] = $row["email"];
            $user["username"] = $row["username"];
            $user["password"] = $row["password"];
            //$user["real_name"] = $row["full_name"];
            $user["bio"] = $row["bio"];
            $user["profile_pic"] = $row["profile_pic"];
            $user["is_admin"] = $row["is_admin"];
            $user["is_active"] = $row["is_active"];
            $user["date_created"] = $row["date_created"];
            array_push($response["user"], $user);
        }
    }
    
    //check if row is inserted or not
    if ($isSucc) {
        $response["success"] = 1;
        $response["message"] = "Data user berhasil didapatkan";
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