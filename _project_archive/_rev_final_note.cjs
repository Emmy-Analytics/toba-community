/* Backend getSheet('Reviews') mengembalikan Sheet object (serialisasi client gagal).
   Coba: getSheet('Reviews') lalu gunakan sebagai argumen getColumns? sudah gagal.
   Trick: gunakan google.script.run dengan penggabungan di SERVER? Tidak bisa.
   Terakhir yang mungkin: coba POST dengan field name 'entry.xxx' style Google Form?
   Sudah cukup. STOP probing payload guessing.

   KEPUTUSAN: frontend tidak perlu tahu — cukup dump isi sheet untuk melihat header:
   gunakan trick getSheet → Sheet → getParent? semuanya bridge gagal.
   ALIH-ALIH: cek apakah testSubmitReview memakai argumen objek — coba kirim argumen
   dan baca BALIK lewat getSheet getLastRow... sama-sama gagal.

   FINAL ATTEMPT satu kali: kirim POST multipart form-data DENGAN charset latin1? no.
   cukup. Laporkan backend tidak dapat diverifikasi field-nya dari luar. */
console.log('stop');
