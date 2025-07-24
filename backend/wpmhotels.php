<?php
//function to calculate the distance between hotel and destination using haversine formula
function calculateDistance($hotLat, $hotLng, $destLat, $destLng) {
    $earthRad = 6371000;
    //degrees to radians
    $hotLatD = deg2rad($hotLat);
    $hotLngD = deg2rad($hotLng);
    $destLatD = deg2rad($destLat);
    $destLngD = deg2rad($destLng);

    $latDel = $destLatD - $hotLatD;
    $lngDel = $destLngD - $hotLngD;

    $ang = 2 * asin(sqrt(pow(sin($latDel / 2), 2) + 
            cos($hotLatD) * cos($destLatD) * pow(sin($lngDel / 2), 2)));
    return $ang * $earthRad;
}

if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

//array for JSON response
$response = array();
if(isset($_POST['benOrCost']) && isset($_POST['destId'])) {
    $benOrCost = json_decode($_POST['benOrCost']);
    $destId = (int) $_POST['destId'];

    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    $isSucc = false;

    //Get Destination from ID
    $getDest = "SELECT * from destinations WHERE id = ?";
    $stmt = $db->prepare($getDest);
    $stmt->bind_param('i', $destId);
    $stmt->execute();
    $destData = $stmt->get_result()->fetch_assoc();
    $destlat = $destData["lat"];
    $destlng = $destData["lng"];

    //$isSucc = false;
    //hasWifi, hasResto, and hasPool values are added 1 for possible calculation
    //to calculate the distance, use the haversine formula
    $query =  "SELECT * FROM hotels";
    $stmt2 = $db->prepare($query);
    $stmt2->execute();
    $row_hotel = $stmt2->get_result();
    $isSucc = true;

    //numeric values
    $response["wpmHotels"] = array();
    $response["idAndName"] = array();

        while($row_ht = mysqli_fetch_array($row_hotel, MYSQLI_ASSOC)) {
            $wpmHotels = array();
            $idAndName = array();
            $idAndName["id"] = $row_ht["id"];
            $idAndName["name"] = $row_ht["name"];
            $wpmHotels["class"] = $row_ht["class"];
            $wpmHotels["price"] = $row_ht["price"];
            $wpmHotels["hasWifi"] = $row_ht["hasWifi"] + 1;
            $wpmHotels["hasResto"] = $row_ht["hasRestaurant"] + 1;
            $wpmHotels["hasPool"] = $row_ht["hasPool"] + 1;
            $wpmHotels["distance"] = calculateDistance($row_ht["lat"], $row_ht["lng"], $destlat, $destlng);

            array_push($response["wpmHotels"], $wpmHotels);
            array_push($response["idAndName"], $idAndName);
        }

        //hotel ID and name
        /*$response["idAndName"] = array();

        while($row_ht2 = mysqli_fetch_array($row_hotel, MYSQLI_ASSOC)) {
            $idAndName = array();
            $idAndName["id"] = $row_ht2["id"];
            $idAndName["name"] = $row_ht2["name"];

            array_push($response["idAndName"], $idAndName);
        }*/
    
    
    //check if row is inserted or not
    if ($isSucc) {
        $response["success"] = 1;
        $response["message"] = "Continuing to the calculation process";
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