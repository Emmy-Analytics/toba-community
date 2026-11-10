# Try a second batch of candidate IDs for the two remaining slots
$base = "g:\Users\HCI_PC_PRODUKSI_02\Documents\EMMY 2023-2026 - CASHIER GENERAL AFFAIR\EMMY\BDA\PROJECT 6\assets\img"
$want = @{
  'court-wide.jpg'   = @('photo-1519861531473-9200262188bf','photo-1546519638-68e109498ffc','photo-1504450758481-7338eba7524a','photo-1505666287802-931dc83948e9')
  'arena-lights.jpg' = @('photo-1519861531473-9200262188bf','photo-1504450758481-7338eba7524a','photo-1546519638-68e109498ffc','photo-1518063319789-7217e51049c2')
}
# current hashes to avoid duplicates
$have = @{}
Get-ChildItem $base -Filter *.jpg | ForEach-Object { $have[(Get-FileHash $_.FullName -Algorithm MD5).Hash] = $_.Name }
foreach ($slot in $want.Keys) {
  foreach ($id in $want[$slot]) {
    $url = "https://images.unsplash.com/$id`?auto=format&fit=crop&w=1600&q=80"
    $tmp = Join-Path $base "_try.jpg"
    try {
      Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $tmp -TimeoutSec 30
      $len = (Get-Item $tmp).Length
      if ($len -lt 20000) { continue }
      $h = (Get-FileHash $tmp -Algorithm MD5).Hash
      if ($have.ContainsKey($h)) { Write-Output "dup $slot <- $id (same as $($have[$h]))"; continue }
      Move-Item $tmp (Join-Path $base $slot) -Force
      $have[$h] = $slot
      Write-Output "OK $slot <- $id ($len)"
      break
    } catch { Write-Output "fail $id" }
  }
}
Remove-Item (Join-Path $base "_try.jpg") -ErrorAction SilentlyContinue
Get-ChildItem $base -Filter *.jpg | ForEach-Object { "{0}  {1}" -f $_.Name, $_.Length }
