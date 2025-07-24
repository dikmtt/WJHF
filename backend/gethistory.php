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
    $resPerPage = 20;
    $start = ($page_no - 1) * $resPerPage;
    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    $isSucc = false;
    $query =  "
        SELECT history.*, users.username, hotels.name FROM history
        JOIN hotels ON history.hotel_id = hotels.id
        JOIN users ON history.user_id = users.id
        ORDER BY date DESC, id DESC
        LIMIT $start, $resPerPage
    ";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $row_post = $stmt->get_result();

    $queryTot =  "SELECT COUNT(*) as historyCount FROM history";
    $stmtTot = $db->query($queryTot);
    //$stmtTot->execute();
    $total = $stmtTot->fetch_assoc();

    $trueTotal = ceil($total["historyCount"] / $resPerPage);

    $isSucc = true;
    $response["history"] = array();

        while($row_post_ex = mysqli_fetch_array($row_post, MYSQLI_ASSOC)) {
            $hist = array();
            $hist["username"] = $row_post_ex["username"];
            $hist["hotelname"] = $row_post_ex["name"];
            $hist["date"] = $row_post_ex["date"];

            array_push($response["history"], $hist);
        }
    $response["total"] = $trueTotal;
    
    //check if row is inserted or not
    if ($isSucc) {
        $response["success"] = 1;
        $response["message"] = "Data history berhasil didapatkan";
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