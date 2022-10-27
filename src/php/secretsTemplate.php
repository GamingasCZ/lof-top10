<?php

$hostname = "";
$username = "";
$password = "";
$database = "";
$debugMode = true;

function privateIDGenerator($listName, $creator, $timestamp) {
    $str = $listName . $creator . $timestamp;
    return substr(sha1($str),0,10);
}

function passwordGenerator($listName, $creator, $timestamp)
{
    // Your code here... :)
    return 0;
}

// Not secret :)
function sanitizeInput($inputArray)
{
    global $debugMode;
    error_reporting($debugMode ? -1 : 0);

    $i = 0;
    foreach ($inputArray as $post) {
        if ($inputArray[$i] == "") {
            echo "1";
            exit();
        }
        $inputArray[$i] = htmlspecialchars(strip_tags(htmlspecialchars_decode($post)));
        $i += 1;
    }

    error_reporting($debugMode ? -1 : 1);

    return $inputArray;
}

function doRequest($mysqli, $queryTemplate, $values, $valueTypes)
{
    $query = $mysqli->prepare($queryTemplate);

    // Fill in template
    $query->bind_param($valueTypes, ...$values);
  
    $query->execute();
    $result = $query->get_result();
    
    $query->close();

    if (!$result) {
        return -1;
    }
    
    return $result -> fetch_assoc();
}
