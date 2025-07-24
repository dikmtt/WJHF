<?php
if(isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
}

//array for JSON response
$response = array();

if(isset($_POST['hotelId']) && isset($_POST['userId'])) {
    $hId = (int) $_POST['hotelId'];
    $uId = (int) $_POST['userId'];

    require_once __DIR__ . '/dbconfig.php';

    //connecting to db
    $db = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or
    die(mysqli_connect_error());

    $isSucc = false;
    $query =  "
                SELECT reviews.*, users.username, users.profile_pic FROM reviews 
                JOIN users on reviews.user_id = users.id
                WHERE reviews.hotel_id = ?
            ";
    $stmt = $db->prepare($query);
    $stmt->bind_param('i', $hId);
    $stmt->execute();
    $row_post = $stmt->get_result();
    $isSucc = true;

    $response["reviews"] = array();
    $review_no = 0;
    $review_rating = 0;

    while($row_post_ex = mysqli_fetch_array($row_post, MYSQLI_ASSOC)) {
        $rev = array();
        $rev["username"] = $row_post_ex["username"];
        $rev["profile_pic"] = $row_post_ex["profile_pic"];
        $rev["comment"] = $row_post_ex["comment"];
        $rev["rating"] = $row_post_ex["rating"];
        $rev["date"] = $row_post_ex["date_posted"];

        $review_no = $review_no + 1;
        $review_rating = $review_rating + $row_post_ex["rating"];

        array_push($response["reviews"], $rev);
    }
    
    if($review_no > 0) {
        $response["avg_rating"] = $review_rating / $review_no;
    } else {
        $response["avg_rating"] = 0;
    }
    
    //check if row is inserted or not
    if ($isSucc) {
        $response["success"] = 1;
        $response["message"] = "Data ulasan berhasil didapatkan";
    } else {
        $response["success"] = 0;
        $response["message"] = "Terdapat kesalahan";
    }
    echo json_encode($response);
}
?>