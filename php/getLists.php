<?php

/*
Return codes: 
0 - Connection error
1 - Empty request
2 - Invalid parameters
3 - No results when searching
4 - Invalid listID
*/

// My first time doing php... don't kill me :D
header("Content-Type: application/json"); // Return as JSON
require("secrets.php");

$mysqli = new mysqli($hostname, $username, $password, $database);



if ($mysqli->connect_errno) {
  echo "0";
  exit();
}

function clamp($current, $min, $max) {
  return max($min, min($max, $current));
}

function parseResult($rows, $singleList = false, $maxpage = -1) {
  $ind = 0;
  if (!$singleList) {
    // No results when searching / No lists to load
    if (count($rows) == 0) {
      die("3");
    }
    
    foreach ($rows as $row) {
      // Decode html special characters
      $row["data"] = json_decode(htmlspecialchars_decode($row["data"]));
      $rows[$ind]["data"] = $row["data"];

      $ind += 1;
    }
    array_push($rows, $maxpage);
    
  } else {
    // Single list
    $rows["data"] = json_decode(htmlspecialchars_decode($rows["data"]));
  }

  echo json_encode($rows);
}

if (count($_GET) == 1) {
  // Loading a single list
  if (in_array("id", array_keys($_GET))) {
    // Private lists can't be accessed by their id!
    $result = doRequest($mysqli, "SELECT * FROM `lists` WHERE `hidden` = '0' AND `id` = ?", [$_GET["id"]], "s");

    if (count($result) == 0) { die("4"); } // Invalid ID
      
    parseResult($result, true);
  } elseif (in_array("pid", array_keys($_GET))) {
    // Private lists
    $result = doRequest($mysqli, "SELECT * FROM `lists` WHERE `hidden`= ?", [$_GET["pid"]], "s");

    if (count($result) == 0) { die("4"); } // Invalid ID
    
    parseResult($result, true);
  } elseif (in_array("random", array_keys($_GET))) {
    // Picking a random list
    $query = $mysqli->query("SELECT `id` FROM `lists` WHERE `hidden`=0");
    $result = $query->fetch_all(MYSQLI_ASSOC);
    $ids = array();

    for ($i = 0; $i < sizeof($result); $i++) {
      array_push($ids, $result[$i]["id"]);
    }

    $getList = $mysqli->query("SELECT * FROM `lists` WHERE `id`=" . $ids[array_rand($ids)]);
    parseResult($getList->fetch_all(MYSQLI_ASSOC));
  } elseif (in_array("homepage", array_keys($_GET))) {
    $result = $mysqli->query("SELECT * FROM `lists` WHERE `hidden` = '0' ORDER BY `lists`.`id` DESC LIMIT 3 ");
    parseResult($result->fetch_all(MYSQLI_ASSOC));
  }
} else {
  // --- Loading all lists ---

  // Are values numbers?
  if (!is_numeric($_GET["page"]) &&
      !is_numeric($_GET["startID"]) &&
      !is_numeric($_GET["sort"] &&
      !is_numeric($_GET["fetchAmount"]))) {
    die("1");
  }

  // How many list should be fetched and the offset (page)
  $dbSlice = clamp(intval($_GET["fetchAmount"]), 2, 15) * intval($_GET["page"]);
  
  // 0 = descending, 1 = ascending
  $sorting = intval($_GET["sort"]) == 0 ? "DESC" : "ASC";

  $query = sprintf("SELECT * FROM `lists`
            WHERE `hidden` = '0'
            AND `name` LIKE '%%%s%%'
            ORDER BY `lists`.`id`
            %s 
            LIMIT %d
            OFFSET %d", $_GET["searchQuery"], $sorting, $_GET["fetchAmount"], $dbSlice);

  $maxpageQuery = $mysqli->query(sprintf("SELECT COUNT(*) from `lists` WHERE `hidden` = '0' AND `name` LIKE '%%%s%%'", $_GET["searchQuery"]));
  $maxpage = ceil($maxpageQuery->fetch_array()[0] / $_GET["fetchAmount"]);
  
  $result = $mysqli->query($query);
  parseResult($result->fetch_all(MYSQLI_ASSOC), false, $maxpage);
}

$mysqli->close();


/*
GET
&id || pid || random || homepage

&page=0?startID=10?searchQuery=hello?sort=0?fetchAmount=10
*/
