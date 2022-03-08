<?php
/* Return codes:
0 - Connection failure
1 - Empty/bad request
2 - No comments
3 - Bad list ID
*/

require("secrets.php");
header('Content-type: application/json'); // Return as JSON

// Does the request have an id?
if (count($_GET) != 1 || isset($_GET["listid"]) === FALSE) {
    echo "1";
    exit();
}

$fuckupID = preg_match("/-?\d+/", $_GET["listid"], $match);
$fuckupID = $match[0];
// Is the ID valid?
if ($_GET["listid"] == "-1") {
    echo "3";
    exit();
}

// Fetching comments
$mysqli = new mysqli($hostname, $username, $password, $database);

if ($mysqli -> connect_errno) {
    echo "0";
    exit();
}

$query = "SELECT * FROM `comments` WHERE `listID`=" . $fuckupID;
$result = $mysqli -> query($query) or die($mysqli -> error);

$rows = $result -> fetch_all(MYSQLI_ASSOC);

// No comments
if (count($rows) == 0) {
    echo "2";
    exit();
}

$ind = 0;
foreach ($rows as $row) {
    $rows[$ind]["comment"] = htmlspecialchars_decode($row["comment"]);
    $ind += 1;
}
echo json_encode($rows);

$mysqli -> close();

?>
