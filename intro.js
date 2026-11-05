/* TOBA COMMUNITY — cinematic crocodile intro "THE CROCODILE AWAKENS"
   Scene 01 The Eye -> 02 The Awakening -> 03 The Opening -> 04 The Reveal
   Welcome copy: "SOMETHING IS WAKING." / "WELCOME TO TOBA." /
   "MORE THAN A GAME. A COMMUNITY." (ID via i18n)
   Built from the single static asset assets/crocodile-head.png: the jaw
   opening is simulated with layered scale + rotation + a mouth-interior
   mask (no separate jaw assets exist yet). Runs once per session,
   respects prefers-reduced-motion, never traps the user (skip + timeout). */
(function () {
  const KEY = 'toba-intro-seen';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onHome = document.body.dataset.page === 'home';
  if (reduce || !onHome || sessionStorage.getItem(KEY)) return;
  sessionStorage.setItem(KEY, '1');

  const intro = document.createElement('div');
  intro.id = 'tobaIntro';
  intro.setAttribute('role', 'dialog');
  intro.setAttribute('aria-label', 'TOBA cinematic intro');
  intro.innerHTML = `
    <div class="intro-bg"></div>
    <div class="intro-stage">
      <div class="intro-eye"><img src="assets/crocodile-eye.png" alt=""><div class="intro-lid"></div></div>
      <div class="intro-head"><img src="assets/crocodile-head-trans.png" alt=""></div>
      <div class="intro-mouth"></div>
    </div>
    <div class="intro-line" id="introLine1"><span class="rule"></span><span id="il1a"></span></div>
    <div class="intro-line" id="introLine2"><span class="rule"></span><span id="il2a"></span><small>TOBA COMMUNITY</small></div>
    <div class="intro-line" id="introLine3"><span class="rule"></span><span id="il3a"></span></div>
    <div class="intro-fade"></div>
    <div class="intro-progress"><i data-p="0" class="on"></i><i data-p="1"></i><i data-p="2"></i><i data-p="3"></i></div>
    <button class="intro-skip" id="introSkip" type="button">Skip intro</button>`;
  document.body.appendChild(intro);
  document.documentElement.classList.add('intro-lock');
  window.scrollTo(0, 0);

  const lines = {
    1: () => t('intro.wake'),
    2: () => t('intro.welcome'),
    3: () => t('intro.community')
  };
  const localize = () => {
    document.getElementById('introSkip').textContent = t('intro.skip');
    for (let i = 1; i <= 3; i++) {
      const el = document.getElementById('il' + i + 'a');
      if (el && !el.textContent) el.textContent = lines[i]();
    }
  };
  localize();

  let done = false, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function finish() {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    intro.classList.add('stage-out');
    document.documentElement.classList.remove('intro-lock');
    setTimeout(() => { intro.remove(); document.dispatchEvent(new CustomEvent('toba:introdone')) }, 800);
  }
  document.getElementById('introSkip').addEventListener('click', finish);

  const L = (id) => { intro.querySelectorAll('.intro-line').forEach(l => l.classList.remove('show', 'hide')); const el = document.getElementById(id); el.classList.add('show'); later(() => el.classList.add('hide'), 2600); };
  const P = (i) => intro.querySelectorAll('.intro-progress i').forEach((d, k) => d.classList.toggle('on', k <= i));

  /* Scene 01 — the eye wakes (0.2s - 3.6s) */
  later(() => { intro.classList.add('stage-eye'); L('introLine1'); P(0); }, 200);
  /* Scene 02 — camera pulls back, head revealed (3.8s - 7.4s) */
  later(() => { intro.classList.remove('stage-eye'); intro.classList.add('stage-head'); document.getElementById('introLine1')?.classList.add('hide'); L('introLine2'); P(1); }, 3800);
  /* Scene 03 — jaw opens (7.6s - 10.4s) */
  later(() => { intro.classList.remove('stage-head'); intro.classList.add('stage-jaw'); L('introLine3'); P(2); }, 7600);
  /* Scene 04 — into the mouth, reveal (10.6s - 12.4s) */
  later(() => { intro.classList.remove('stage-jaw'); intro.classList.add('stage-mouth'); P(3); }, 10600);
  later(finish, 11800);
  /* safety: never block longer than 13s */
  setTimeout(finish, 13000);
})();
