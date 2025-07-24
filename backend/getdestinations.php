<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

//array for JSON response
$response = array();

    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    $isSucc = false;
    $query =  "SELECT * FROM destinations ORDER BY name";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $row_post = $stmt->get_result();
    $isSucc = true;
    $response["dest"] = array();

        while($row_post_ex = mysqli_fetch_array($row_post, MYSQLI_ASSOC)) {
            $dest = array();
            $dest["id"] = $row_post_ex["id"];
            $dest["name"] = $row_post_ex["name"];
            $dest["type"] = $row_post_ex["type"];
            $dest["lat"] = $row_post_ex["lat"];
            $dest["lng"] = $row_post_ex["lng"];
            $dest["image"] = $row_post_ex["image"];

            array_push($response["dest"], $dest);
        }
    
    
    //check if row is inserted or not
    if ($isSucc) {
        $response["success"] = 1;
        $response["message"] = "Data tempat wisata berhasil didapatkan";
    } else {
        $response["success"] = 0;
        $response["message"] = "Terdapat kesalahan";
    }
    echo json_encode($response);

?>