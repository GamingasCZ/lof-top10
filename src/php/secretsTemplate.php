<?php

$hostname = "";
$username = "";
$password = "";
$database = "";
$debugMode = true;

$GDL_ENDPOINT = "http://localhost:8000";
$DISCORD_CLIENT_ID = "";
$DISCORD_CLIENT_SECRET = "";
$SECRET = ""; // Use a random string :)

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

// thanks, random stackoverflow person (https://stackoverflow.com/a/46872528/11000740) :)
function encrypt($plaintext) {
    $method = "AES-256-CBC";
    $key = hash('sha256', $SECRET, true);
    $iv = openssl_random_pseudo_bytes(16);

    $ciphertext = openssl_encrypt($plaintext, $method, $key, OPENSSL_RAW_DATA, $iv);
    $hash = hash_hmac('sha256', $ciphertext . $iv, $key, true);

    return $iv . $hash . $ciphertext;
}

function decrypt($ivHashCiphertext) {
    $method = "AES-256-CBC";
    $iv = substr($ivHashCiphertext, 0, 16);
    $hash = substr($ivHashCiphertext, 16, 32);
    $ciphertext = substr($ivHashCiphertext, 48);
    $key = hash('sha256', $SECRET, true);

    if (!hash_equals(hash_hmac('sha256', $ciphertext . $iv, $key, true), $hash)) return null;

    return openssl_decrypt($ciphertext, $method, $key, OPENSSL_RAW_DATA, $iv);
}

function post($url, $data, $headers, $needsRURL = false) {
    foreach ($data as $key => $value) {
        $data[$key] = urlencode($value);
    }
    if ($needsRURL) { $data["redirect_uri"] = "http://localhost:8000/php/accounts.php"; }

    $curl = curl_init($url);
    curl_setopt($curl, CURLINFO_HEADER_OUT, true);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    if (sizeof($data) > 0 and !is_string($data)) {
        $data = http_build_query($data);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    }
    else {
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'GET');
    }

    // Set HTTP Header for POST request 
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
  
    // Submit the POST request
    $result = curl_exec($curl);

    curl_close($curl);
    return $result;
}

function checkAccount($token) {
    $tokenHeaders = array('Authorization: Bearer ' . $accessInfo["access_token"]);
    $baseURL = "https://discord.com/api/v10/users/@me";
    $ok = json_decode(post($baseURL, array(), $tokenHeaders), true);

    return $ok;
}

?>