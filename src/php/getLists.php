<?php

// My first time doing php... don't kill me :D
header("Content-Type: application/json"); // Return as JSON
require("secrets.php");

$mysqli = new mysqli($hostname, $username, $password, $database);



if ($mysqli->connect_errno) {
  echo "0";
  exit();
}

function parseResult($rows, $singleList = false)
{
  global $mysqli;
  $ind = 0;
  if (!$singleList) {
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
  echo json_encode(array($rows, $users));
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
} elseif (count($_GET) > 1) {
  // multiple parameters don't make sense lol
  echo "3";
  exit();
} else {
  // Loading all lists
  $result = $mysqli->query("SELECT * FROM `lists` WHERE `hidden` = '0' ORDER BY `lists`.`id` DESC");
  parseResult($result->fetch_all(MYSQLI_ASSOC));
}

$mysqli->close();
