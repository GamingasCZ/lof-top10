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

// Check list size
$len = strlen($_POST["listData"]);
if ($len > 25000 || $len < 150) {
  echo "4";
  exit();
}

// TODO: check for cookie
$discord_id = checkAccount()["id"];

$uid_query = $mysqli -> query(sprintf("SELECT `id` FROM `users` WHERE `discord_id` = '%s'", $discord_id));
$user_id = $uid_query -> fetch_all(MYSQLI_ASSOC)[0]["id"];

// Checking request
error_reporting($debugMode ? -1 : 0);
$fuckupData = sanitizeInput(array($_POST["lName"],$_POST["listData"]));
$timestamp = $time -> getTimestamp();

// Generate id if list private
if (isset($_POST["hidden"])) { $hidden = privateIDGenerator($fuckupData[1], $fuckupData[0], $timestamp); }
else { $hidden = "0"; }

// Send to database
$teplate = "INSERT INTO `lists`(`creator`,`name`,`data`,`timestamp`,`hidden`,`uid`) VALUES ('',?,?,?,?,?)";
$values = array($fuckupData[0], $fuckupData[1], $timestamp, $hidden, $user_id);
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

echo json_encode([$listID]);

?>
