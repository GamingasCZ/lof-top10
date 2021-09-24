<?php

$hostname = "";
$username = "";
$password = "";
$database = "";

function privateIDGenerator($listName, $creator, $timestamp) {
    $str = "";
    for ($i=0; $i < 4; $i++) { 
        $str = $str . substr($listName, 0+$i, 0+$i);
        $str = $str . substr($creator, 0+$i, 0+$i);
        $str = $str . substr($timestamp, 0+$i, 0+$i);
    }
    return substr(sha1($str),0,10);
}

function passwordGenerator($listName, $creator, $timestamp) {
    // Your code here... :)
    return 0;
}
?>
