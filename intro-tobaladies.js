/* TOBALADIES — bright editorial welcome (~5s desktop, ~3.2s mobile)
   "The Court Comes Alive → Meet the Players"
   Scene 1 court lines draw themselves on warm ivory
   Scene 2 basketball enters, one natural bounce, settles
   Scene 3 mascot lady croc surfaces with the ball (the "player")
   Scene 4 TOBALADIES wordmark + welcome "Ini lapanganmu."
   Scene 5 CTA appears → intro dissolves into the real hero
   Bright, warm, no dark cinematic. Session-based, skippable,
   reduced-motion = instant pass-through, never blocks the site. */
(function () {
  const KEY = 'tobaladies-intro-seen';
  const page = document.body.dataset.page;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 760px)').matches;
  if (page !== 'tobaladies' || reduce || sessionStorage.getItem(KEY)) return;
  sessionStorage.setItem(KEY, '1');

  const el = (c, parent) => { const n = document.createElement('div'); n.className = c; (parent || document.body).appendChild(n); return n };

  const intro = el('tld-intro');
  let stagger = 0;
  intro.setAttribute('role', 'dialog');
  intro.setAttribute('aria-label', 'Selamat datang di Tobaladies');
  intro.innerHTML = `
    <div class="tld-stage">
      <!-- Prompt 33+42: geometri master dari court-geometry.js — IDENTIK dengan
           Intro/Home/Tobadeli; hanya warna (pink) yang berbeda. -->
      <!-- stagger index untuk animasi gambar bertahap -->
      
      <svg class="tld-court" viewBox="${-HW} ${-HH} ${HW * 2} ${HH * 2}" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <g>${COURT_MARKINGS.replace(/<(rect|line|circle|path) /g, (m, tag) => `<${tag} class="tcl" style="--i:${stagger++}" `)}</g>
      </svg>
      <div class="tld-ball-wrap"><svg class="tld-ball" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="#E4793D"/>
        <path d="M50 4 v92 M4 50 h92 M18 17 c18 20 18 46 0 66 M82 17 c-18 20 -18 46 0 66" stroke="#8A3D1B" stroke-width="3" fill="none"/>
      </svg><div class="tld-shadow"></div></div>
      <div class="tld-mascot-wrap"><img src="assets/logomascpinkpng (3).png" alt="Maskot Tobaladies"></div>
      <div class="tld-copy">
        <p class="tld-eyebrow">${t('intro.ladies.eyebrow')}</p>
        <h2 class="tld-wordmark">TOBA<span>LADIES</span></h2>
        <p class="tld-welcome">Ini lapanganmu.</p>
        <a class="tld-cta" href="#top">Kenalan dengan Tobaladies</a>
      </div>
      <button class="tld-skip" type="button">Lewati intro</button>
    </div>`;

  const stage = intro.querySelector('.tld-stage');
  const ball = intro.querySelector('.tld-ball-wrap');
  const mascot = intro.querySelector('.tld-mascot-wrap');
  const copy = intro.querySelector('.tld-copy');
  const skip = intro.querySelector('.tld-skip');
  document.documentElement.classList.add('intro-lock');

  const D = small
    ? { ball: 400, mascot: 1100, copy: 1800, out: 2800 }
    : { ball: 550, mascot: 1600, copy: 2600, out: 4600 };

  let done = false, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function finish() {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    intro.classList.add('tld-out');
    document.documentElement.classList.remove('intro-lock');
    setTimeout(() => intro.remove(), 750);
  }
  skip.addEventListener('click', finish);

  requestAnimationFrame(() => stage.classList.add('run')); /* scene 1: court lines draw */
  later(() => ball.classList.add('drop'), D.ball);          /* scene 2: ball bounce */
  later(() => { mascot.classList.add('in'); ball.classList.add('handoff'); }, D.mascot); /* scene 3 */
  later(() => ball.classList.add('settle'), D.copy - 500);
  later(() => { mascot.classList.add('recede'); stage.classList.add('dim'); copy.classList.add('in'); }, D.copy); /* scenes 4+5 */
  later(finish, D.out);
  setTimeout(finish, D.out + 1200);
})();
