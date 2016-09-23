<?php
if (empty($_GET['machine'])) {
  die("Missing machine parameter");
}

require('db.inc.php');

$machine = mysqli_real_escape_string($mysqli, $_GET['machine']);
$query = "SELECT `data`, `date` FROM bandwidth_test WHERE `machine`='$machine' ORDER BY `date`";
$res = $mysqli->query($query);
$latencyLog = [['Date', 'Google Ping', 'Softlayer Ping']];
$speedLog = [['Date', 'Min', 'Avg', 'Max']];
while ( $row = mysqli_fetch_array($res, MYSQLI_BOTH) ) {
  $datum = json_decode($row['data'], true);
  $latencyLog[] = array($row['date'], $datum['ping'], $datum['bandwidth']['latency']);
  $speedLog[] = array(
    $row['date'],
    $datum['bandwidth']['minThroughput'] / 1000,
    $datum['bandwidth']['avgThroughput'] / 1000,
    $datum['bandwidth']['maxThroughput'] / 1000);
}

?>
 <html>
  <head>
    <title>Bandwidth Analytics for <?= htmlspecialchars($_GET['machine']); ?></title>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
      google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable(<?php echo json_encode($latencyLog); ?>);
        var data2 = google.visualization.arrayToDataTable(<?php echo json_encode($speedLog); ?>);

        var options = {
          title: 'System Latency',
          curveType: 'function',
          legend: { position: 'bottom' },
          vAxis: { format:'#ms'}
        };

        var options2 = {
          title: 'System Bandwidth',
          curveType: 'function',
          legend: { position: 'bottom' },
          vAxis: { format:'#.#Mbps'}
        };

        var chart = new google.charts.Line(document.getElementById('latency_chart'));
        var chart2 = new google.charts.Line(document.getElementById('bandwidth_chart'));

        chart.draw(data, google.charts.Line.convertOptions(options));
        chart2.draw(data2, google.charts.Line.convertOptions(options2));
      }
    </script>
  </head>
  <body>
    <div id="latency_chart" style="width: 900px; height: 500px; padding-bottom: 10px; border-bottom: 2px solid #a0a0a0; margin-bottom: 10px"></div>
    <div id="bandwidth_chart" style="width: 900px; height: 500px"></div>
  </body>
</html>

