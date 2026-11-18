$ids = @('123hW3KooJAwmHs1JeLp5u2KxmfY582d', '1uqhD67jAr28AUAHtqvjIQeQ2zU')
foreach ($id in $ids) {
  try {
    $r = Invoke-WebRequest -Uri ("https://drive.google.com/thumbnail?id=" + $id + "&sz=w400") -UseBasicParsing -TimeoutSec 25
    Write-Output ($id + " GET -> " + $r.StatusCode + " " + $r.Headers['Content-Type'] + " len=" + $r.RawContentLength)
  }
  catch {
    Write-Output ($id + " GET FAIL " + $_.Exception.Message)
  }
}
