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

function getRatings($userID) {
    global $mysqli;
    $fuckupData = sanitizeInput($_GET["id"]);
    $likeQuery = doRequest($mysqli,"SELECT count(*) FROM ratings WHERE rate=1 AND list_id=?", [$fuckupData[0]], "s");
    $dislikeQuery = doRequest($mysqli,"SELECT count(*) FROM ratings WHERE rate=0 AND list_id=?", [$fuckupData[0]], "s");
    $hasRatedQuery = doRequest($mysqli,"SELECT `rate` FROM ratings WHERE `uid`=? AND list_id=?", [$userID, $fuckupData[0]], "is");
    return array($likeQuery["count(*)"], $dislikeQuery["count(*)"], $hasRatedQuery["rate"]);
}

$method = $_SERVER["REQUEST_METHOD"];
switch ($method) {
    case 'GET': // Fetches ratings
        $userID = checkAccount()["id"];
        echo json_encode(getRatings($userID));
        break;
        
    case 'POST': // No rate => rate
        $accountCheck = checkAccount()["id"];
        $fuckupData = sanitizeInput($_POST["id"], $_POST["action"]);
        $rating = boolval($fuckupData[1]) ? 1 : -1;

        $checkRate = doRequest($mysqli, "SELECT rate FROM ratings WHERE `uid`=? AND `list_id`=?", [$accountCheck, $fuckupData[0]], "ii");
        $result = ["result" => null, "ratings" => null];
        if (is_null($checkRate)) { // No rating
            $rowQuery = doRequest($mysqli,"INSERT INTO `ratings`(`rate`,`uid`,`list_id`) VALUES (?,?,?)", [boolval($fuckupData[1]), $accountCheck, $fuckupData[0]], "iss");
            $valueQuery = doRequest($mysqli,"UPDATE lists SET rate_ratio = rate_ratio + ? WHERE id=?", [$rating, $fuckupData[0]], "ii");
            $result["result"] = "added";
        }
        elseif ($checkRate["rate"] !== $fuckupData[1]) { // Change rating
            doRequest($mysqli, "UPDATE `ratings` SET `rate`=? WHERE `uid`=? AND `list_id`=?", [boolval($fuckupData[1]), $accountCheck, $fuckupData[0]], "iii");
            // todo: remove from rate_ratio
            $result["result"] = "changed";
        }
        elseif ($checkRate["rate"] === $fuckupData[1]) { // Remove rating
            // todo: maybe check for errors?
            doRequest($mysqli, "DELETE FROM ratings WHERE `uid`=? AND `list_id`=?", [$accountCheck, $fuckupData[0]], "ii");
            // todo: remove from rate_ratio
            $result["result"] = "deleted";
        }
        $result["ratings"] = getRatings($userID);
        echo $result;
        break;
    default:
        die(1);
}

// jsem přihlášenej?
// likuju, dislikuju, odlikuji, oddislikuju, ruším hodnocení?
// je list hidden?
// updatovat rate ratio
// přidat/odebrat z tabulky rates


?>
