<?php
/*
Return codes: 
0 - Connection error
1 - Empty request
2 - Invalid password
3 - Success!
*/

require("secrets.php");
header('Content-type: application/json'); // Return as JSON

$mysqli = new mysqli($hostname, $username, $password, $database);

if ($mysqli -> connect_errno) {
  http_response_code(500);
  echo "0";
  exit();
}

// Checking request
$fuckupData = sanitizeInput(array($_POST["id"]));

// Password check
if ($_POST["isHidden"] == 0) {
  $listData = doRequest($mysqli, "SELECT * FROM `lists` WHERE `id` = ?", [strval($fuckupData[0])], "i");
}
else {
  $listData = doRequest($mysqli, "SELECT * FROM `lists` WHERE `hidden` = ?", [strval($fuckupData[0])], "s");
}

// This causes passwords to not work, hopefully no one minds :)
$creatorCheck = checkListOwnership($mysqli, $listData["uid"]);
if (!$creatorCheck) {
  $mysqli -> close();
  http_response_code(401);
  die("2");
}

// Removing list
if ($_POST["isHidden"] == 0) {
  doRequest($mysqli, "DELETE FROM `lists` WHERE `id` = ?", [$listData["id"]], "i");
}
else {
  doRequest($mysqli, "DELETE FROM `lists` WHERE `hidden` = ?", [$listData["hidden"]], "s");
}
echo "3";

$mysqli -> close();
?>
