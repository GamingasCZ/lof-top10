<?php

// My first time doing php... don't kill me :D

require("secrets.php");

$mysqli = new mysqli($hostname, $username, $password, $database);

if ($mysqli -> connect_errno) {
  echo "0";
  exit();
}
if (count($_GET) != 0) {
  // Loading a single list
  if (in_array("id", array_keys($_GET))) {
    $result = $mysqli -> query("SELECT * FROM lists WHERE id=" . $_GET["id"]);
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
          echo htmlspecialchars_decode(join(";-!-;",$row));
        }
      }
  }
  }

  // Searching
  elseif (in_array("search", array_keys($_GET))) {
    $result = $mysqli -> query("SELECT * FROM `lists` WHERE `name` LIKE '%".$_GET["search"]."%'");
    $rows = $result -> fetch_all(MYSQLI_ASSOC);
    if (count($rows) == 0) {
      // No results
      echo "1";
    }
    else {
      foreach ($rows as $row) {
        echo htmlspecialchars_decode(join(";-!-;",$row)) . "|-!-|";
      }
    }
  }
}
else {
  $result = $mysqli -> query("SELECT * FROM `lists` WHERE `hidden` = 0");

  $rows = $result->fetch_all(MYSQLI_ASSOC);
  foreach ($rows as $row) {
    echo htmlspecialchars_decode(join(";-!-;",$row)) . "|-!-|";
        
    }
      
}

$mysqli -> close();

?>

