<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

//array for JSON response
$response = array();

//check for required fields
if(isset($_POST['name']) && isset($_POST['address']) && isset($_POST['class']) && isset($_POST['price'])
    && isset($_POST['hasWifi']) && isset($_POST['hasResto']) && isset($_POST['hasPool']) && isset($_POST['description'])
    && isset($_POST['lat']) && isset($_POST['lng']) && (isset($_FILES['image']) || isset($_POST['oldimg']))
    && isset($_POST['hotelId'])) {
    $name = $_POST['name'];
    $address = $_POST['address'];
    $class = (int) $_POST['class'];
    $price = (int) $_POST['price'];
    $hasWifi = (int) $_POST['hasWifi'];
    $hasResto = (int) $_POST['hasResto'];
    $hasPool = (int) $_POST['hasPool'];
    $desc = $_POST['description'];
    $lat = $_POST['lat'];
    $lng =  $_POST['lng'];
    if(isset($_FILES['image'])) {
        $image = $_FILES['image'];
    } else {
        $image = $_POST['oldimg'];
    }
    $hotelId = (int) $_POST['hotelId'];

    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    //save uploaded image
    if(isset($_FILES['image'])) {
        $source = $image['tmp_name'];
        $destination = 'uploads/hotels_img/' . $image['name'];
        move_uploaded_file($source, $destination);
    } else {
        $destination = $image;
    }

    //mysql inserting a new row
    //$result = mysqli_query($db, "INSERT INTO hotels(name, address, class, price, hasWifi, hasRestaurant, hasPool, description, lat, lng, image)
    //        VALUES('$name', '$address', '$class', '$price', '$hasWifi', '$hasResto', '$hasPool', '$desc', '$lat', '$lng', '$destination')");
    $result = "UPDATE hotels SET name = ?, address = ?, class = ?, price = ?, hasWifi = ?, 
                hasRestaurant = ?, hasPool = ?, description = ?, lat = ?, lng = ?, image = ? WHERE id = ?";
    $stmt = $db->prepare($result);
    $stmt->bind_param('ssiiiiisddsi', $name, $address, $class, $price, $hasWifi, $hasResto, $hasPool, $desc, $lat, $lng, $destination, $hotelId);
    
    //check if row is inserted or not
    if ($stmt->execute()) {
        $response["success"] = 1;
        $response["message"] = "Data hotel berhasil diedit";
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