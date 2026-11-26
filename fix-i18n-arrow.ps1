$p = (Resolve-Path 'i18n.js').Path
$lines = [System.IO.File]::ReadAllLines($p, [System.Text.Encoding]::UTF8)
$lines[112] = $lines[112] -replace ' \u2192 ', ' - '
[System.IO.File]::WriteAllLines($p, $lines, (New-Object System.Text.UTF8Encoding $false))
Write-Output ("LINE113: " + $lines[112])
