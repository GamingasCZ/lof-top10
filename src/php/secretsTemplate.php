<?php

$hostname = "";
$username = "";
$password = "";
$database = "";
$debugMode = true;

$GDL_ENDPOINT = "";
$DISCORD_CLIENT_ID = "";
$DISCORD_CLIENT_SECRET = "";
$SECRET = ""; // Use a random string :)

function privateIDGenerator($listName, $creator, $timestamp) {
    $str = $listName . $creator . $timestamp;
    return substr(sha1($str),0,10);
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

// thanks, random stackoverflow person (https://stackoverflow.com/a/46872528/11000740) :)
function encrypt($plaintext) {
    global $SECRET;
    $method = "AES-256-CBC";
    $key = hash('sha256', $SECRET, true);
    $iv = openssl_random_pseudo_bytes(16);

    $ciphertext = openssl_encrypt($plaintext, $method, $key, OPENSSL_RAW_DATA, $iv);
    $hash = hash_hmac('sha256', $ciphertext . $iv, $key, true);

    return $iv . $hash . $ciphertext;
}

function decrypt($ivHashCiphertext) {
    global $SECRET;
    $method = "AES-256-CBC";
    $iv = substr($ivHashCiphertext, 0, 16);
    $hash = substr($ivHashCiphertext, 16, 32);
    $ciphertext = substr($ivHashCiphertext, 48);
    $key = hash('sha256', $SECRET, true);

    if (!hash_equals(hash_hmac('sha256', $ciphertext . $iv, $key, true), $hash)) return null;

    return openssl_decrypt($ciphertext, $method, $key, OPENSSL_RAW_DATA, $iv);
}

function post($url, $data, $headers, $needsRURL = false) {
    global $GDL_ENDPOINT;
    foreach ($data as $key => $value) {
        $data[$key] = urlencode($value);
    }
    if ($needsRURL) { $data["redirect_uri"] = $GDL_ENDPOINT . "/php/accounts.php"; }

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

function refreshToken($currToken) {
    global $hostname, $username, $password, $database, $DISCORD_CLIENT_ID, $DISCORD_CLIENT_SECRET;
    $mysqli = new mysqli($hostname, $username, $password, $database);
    if ($mysqli -> connect_errno) die("0");

    $refresh_token = doRequest($mysqli, "SELECT refresh_token FROM users WHERE discord_id=?", [$currToken[2]], "i")["refresh_token"];

    // Get the new token details
    $tokenUrl = array(
        "client_id" => $DISCORD_CLIENT_ID,
        "client_secret" => $DISCORD_CLIENT_SECRET,
        "grant_type" => "refresh_token",
        "refresh_token" => $refresh_token,
    );
    $tokenHeaders = array('Content-Type: application/x-www-form-urlencoded');
    $baseURL = "https://discord.com/api/v10/oauth2/token";
    $accessInfo = json_decode(post($baseURL, $tokenUrl, $tokenHeaders, 0), true);
    if (array_key_exists("error", $accessInfo)) {
        setcookie("access_token","",time()-3600000);
        setcookie("cA","",time()-3600000);
        return false;
    }

    // Get user data
    $tokenHeaders = array('Authorization: Bearer ' . $accessInfo["access_token"]);
    $baseURL = "https://discord.com/api/v10/users/@me";
    $ok = json_decode(post($baseURL, array(), $tokenHeaders), true);
    
    // Encrypt and save access token into a cookie
    setcookie("access_token", encrypt(($accessInfo["access_token"])."|".(time()-$accessInfo["expires_in"])."|".($ok["id"])), time()+$accessInfo["expires_in"], "/");
    
    $mysqli -> query(sprintf('UPDATE `users` SET `username`="%s", `avatar_hash`="%s", `refresh_token`="%s" WHERE `discord_id`="%s"', $ok["username"], $ok["avatar"], $accessInfo["refresh_token"], $ok["id"]));
    $mysqli -> close();

    return $accessInfo["access_token"];
}

function checkAccount() {
    if (!isset($_COOKIE["access_token"])) return false;

    if (isset($_COOKIE["cA"])) {
        $data = decrypt($_COOKIE["cA"]);
        if (strpos($data, "<hash>")) {
            $check = explode("<hash>", $data, 2);
            if (md5($check[0]) == $check[1]) {
                return json_decode($check[0], true);
            }
        }
    }
 
    $token = explode("|", decrypt($_COOKIE["access_token"]));
    if (time()-$token[1] < 86400) $token[0] = refreshToken($token);

    $tokenHeaders = array('Authorization: Bearer ' . $token[0]);
    $baseURL = "https://discord.com/api/v10/users/@me";
    $ok = post($baseURL, array(), $tokenHeaders);
    $json = json_decode($ok, true);

    if (isset($json["message"]) && strstr($json["message"], "401")) { // Invalid token, logout
        setcookie("access_token","",time()-3600000);
        setcookie("cA","",time()-3600000);
        return false;
    }
    setcookie("cA",encrypt($ok . "<hash>" . md5($ok)), time()+300);
    return $json;
}

function checkListOwnership($mysqli, $user_id) {
    $client_id = checkAccount()["id"];
    return $user_id == $client_id;
}

function list_id($row) {
    return $row["hidden"] == 0 ? $row["id"] : $row["hidden"];
}

?>
