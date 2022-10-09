<?php
//header('Content-type: application/json'); // Return as JSON
require("secrets.php");

function post($url, $data, $headers, $needsRURL = false) {
    foreach ($data as $key => $value) {
        $data[$key] = urlencode($value);
    }
    if ($needsRURL) { $data["redirect_uri"] = $GDL_ENDPOINT . "/php/accounts.php"; }

    $data = http_build_query($data);
    $curl = curl_init($url);
    curl_setopt($curl, CURLINFO_HEADER_OUT, true);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    if (!is_string($data)) {
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

if (sizeof($_GET) == 1) {
    /*
    $tokenUrl =  array(
        "client_id" => $DISCORD_CLIENT_ID,
        "client_secret" => $DISCORD_CLIENT_SECRET,
        "grant_type" => "authorization_code",
        "code" => $_GET["code"],
    );
    $tokenHeaders = array('Content-Type: application/x-www-form-urlencoded');
    $baseURL = "https://discord.com/api/v10/oauth2/token";
    echo post($baseURL, $tokenUrl, $tokenHeaders);
    */
    $tokenHeaders = array('Authorization: Bearer (access_token)');
    $baseURL = "https://discord.com/api/v10/users/@me";
    $ok = json_decode(post($baseURL, array(), $tokenHeaders), true);

    $userInfo = json_encode(array($ok["username"], $ok["id"], $ok["avatar"]));
    setcookie("logindata", $userInfo, time()+30, "/");
    
    header("Location: " . $GDL_ENDPOINT ."/#login");
}
else {
    http_response_code(401);
    die("1");
}

?>