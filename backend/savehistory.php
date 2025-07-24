<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

//array for JSON response
$response = array();

//check for required fields
if(isset($_POST['userId']) && isset($_POST['hotelIds'])) {
    $userId = (int) $_POST['userId'];
    $hotelIds = $_POST['hotelIds'];
    $hotelIdsParsed = json_decode($hotelIds);

    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    //save uploaded image
    $date = date("Y-m-d");

    $isSucc = false;
    $bestHotels = array();

    //mysql inserting a new row
    for($i = 0; $i < count($hotelIdsParsed); $i++) {
        $result = "INSERT INTO history(user_id, hotel_id, date) VALUES(?, ?, ?)";
        $stmt1 = $db->prepare($result);
        $stmt1->bind_param('iis', $userId, $hotelIdsParsed[$i], $date);
        $stmt1->execute();

        $query =  "SELECT * FROM hotels WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param('i', $hotelIdsParsed[$i]);
        $stmt->execute();
        $row_post_ex = $stmt->get_result()->fetch_assoc();

        $post = array();
        $post["id"] = $row_post_ex["id"];
        $post["name"] = $row_post_ex["name"];
        $post["image"] = $row_post_ex["image"];
        $post["price"] = $row_post_ex["price"];
        $post["class"] = $row_post_ex["class"];
        $post["hasWifi"] = $row_post_ex["hasWifi"];
        $post["hasResto"] = $row_post_ex["hasRestaurant"];
        $post["hasPool"] = $row_post_ex["hasPool"];
        array_push($bestHotels, $post);
    }

    $response["post"] = $bestHotels;
    $isSucc = true;
    //check if row is inserted or not
    if ($isSucc) {
        $response["success"] = 1;
        $response["message"] = "Data history berhasil dimasukkan";
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