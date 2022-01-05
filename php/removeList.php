<?php
/*
Return codes: 
0 - Connection error
1 - Empty request
2 - Invalid password
3 - Success!
*/


require("secrets.php");

$mysqli = new mysqli($hostname, $username, $password, $database);

if ($mysqli -> connect_errno) {
  echo "0";
  exit();
}

// Checking request
error_reporting(0);

$fuckupData = array($_POST["id"],$_POST["pwdEntered"]);
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

error_reporting(1);

// Password check
if ($_POST["isHidden"] == 0) {
  $check = $mysqli -> query("SELECT * FROM `lists` WHERE `id`=".$fuckupData[0]);
}
else {
  $check = $mysqli -> query("SELECT * FROM `lists` WHERE `hidden`='".$fuckupData[0]."'");
}

echo "SELECT * FROM `lists` WHERE `hidden`=".$fuckupData[0];

$listData = $check -> fetch_assoc();
$listPass = passwordGenerator($listData["name"], $listData["creator"], $listData["timestamp"]);

// Invalid password
if ($listPass != $fuckupData[1]) {
  echo "2";
  $mysqli -> close();
  exit();
}

// Removing list
if ($_POST["isHidden"] == 0) {
  $check = sprintf("DELETE FROM `lists` WHERE `id`=%s",$listData["id"]);
}
else {
  $check = sprintf("DELETE FROM `lists` WHERE`hidden`='%s'",$listData["hidden"]);
}
$result = $mysqli -> query($check);
echo "3";

$mysqli -> close();

?>
