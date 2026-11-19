$b='G:\Users\HCI_PC_PRODUKSI_02\Documents\EMMY 2023-2026 - CASHIER GENERAL AFFAIR\EMMY\BDA\_backup_project6_before_cleanup\project6_before_cleanup_full.zip'
Add-Type -AssemblyName System.IO.Compression.FileSystem
try { $z=[System.IO.Compression.ZipFile]::OpenRead($b) } catch { Write-Output "OPEN FAILED: $($_.Exception.Message)"; exit 1 }
Write-Output ("entries: {0}" -f $z.Entries.Count)
$targets=@('index.html','script.js','style.css','qa-hero.js','_rev_probe.json','_hero_dbg.cjs','game.html','package.json','favicon.svg','assets/img/1.png','README.txt')
foreach($t in $targets){
  $m=$z.Entries | Where-Object { $_.FullName -eq $t }
  "{0} => {1} entry(ies); size={2}" -f $t, ($m|Measure-Object).Count, (($m|Select-Object -First 1).Length)
}
$z.Dispose()
