<?php

$err = "";
function error() {
    global $err;
    $err = "fuck";
}

$err = set_error_handler("error");
$xml = file_get_contents("https://gdbrowser.com/api/profile/wrewrwrewareewr");

echo $err;
?>