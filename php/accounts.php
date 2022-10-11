<?php
/*
Return codes:
0 - Every error
1 - Account already created
*/
header('Content-type: application/json'); // Return as JSON
require("secrets.php");

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

if (sizeof($_GET) == 1) {
    // Get the access token from the authorization code
    $tokenUrl =  array(
        "client_id" => $DISCORD_CLIENT_ID,
        "client_secret" => $DISCORD_CLIENT_SECRET,
        "grant_type" => "authorization_code",
        "code" => $_GET["code"],
    );
    $tokenHeaders = array('Content-Type: application/x-www-form-urlencoded');
    $baseURL = "https://discord.com/api/v10/oauth2/token";
    $accessInfo = json_decode(post($baseURL, $tokenUrl, $tokenHeaders, 1), true);
    if (array_key_exists("error", $accessInfo)) die(0);

    // Encrypt and save access token into a cookie
    setcookie("access_token", encrypt($accessInfo["access_token"]), time()+$accessInfo["expires_in"], "/");
    // Get user data
    $tokenHeaders = array('Authorization: Bearer ' . $accessInfo["access_token"]);
    $baseURL = "https://discord.com/api/v10/users/@me";
    $ok = json_decode(post($baseURL, array(), $tokenHeaders), true);

    $userInfo = json_encode(array($ok["username"], $ok["id"], $ok["avatar"]));
    setcookie("logindata", $userInfo, time()+30, "/");

    // Save data to database
    // TODO: accounts shouldn't duplicate
    $mysqli = new mysqli($hostname, $username, $password, $database);
    if ($mysqli -> connect_errno) die("0");

    $mysqli -> query(sprintf("INSERT INTO `users`(`discord_id`, `refresh_token`) VALUES ('%s','%s')", $ok["id"], $accessInfo["refresh_token"]));
    if ($mysqli -> error != "") die("0");
    echo "2";
    $mysqli -> close();

    header("Location: " . $GDL_ENDPOINT ."/#login");
}
else {
    http_response_code(401);
    die("1");
}
?>