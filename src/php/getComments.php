<?php
/* Return codes:
0 - Connection failure
1 - Empty/bad request
3 - Bad list ID
*/

require("secrets.php");
header('Content-type: application/json'); // Return as JSON

if (!preg_match('/[A-z]/', $_GET["listid"])) {
    $fuckupID = preg_match("/-?\d+/", $_GET["listid"], $match);
    $fuckupID = $match[0];
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

// Are values numbers?
if (!is_numeric($_GET["page"]) &&
    !is_numeric($_GET["startID"]) &&
    !is_numeric($_GET["fetchAmount"])) {
    die("1");
}

// How many comments should be fetched and the offset (page)
$dbSlice = clamp(intval($_GET["fetchAmount"]), 2, 15) * intval($_GET["page"]);

$query = sprintf("SELECT * FROM `comments`
            WHERE `comID`<=%d AND `listID`=%d
            ORDER BY `comID` DESC
            LIMIT %d 
            OFFSET %s", $_GET["startID"], $fuckupID, clamp(intval($_GET["fetchAmount"]), 2, 15), $dbSlice);

$maxpageQuery = $mysqli->query(sprintf("SELECT COUNT(*) from `comments` WHERE `listID`=%d", $_GET["listid"]));
$commAmount = $maxpageQuery->fetch_array()[0];
$maxpage = ceil($commAmount / clamp(intval($_GET["fetchAmount"]), 2, 15));

$result = $mysqli->query($query) or die($mysqli -> error);
$comments = $result -> fetch_all(MYSQLI_ASSOC);

$dbInfo["maxPage"] = $maxpage;
$dbInfo["startID"] = $comments[0]["comID"];
$dbInfo["page"] = $_GET["page"];
$dbInfo["path"] = $_SERVER["SCRIPT_NAME"];
$dbInfo["commAmount"] = $commAmount;

// No comments
if (count($comments) == 0) {
    exit(json_encode(array([],[],$dbInfo)));
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

echo json_encode(array($comments, $users, $dbInfo));
$mysqli -> close();

?>