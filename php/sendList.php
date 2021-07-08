<?php

// Probably ugly ass code

require("secrets.php");

$mysqli = new mysqli($hostname, $username, $password, $database);
$time = new DateTime();

if ($mysqli -> connect_errno) {
  echo "0";
  exit();
}

$fuckupData = array($_POST["creator"],$_POST["lName"],$_POST["listData"]);
$i = 0;
foreach ($fuckupData as $post) {
  if ($fuckupData[$i] == "") {
    echo "1";
    $mysqli -> close();
    exit();
  }
  $fuckupData[$i] = htmlspecialchars($post);
  $i += 1;
}

$timestamp = $time -> getTimestamp();

if (isset($_POST["hidden"])) { $hidden = "1"; }
else { $hidden = "0"; }

$pass = passwordGenerator($_POST["lName"], $_POST["creator"], $timestamp);


$query = sprintf("INSERT INTO `lists`(`creator`,`name`,`data`,`timestamp`,`hidden`) VALUES ('%s','%s','%s','%s',%s)",
                $fuckupData[0],
                $fuckupData[1],
                $fuckupData[2],
                $timestamp,
                $hidden);
$result = $mysqli -> query($query);
$listIDquery = $mysqli -> query("SELECT LAST_INSERT_ID()");
$rows = $listIDquery -> fetch_all(MYSQLI_ASSOC);
foreach ($rows as $row) {
  $listID = join("",$row);
}


$mysqli -> close();

header("location:http://www.gamingas.wz.cz/lofttop10/upload.html?password=" . $pass . "&id=" . $listID);

?>
