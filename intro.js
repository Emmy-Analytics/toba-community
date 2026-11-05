/* TOBA COMMUNITY — "THE COURT IS OPEN" welcome experience (~4.2s desktop, ~3s mobile)
   Bright ivory + sage atmosphere (matches the approved homepage gradient),
   basketball court geometry draws itself around the mascot, the croc head
   surfaces as the focal point, wordmark + welcome line, then dissolves
   into the real hero. Session-based, skippable, reduced-motion pass-through. */
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
      <svg class="obi-court" viewBox="0 0 1200 700" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <rect class="ocl" x="70" y="90" width="1060" height="520" rx="2"/>
        <line class="ocl" x1="600" y1="90" x2="600" y2="610"/>
        <circle class="ocl" cx="600" cy="350" r="96"/>
        <path class="ocl" d="M600 240 h190 a10 10 0 0 1 10 10 v200 a10 10 0 0 1 -10 10 h-190"/>
        <circle class="ocl-soft" cx="800" cy="350" r="6"/>
        <path class="ocl-arc" d="M330 610 A 320 320 0 0 1 870 610"/>
      </svg>
      <div class="obi-atmosphere" aria-hidden="true"></div>
      <div class="obi-figure">
        <div class="obi-ring"></div>
        <img src="assets/crocodile-head-trans.png" alt="Maskot TOBA">
      </div>
      <div class="obi-copy">
        <p class="obi-wordmark">TOBA <small>COMMUNITY</small></p>
        <p class="obi-welcome">Lapangan selalu punya tempat buat kamu.</p>
        <p class="obi-sub">Komunitas basket · Jakarta Timur</p>
      </div>
      <button class="obi-skip" type="button">Lewati intro</button>
    </div>`;
  document.body.appendChild(intro);
  document.documentElement.classList.add('intro-lock');
  window.scrollTo(0, 0);

  const stage = intro.querySelector('.obi-stage');
  const figure = intro.querySelector('.obi-figure');
  const copy = intro.querySelector('.obi-copy');
  const skip = intro.querySelector('.obi-skip');

  const D = small
    ? { court: 200, mascot: 1000, copy: 1700, out: 2800 }
    : { court: 300, mascot: 1400, copy: 2400, out: 4000 };

  let done = false, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function finish() {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    intro.classList.add('obi-out');
    document.documentElement.classList.remove('intro-lock');
    document.dispatchEvent(new CustomEvent('toba:introdone'));
    setTimeout(() => intro.remove(), 700);
  }
  skip.addEventListener('click', finish);

  requestAnimationFrame(() => stage.classList.add('run'));     /* 1-3 ivory, atmosphere, court draws */
  later(() => figure.classList.add('in'), D.court);            /* 4 mascot surfaces */
  later(() => { copy.classList.add('in'); stage.classList.add('dim'); figure.classList.add('settle'); }, D.copy); /* 5-6 */
  later(finish, D.out);                                        /* 7 dissolve into hero */
  setTimeout(finish, D.out + 1200);
})();
