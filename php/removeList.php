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
error_reporting(0);
$fuckupData = sanitizeInput(array($_POST["id"],$_POST["pwdEntered"]));

// Password check
$listData = doRequest($mysqli, "SELECT * FROM `lists` WHERE `id` = ?", [strval($fuckupData[0])], "i");
$listPass = passwordGenerator($listData["name"], $listData["creator"], $listData["timestamp"]);

// Invalid password
if ($listPass != $fuckupData[1]) {
  echo "2";
  http_response_code(401);
  $mysqli -> close();
  exit();
}

// Removing list
doRequest($mysqli, "DELETE FROM `lists` WHERE `id` = ?", [$listData["id"]], "i");
echo "3";

$mysqli -> close();
?>
