$ids = @('12GguSs1qx9r1GruzeBfRcDCsusW9HxGt','1wllX_VIZhFBdfQzc4UWVrsD8gIqfB186','16bcF_sCuCr3KnOeM8F30KseNKQkzDyk_','1W-SgFlXc5R3dTapM_jtuWJauTJ6KC_B8','11V2PVJ7tUCInXTGnu8NAuHHv5vWgmOuX','123hW3KooJAwmHs1JeLp5u2KxmfY582d','1ExxxsjXzmpRxBoBM2IUfbOPguTZNotji','120Lr7adJIt8daEH1bsiL19tQKLWgAxI2','1uqhD67jAr28AUAHtqvjIQeQ2zU','1JAWJDBMfFb8hVYRQHS4Y5dcfy9TISCyS','1CgCcFBHOgqg21Ky7yVslFfeQZseuPTid','1hN511_3VimHXabG3mVt7zayhvdoLOzuu')
foreach ($id in $ids) {
  try {
    $r = Invoke-WebRequest -Uri ("https://drive.google.com/thumbnail?id=" + $id + "&sz=w400") -Method Head -UseBasicParsing -TimeoutSec 25
    Write-Output ($id + " -> " + $r.StatusCode + " " + $r.Headers['Content-Type'])
  } catch {
    Write-Output ($id + " -> FAIL " + $_.Exception.Message)
  }
}
