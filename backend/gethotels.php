<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

//array for JSON response
$response = array();

if (isset($_POST['page_no'])) {
    $page_no = (int) $_POST['page_no'];
    $resPerPage = 10;
    $start = ($page_no - 1) * $resPerPage;

    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    $isSucc = false;
    $query =  "SELECT * FROM hotels ORDER BY name LIMIT $start, $resPerPage";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $row_post = $stmt->get_result();

    $queryTot =  "SELECT COUNT(*) as hotelCount FROM hotels";
    $stmtTot = $db->query($queryTot);
    //$stmtTot->execute();
    $total = $stmtTot->fetch_assoc();

    $trueTotal = ceil($total["hotelCount"] / $resPerPage);

    $isSucc = true;
    $response["post"] = array();

        while($row_post_ex = mysqli_fetch_array($row_post, MYSQLI_ASSOC)) {
            $post = array();
            $post["id"] = $row_post_ex["id"];
            $post["name"] = $row_post_ex["name"];
            $post["address"] = $row_post_ex["address"];
            $post["class"] = $row_post_ex["class"];
            $post["price"] = $row_post_ex["price"];
            $post["hasWifi"] = $row_post_ex["hasWifi"];
            $post["hasResto"] = $row_post_ex["hasRestaurant"];
            $post["hasPool"] = $row_post_ex["hasPool"];
            $post["desc"] = $row_post_ex["description"];
            $post["lat"] = $row_post_ex["lat"];
            $post["lng"] = $row_post_ex["lng"];
            $post["image"] = $row_post_ex["image"];

            array_push($response["post"], $post);
        }
    $response["total"] = $trueTotal;
    
    //check if row is inserted or not
    if ($isSucc) {
        $response["success"] = 1;
        $response["message"] = "Data hotel berhasil didapatkan";
    } else {
        $response["success"] = 0;
        $response["message"] = "Terdapat kesalahan";
    }
    echo json_encode($response);
} else {
    $response["success"] = 0;
    $response["message"] = "Data tidak lengkap";
}
?>