<?php

// My first time doing php... don't kill me :D

require("secrets.php");

$mysqli = new mysqli($hostname, $username, $password, $database);
header('Content-type: application/json'); // Return as JSON


if ($mysqli->connect_errno) {
  echo "0";
  exit();
}

function parseResult($rows, $singleList=false) {
  $ind = 0;
  foreach ($rows as $row) {
    if (base64_decode($row["data"], true) == true) {
      $row["data"] = base64_decode($row["data"]);
    }
    $row["data"] = json_decode(htmlspecialchars_decode($row["data"]));
    
    if ($singleList) { $rows["data"] = $row["data"]; }
    else { $rows[$ind]["data"] = $row["data"]; }
    $ind += 1;
  }

  echo json_encode($rows);
}

if (count($_GET) == 1) {
  // Loading a single list
  if (in_array("id", array_keys($_GET))) {
    // Private lists can't be accessed by their id!
    $result = $mysqli->query("SELECT * FROM `lists` WHERE `hidden` = '0' AND `id`=" . $_GET["id"]);
    if ($result == false) {
      // When the ID is gay (does this even work?)
      echo "2";
    }
    else {
      $rows = $result->fetch_all(MYSQLI_ASSOC);

      if (count($rows) == 0) { echo "1"; } // When the pID is invalid
      else { parseResult($rows); }
    }
  } elseif (in_array("pid", array_keys($_GET))) {
    // Private lists
    $result = $mysqli->query(sprintf("SELECT * FROM `lists` WHERE `hidden`='%s'", $_GET["pid"]));
    $rows = $result->fetch_all(MYSQLI_ASSOC);

    if (count($rows) == 0) { echo "1"; } // When the pID is invalid
    else { parseResult($rows); }
  }

  // Searching
  elseif (in_array("search", array_keys($_GET))) {
    // Search is useless for now
    exit();
    $result = $mysqli->query("SELECT * FROM `lists` WHERE `name` LIKE '%" . $_GET["search"] . "%'");
    $rows = $result->fetch_all(MYSQLI_ASSOC);
    
    if (count($rows) == 0) { echo "1"; } // When the pID is invalid
    else { parseResult($rows); }
  }
}

elseif (count($_GET) > 1) {
  // multiple parameters don't make sense lol
  echo "3";
  exit();
}

else {
  // Loading all lists
  $result = $mysqli->query("SELECT * FROM `lists` WHERE `hidden` = '0'");
  parseResult($result->fetch_all(MYSQLI_ASSOC));
}

$mysqli->close();
