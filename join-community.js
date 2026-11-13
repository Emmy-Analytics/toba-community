/* TOBA COMMUNITY — Prompt 16/19: shared member join form untuk halaman komunitas.
   Satu mekanisme dengan homepage: WA admin 6281285704946, template pesan sama,
   validasi sama. Perbedaan hanya aksen tema (pink Tobaladies / orange Tobadeli)
   dan auto-select komunitas sesuai halaman. Tanpa nomor/link baru. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var WA = 'https://wa.me/6281285704946';
    var page = document.body.dataset.page; /* 'tobaladies' | 'tobadeli' */
    var m = document.getElementById('joinModal');
    if (!m) return;

    var JMSG = {
      id: 'Halo admin TOBA Community! Saya ingin bergabung atau meminta informasi mengenai komunitas TOBA.\n\nBerikut data saya:\nNama: {nama}\nNo. Telp/WA: {phone}\nInstagram: {ig}\nDomisili: {domisili}\nPilihan komunitas: {team}\n\nMohon informasi mengenai cara bergabung, jadwal bermain, dan kegiatan komunitas.\n\nTerima kasih!',
      en: 'Hello TOBA Community admin! I would like to join or request information about TOBA Community.\n\nHere are my details:\nName: {nama}\nPhone/WhatsApp: {phone}\nInstagram: {ig}\nLocation: {domisili}\nCommunity preference: {team}\n\nI would appreciate information about joining, playing schedules, and community activities.\n\nThank you!'
    };
    var ERR = {
      id: { name: 'Nama wajib diisi.', phone: 'Nomor WhatsApp tidak valid.', ig: 'Instagram wajib diisi.', city: 'Domisili wajib diisi.', team: 'Pilih komunitas dulu.' },
      en: { name: 'Name is required.', phone: 'Enter a valid WhatsApp number.', ig: 'Instagram is required.', city: 'Domicile is required.', team: 'Please choose a community.' }
    };
    var curLang = function () { try { return localStorage.getItem('toba-lang') === 'en' ? 'en' : 'id'; } catch (_) { return 'id'; } };

    /* auto-select komunitas sesuai halaman (Prompt 16) */
    var radios = m.querySelectorAll('input[name="team"]');
    if (radios.length) {
      radios.forEach(function (r) { r.checked = false; });
      var auto = m.querySelector('input[name="team"][value="' + (page === 'tobaladies' ? 'Tobaladies' : 'Tobadeli') + '"]');
      if (auto) auto.checked = true;
    }

    var openJoin = function () {
      if (!m.hidden) return;
      /* Prompt 1 mobile: pastikan intro halaman komunitas sudah tidak menutup modal
         (intro z-index lebih tinggi) — tutup intro jika masih tampil */
      var intro = document.querySelector('.tld-intro,.tdl-intro,.tld-intro,#tobaIntro');
      if (intro) {
        var skip = intro.querySelector('.tld-skip,.tdl-skip,.obi-skip,[class*="skip"]');
        if (skip) skip.click(); else intro.remove();
      }
      m.hidden = false;
      document.body.style.overflow = 'hidden';
      var f = m.querySelector('input'); if (f) f.focus();
    };
    var closeModal = function () {
      m.hidden = true;
      document.body.style.overflow = '';
    };

    /* tombol Gabung di halaman komunitas dirender dinamis oleh script.js:
       .callout a.pill (CTA gabung) & .contact-card — buka modal, bukan pindah halaman */
    document.addEventListener('click', function (e) {
      var t = e.target.closest('.callout a.pill, .contact-card, #joinCtaBtn');
      if (!t) return;
      /* .contact-card hanya pada homepage; di halaman komunitas callout CTA gabung
         adalah <a class="pill"> ke partnership.html — ubah perilakunya jadi modal */
      if (t.classList && t.classList.contains('contact-card') && page === 'home') return;
      e.preventDefault();
      openJoin();
    });

    m.addEventListener('click', function (e) { if (e.target.closest('[data-join-close]')) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) closeModal(); });

    var form = m.querySelector('#joinForm'), err = m.querySelector('#joinErr');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form), L = ERR[curLang()];
      var nama = (d.get('nama') || '').trim(), phone = (d.get('phone') || '').trim(),
        ig = (d.get('ig') || '').trim(), dom = (d.get('domisili') || '').trim(), team = d.get('team');
      var bad = [];
      if (!nama) bad.push(L.name);
      if (!/^\+?[0-9][0-9\s-]{7,}$/.test(phone.replace(/[\s-]/g, ''))) bad.push(L.phone);
      if (!ig) bad.push(L.ig);
      if (!dom) bad.push(L.city);
      if (!team) bad.push(L.team);
      if (bad.length) { err.textContent = bad.join(' '); err.hidden = false; return; }
      err.hidden = true;
      var msg = (JMSG[curLang()] || JMSG.id)
        .replace('{nama}', nama).replace('{phone}', phone)
        .replace('{ig}', ig).replace('{domisili}', dom).replace('{team}', team);
      window.open(WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      if (typeof window.toast === 'function') window.toast(t('join.wa.ok'));
      closeModal();
    });
  });
})();
