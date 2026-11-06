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
        <!-- FIBA top-view proportions: 28m x 15m court -> viewBox scale ~35.7px/m -->
        <!-- court boundary: 80,70 to 1120,630 -->
        <rect class="ocl" x="80" y="70" width="1040" height="560"/>
        <!-- center line -->
        <line class="ocl" x1="600" y1="70" x2="600" y2="630"/>
        <!-- center circle (r 1.8m ~ 64px) -->
        <circle class="ocl" cx="600" cy="350" r="64"/>
        <!-- left key/paint: 5.8m wide (~207px), 5.8m from baseline -->
        <path class="ocl" d="M80 246 h207 v208 h-207"/>
        <!-- left free-throw circle (top half solid, bottom dashed) -->
        <circle class="ocl" cx="287" cy="350" r="64"/>
        <path class="ocl ocl-dash" d="M287 286 a64 64 0 0 0 0 128"/>
        <!-- left three-point arc (6.75m radius ~241px, corner straight lines) -->
        <path class="ocl" d="M80 575 L 190 575 A 241 241 0 0 0 190 125 L 80 125"/>
        <!-- right key/paint -->
        <path class="ocl" d="M1120 246 h-207 v208 h207"/>
        <!-- right free-throw circle -->
        <circle class="ocl" cx="913" cy="350" r="64"/>
        <path class="ocl ocl-dash" d="M913 286 a64 64 0 0 1 0 128"/>
        <!-- right three-point arc -->
        <path class="ocl" d="M1120 575 L 1010 575 A 241 241 0 0 1 1010 125 L 1120 125"/>
        <!-- restricted area arcs (1.25m ~45px) -->
        <path class="ocl" d="M125 350 a45 45 0 0 1 90 0"/>
        <path class="ocl" d="M1075 350 a45 45 0 0 0 -90 0"/>
        <!-- backboards: 1.2m from baseline inside -->
        <line class="ocl" x1="80" y1="290" x2="80" y2="410" stroke-width="4"/>
        <line class="ocl" x1="1120" y1="290" x2="1120" y2="410" stroke-width="4"/>
      </svg>
      <div class="obi-atmosphere" aria-hidden="true"></div>
      <div class="obi-figure">
        <div class="obi-ring"></div>
        <img src="assets/crocodile-head.png" alt="Maskot TOBA">
      </div>
      <div class="obi-copy">
        <p class="obi-wordmark">TOBA <small>COMMUNITY</small></p>
        <p class="obi-welcome">Cari teman main? Ketemu di TOBA.</p>
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
