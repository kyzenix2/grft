$files = @(
  "guide.html","deploy.html","civ.html","city.html","pets.html","garage.html","plots.html","square.html",
  "economy.html","bank.html","exchange.html","coins.html","freeport.html","league.html","jobs.html","hire.html",
  "foundry.html","apps.html","billboards.html","crews.html","clinic.html","compute.html","court.html",
  "election.html","strikes.html","verify.html","x402.html"
)
$template = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GRFT — San Verano</title>
  <link rel="icon" href="icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/palette.css">
  <link rel="stylesheet" href="css/landing.css">
  <link rel="stylesheet" href="css/city-switchboard.css">
</head>
<body data-page="__FILE__">
  <div id="app"></div>
  <script src="js/pages.js"></script>
  <script src="js/shell.js"></script>
</body>
</html>
'@
foreach ($f in $files) {
  Set-Content -Path $f -Value ($template.Replace("__FILE__", $f)) -Encoding UTF8
  Write-Output $f
}
