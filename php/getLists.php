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
  $ind = 0;
  if (!$singleList) {
    foreach ($rows as $row) {
      if (base64_decode($row["data"], true) == true) {
        $row["data"] = base64_decode($row["data"]);
      }
      $row["data"] = json_decode(htmlspecialchars_decode($row["data"]));

      if ($singleList) {
        $rows["data"] = $row["data"];
      } else {
        $rows[$ind]["data"] = $row["data"];
      }
      $ind += 1;
    }
  } else {
    // Single list
    if (base64_decode($rows["data"], true) == true) {
      $rows["data"] = base64_decode($rows["data"]);
    }
    $rows["data"] = json_decode(htmlspecialchars_decode($rows["data"]));
  }

  echo json_encode($rows);
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
    $getList = $mysqli->query("SELECT * FROM `lists` WHERE `hidden` LIKE 0 ORDER BY RAND() LIMIT 1");
    parseResult($getList->fetch_all(MYSQLI_ASSOC));
  } elseif (in_array("homepage", array_keys($_GET))) {
    $result = $mysqli->query("SELECT * FROM `lists` WHERE `hidden` = '0' ORDER BY `lists`.`id` DESC LIMIT 3 ");
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
