<?php
/*
Return codes:
0 - Every error
1 - Account already created
*/
header('Content-type: application/json'); // Return as JSON
require("secrets.php");

if (sizeof($_GET) == 1) {
    if (array_keys($_GET)[0] == "check") { // Check login validity
        if (!isset($_COOKIE["access_token"])) {echo -1; return false;} // Not logged in

        echo checkAccount() ? 1 : 0;
        return true;
    }
    if (array_keys($_GET)[0] == "logout") { // Check login validity
        removeCookie("access_token");
        echo "1";
        return true;
    }

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

    // Get user data
    $tokenHeaders = array('Authorization: Bearer ' . $accessInfo["access_token"]);
    $baseURL = "https://discord.com/api/v10/users/@me";
    $ok = json_decode(post($baseURL, array(), $tokenHeaders), true);

    $userInfo = json_encode(array($ok["username"], $ok["id"], $ok["avatar"]));
    setcookie("logindata", $userInfo, time()+30, "/");

    // Encrypt and save access token into a cookie
    setcookie("access_token", encrypt(($accessInfo["access_token"])."|".(time()-$accessInfo["expires_in"])."|".($ok["id"])), time()+$accessInfo["expires_in"], "/");

    // Save data to database
    $mysqli = new mysqli($hostname, $username, $password, $database);
    if ($mysqli -> connect_errno) die("0");

    try {
        $mysqli -> query(sprintf("INSERT INTO `users`(`username`, `avatar_hash`, `discord_id`, `refresh_token`) VALUES ('%s','%s','%s','%s')", $ok["username"], $ok["avatar"], $ok["id"], $accessInfo["refresh_token"]));
    } catch (mysqli_sql_exception $err) {
        // Database does not allow duplicate values (already registered), do not die in that case, else ye, commit die :D
        if (str_contains($err, "Duplicate")) {
            $mysqli -> query(sprintf("UPDATE `users` SET `username`='%s', `avatar_hash`='%s', `refresh_token`='%s' WHERE `discord_id`='%s'", $ok["username"], $ok["avatar"], $accessInfo["refresh_token"], $ok["id"]));
        }
    }
    $mysqli -> close();

    header("Location: " . $GDL_ENDPOINT ."/#login");
}
else {
    http_response_code(401);
    die("1");
}
?>