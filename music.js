/* =====================================================================
   TOBA COMMUNITY — BACKGROUND MUSIC PLAYER (music.js)
   Data  : Apps Script ?api=music (Google Sheets tab "Music")
   Audio : Google Drive (audioUrl dari Sheets; fallback drive.usercontent)
   Aturan: autoplay DIBLOKIR sampai interaksi pertama pengunjung.
           Satu audio aktif. Pemulihan track+posisi antar halaman
           via sessionStorage (navigasi multi-halaman, bukan SPA).

   CATATAN KOMPATIBILITAS GOOGLE DRIVE (hasil QA nyata, Chromium):
   - URL stream langsung (uc?export=download / drive.usercontent...download)
     GAGAL di elemen <audio> Chromium: MEDIA_ELEMENT_ERROR code=4 (format).
     Penyebab: file .mp3 di Drive tersimpan sebagai kontainer ISO-BMFF/DASH
     ("major_brand dash"), bukan MPEG-1 murni — demuxer Chromium menolaknya
     saat streaming; DAN drive.usercontent mengirim Content-Disposition:
     attachment (403 utk subresource tanpa sandbox).
   - Solusi terbukti: unduh penuh via fetch() → Blob → blob: URL → <audio>.
     SEMUA track lolos (durasi terbaca, audio terputar).
   - Jika fetch() diblokir CORS di produksi, player memakai proxy Apps Script
     (action=musicproxy) yang dikonfigurasi admin; jika proxy juga gagal,
     player tetap tampil dengan pesan error yang jelas (tidak hardcode lagu).
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- konfigurasi ---------- */
  var API = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
  var MUSIC_ENDPOINT = API + '?api=music&callback=tobaMusicCallback';
  var SS_KEY = 'tobaMusicState.v1';      /* {idx, time, playing, volume, repeat} */
  var CACHE_KEY = 'tobaMusicTracks.v1';  /* cache daftar lagu (tanpa audio) */
  var TTL = 5 * 60 * 1000;

  /* ---------- state ---------- */
  var tracks = [];
  var cur = 0;
  var audio = null;            /* dibuat saat interaksi pertama */
  var wantPlay = false;        /* user sudah pernah menekan Play */
  var repeat = false;
  var volume = 0.8;
  var pendingSeek = null;      /* {time} untuk pemulihan antar halaman */
  var panelOpen = false;

  /* ---------- util ---------- */
  function $(id) { return document.getElementById(id); }
  function fmt(s) {
    if (!isFinite(s)) return '0:00';
    s = Math.max(0, Math.round(s));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  function saveState() {
    try {
      sessionStorage.setItem(SS_KEY, JSON.stringify({
        idx: cur, time: audio ? audio.currentTime : 0,
        playing: wantPlay, volume: volume, repeat: repeat, open: panelOpen
      }));
    } catch (_) { }
  }
  function loadState() {
    try { return JSON.parse(sessionStorage.getItem(SS_KEY)); } catch (_) { return null; }
  }

  /* ---------- UI: markup disuntik sekali (idempotent) ---------- */
  function buildUI() {
    if ($('tobaMusicFab')) return;
    var wrap = document.createElement('div');
    wrap.id = 'tobaMusicRoot';
    wrap.innerHTML =
      '<button class="tm-fab" id="tobaMusicFab" aria-label="Buka pemutar musik" aria-expanded="false">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18.5V6.2l10-2v12.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="6.6" cy="18.5" r="2.6" fill="currentColor"/><circle cx="16.6" cy="16.5" r="2.6" fill="currentColor"/></svg>' +
      '<span class="tm-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '</button>' +
      '<section class="tm-panel" id="tobaMusicPanel" hidden aria-label="TOBA Music Player">' +
      '<header class="tm-head"><b>TOBA <span>MUSIC</span></b><button class="tm-x" id="tmClose" aria-label="Tutup">\u2715</button></header>' +
      '<div class="tm-now">' +
      '<p class="tm-title" id="tmTitle">Memuat daftar lagu\u2026</p>' +
      '<p class="tm-status" id="tmStatus">TOBA Community</p>' +
      '</div>' +
      '<div class="tm-progress"><input type="range" id="tmSeek" min="0" max="1000" value="0" aria-label="Progress lagu" disabled>' +
      '<span class="tm-time"><span id="tmCur">0:00</span> / <span id="tmDur">0:00</span></span></div>' +
      '<div class="tm-controls">' +
      '<button id="tmPrev" aria-label="Lagu sebelumnya" disabled>\u23EE</button>' +
      '<button id="tmPlay" class="tm-play" aria-label="Putar" disabled>\u25B6</button>' +
      '<button id="tmNext" aria-label="Lagu berikutnya" disabled>\u23ED</button>' +
      '<button id="tmRepeat" class="tm-repeat" aria-label="Ulangi lagu" aria-pressed="false" disabled>\u21BB</button>' +
      '</div>' +
      '<div class="tm-volume"><span aria-hidden="true">\u{1F50A}</span><input type="range" id="tmVol" min="0" max="100" value="80" aria-label="Volume"></div>' +
      '<ul class="tm-list" id="tmList"></ul>' +
      '</section>';
    document.body.appendChild(wrap);

    $('tobaMusicFab').addEventListener('click', togglePanel);
    $('tmClose').addEventListener('click', togglePanel);
    $('tmPlay').addEventListener('click', onPlayClick);
    $('tmNext').addEventListener('click', function () { step(1); });
    $('tmPrev').addEventListener('click', function () { step(-1); });
    $('tmRepeat').addEventListener('click', function () {
      repeat = !repeat;
      this.setAttribute('aria-pressed', repeat);
      this.classList.toggle('on', repeat);
      saveState();
    });
    $('tmVol').addEventListener('input', function () {
      volume = this.value / 100;
      if (audio) audio.volume = volume;
      saveState();
    });
    $('tmSeek').addEventListener('input', function () {
      if (audio && audio.duration) {
        audio.currentTime = (this.value / 1000) * audio.duration;
      }
    });
    /* SEMUA kontrol dikunci sampai interaksi pertama — kepatuhan autoplay */
    ['pointerdown', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, firstInteraction, { once: true, passive: true });
    });
  }

  function firstInteraction() { ensureAudio(); }

  function togglePanel() {
    panelOpen = !panelOpen;
    $('tobaMusicPanel').hidden = !panelOpen;
    $('tobaMusicFab').setAttribute('aria-expanded', panelOpen);
    $('tobaMusicFab').classList.toggle('open', panelOpen);
    document.body.classList.toggle('tm-panel-open', panelOpen);  /* CSS memastikan overflow halaman TIDAK dikunci */
    saveState();
  }

  /* ---------- data ---------- */
  function loadTracks() {
    /* cache sessionStorage dulu (cepat, hemat kuota Apps Script) */
    try {
      var c = JSON.parse(sessionStorage.getItem(CACHE_KEY));
      if (c && c.tracks && c.tracks.length && (Date.now() - c.ts) < TTL) {
        applyTracks(c.tracks, 'cache');
        return;
      }
    } catch (_) { }
    window.tobaMusicCallback = function (res) {
      var s = document.getElementById('tobaMusicJsonp'); if (s) s.remove();
      if (res && res.success && Array.isArray(res.tracks) && res.tracks.length) {
        var clean = res.tracks.filter(function (t) {
          return t && t.audioUrl && typeof t.audioUrl === 'string';
        }).map(function (t, i) {
          var gid = (t.audioUrl.match(/[?&]id=([^&]+)/) || [])[1] || '';
          return {
            id: t.musicId || ('M' + i), title: (t.title || 'Tanpa judul').trim(),
            audioUrl: t.audioUrl, fileId: gid, order: Number(t.displayOrder) || 99,
            duration: t.duration || '', coverUrl: t.coverUrl || '', alt: t.altText || ''
          };
        }).sort(function (a, b) { return a.order - b.order; });
        if (clean.length) {
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), tracks: clean })); } catch (_) { }
          applyTracks(clean, 'api');
        } else { showStatus('Daftar lagu kosong di Google Sheets.', true); }
      } else {
        showStatus('API musik tidak merespons \u2014 coba muat ulang halaman.', true);
      }
    };
    var script = document.createElement('script');
    script.id = 'tobaMusicJsonp';
    script.src = MUSIC_ENDPOINT;
    script.onerror = function () { showStatus('Gagal memuat daftar lagu (jaringan).', true); };
    document.body.appendChild(script);
  }

  function applyTracks(list) {
    tracks = list;
    var ul = $('tmList');
    ul.innerHTML = '';
    list.forEach(function (t, i) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = (i + 1) + '. ' + t.title;
      b.addEventListener('click', function () { wantPlay = true; ensureAudio(); playIndex(i, true); });
      li.appendChild(b);
      ul.appendChild(li);
    });
    ['tmPlay', 'tmNext', 'tmPrev', 'tmRepeat'].forEach(function (id) { $(id).disabled = false; });
    $('tmSeek').disabled = false;
    showStatus(getMusicHint());
    $('tmStatus').dataset.kind = 'hint';
    markActive();

    /* pemulihan posisi antar halaman */
    var st = loadState();
    if (st && typeof st.idx === 'number' && st.idx < tracks.length) {
      cur = st.idx;
      volume = typeof st.volume === 'number' ? st.volume : 0.8;
      repeat = !!st.repeat;
      $('tmRepeat').setAttribute('aria-pressed', repeat);
      $('tmRepeat').classList.toggle('on', repeat);
      $('tmVol').value = Math.round(volume * 100);
      if (st.open) togglePanel();
      if (st.playing) {
        wantPlay = true;                    /* browser MUNGKIN memblokir autoplay
                                               tanpa gesture baru — aman: kalau
                                               diblokir, ikon tetap Play & status
                                               menjelaskan cara lanjut */
        ensureAudio();
        pendingSeek = { time: st.time || 0 };
        playIndex(cur, false);              /* coba lanjut tanpa gesture */
      } else {
        setNowPlaying();
      }
    } else {
      setNowPlaying();
    }
  }

  /* ---------- audio ---------- */
  function ensureAudio() {
    if (audio) return;
    audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audio.addEventListener('timeupdate', function () {
      if (audio.duration) $('tmSeek').value = Math.round(audio.currentTime / audio.duration * 1000);
      $('tmCur').textContent = fmt(audio.currentTime);
    });
    audio.addEventListener('loadedmetadata', function () {
      $('tmDur').textContent = fmt(audio.duration);
      if (pendingSeek) {
        try { audio.currentTime = pendingSeek.time; } catch (_) { }
        pendingSeek = null;
      }
      showStatus('\u25B6 ' + tracks[cur].title);
    });
    audio.addEventListener('ended', function () {
      if (repeat) { audio.currentTime = 0; audio.play().catch(function () { }); }
      else step(1);
    });
    audio.addEventListener('error', function () {
      var code = audio.error ? audio.error.code : 0;
      showStatus('Audio gagal dimuat (kode ' + code + '). Coba lagu lain.', true);
      setPlayIcon(false);
    });
    audio.addEventListener('waiting', function () { showStatus('Buffering\u2026'); });
    /* status ikon SELALU mengikuti kondisi audio asli — tidak bisa salah
       tampil walau autoplay ditolak browser atau tab pindah/aktif kembali */
    audio.addEventListener('play', function () { setPlayIcon(true); showStatus('\u25B6 ' + (tracks[cur] ? tracks[cur].title : '')); });
    audio.addEventListener('pause', function () { setPlayIcon(false); });
    /* iOS/Android Safari dapat mem-pause audio saat tab pindah; ikutkan state */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && audio && wantPlay && audio.paused && audio.src) {
        var p = audio.play();
        if (p && p.catch) p.catch(function () { });
      }
    });
  }

  /* ---- RESOLUSI SUMBER AUDIO (hasil audit nyata, Chromium) ----
     MASALAH: (1) file .mp3 di Drive tersimpan sbg kontainer ISO-BMFF/DASH
     → Chromium menolak STREAM langsung (code=4); (2) fetch() ke Drive
     diblokir CORS (tanpa Access-Control-Allow-Origin); (3) proxy Apps
     Script action=musicproxy TIDAK ADA — semua varian mengembalikan HTML
     interstitial Google, bukan binary audio.
     BUKTI: blob dari file yang sama diputar via server lokal Range-capable
     → STREAM-OK + PLAYBACK aktif. Jadi solusi butuh PROXY BINER + CORS
     header, yang hanya bisa disediakan admin di Apps Script.
     URUTAN COBA: proxy admin (action=musicproxy, ct binary) → gagal →
     pesan error jelas (tanpa hardcoded playlist). */
  var PROXY_BASE = null;   /* diisi admin, mis. URL Apps Script deploy lain */
  function resolveSrc(t, cb) {
    var candidates = [];
    if (PROXY_BASE) candidates.push(PROXY_BASE + '?api=musicproxy&fileId=' + encodeURIComponent(t.fileId || ''));
    candidates.push(t.audioUrl);   /* drive langsung — biasanya gagal CORS/format */

    function tryNext(i) {
      if (i >= candidates.length) { cb(null); return; }
      var url = candidates[i];
      fetch(url, { mode: 'cors' }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        var ct = r.headers.get('content-type') || '';
        if (ct.indexOf('text/html') !== -1) throw new Error('interstitial');  /* proxy palsu / halaman Google */
        return r.blob();
      }).then(function (b) {
        /* validasi magic byte: MP3 (ID3/0xFFEx) atau ISO-BMFF (ftyp) —
           bukan HTML yang menyamar */
        return b.slice(0, 16).arrayBuffer().then(function (ab) {
          var h = new Uint8Array(ab);
          var isMp3 = (h[0] === 0x49 && h[1] === 0x44 && h[2] === 0x33) || (h[0] === 0xFF && (h[1] & 0xE0) === 0xE0);
          var isMp4 = h[4] === 0x66 && h[5] === 0x74 && h[6] === 0x79 && h[7] === 0x70;
          if (!isMp3 && !isMp4) throw new Error('bukan audio');
          cb(URL.createObjectURL(new Blob([b], { type: 'audio/mpeg' })));
        });
      }).catch(function () { tryNext(i + 1); });
    }
    tryNext(0);
  }

  var currentObjectUrl = null;
  function playIndex(i, autoplay) {
    if (!tracks.length) return;
    cur = ((i % tracks.length) + tracks.length) % tracks.length;
    var t = tracks[cur];
    setNowPlaying();
    showStatus('Memuat\u2026');
    markActive();
    setPlayIcon(false);
    resolveSrc(t, function (src) {
      if (!src) {
        showStatus('Audio tidak dapat diputar: Google Drive memblokir\nstreaming dari browser & proxy audio admin belum tersedia.\nSolusi: minta admin tambahkan proxy biner di Apps Script.', true);
        return;
      }
      if (currentObjectUrl && currentObjectUrl.indexOf('blob:') === 0) URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = src;
      audio.src = src;
      if (wantPlay && autoplay !== false) {
        audio.play().then(function () {
          setPlayIcon(true);
          showStatus('\u25B6 ' + t.title);
        }).catch(function () {
          setPlayIcon(false);
          showStatus('Browser memblokir autoplay \u2014 tekan \u25B6.', true);
        });
      }
      saveState();
    });
  }

  function step(d) {
    wantPlay = true;
    ensureAudio();
    playIndex(cur + d, true);
  }

  function onPlayClick() {
    wantPlay = true;
    ensureAudio();
    if (!tracks.length) { showStatus('Daftar lagu belum termuat.', true); return; }
    if (audio && audio.src && !audio.paused) {
      audio.pause(); setPlayIcon(false);
    } else {
      if (!audio.src) { playIndex(cur, true); }
      else {
        audio.play().then(function () { setPlayIcon(true); })
          .catch(function () { playIndex(cur, true); });
      }
    }
    saveState();
  }

  /* ---------- UI helpers ---------- */
  function getMusicHint() {
    return document.documentElement.lang === 'id'
      ? 'Pilih lagu favoritmu dan nikmati musiknya.'
      : 'Pick your favorite song and enjoy the music.';
  }
  document.addEventListener('toba:langchange', function () {
    var el = $('tmStatus');

    if (el && el.dataset.kind === 'hint') {
      showStatus(getMusicHint());
      el.dataset.kind = 'hint';
    }
  });
  function setPlayIcon(playing) {
    $('tmPlay').textContent = playing ? '\u23F8' : '\u25B6';
    $('tmPlay').setAttribute('aria-label', playing ? 'Jeda' : 'Putar');
    document.body.classList.toggle('tm-playing', playing);
  }
  function setNowPlaying() {
    if (tracks[cur]) $('tmTitle').textContent = tracks[cur].title;
  }
  function showStatus(msg, isErr) {
    var el = $('tmStatus');
    if (el) { el.textContent = msg; el.classList.toggle('err', !!isErr); }
  }
  function markActive() {
    var lis = $('tmList').children;
    for (var i = 0; i < lis.length; i++) lis[i].classList.toggle('active', i === cur);
  }
  /* simpan posisi sebelum pindah halaman */
  window.addEventListener('pagehide', saveState);
  setInterval(saveState, 5000);

  /* ---------- intro gate ----------
     Saat intro (home/Tobaladies/Tobadeli) berjalan, UI musik ditahan agar
     tidak muncul di atas animasi intro. Kontrak: html.intro-running
     ditambah intro.js, dan event 'toba:introdone' dikirim saat intro selesai. */
  function introDone(cb) {
    if (!document.documentElement.classList.contains('intro-running')) { cb(); return; }
    document.addEventListener('toba:introdone', cb, { once: true });
    /* safety net: jika event tidak pernah datang (script intro gagal),
       tampilkan setelah jeda maksimal — halaman tidak boleh kosong */
    setTimeout(cb, 9000);
  }

  /* ---------- init ---------- */
  function init() {
    introDone(function () {
      buildUI();
      loadTracks();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
