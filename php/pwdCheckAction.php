<?php

require("secrets.php");

/*
Return codes:
0 - Error connecting to database
1 - Empty request
2 - Incorrect password
*/

$mysqli = new mysqli($hostname, $username, $password, $database);
if ($mysqli -> connect_errno) {
    echo "0";
    exit();
}

$datacheck = [$_POST["id"], $_POST["pwdEntered"]];
if (in_array("", $datacheck)) {
    echo "1";
    exit();
}

$getList = $mysqli -> query("SELECT * FROM `lists` WHERE id=" . join("",array_slice($datacheck,0,1)));
$listData = $getList -> fetch_assoc();

$listPwd = passwordGenerator($listData["name"], $listData["creator"], $listData["data"]);
$listData["data"] = str_replace("&quot;",'"',$listData["data"]);
if ($_POST["pwdEntered"] != $listPwd) {
    //sleep(4);
    echo "2";
    exit();
}
else {
    echo "3";
    //header("location:http://www.gamingas.wz.cz/lofttop10/upload.html?edit=");
}
?>