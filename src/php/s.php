<?php
/*
Return codes: 
0 - Connection error
1 - Empty request
2 - Invalid parameters
3 - No results when searching
4 - Invalid listID
*/

require("secrets.php");

$mysqli = new mysqli($hostname, $username, $password, $database);
if ($mysqli->connect_errno) {
  echo "0";
  exit();
}

function mtch($val) {
    return preg_match("/\d+/", $val);
}

function parseResult($rows) {
  global $mysqli;

  // Single list
  $rows["data"] = json_decode(htmlspecialchars_decode($rows["data"]));
  setcookie("lastViewed", $rows["id"], time()+300);

  // Fetch comment amount
  $query = sprintf("SELECT username,discord_id,avatar_hash FROM users WHERE discord_id=%s", $rows["uid"]);                  
  
  $result = $mysqli -> query($query) or die($mysqli -> error);
  $users = $result -> fetch_all(MYSQLI_ASSOC);
  $listLen = sizeof(array_filter(array_keys((array)$rows["data"]), "mtch"));
  $desc = sprintf("%s levels | %s views | Uploaded %s", $listLen, $rows["views"], $rows["timestamp"]);
  //echo $rows["name"];
  echo "<head>";
  echo '<meta name="twitter:card" content="summary">';
  echo '<meta name="twitter:title" property="og:title" itemprop="name" content="'.$rows["name"].' by '.$users[0]["username"].' | GD Lists">';
  echo '<meta name="twitter:description" property="og:description" itemprop="description" content="'.$desc.'">';
  echo "</head><body></body></html>";
  header("Location: https://gamingas.wz.cz/lofttop10/#".$rows["id"]);
}

if (count($_GET) == 1) {
  // Loading a single list
  if (in_array("id", array_keys($_GET))) {
    // Private lists can't be accessed by their id!
    $result = doRequest($mysqli, "SELECT * FROM `lists` WHERE `hidden` = '0' AND `id` = ?", [$_GET["id"]], "s");
    parseResult($result, true);
  } elseif (in_array("pid", array_keys($_GET))) {
    // Private lists
    $result = doRequest($mysqli, "SELECT * FROM `lists` WHERE `hidden`= ?", [$_GET["pid"]], "s");
    parseResult($result);
  }
}
$mysqli->close();
?>