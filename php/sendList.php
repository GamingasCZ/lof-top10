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
  $fuckupData[i] = htmlspecialchars($post);
  $i += 1;
}

$pass = passwordGenerator();

$result = $mysqli -> query("INSERT INTO `lists`(`creator`,`name`,`password`,`data`) VALUES ('".$fuckupData[0]."','".$fuckupData[1]."','".$pass."','".$fuckupData[2]."')");

$mysqli -> close();

header("location:http://www.gamingas.wz.cz/lofttop10/upload.html?password=" . $pass);

?>
