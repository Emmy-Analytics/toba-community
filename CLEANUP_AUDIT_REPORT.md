# LAPORAN AUDIT — SAFE PROJECT CLEANUP (PROJECT 6 TOBA COMMUNITY)
Tanggal audit: 20 Nov 2026. Audit saja — BELUM ada file yang dihapus.

## RINGKASAN ANGKA
- File project diperiksa : seluruh file root (kode, konfigurasi, dok), seluruh assets (rekursif), folder _project_archive.
- Metode referensi       : pencarian nama file di SEMUA *.html, *.js, *.css (termasuk referensi dinamis via konstanta `photos`/`IMG`), plus pengecekan URL-encoded (KOCAKKKK), plus hash-duplicate check MD5.

## KATEGORI 1 — AMAN DIHAPUS (terverifikasi nol referensi + bukan aset dinamis)
| Item | Ukuran | Alasan |
|---|---|---|
| assets\img\qa-hero-api\ (33 screenshot PNG QA) | ~11 MB | Screenshot testing sementara; tidak ada satu pun referensi di kode/konfigurasi. |
| assets\img\qa-p1\ (17 screenshot PNG QA) | ~6 MB | Idem. |
| _rev_panel_submit.html, _tobi_dbg.mjs, _tobi_qa2.mjs, _tobi_ui_qa.mjs, _hero_qa6.mjs, _hero_qa7.mjs, _qa_mobile_events.png, _qa_mobile_index.png, _qa_panel.png (9 file di root) | kecil | Probe/debug/temp hasil sesi QA lama; tidak direferensikan halaman mana pun. |
| `_project_archive\shots\`, `_project_archive\audit_final_*.png`, `_project_archive\hero_*.png` | gambar QA | Screenshot audit lama; dokumen inti archive (README, RECOVERY.md, script backup) TIDAK disentuh. |
| File root `for GitHub Pages deploymentgit commit -m …` | kecil | Sisa typo perintah git yang tersimpan sebagai nama file; bukan konfigurasi deployment (GitHub Pages memakai root/branch, bukan file ini). |

Estimasi penghematan: ±17 MB aset QA + kerapian root.

## KATEGORI 2 — PERLU KONFIRMASI ANDA
| Item | Alasan ragu |
|---|---|
| assets\img\web\toba-011.jpg & toba-012.jpg | Duplikat identik (MD5 sama), dan keduanya tidak direferensikan kode (foto galeri memakai API Sheets). Tapi bisa jadi dipakai manual/admin. |
| ±20 foto `assets\img\web\toba-0XX.jpg` & beberapa JPG di `assets\img\` root yang tidak muncul di kode | Foto dokumentasi asli; tidak direferensikan saat ini (galeri = Google Drive API). Berisiko dipakai admin/di masa depan — SARAN: pindah ke archive, bukan hapus. |
| `assets\img\the founder.png` | Duplikat dari `web/founder-cut.png` yang dipakai. Bisa dihapus jika yakin. |
| `assets\img\@abandmotret-630 (1).JPG` | Duplikat dari `@abandmotret-630.JPG`. |
| `_project_archive\script_before_center_stage.js.bak` + `style_before_center_stage.css.bak` | Backup rollback redesign terakhir (kemarin). Pertahankan minimal sampai redesign stabil di production. |
| node_modules\ | Hanya dipakai script QA Puppeteer (devDependency). Tidak memengaruhi website; hapus hanya jika QA browser tidak akan dijalankan lagi. |

## KATEGORI 3 — WAJIB DIPERTAHANKAN (tidak disentuh)
- Semua *.html (index, tobaladies, tobadeli, events, merchandise, gallery, partnership, game, 404, dll).
- script.js, i18n.js, court-geometry.js, intro.js, music.js, style.css, favicon.svg.
- assets\img\cutout\ (246 file SVG — sumber hero carousel + fallback Google Drive gagal).
- Semua aset yang ter-referensi: crocodile-head(-trans).png, logopinkpng, logo orange/pink mascot, court-floor.jpg, ball-close.jpg, KOCAKKKK svg (dipakai intro via CSS URL-encoded), founder-cut.png, instagram/whatsapp.svg, dst.
- Konfigurasi/deployment: package.json, package-lock.json, .git, robots/sitemap bila ada.
- _project_archive\ inti: README.txt, RECOVERY.md, make_backup.ps1, checkzip.ps1, do_cleanup.ps1 + lokasi backup zip eksternal (G:\...\_backup_project6_before_cleanup).

## TEMUAN KHUSUS
1. Duplikat function t() di i18n.js sudah diperbaiki di sesi sebelumnya (bukan bagian cleanup ini).
2. Tidak ditemukan file duplikat aset lain selain yang tercantum di Kategori 2.
3. Tidak ada referensi tersembunyi ke folder qa-* (dicek juga di file archive *.mjs/*.cjs).
4. Git: 36 perubahan belum di-commit (hasil redesign hero + TOBI). TIDAK di-commit/di-push sesuai batasan.

## EKSEKUSI
Tahap D menunggu daftar persetujuan Anda (boleh: "setuju kategori 1 saja", atau sebutkan item kategori 2 yang ikut dihapus). Setelah persetujuan: hapus → jalankan QA Puppeteer (console error, overflow, semua halaman, carousel, TOBI, music player) → lapor hasil.
