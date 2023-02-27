<?php

/*
Return codes: 
0 - Connection error
1 - Empty request
*/

require("secrets.php");
header('Content-type: application/json'); // Return as JSON

$mysqli = new mysqli($hostname, $username, $password, $database);

// Cannot connect to database
if ($mysqli -> connect_errno) {
  echo "0";
  exit();
}

// Checking request
/*
$fuckupData = sanitizeInput(array());
$timestamp = $time -> getTimestamp();

$template = "";
$values = "";
$result = doRequest($mysqli, $template, $values, "");

$mysqli -> close();
*/
$result = [
    "username" => "gemingay",
    "profilePicture" => "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FU2gxWV0MkrI%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=1b8300b7f46c1ea2c4ed73cac9dc667302990b9c8c7263a192e9d1b1078b8e38&ipo=images",
    "profileBanner" => "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwallpapercave.com%2Fwp%2Fp6SpXmL.jpg&f=1&nofb=1&ipt=9d3487de8527d23355fa594de7cd09b8fe25bb8a4d9e5a002011039c4516cb85&ipo=images",
    "profileColor" => "#0f160f",
];

echo json_encode($result);

/*
Response:
- username
- profilePicture
- profileBanner
- profileColor
- profileBackground
- profileData {
    maxColumns
    sections: [

    ]
}
- 
*/

?>