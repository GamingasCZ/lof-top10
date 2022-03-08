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
$fuckupData = sanitizeInput(array($_POST["id"],$_POST["pwdEntered"],$_POST["listData"],$_POST["isNowHidden"]));

// Password check
if (in_array($_POST["hidden"], Array(0,1)) and $_POST["isNowHidden"] == "true") {
    $listData = doRequest($mysqli, "SELECT * FROM `lists` WHERE `hidden` = ?", [$fuckupData[0]], "s");
}
elseif (in_array($_POST["hidden"], Array(0,1)) and $_POST["isNowHidden"] == "false") {
    $listData = doRequest($mysqli, "SELECT * FROM `lists` WHERE `id` = ?", [$fuckupData[0]], "i");
}
else {
    $listData = doRequest($mysqli, "SELECT * FROM `lists` WHERE `id` = ?", [$fuckupData[0]], "i");
}

$listPass = passwordGenerator($listData["name"], $listData["creator"], $listData["timestamp"]);

// Invalid password
if ($listPass != $fuckupData[1]) {
  echo "2";
  $mysqli -> close();
  exit();
}

// Private list settings
if ($_POST["hidden"] == 1 and $_POST["isNowHidden"] == "true") {
    doRequest($mysqli, "UPDATE `lists` SET `data`='%s' WHERE `hidden`='%s'", [$_POST["listData"], $_POST["id"]], "ss");
}
elseif ($_POST["hidden"] == 1 and $_POST["isNowHidden"] == "false") {
    $hidden = privateIDGenerator($listData["name"], $listData["creator"], $listData["timestamp"]);
    doRequest($mysqli, "UPDATE `lists` SET `data`='%s', `hidden`='%s' WHERE `id`='%s'", [$_POST["listData"], $hidden, $_POST["id"]], "sss");
}
elseif ($_POST["hidden"] == 0 and $_POST["isNowHidden"] == "false") {
    doRequest($mysqli, "UPDATE `lists` SET `data`='%s' WHERE `id`='%s'", [$_POST["listData"], $_POST["id"]], "ss");
}
else {
    doRequest($mysqli, "UPDATE `lists` SET `data`='%s', `hidden`='0' WHERE `hidden`='%s'", [$_POST["listData"], $_POST["id"]], "ss");
}

// Updating list data
echo "3";

$mysqli -> close();

?>
