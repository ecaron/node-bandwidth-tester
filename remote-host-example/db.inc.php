<?php
$mysqli = new mysqli(
  'YOUR-HOSTNAME-HERE',
  'YOUR-USERNAME-HERE',
  'YOUR-PASSWORD-HERE',
  'YOUR-DATABASE-HERE');

/* check connection */
if (mysqli_connect_errno()) {
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}
