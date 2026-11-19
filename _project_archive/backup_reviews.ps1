$ErrorActionPreference = 'Stop'
$src = 'G:\Users\HCI_PC_PRODUKSI_02\Documents\EMMY 2023-2026 - CASHIER GENERAL AFFAIR\EMMY\BDA\PROJECT 6'
$dest = 'G:\Users\HCI_PC_PRODUKSI_02\Documents\EMMY 2023-2026 - CASHIER GENERAL AFFAIR\EMMY\BDA\_backup_project6_before_cleanup\reviews_backup'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
foreach ($f in @('style.css', 'script.js', 'i18n.js')) {
  Copy-Item -LiteralPath (Join-Path $src $f) -Destination (Join-Path $dest ($f + '.' + (Get-Date -Format 'yyyyMMdd_HHmmss') + '.bak')) -Force
}
Get-ChildItem $dest | Select-Object Name, Length | Format-Table -AutoSize
