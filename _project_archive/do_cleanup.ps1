$ErrorActionPreference = 'Stop'
$root = 'G:\Users\HCI_PC_PRODUKSI_02\Documents\EMMY 2023-2026 - CASHIER GENERAL AFFAIR\EMMY\BDA\PROJECT 6'
# Kandidat hapus: SEMUA file root yang diawali underscore + file tool QA/patch satu kali
# TIDAK termasuk: file utama website, aset, konfigurasi.
$patterns = @('_*')
$exact = @('qa-hero.js', 'fix_footers.js', 'shot-challenge.js', 'patch-nav.ps1', 'patch2.ps1', 'patch3.ps1', 'patch_footer.ps1')
$targets = @()
$targets += Get-ChildItem -LiteralPath $root -File -Filter '_*' | Where-Object { $_.Name -ne '_inventory.txt' -and $_.Name -ne '_refs.txt' }
$targets += Get-ChildItem -LiteralPath $root -File | Where-Object { $exact -contains $_.Name }
$targets = $targets | Sort-Object FullName -Unique
$del = Join-Path $env:TEMP ('project6_deleted_' + (Get-Date -Format 'yyyyMMdd_HHmmss'))
New-Item -ItemType Directory -Force -Path $del | Out-Null
$count = 0
foreach ($t in $targets) {
  Copy-Item -LiteralPath $t.FullName -Destination (Join-Path $del $t.Name) -Force
  Remove-Item -LiteralPath $t.FullName -Force
  $count++
}
Write-Output ("deleted+quarantined: {0} files to {1}" -f $count, $del)
