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
    && isset($_FILES['image']) && isset($_POST['lat']) && isset($_POST['lng'])) {
    $name = $_POST['name'];
    $address = $_POST['address'];
    $class = (int) $_POST['class'];
    $price = (int) $_POST['price'];
    $hasWifi = (int) $_POST['hasWifi'];
    $hasResto = (int) $_POST['hasResto'];
    $hasPool = (int) $_POST['hasPool'];
    $desc = $_POST['description'];
    $image = $_FILES['image'];
    $lat = (float) $_POST['lat'];
    $lng = (float) $_POST['lng'];

    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    //save uploaded image
    $source = $image['tmp_name'];
    $destination = 'uploads/hotels_img/' . $image['name'];
    move_uploaded_file($source, $destination);

    //mysql inserting a new row
    $result = "INSERT INTO hotels(name, address, class, price, hasWifi, hasRestaurant, hasPool, description, lat, lng, image)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $db->prepare($result);
    $stmt->bind_param('ssiiiiisdds', $name, $address, $class, $price, $hasWifi, $hasResto, $hasPool, $desc, $lat, $lng, $destination);
    
    //check if row is inserted or not
    if ($stmt->execute()) {
        $response["success"] = 1;
        $response["message"] = "Data hotel berhasil dimasukkan";
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