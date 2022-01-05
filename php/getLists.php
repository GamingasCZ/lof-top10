<?php

// My first time doing php... don't kill me :D

require("secrets.php");

$mysqli = new mysqli($hostname, $username, $password, $database);

if ($mysqli -> connect_errno) {
  echo "0";
  exit();
}
if (count($_GET) == 1) {
  // Loading a single list
  if (in_array("id", array_keys($_GET))) {
    // Private lists can't be accessed by their id!
    $result = $mysqli -> query("SELECT * FROM `lists` WHERE `hidden` = '0' AND `id`=" . $_GET["id"]);
    if ($result == false) {
      // When the ID is gay (does this even work?)
      echo "2";
      }
    else {
      $rows = $result -> fetch_all(MYSQLI_ASSOC);
      if (count($rows) == 0) {
        // When the ID is invalid
        echo "1";
      }
      else {
        foreach ($rows as $row) {
    if (base64_decode($row["data"], true) == true) {
        $row["data"] = base64_decode($row["data"]);
    }
    echo htmlspecialchars_decode(join(";-!-;",$row));
        }
      }
  }
  }
  
  elseif (in_array("pid", array_keys($_GET))) {
    // Private lists
    $result = $mysqli -> query(sprintf("SELECT * FROM `lists` WHERE `hidden`='%s'",$_GET["pid"]));
    $rows = $result -> fetch_all(MYSQLI_ASSOC);
    if (count($rows) == 0) {
      // When the pID is invalid
      echo "1";
    }
    else {
      foreach ($rows as $row) {
    if (base64_decode($row["data"], true) == true) {
        $row["data"] = base64_decode($row["data"]);
    }
    echo htmlspecialchars_decode(join(";-!-;",$row));
      }
    }
  }

  // Searching
  elseif (in_array("search", array_keys($_GET))) {
    // Search is useless for now
    exit();
    $result = $mysqli -> query("SELECT * FROM `lists` WHERE `name` LIKE '%".$_GET["search"]."%'");
    $rows = $result -> fetch_all(MYSQLI_ASSOC);
    if (count($rows) == 0) {
      // No results
      echo "1";
      exit();
    }
    else {
      foreach ($rows as $row) {
    if (base64_decode($row["data"], true) == true) {
        $row["data"] = base64_decode($row["data"]);
    }
    echo htmlspecialchars_decode(join(";-!-;",$row)) . "|-!-|";
      }
    }
  }
}
elseif (count($_GET) > 1) {
  // multiple parameters don't make sense lol
  echo "3";
  exit();
}
else {
  $result = $mysqli -> query("SELECT * FROM `lists` WHERE `hidden` = '0'");

  $rows = $result->fetch_all(MYSQLI_ASSOC);
  foreach ($rows as $row) {
    if (base64_decode($row["data"], true) == true) {
        $row["data"] = base64_decode($row["data"]);
    }
    echo htmlspecialchars_decode(join(";-!-;",$row)) . "|-!-|";
        
    }
      
}

$mysqli -> close();

?>

