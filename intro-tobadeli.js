/* TOBADELI — bold editorial welcome (~4.4s desktop, ~3s mobile)
   Warm ivory + burnt orange. No dedicated mascot asset exists in the
   project (audited: only the pink full-body croc and shared croc head),
   so the identity carries through court geometry + the ball + wordmark.
   Confident, punchier motion than Tobaladies, still premium. */
(function () {
  const KEY = 'tobadeli-intro-seen';
  const page = document.body.dataset.page;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 760px)').matches;
  if (page !== 'tobadeli' || reduce || sessionStorage.getItem(KEY)) return;
  sessionStorage.setItem(KEY, '1');

  const intro = document.createElement('div');
  intro.id = 'tdlIntro';
  intro.setAttribute('role', 'dialog');
  intro.setAttribute('aria-label', 'Selamat datang di Tobadeli');
  intro.innerHTML = `
    <div class="tdl-stage">
      <svg class="tdl-court" viewBox="0 0 1200 700" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <!-- FIBA top-view, same anatomy; burnt orange, bold right-weighted framing -->
        <rect class="tob" x="80" y="70" width="1040" height="560"/>
        <line class="tob" x1="600" y1="70" x2="600" y2="630"/>
        <circle class="tob" cx="600" cy="350" r="64"/>
        <path class="tob" d="M80 246 h207 v208 h-207"/>
        <circle class="tob" cx="287" cy="350" r="64"/>
        <path class="tob tob-dash" d="M287 286 a64 64 0 0 0 0 128"/>
        <path class="tob" d="M80 575 L 190 575 A 241 241 0 0 0 190 125 L 80 125"/>
        <path class="tob" d="M1120 246 h-207 v208 h207"/>
        <circle class="tob" cx="913" cy="350" r="64"/>
        <path class="tob tob-dash" d="M913 286 a64 64 0 0 1 0 128"/>
        <path class="tob" d="M1120 575 L 1010 575 A 241 241 0 0 1 1010 125 L 1120 125"/>
      </svg>
      <div class="tdl-atmosphere" aria-hidden="true"></div>
      <div class="tdl-ball-wrap">
        <svg class="tdl-ball" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#E4793D"/>
          <path d="M50 4 v92 M4 50 h92 M18 17 c18 20 18 46 0 66 M82 17 c-18 20 -18 46 0 66" stroke="#7A3413" stroke-width="3" fill="none"/>
        </svg>
        <div class="tdl-shadow"></div>
      </div>
      <div class="tdl-copy">
        <p class="tdl-eyebrow">KOMUNITAS BASKET PRIA · JAKARTA TIMUR</p>
        <h2 class="tdl-wordmark">TOBA<span>DELI</span></h2>
        <p class="tdl-welcome">Satu lapangan. Satu tim. Satu tujuan.</p>
        <a class="tdl-cta" href="#top">Kenalan dengan Tobadeli</a>
      </div>
      <button class="tdl-skip" type="button">Lewati intro</button>
    </div>`;

  const stage = intro.querySelector('.tdl-stage');
  const ball = intro.querySelector('.tdl-ball-wrap');
  const copy = intro.querySelector('.tdl-copy');
  const skip = intro.querySelector('.tdl-skip');
  document.body.appendChild(intro);
  document.documentElement.classList.add('intro-lock');

  const D = small
    ? { ball: 350, copy: 1700, out: 2900 }
    : { ball: 500, copy: 2400, out: 4300 };

  let done = false, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function finish() {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    intro.classList.add('tdl-out');
    document.documentElement.classList.remove('intro-lock');
    setTimeout(() => intro.remove(), 700);
  }
  skip.addEventListener('click', finish);

  requestAnimationFrame(() => stage.classList.add('run'));  /* 1-2 ivory, atmosphere, court */
  later(() => ball.classList.add('drop'), D.ball);          /* 3 ball enters, one firm bounce */
  later(() => ball.classList.add('settle'), D.copy - 450);  /* ball clears before copy */
  later(() => copy.classList.add('in'), D.copy);            /* 4-5 wordmark + welcome + CTA */
  later(finish, D.out);
  setTimeout(finish, D.out + 1200);
})();
