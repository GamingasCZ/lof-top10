<?php
/*
Return codes:
0 - Error connecting to database
1 - Empty/incomplete request
2 - Incorrect password
3 - List needs password
4 - Success!!
*/

require("secrets.php");
header('Content-type: application/json'); // Return as JSON

$mysqli = new mysqli($hostname, $username, $password, $database);
if ($mysqli -> connect_errno) {
    echo "0";
    //http_response_code(500);
    exit();
}

error_reporting(0);

if (isset($_POST["id"])) {
    $listType = Array($_POST["id"], "id");
}
elseif (isset($_POST["pid"])) {
    $listType = Array($_POST["pid"], "hidden");
}
else {
    echo "1";
    //http_response_code(400);
    exit();
}
$datacheck = sanitizeInput([$listType[0]]);

$listData = doRequest($mysqli, sprintf("SELECT * FROM `lists` WHERE `%s`= ?", $listType[1]), [$datacheck[0]], "s");

$owner = checkListOwnership($mysqli, $listData["uid"]);
if ($owner) {
    $listData["data"] = htmlspecialchars_decode($listData["data"]);
    echo json_encode($listData);
}
?>
