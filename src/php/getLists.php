<?php
/*
Return codes: 
0 - Connection error
1 - Empty request
2 - Invalid parameters
3 - No results when searching
4 - Invalid listID
*/

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

function parseResult($rows, $singleList = false, $maxpage = -1, $search = "", $page = 0) {
  global $mysqli;
  $ind = 0;
  $dbInfo = [];
  if (!$singleList) {
    // No results when searching / No lists to load
    if (count($rows) == 0) {
      die("3");
    }
    
    $uid_array = array();
    foreach ($rows as $row) {
      array_push($uid_array, $row["uid"]);
      $row["data"] = json_decode(htmlspecialchars_decode($row["data"]));
      $rows[$ind]["data"] = $row["data"];

      $ind += 1;
    }

    $query = sprintf("SELECT DISTINCT username,discord_id
                      FROM users
                      WHERE discord_id IN ('%s')", join("','", array_unique($uid_array)));
    $dbInfo["maxPage"] = $maxpage;
    $dbInfo["startID"] = $rows[0]["id"];
    $dbInfo["searchQuery"] = $search;
    $dbInfo["page"] = $page;
    $dbInfo["path"] = $_SERVER["SCRIPT_NAME"];
    
  } else {
    // Single list
    $rows["data"] = json_decode(htmlspecialchars_decode($rows["data"]));

    if (isset($_COOKIE["lastViewed"]) && $_COOKIE["lastViewed"] != $rows["id"]) {
      doRequest($mysqli, "UPDATE lists SET views = views+1 WHERE id=?", [$rows["id"]], "i");
      $rows["views"] += 1;
    }
    setcookie("lastViewed", $rows["id"], time()+300);

    // Fetch comment amount
    $commAmount = doRequest($mysqli, "SELECT COUNT(*) FROM comments WHERE listID = ?", [list_id($rows)], "s");
    $rows["commAmount"] = $commAmount["COUNT(*)"];
    $query = sprintf("SELECT username,discord_id,avatar_hash FROM users WHERE discord_id=%s", $rows["uid"]);                  
  }
  
  $result = $mysqli -> query($query) or die($mysqli -> error);
  $users = $result -> fetch_all(MYSQLI_ASSOC);
  echo json_encode(array($rows, $users, $dbInfo));
}

if (count($_GET) == 1) {
  // Loading a single list
  if (in_array("id", array_keys($_GET))) {
    // Private lists can't be accessed by their id!
    $result = doRequest($mysqli, "SELECT * FROM `lists` WHERE `hidden` = '0' AND `id` = ?", [$_GET["id"]], "s");
    if ($result == null) {
      echo "2";
    } else {
      parseResult($result, true);
    }
  } elseif (in_array("pid", array_keys($_GET))) {
    // Private lists
    $result = doRequest($mysqli, "SELECT * FROM `lists` WHERE `hidden`= ?", [$_GET["pid"]], "s");

    if ($result == null) {
      echo "2";
    } // When the pID is invalid
    else {
      parseResult($result, true);
    }
  } elseif (in_array("random", array_keys($_GET))) {
    // Picking a random list
    $result = doRequest($mysqli, "SELECT * FROM `lists` WHERE `hidden` LIKE 0 ORDER BY RAND() LIMIT ?", [1], "i");
    parseResult($result, true);
  } elseif (in_array("homepage", array_keys($_GET))) {
    $result = $mysqli->query("SELECT * FROM `lists` WHERE `hidden` = '0' ORDER BY `lists`.`id` DESC LIMIT 3 ");
    parseResult($result->fetch_all(MYSQLI_ASSOC));
  } elseif (!empty(array_intersect(["user","hidden","homeUser"], array_keys($_GET)))) {
    $account = checkAccount();
    if (!$account) die("[]"); // Not logged in

    $showHidden = in_array("hidden", array_keys($_GET)) ? "" : "AND `hidden` LIKE 0";
    $limit = in_array("homeUser", array_keys($_GET)) ? "LIMIT 3" : "";
    $result = $mysqli->query(sprintf("SELECT * FROM `lists` WHERE `uid`=%s %s ORDER BY `hidden` DESC, `id` DESC %s", $account["id"], $showHidden, $limit));
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
            WHERE `hidden` = '0' AND `id`<=%d AND `name` LIKE '%%%s%%'
            ORDER BY `id` DESC
            LIMIT %d 
            OFFSET %s", $_GET["startID"], $_GET["searchQuery"], clamp(intval($_GET["fetchAmount"]), 2, 15), $dbSlice);

  $maxpageQuery = $mysqli->query(sprintf("SELECT COUNT(*) from `lists` WHERE `hidden` = '0' AND `name` LIKE '%%%s%%' AND `id`<=%d", $_GET["searchQuery"], $_GET["startID"]));
  $maxpage = ceil($maxpageQuery->fetch_array()[0] / clamp(intval($_GET["fetchAmount"]), 2, 15));
  
  $result = $mysqli->query($query);
  parseResult($result->fetch_all(MYSQLI_ASSOC), false, $maxpage, $_GET["searchQuery"], $_GET["page"]);
}

$mysqli->close();

/*
GET
&id || pid || random || homepage

&page=0?startID=10?searchQuery=hello?sort=0?fetchAmount=10
*/