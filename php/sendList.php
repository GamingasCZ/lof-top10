<?php

/*
Return codes: 
0 - Connection error
1 - Empty request
2 - Invalid listName length
3 - Invalid listCreator length
4 - List too big
*/

require("secrets.php");
header('Content-type: application/json'); // Return as JSON

$mysqli = new mysqli($hostname, $username, $password, $database);
$time = new DateTime();

// Cannot connect to database
if ($mysqli -> connect_errno) {
  echo "0";
  exit();
}

// Invalid listName length
if (strlen($_POST["lName"]) < 3 || strlen($_POST["lName"]) > 40) {
  echo "2";
  exit();
}

// Invalid listCreator length
if (strlen($_POST["lCreator"]) < 3 || strlen($_POST["lCreator"]) > 20) {
  echo "3";
  exit();
}

// Check list size
$len = strlen($_POST["listData"]);
if ($len > 25000 || $len < 150) {
  echo "4";
  exit();
}

// Checking request
error_reporting(0);
$fuckupData = sanitizeInput(array($_POST["lCreator"],$_POST["lName"],$_POST["listData"]));
$timestamp = $time -> getTimestamp();

// Generate id if list private
if (isset($_POST["hidden"])) { $hidden = privateIDGenerator($fuckupData["lname"], $fuckupData["lCreator"], $timestamp); }
else { $hidden = "0"; }

// Password for editing
$pass = passwordGenerator($_POST["lName"], $_POST["lCreator"], $timestamp);

// Send to database
$teplate = "INSERT INTO `lists`(`creator`,`name`,`data`,`timestamp`,`hidden`) VALUES (?,?,?,?,?)";
$values = array($fuckupData[0], $fuckupData[1], $fuckupData[2], $timestamp, $hidden);
doRequest($mysqli, $teplate, $values, "sssss");

if (isset($_POST["hidden"])) {
    // Hidden lists
    $listID = $hidden;
}
else {
    $listIDquery = $mysqli -> query("SELECT LAST_INSERT_ID()");
    $rows = $listIDquery -> fetch_all(MYSQLI_ASSOC);
    foreach ($rows as $row) {
      $listID = join("",$row);
    }
}
$mysqli -> close();

echo json_encode([$pass, $listID]);

?>
