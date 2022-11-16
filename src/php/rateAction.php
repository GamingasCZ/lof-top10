<?php
require("secrets.php");
header('Content-type: application/json'); // Return as JSON
/*
Return codes:
0 - Error connecting to database
1 - Incorrect parameters

*/

$mysqli = new mysqli($hostname, $username, $password, $database);
if ($mysqli -> connect_errno) die("0");

function getRatings($userID, $list_id) {
    global $mysqli;
    // todo: may be optimized by doing just one request, counting client-side
    $likeQuery = doRequest($mysqli,"SELECT count(*) FROM ratings WHERE rate=1 AND list_id=?", [$list_id], "s");
    $dislikeQuery = doRequest($mysqli,"SELECT count(*) FROM ratings WHERE rate=0 AND list_id=?", [$list_id], "s");
    $hasRatedQuery;
    if ($userID) {
        $hasRatedQuery = doRequest($mysqli,"SELECT `rate` FROM ratings WHERE `uid`=? AND list_id=?", [$userID, $list_id], "ii");
        $hasRatedQuery = $hasRatedQuery === null ? -1 : $hasRatedQuery["rate"];
    }
    else $hasRatedQuery = -2;
    return array($likeQuery["count(*)"], $dislikeQuery["count(*)"], $hasRatedQuery);
}

$method = $_SERVER["REQUEST_METHOD"];
switch ($method) {
    case 'GET': // Fetches ratings
        $user = checkAccount();
        if ($user) $user = $user["id"]; // Use user's id if no error occured, else is false

        echo json_encode(getRatings($user, $_GET["id"]));
        break;
        
    case 'POST': // No rate => rate
        $accountCheck = checkAccount()["id"];
        $fuckupData = intval($_POST["id"]);
        $rating = $_POST["action"] == "1" ? 1 : 0;

        // TODO: check for private lists!!

        $checkRate = doRequest($mysqli, "SELECT rate FROM ratings WHERE `uid`=? AND `list_id`=?", [$accountCheck, $fuckupData], "ii");
        $result = ["result" => null, "ratings" => null];
        if (is_null($checkRate)) { // No rating
            // todo: maybe check for errors? PLEASEE, this could break could disjoin ratings and rate_ratio
            $inc = $rating ? 1 : -1;
            $rowQuery = doRequest($mysqli,"INSERT INTO `ratings`(`rate`,`uid`,`list_id`) VALUES (?,?,?)", [$rating, $accountCheck, $fuckupData], "iss");
            $valueQuery = doRequest($mysqli,"UPDATE lists SET rate_ratio = rate_ratio+? WHERE id=?", [$inc, $fuckupData], "ii");
            $result["result"] = "added";
        }
        elseif ($checkRate["rate"] != $rating) { // Change rating
            // todo: maybe check for errors? PLEASEE, this could break could disjoin ratings and rate_ratio
            $inc = $rating ? 2 : -2;
            doRequest($mysqli, "UPDATE `ratings` SET `rate`=? WHERE `uid`=? AND `list_id`=?", [$rating, $accountCheck, $fuckupData], "iii");
            doRequest($mysqli,"UPDATE lists SET rate_ratio = rate_ratio+? WHERE id=?", [$inc, $fuckupData], "ii");
            $result["result"] = "changed";
        }
        elseif ($checkRate["rate"] == $rating) { // Remove rating
            // todo: maybe check for errors? PLEASEE, this could break could disjoin ratings and rate_ratio
            $inc = !$rating ? 1 : -1;
            doRequest($mysqli, "DELETE FROM ratings WHERE `uid`=? AND `list_id`=?", [$accountCheck, $fuckupData], "ii");
            doRequest($mysqli,"UPDATE lists SET rate_ratio = rate_ratio+? WHERE id=?", [$inc, $fuckupData], "ii");
            $result["result"] = "deleted";
        }
        $result["ratings"] = getRatings($userID, $fuckupData);
        echo json_encode($result);
        break;
    default:
        die(1);
}

// jsem přihlášenej?
// je list hidden?


?>
