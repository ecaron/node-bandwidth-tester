<?php
if (empty($_SERVER['HTTP_API_KEY']) || $_SERVER['HTTP_API_KEY'] !== '7afe2324-01de-4152-93d7-121decb6aff6') {
  die('Missing API key, or API key does not match');
}

if (empty($_POST['machine']) || empty($_POST['data']) || empty($_POST['datetime'])) {
  die('Not all fields available');
}

require('db.inc.php');

$machine = $mysqli->real_escape_string($_POST['machine']);
$data = $mysqli->real_escape_string($_POST['data']);
$time = $mysqli->real_escape_string($_POST['datetime']);

$query = "INSERT INTO bandwidth_test (`machine`, `date`, `data`) "
       . "VALUES ('$machine', '$time', '$data')";
$mysqli->query($query);
