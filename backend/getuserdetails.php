<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

//array for JSON response
$response = array();

if(isset($_POST['userId']) && isset($_POST['type'])) {
    $uId = (int) $_POST['userId'];
    $type = $_POST['type'];

    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    $isSucc = false;
    if($type == "Reviews") {
        $query =  "
                    SELECT reviews.*, users.username, users.profile_pic, hotels.name FROM reviews 
                    JOIN users on reviews.user_id = users.id
                    JOIN hotels on reviews.hotel_id = hotels.id
                    WHERE reviews.user_id = ?
                    ORDER BY reviews.date_posted DESC, reviews.id DESC
                ";
    } else if($type == "Favs") {
        $query = "
                    SELECT hotels.* from favs
                    JOIN hotels on favs.hotel_id = hotels.id
                    WHERE favs.user_id = ?
                    ORDER BY hotels.name
                ";
    } else if($type == "Recs") {
        $query = "
                    SELECT hotels.*, history.date, history.id from history
                    JOIN hotels on history.hotel_id = hotels.id
                    WHERE history.user_id = ?
                    ORDER BY history.date DESC, history.id DESC
                ";
    }
    $stmt = $db->prepare($query);
    $stmt->bind_param('i', $uId);
    $stmt->execute();
    $row_post = $stmt->get_result();
    $isSucc = true;

    $response["resp_data"] = array();

    while($row_post_ex = mysqli_fetch_array($row_post, MYSQLI_ASSOC)) {
        if($type == "Reviews") {
            $rev = array();
            $rev["username"] = $row_post_ex["username"];
            $rev["profile_pic"] = $row_post_ex["profile_pic"];
            $rev["comment"] = $row_post_ex["comment"];
            $rev["rating"] = $row_post_ex["rating"];
            $rev["date"] = $row_post_ex["date_posted"];
            $rev["hotel_name"] = $row_post_ex["name"];

            array_push($response["resp_data"], $rev);
        } else if($type == "Favs") {
            $fav = array();
            $fav["name"] = $row_post_ex["name"];
            $fav["class"] = $row_post_ex["class"];
            $fav["address"] = $row_post_ex["address"];
            $fav["image"] = $row_post_ex["image"];

            array_push($response["resp_data"], $fav);
        } else if($type == "Recs") {
            $rec = array();
            $rec["name"] = $row_post_ex["name"];
            $rec["class"] = $row_post_ex["class"];
            $rec["address"] = $row_post_ex["address"];
            $rec["image"] = $row_post_ex["image"];
            $rec["hist_date"] = $row_post_ex["date"];

            array_push($response["resp_data"], $rec);
        }
    }
    
    //check if row is inserted or not
    if ($isSucc) {
        $response["success"] = 1;
        $response["message"] = "Data untuk profil berhasil didapatkan";
    } else {
        $response["success"] = 0;
        $response["message"] = "Terdapat kesalahan";
    }
    echo json_encode($response);
}
?>