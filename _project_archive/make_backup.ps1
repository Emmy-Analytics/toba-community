$ErrorActionPreference = 'Stop'
$dest = 'G:\Users\HCI_PC_PRODUKSI_02\Documents\EMMY 2023-2026 - CASHIER GENERAL AFFAIR\EMMY\BDA\_backup_project6_before_cleanup'
$zip = Join-Path $dest 'project6_before_cleanup_full.zip'
$src = 'G:\Users\HCI_PC_PRODUKSI_02\Documents\EMMY 2023-2026 - CASHIER GENERAL AFFAIR\EMMY\BDA\PROJECT 6'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $zip) { Remove-Item $zip -Force }
$fs = [System.IO.File]::Create($zip)
$arc = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
$level = [System.IO.Compression.CompressionLevel]::Fastest
$count = 0
Get-ChildItem $src -Recurse -File | Where-Object { $_.FullName -notmatch '\\node_modules\\' } | ForEach-Object {
  $rel = $_.FullName.Substring($src.Length + 1).Replace('\', '/')
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($arc, $_.FullName, $rel, $level) | Out-Null
  $count++
}
$arc.Dispose(); $fs.Dispose()
Write-Output ("entries written: {0}" -f $count)
Write-Output ("{0:N0} bytes" -f (Get-Item $zip).Length)
