<?php
/*
Return codes: 
0 - Connection error
1 - Empty request
2 - Invalid password
[LIST_ID] - Success!!
4 - No changes made to list
*/


require("secrets.php");
header('Content-type: application/json'); // Return as JSON

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

// When no changes are made in the list
$isBeingHidden = $_POST["hidden"] == 1 and $_POST["isNowHidden"] == "false" && $_POST["hidden"] == 0 and $_POST["isNowHidden"] == "true";
if ($listData["data"] == $fuckupData[2] && !$isBeingHidden) {
    echo "4";
    exit();
}

$listPass = passwordGenerator($listData["name"], $listData["creator"], $listData["timestamp"]);

// Invalid password
if ($listPass != $fuckupData[1]) {
  echo "2";
  $mysqli -> close();
  exit();
}

$retListID = [$_POST["id"]];
// Private list settings
if ($_POST["hidden"] == 1 and $_POST["isNowHidden"] == "true") {
    doRequest($mysqli, "UPDATE `lists` SET `data` = ? WHERE `hidden` = ?", [$_POST["listData"], $_POST["id"]], "ss");
}
elseif ($_POST["hidden"] == 1 and $_POST["isNowHidden"] == "false") {
    $hidden = privateIDGenerator($listData["name"], $listData["creator"], $listData["timestamp"]);
    $retListID[0] = $hidden;
    doRequest($mysqli, "UPDATE `lists` SET `data` = ?, `hidden` = ? WHERE `id` = ?", [$_POST["listData"], $hidden, $_POST["id"]], "sss");
}
elseif ($_POST["hidden"] == 0 and $_POST["isNowHidden"] == "false") {
    doRequest($mysqli, "UPDATE `lists` SET `data` = ? WHERE `id` = ?", [$_POST["listData"], $_POST["id"]], "ss");
}
else {
    doRequest($mysqli, "UPDATE `lists` SET `data` = ?, `hidden`='0' WHERE `hidden` = ?", [$_POST["listData"], $_POST["id"]], "ss");
    $retListID[0] = $listData["id"];
}

echo json_encode($retListID);

$mysqli -> close();

?>
