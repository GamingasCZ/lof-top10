<?php
header('Content-type: application/json'); // Return as JSON
require("secrets.php");
$returnData = [];


switch (array_keys($_GET)[0]) {
    case "id": {
        $levelDataReq = post("https://www.boomlings.com/database/getGJLevels21.php", ["secret"=>"Wmfd2893gb7","type"=>0,"str"=>$_GET["id"]], []);
        $levelData = explode(":", $levelDataReq);
        
        $returnData["id"] = $levelData[1];
        $returnData["name"] = $levelData[3];
        $returnData["author"] = $levelData[54];
        $returnData["difficulty"] = ((int) $levelData[21])*10 + $levelData[11]/10; // isDemon*10 + weird ass rubrub difficulty thingy/10
        $returnData["cp"] = ((int) $levelData[27] > 0) + ((int) $levelData[29] > 0) + ((int) $levelData[31] > 0);
        break;
    }
    case "levelName": {
        $levelDataReq = post("https://www.boomlings.com/database/getGJLevels21.php", ["secret"=>"Wmfd2893gb7","type"=>0,"str"=>$_GET["levelName"]], []);
        if ($levelDataReq == -1) { // No levels found
            http_response_code(404);
            die(-1);
        }
        
        $allLevels = explode("|", $levelDataReq); 
        $levelData = explode(":", $allLevels[0]); // First result level
        $names = explode("|", explode("#", $levelDataReq)[1]); // rob's silly ass response (users)

        foreach ($names as $level) { // Player ID from levelData search in names
            if (preg_match(sprintf("/^%s/", $levelData[7]), $level) == 1) $returnData["author"] = explode(":", $level)[1];
        }

        $returnData["id"] = $levelData[1];
        $returnData["name"] = $levelData[3];
        $returnData["difficulty"] = ((int) $levelData[21])*10 + $levelData[11]/10; // isDemon*10 + weird ass rubrub difficulty thingy/10
        $returnData["cp"] = ((int) $levelData[27] > 0) + ((int) $levelData[29] > 0) + ((int) $levelData[31] > 0);
        break;
    }
    case "levelMaker": {

        break;
    }
    case "userSearch": {

        break;
    }
}


echo json_encode($returnData);
?>