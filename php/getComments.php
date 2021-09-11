<?php
/* Return codes:
0 - Connection failure
1 - Empty/bad request
2 - No comments
3 - Bad list ID
*/

require("secrets.php");

$fuckupID = htmlspecialchars($_GET["listid"]);

// Does the request have an id?
if (count($_GET) != 1 || isset($_GET["listid"]) === FALSE) {
    echo "1";
    exit();
}

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

foreach ($rows as $row) {
    echo htmlspecialchars_decode(join(";-!-;", $row)) . "|-!-|";
}

$mysqli -> close();

?>
