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
$fuckupData = sanitizeInput(array($_POST["creator"], $_POST["comment"], $_POST["comType"], $_POST["listID"], $_POST["comColor"]));

// Checking comment and user string length
if (strlen($_POST["comment"]) > 300 || strlen($_POST["creator"]) > 20) die("2");

// Is ID valid?
if ($_POST["listID"] == "-1") die("3");

// Is color valid?
if (preg_match("/^#[a-f0-9]{6}$/i", $_POST["comColor"]) == 0) die("4");

// Check if comment type is valid - 0: comment 1: reply
// REPLIES WILL BE ADDED LATER
if (!in_array($_POST["comType"], ["0", "1"])) die("5");

// Checking whether commenter's GD profile exists
$verified = 1;
$chkUsername = @file_get_contents("https://gdbrowser.com/api/profile/" . $_POST["creator"]);

if ($chkUsername === FALSE) $verified = 2; // GDBrowser is down :(
elseif ($chkUsername === "-1") $verified = 0; // User doesn't exist

$mysqli = new mysqli($hostname, $username, $password, $database);

if ($mysqli->connect_errno) {
  echo "0";
  exit();
}

$time = new DateTime();

// Get ID of hidden list
if (preg_match('/[A-z]/', $fuckupData[3])) {
  $hiddenID = $mysqli->query(sprintf("SELECT `id` FROM `lists` WHERE `hidden`= '%s'", $fuckupData[3])) or die($mysqli->error);
  $fuckupData[3] = $hiddenID->fetch_all(MYSQLI_ASSOC)[0]["id"];
}

$template = "INSERT INTO `comments` (`username`,`comment`,`comType`,`bgcolor`,`listID`,`verified`,`timestamp`) VALUES (?, ?, ?, ?, ?, ?, ?)";
$values = array($fuckupData[0], $fuckupData[1], $fuckupData[2], $fuckupData[4], $fuckupData[3], $verified, $time->getTimestamp());
$result = doRequest($mysqli, $template, $values, "sssssss");

echo "6";
$mysqli->close();

?>
