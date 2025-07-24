<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

//array for JSON response
$response = array();

//check for required fields
if(isset($_POST['name']) && isset($_POST['type'])
    && isset($_FILES['image']) && isset($_POST['lat']) && isset($_POST['lng'])) {
    $name = $_POST['name'];
    $type = $_POST['type'];
    $image = $_FILES['image'];
    $lat = (float) $_POST['lat'];
    $lng = (float) $_POST['lng'];

    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    //save uploaded image
    $source = $image['tmp_name'];
    $destination = 'uploads/dest_img/' . $image['name'];
    move_uploaded_file($source, $destination);

    //mysql inserting a new row
    $result ="INSERT INTO destinations(name, type, lat, lng, image)
            VALUES(?, ?, ?, ?, ?)";
    $stmt = $db->prepare($result);
    $stmt->bind_param('ssdds', $name, $type, $lat, $lng, $destination);
    
    //check if row is inserted or not
    if ($stmt->execute()) {
        $response["success"] = 1;
        $response["message"] = "Data tempat wisata berhasil dimasukkan";
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