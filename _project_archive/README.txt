TOBA COMMUNITY — PROJECT 6 ARCHIVE
Dibuat otomatis saat sesi cleanup 2026-11-19.

ISI FOLDER INI
- make_backup.ps1     : script pembuat backup zip
- checkzip.ps1        : script verifikasi isi backup zip
- do_cleanup.ps1      : script cleanup yang dipakai (hapus + quarantine)
- RECOVERY.md         : catatan pemulihan & lokasi backup

BACKUP UTAMA (di luar project):
G:\Users\HCI_PC_PRODUKSI_02\Documents\EMMY 2023-2026 - CASHIER GENERAL AFFAIR\EMMY\BDA\_backup_project6_before_cleanup\project6_before_cleanup_full.zip
- 523 entry, memuat seluruh project termasuk SEMUA file debug/probe yang dihapus
  (157 file _rev_*, 31 _qfix_dbg*, semua _qa*, _shots*, _dbg*, dll), minus node_modules.

QUARANTINE TAMBAHAN (salinan file terhapus sebelum dihapus dari project):
C:\Users\HOPECH~1\AppData\Local\Temp\project6_deleted_20261119_093900\  (290 file)

PEMULIHAN: salin kembali file yang dibutuhkan dari zip di atas.
File dihapus hanya dari root project; tidak ada file utama, aset, atau konfigurasi yang disentuh.
