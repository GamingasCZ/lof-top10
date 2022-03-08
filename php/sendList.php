<?php

require("secrets.php");
header('Content-type: application/json'); // Return as JSON

$mysqli = new mysqli($hostname, $username, $password, $database);
$time = new DateTime();

if ($mysqli -> connect_errno) {
  echo "0";
  exit();
}

// Checking request
error_reporting(0);
$fuckupData = sanitizeInput(array($_POST["creator"],$_POST["lName"],$_POST["listData"]));
$timestamp = $time -> getTimestamp();

// Generate id if list private
if (isset($_POST["hidden"])) { $hidden = privateIDGenerator($fuckupData["lname"], $fuckupData["creator"], $timestamp); }
else { $hidden = "0"; }

// Password for editing
$pass = passwordGenerator($_POST["lName"], $_POST["creator"], $timestamp);

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

header("location:http://www.gamingas.wz.cz/lofttop10/upload.html?password=" . $pass . "&id=" . $listID);

?>
