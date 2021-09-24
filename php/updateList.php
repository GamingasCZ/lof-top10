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

$fuckupData = array($_POST["id"],$_POST["pwdEntered"],$_POST["listData"],$_POST["isNowHidden"]);
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
if (in_array($_POST["hidden"], Array(0,1)) and $_POST["isNowHidden"] == "true") {
    $check = $mysqli -> query(sprintf("SELECT * FROM `lists` WHERE `hidden`='%s'", $fuckupData[0]));
}
elseif (in_array($_POST["hidden"], Array(0,1)) and $_POST["isNowHidden"] == "false") {
    $check = $mysqli -> query(sprintf("SELECT * FROM `lists` WHERE `id`='%s'", $fuckupData[0]));
}
else {
    $check = $mysqli -> query("SELECT * FROM `lists` WHERE `id`=".join("",array_slice($fuckupData,0,1)));
}

$listData = $check -> fetch_assoc();
$listPass = passwordGenerator($listData["name"], $listData["creator"], $listData["timestamp"]);

// Invalid password
if ($listPass != $fuckupData[1]) {
  echo "2";
  $mysqli -> close();
  exit();
}

// Private list settings
if ($_POST["hidden"] == 1 and $_POST["isNowHidden"] == "true") {
    $query = sprintf("UPDATE `lists` SET `data`='%s' WHERE `hidden`='%s'",$_POST["listData"], $_POST["id"]);
}
elseif ($_POST["hidden"] == 1 and $_POST["isNowHidden"] == "false") {
    $hidden = privateIDGenerator($listData["name"], $listData["creator"], $listData["timestamp"]);
    $query = sprintf("UPDATE `lists` SET `data`='%s', `hidden`='%s' WHERE `id`='%s'",$_POST["listData"], $hidden, $_POST["id"]);
}
elseif ($_POST["hidden"] == 0 and $_POST["isNowHidden"] == "false") {
    $query = sprintf("UPDATE `lists` SET `data`='%s' WHERE `id`='%s'",$_POST["listData"], $_POST["id"]);
}
else {
    $query = sprintf("UPDATE `lists` SET `data`='%s', `hidden`='0' WHERE `hidden`='%s'",$_POST["listData"],$_POST["id"]);
}

// Updating list data
$result = $mysqli -> query($query);
$ok = $result -> fetch_assoc();
print_r($ok);
echo "3";

$mysqli -> close();

?>
