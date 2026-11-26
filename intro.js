/* TOBA COMMUNITY — PROMPT 72 · MAIN INTRO (restored, approved design)
   "THE COURT IS OPEN" (~4.2s desktop, ~3s mobile)
   Bright ivory + sage atmosphere (matches the approved homepage gradient),
   basketball court geometry draws itself around the mascot, the croc head
   surfaces as the focal point, wordmark + welcome line, then dissolves
   into the real hero. Session-based, skippable, reduced-motion pass-through.

   NOTE: this intro is deliberately KEPT SEPARATE from the in-homepage
   welcome invitation (script.js · PROMPT 75). Two experiences, one screen
   opening only: intro here, invitation inside the homepage after the hero. */
(function () {
  const KEY = 'toba-intro-seen';
  const page = document.body.dataset.page;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 760px)').matches;
  if (page !== 'home' || reduce || sessionStorage.getItem(KEY)) return;
  sessionStorage.setItem(KEY, '1');

  const intro = document.createElement('div');
  intro.id = 'tobaIntro';
  intro.setAttribute('role', 'dialog');
  intro.setAttribute('aria-label', 'Selamat datang di TOBA Community');
  intro.innerHTML = `
    <div class="obi-stage">
      <!-- Bagian 1: background aset kocak asli (assets/img/web), monokrom, tidak mengganggu keterbacaan -->
      <div class="obi-kocak" aria-hidden="true"></div>
      <!-- Bagian 3: geometry master yang sama dengan Home/Tobaladies/Tobadeli -->
      <svg class="obi-court" viewBox="${-HW} ${-HH} ${HW * 2} ${HH * 2}" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><g class="obi-markings">${COURT_MARKINGS.replace(/<(rect|line|circle|path) /g, '<$1 class="ocl" ')}</g></svg>
      <div class="obi-atmosphere" aria-hidden="true"></div>
      <div class="obi-figure">
        <div class="obi-ring"></div>
        <img src="assets/crocodile-head.png" alt="Maskot TOBA">
      </div>
      <div class="obi-copy">
        <p class="obi-wordmark" translate="no"><span class="ow-toba">TOBA</span><span class="ow-comm">COMMUNITY</span></p>
        <p class="obi-sub">${t('intro.brand.tagline')}</p>
      </div>
      <button class="obi-skip" type="button">Lewati intro</button>
    </div>`;
  document.body.appendChild(intro);
  document.documentElement.classList.add('intro-lock');
  /* kontrak intro: satu flag global untuk music/chatbot (dibaca music.js & script.js) */
  document.documentElement.classList.add('intro-running');
  window.scrollTo(0, 0);

  const stage = intro.querySelector('.obi-stage');
  const figure = intro.querySelector('.obi-figure');
  const copy = intro.querySelector('.obi-copy');
  const skip = intro.querySelector('.obi-skip');

  const D = small
    ? { court: 400, mascot: 1400, copy: 2200, out: 4400 }   /* PROMPT 5: mobile +0.2-0.4s delay antar-elemen */
    : { court: 500, mascot: 1800, copy: 2700, out: 5600 };   /* PROMPT 5: desktop — entrance 0.5s, delay 0.3-0.4s,
                                                                elemen terlihat 2-3s, fade-out 0.55s */

  let done = false, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function finish() {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    intro.classList.add('obi-out');
    document.documentElement.classList.remove('intro-lock');
    document.documentElement.classList.remove('intro-running');
    document.dispatchEvent(new CustomEvent('toba:introdone'));
    setTimeout(() => intro.remove(), 700);
  }
  skip.addEventListener('click', finish);
  /* Escape never traps the user */
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape' && !done) { document.removeEventListener('keydown', esc); finish() }
  });

  /* PROMPT 5: jangan mulai animasi sebelum aset visual siap.
     Mascot = aset utama; tunggu sampai gambar selesai dimuat (dengan
     batas waktu 2.5s agar intro tidak pernah menggantung), baru jalankan
     timeline. Jaringan lambat: intro menunggu, bukan menampilkan frame kosong. */
  const mascotImg = figure.querySelector('img');
  const mascotReady = new Promise(resolve => {
    if (!mascotImg) return resolve();
    if (mascotImg.complete && mascotImg.naturalWidth > 0) return resolve();
    const to = setTimeout(resolve, 2500);
    mascotImg.addEventListener('load', () => { clearTimeout(to); resolve(); }, { once: true });
    mascotImg.addEventListener('error', () => { clearTimeout(to); resolve(); }, { once: true });
  });
  mascotReady.then(() => {
    requestAnimationFrame(() => stage.classList.add('run'));     /* 1-3 ivory, atmosphere, court draws */
    later(() => figure.classList.add('in'), D.court);            /* 4 mascot surfaces */
    later(() => { copy.classList.add('in'); stage.classList.add('dim'); figure.classList.add('settle'); }, D.copy); /* 5-6 */
    later(finish, D.out);                                        /* 7 dissolve into hero */
  });
  /* hard safety: walau apa pun terjadi, intro tidak boleh lebih dari D.out + 2.5s */
  setTimeout(() => { if (!done) finish(); }, D.out + 2500);
})();
