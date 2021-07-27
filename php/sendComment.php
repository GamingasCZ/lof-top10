<?php
/*
Return codes:
0 - Connection error
1 - Empty request
*/

require("secrets.php");

// Checking request
error_reporting(0);

$fuckupData = array($_POST["creator"],$_POST["comment"],$_POST["comType"]);
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

// Checking if commenter exists
$verified = 1;
if (file_get_contents("https://gdbrowser.com/api/profile/" + $_POST["creator"]) == "-1") {

}


$mysqli = new mysqli($hostname, $username, $password, $database);

if ($mysqli -> connect_errno) {
    echo "0";
    exit();
  }
?>