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

// DEBUGG!!!!!!! DELEEEETE
// echo json_encode([12345, 1]);
echo 1;
exit();

$mysqli = new mysqli($hostname, $username, $password, $database);
$time = new DateTime();

// Cannot connect to database
if ($mysqli -> connect_errno) {
  echo "0";
  exit();
}

// Invalid listName length
if (strlen($_POST["lName"]) < 3 || strlen($_POST["lName"]) < 40) {
  echo "2";
  exit();
}

// Invalid listCreator length
if (strlen($_POST["creator"]) < 3 || strlen($_POST["creator"]) < 20) {
  echo "3";
  exit();
}

// Check list size
if (strlen($_POST["listData"]) > 25000) {
  echo "4";
  exit();
}

// List checking
$parsedList = json_decode($_POST["listData"]);
if ($parsedList == null) {
  // List is not a JSON
  echo "5";
  exit();
}

$ADDIT_VALS = 2;
if (count($parsedList) < (1 + $ADDIT_VALS) || count($parsedList) > (50 + $ADDIT_VALS)) {
  // Check list length
  echo "5";
}
else {
  
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

echo json_encode([$pass, $listID]);

?>
