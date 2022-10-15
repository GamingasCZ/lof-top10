<?php
/*
Return codes:
0 - Connection error
1 - Empty request
2 - Invalid comment or user length
3 - Invalid list ID
4 - Invalid comment color
5 - Invalid comment type
6 - Comment sent!!
*/

require("secrets.php");
header('Content-type: application/json'); // Return as JSON

// Checking request
error_reporting(0);
$fuckupData = sanitizeInput(array($_POST["token"], $_POST["comment"], $_POST["comType"], $_POST["listID"], $_POST["comColor"]));

// Checking comment and user string length
if (strlen($_POST["comment"]) > 300 || strlen($_POST["comment"]) < 10) die("2");

// Is ID valid?
if ($_POST["listID"] == "-1") die("3");

// Is color valid?
if (preg_match("/^#[a-f0-9]{6}$/i", $_POST["comColor"]) == 0) die("4");

// Check if comment type is valid - 0: comment 1: reply
// REPLIES WILL BE ADDED LATER
if (!in_array($_POST["comType"], ["0", "1"])) die("5");

$mysqli = new mysqli($hostname, $username, $password, $database);

if ($mysqli->connect_errno) {
  echo "0";
  exit();
}

$discord_id = checkAccount(decrypt($_COOKIE["access_token"]))["id"];

$uid_query = $mysqli -> query(sprintf("SELECT `id` FROM `users` WHERE `discord_id` = '%s'", $discord_id));
$user_id = $uid_query -> fetch_all(MYSQLI_ASSOC)[0]["id"];

$time = new DateTime();

// Get ID of hidden list
if (preg_match('/[A-z]/', $fuckupData[3])) {
  $hiddenID = $mysqli->query(sprintf("SELECT `id` FROM `lists` WHERE `hidden`= '%s'", $fuckupData[3])) or die($mysqli->error);
  $fuckupData[3] = $hiddenID->fetch_all(MYSQLI_ASSOC)[0]["id"];
}

$template = "INSERT INTO `comments` (`username`,`comment`,`comType`,`bgcolor`,`listID`,`verified`,`timestamp`,`uid`) VALUES ('',?, ?, ?, ?, ?, ?, ?)";
$values = array($fuckupData[1], $fuckupData[2], $fuckupData[4], $fuckupData[3], "1", $time->getTimestamp(), $user_id);
$result = doRequest($mysqli, $template, $values, "sssssss");

echo "6";
$mysqli->close();

?>
