<?php
header('Content-type: application/json'); // Return as JSON
require("secrets.php");
$returnData = [];

$levelDataReq = post("https://www.boomlings.com/database/getGJLevels21.php", ["secret"=>"Wmfd2893gb7","type"=>0,"str"=>$_GET["id"]], []);
$levelData = explode(":", $levelDataReq);
print_r($levelData);
$returnData["name"] = $levelData[3];
$returnData["author"] = $levelData[54];
$returnData["diff"] = $levelData[27];

echo json_encode($returnData);
?>