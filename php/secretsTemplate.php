<?php

$hostname = "";
$username = "";
$password = "";
$database = "";

function privateIDGenerator($listName, $creator, $timestamp) {
    // Your code here... :)
    return 0;
}

function passwordGenerator($listName, $creator, $timestamp)
{
    // Your code here... :)
    return 0;
}

// Not secret :)
function sanitizeInput($inputArray)
{
    error_reporting(0);

    $i = 0;
    foreach ($inputArray as $post) {
        if ($inputArray[$i] == "") {
            echo "1";
            exit();
        }
        $inputArray[$i] = htmlspecialchars(strip_tags(htmlspecialchars_decode($post)));
        $i += 1;
    }

    error_reporting(1);

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
