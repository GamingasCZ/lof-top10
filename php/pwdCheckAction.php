<?php

require("secrets.php");

/*
Return codes:
0 - Error connecting to database
1 - Empty/incomplete request
2 - Incorrect password
*/

$mysqli = new mysqli($hostname, $username, $password, $database);
if ($mysqli -> connect_errno) {
    echo "0";
    exit();
}

if (isset($_POST["id"])) {
    $listType = Array($_POST["id"], "id");
}
elseif (isset($_POST["pid"])) {
    $listType = Array($_POST["pid"], "hidden");
}
else {
    echo "1";
    exit();
}

$datacheck = [$listType[0], $_POST["pwdEntered"], $_POST["retData"]];
if (in_array("", $datacheck)) {
    echo "1";
    exit();
}

$getList = $mysqli -> query(sprintf("SELECT * FROM `lists` WHERE `%s`='%s'", $listType[1], $datacheck[0]));
$listData = $getList -> fetch_assoc();

$listPwd = passwordGenerator($listData["name"], $listData["creator"], $listData["timestamp"]);

if ($_POST["pwdEntered"] != $listPwd) {
    sleep(4);
    echo "2";
    exit();
}
else {
    if ($_POST["retData"] == "1") {
        echo sprintf("%s;-!-;%s;-!-;%s;-!-;%s",$listData["name"],$listData["creator"],$listData["data"],$listData["hidden"]);
    }
    else {
        echo "3";
    }
}
?>
