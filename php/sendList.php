<?php

// Probably ugly ass code

require("secrets.php");

$mysqli = new mysqli($hostname, $username, $password, $database);

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

$pass = passwordGenerator($_POST["lName"], $_POST["creator"], $_POST["listData"]);

$result = $mysqli -> query("INSERT INTO `lists`(`creator`,`name`,`data`) VALUES ('".$fuckupData[0]."','".$fuckupData[1]."','".$fuckupData[2]."')");
$listIDquery = $mysqli -> query("SELECT LAST_INSERT_ID()");
$rows = $listIDquery -> fetch_all(MYSQLI_ASSOC);
foreach ($rows as $row) {
  $listID = join("",$row);
}


$mysqli -> close();

header("location:http://www.gamingas.wz.cz/lofttop10/upload.html?password=" . $pass . "&id=" . $listID);

?>
