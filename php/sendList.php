<?php

// Probably ugly ass code

require("secrets.php");

$mysqli = new mysqli($hostname, $username, $password, $database);
$time = new DateTime();

if ($mysqli -> connect_errno) {
  echo "0";
  exit();
}

function privateIDGenerator($listName, $creator, $timestamp) {
    $str = "";
    for ($i=0; $i < 4; $i++) { 
        $str = $str . substr($listName, 0+$i, 0+$i);
        $str = $str . substr($creator, 0+$i, 0+$i);
        $str = $str . substr($timestamp, 0+$i, 0+$i);
    }
    return substr(sha1($str),0,10);
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

if (isset($_POST["hidden"])) { $hidden = privateIDGenerator($fuckupData["lname"], $fuckupData["creator"], $timestamp); }
else { $hidden = "0"; }

$pass = passwordGenerator($_POST["lName"], $_POST["creator"], $timestamp);


$query = sprintf("INSERT INTO `lists`(`creator`,`name`,`data`,`timestamp`,`hidden`) VALUES ('%s','%s','%s','%s','%s')",
                $fuckupData[0],
                $fuckupData[1],
                $fuckupData[2],
                $timestamp,
                $hidden);
$result = $mysqli -> query($query);

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
