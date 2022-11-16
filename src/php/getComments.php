<?php
/* Return codes:
0 - Connection failure
1 - Empty/bad request
3 - Bad list ID
*/

require("secrets.php");
header('Content-type: application/json'); // Return as JSON

// Does the request have an id?
if (count($_GET) != 1 || isset($_GET["listid"]) === FALSE) {
    echo "1";
    exit();
}

if (!preg_match('/[A-z]/', $_GET["listid"])) {
    $fuckupID = preg_match("/-?\d+/", $_GET["listid"], $match);
    $fuckupID = $match[0];
    // Is the ID valid?
    if ($_GET["listid"] == "-1") die("3");
}

// Fetching comments
$mysqli = new mysqli($hostname, $username, $password, $database);

if ($mysqli -> connect_errno) die("0");

// Get ID of hidden list
if (preg_match('/[A-z]/', $_GET["listid"])) {
    if (strlen($_GET["listid"]) != 10) die("3");
    $hiddenID = $mysqli->query(sprintf("SELECT `id` FROM `lists` WHERE `hidden`= '%s'", $_GET["listid"])) or die($mysqli->error);
    $fuckupID = $hiddenID->fetch_all(MYSQLI_ASSOC)[0]["id"];
}

$query = sprintf("SELECT * FROM `comments` WHERE `listID`='%s' ORDER BY `comID` DESC", $fuckupID);
$result = $mysqli -> query($query) or die($mysqli -> error);

$comments = $result -> fetch_all(MYSQLI_ASSOC);

// No comments
if (count($comments) == 0) {
    exit(json_encode(array([],[])));
}

$uid_array = array();
$ind = 0;
foreach ($comments as $row) {
    array_push($uid_array, $comments[$ind]["uid"]);
    
    $comments[$ind]["comment"] = htmlspecialchars_decode($row["comment"]);
    $ind += 1;
}

$query = sprintf("SELECT DISTINCT username,discord_id,avatar_hash,id
                  FROM users
                  WHERE id IN (%s)", join(",", array_unique($uid_array)), $_GET["listid"]);
$result = $mysqli -> query($query) or die($mysqli -> error);

$users = $result -> fetch_all(MYSQLI_ASSOC);

echo json_encode(array($comments, $users));
$mysqli -> close();

?>
