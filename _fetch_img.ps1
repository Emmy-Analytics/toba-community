# Download curated cinematic basketball photos (Unsplash license) into assets/img/
$base = "g:\Users\HCI_PC_PRODUKSI_02\Documents\EMMY 2023-2026 - CASHIER GENERAL AFFAIR\EMMY\BDA\PROJECT 6\assets\img"
New-Item -ItemType Directory -Force -Path $base | Out-Null
# id -> unsplash photo id (w=1600 q=80 auto=compress)
$map = @{
  'court-wide.jpg'    = 'photo-1546519638-68e109498ffc'  # indoor court wide
  'hoop-light.jpg'    = 'photo-1518063319789-7217e51049c2' # hoop / ball
  'ball-close.jpg'    = 'photo-1574680096145-d05b474e2155' # basketball close-up
  'ladies-action.jpg' = 'photo-1519861531473-9200262188bf' # women playing
  'men-action.jpg'    = 'photo-1504450758481-7338eba7524a' # men playing
  'training.jpg'      = 'photo-1519861531473-9200262188bf' # (replaced below if better found)
  'court-floor.jpg'   = 'photo-1505666287802-931dc83948e9' # court detail
  'arena-lights.jpg'  = 'photo-1546519638-68e109498ffc'
}
foreach ($k in $map.Keys) {
  $url = "https://images.unsplash.com/$($map[$k])?auto=format&fit=crop&w=1600&q=80"
  $out = Join-Path $base $k
  try {
    Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $out -TimeoutSec 30
    $len = (Get-Item $out).Length
    if ($len -lt 15000) { Remove-Item $out; Write-Output "FAIL(small) $k" } else { Write-Output "OK $k $len" }
  }
  catch { Write-Output "FAIL $k $($_.Exception.Message)" }
}
