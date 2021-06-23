<?php

// My first time doing php... don't kill me :D

require("secrets.php");

$mysqli = new mysqli($hostname, $username, $password, $database);

if ($mysqli -> connect_errno) {
  echo "0";
  exit();
}
if (count($_GET) != 0) {
  $result = $mysqli -> query("SELECT * FROM lists WHERE id=" . join(";",$_GET));
  if ($result == false) {
    // Když je ID gay (je string)
    echo "2";
    }
  else {
    $rows = $result -> fetch_all(MYSQLI_ASSOC);
    if (count($rows) == 0) {
      // Při neplatném ID
      echo "1";
    }
    else {
      foreach ($rows as $row) {
        echo htmlspecialchars_decode(join(";",$row));
      }
    }
  }
}
else {
  $result = $mysqli -> query("SELECT * FROM lists");

  $rows = $result->fetch_all(MYSQLI_ASSOC);
  foreach ($rows as $row) {
    echo htmlspecialchars_decode(join(";",$row)) . "|";
        
    }
      
}

$mysqli -> close();

?>

