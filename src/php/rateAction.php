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


$method = $_SERVER["REQUEST_METHOD"];
switch ($method) {
    case 'GET': // Fetches ratings
        # code...
        $fuckupData = sanitizeInput($_GET["id"]);
        $likeQuery = doRequest($mysqli,"SELECT count(*) FROM ratings WHERE rate=0 AND list_id=?", [$fuckupData[0]], "s");
        $dislikeQuery = doRequest($mysqli,"SELECT count(*) FROM ratings WHERE rate=1 AND list_id=?", [$fuckupData[0]], "s");
        echo json_encode(array($likeQuery["count(*)"], $dislikeQuery["count(*)"]));
        break;
        
    case 'POST': // No rate => rate
        $accountCheck = checkAccount()["id"];
        $fuckupData = sanitizeInput($_POST["id"], $_POST["action"]);
        $rating = boolval($fuckupData[1]) ? 1 : -1;

        echo $fuckupData[0];
        $rowQuery = doRequest($mysqli,"INSERT INTO `ratings`(`rate`,`uid`,`list_id`) VALUES (?,?,?)", [boolval($fuckupData[1]), $accountCheck, $fuckupData[0]], "iss");
        $valueQuery = doRequest($mysqli,"UPDATE lists SET rate_ratio = rate_ratio + ? WHERE id=?", [$rating, $fuckupData[0]], "ii");
        break;
    
    case 'PUT': // Change rate
        # code...
        break;
    
    case 'DELETE': // Remove rate
        # code...
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
