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

// Checking request
error_reporting(0);

$fuckupData = array($_POST["creator"], $_POST["comment"], $_POST["comType"], $_POST["listID"], $_POST["comColor"]);
$i = 0;
foreach ($fuckupData as $post) {
    if ($fuckupData[$i] == "") {
      echo "1";
      exit();
    }
    $fuckupData[$i] = htmlspecialchars(strip_tags(htmlspecialchars_decode($post)));
    $i += 1;
  }

error_reporting(1);

// Checking comment and user string length
if (strlen($_POST["comment"]) > 300 || strlen($_POST["creator"]) > 20) {
  echo "2";
  exit();
}
// Is ID valid?
if ($_POST["listID"] == "-1") {
  echo "3";
  exit();
}

// Is color valid?
if (preg_match("/^#[a-f0-9]{6}$/i", $_POST["comColor"]) == 0) {
  echo "4";
  exit();
}

// Check if comment type is valid - 0: comment 1: reply
// REPLIES WILL BE ADDED LATER
if (!in_array($_POST["comType"], ["0", "1"])) {
  echo "5";
  exit();
}

// Checking whether commenter's GD profile exists
$verified = 1;
$chkUsername = @file_get_contents("https://gdbrowser.com/api/profile/" . $_POST["creator"]);
if ($chkUsername === FALSE) {
  $verified = 2; // GDBrowser is down :(
}
elseif ($chkUsername === "-1") {
  $verified = 0; // User doesn't exist
}


$mysqli = new mysqli($hostname, $username, $password, $database);

if ($mysqli -> connect_errno) {
    echo "0";
    exit();
  }

$time = new DateTime();

// Prepare query template
$query = $mysqli -> prepare("INSERT INTO `comments` (`username`,`comment`,`comType`,`bgcolor`,`listID`,`verified`,`timestamp`)
                  VALUES (?, ?, ?, ?, ?, ?, ?)");

// Fill in template
$query -> bind_param("sssssss",
    $fuckupData[0], $fuckupData[1], $fuckupData[2], $fuckupData[4], $fuckupData[3], $verified, $time -> getTimestamp());

$query -> execute();
$query -> close();
echo "6";
$mysqli -> close();

?>
