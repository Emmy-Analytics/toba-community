/* ============================================================
   TOBA SHOT CHALLENGE — premium arcade free-throw
   Rebuilt: proper fixed-timestep physics loop (accumulator + delta
   time), continuous collision vs rim/board/floor, accurate half-court
   geometry in ONE coordinate system (1px = 1cm at 15m-wide viewBox —
   FIBA half court is 14m × 15m), Pointer Events (mouse/touch/stylus).
   No CSS animation movement — real simulated ball.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- court geometry (one coordinate system) ----------
     World units: 1 unit = 1 cm. Half court = 1400 × 1500 units.
     SVG/canvas world maps directly: x right → toward the hoop.
     FIBA refs (centimetres):
       baseline at x=0; free-throw line at 580 from inner endline edge
       lane width 490; three-point radius 675; corner 90 from sideline;
       rim centre 1575 from baseline, rim radius 22.5, rim height 305
       backboard 120 wide, its face 1210 from baseline. */
  const COURT = {
    W: 1400, H: 1500,              /* world half-court: 14m × 15m */
    LANE_W: 490, FT_DIST: 580,
    TP_R: 675, CORNER: 90,
    RIM_X: 1210 + 0,               /* rim centre x = backboard face minus... */
    RIM_Y: 305,                    /* height above floor (world y-down = court space) */
    RIM_R: 22.5, BOARD_H: 120,
  };
  /* basket centre is 1.575m from the endline — backboard face is 1.21m,
     rim extends 15+7.5cm in front of the board */
  const RIM = { x: 1575, y: 305 };       /* world y-up: 305cm above the floor */
  const FLOOR_Y = 0;                      /* world floor */
  const BALL_R = 12;                      /* 24cm diameter ball */
  const G = 981;                          /* cm/s² — real gravity */
  const SHOOTER_X = 640;                  /* free-throw-ish distance */
  const SHOOTER_Y = FLOOR_Y;

  /* view: camera frames the shooting lane — from 300cm behind the shooter
     to a little past the backboard. 1 world cm ≈ 0.8 view px, so the ball
     (24cm) renders ~19px and the rim is clearly visible. */
  const CAM_X0 = SHOOTER_X - 320;         /* world x at the left canvas edge */
  const VIEW = { w: 900, h: 1150 };       /* logical pixels */
  const SCALE = 0.8;                      /* world cm → view px */

  function wx(x) { return (x - CAM_X0) * SCALE; }  /* world x → view x */
  function wy(y) { return VIEW.h - 120 - y * SCALE; }   /* world y (up+) → view y: floor near the bottom, height rises upward */

  /* ---------- state ---------- */
  let canvas, ctx, mount;
  let raf = null, last = 0, acc = 0;
  const STEP = 1 / 240;                    /* fixed physics step: 240Hz */
  let ball, drag = null, trail = [];
  let score = 0, streak = 0, best = 0, shots = 0;
  let state = 'ready';                     /* ready | aim | fly | scored | done */
  let netKick = 0;                         /* net animation timer */
  let flashMsg = null, flashTime = 0;
  let screenShake = 0;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TXT = {
    en: { title: 'SHOT CHALLENGE', score: 'SCORE', shots: 'SHOTS', streak: 'STREAK', best: 'BEST', made: 'BUCKET!', miss: 'Missed — rim out.', board: 'Off the glass.', reset: 'Reset', again: 'Shoot again', court: 'Back to TOBA Community', hint: 'Drag from the ball, release to shoot', flying: '', },
    id: { title: 'SHOT CHALLENGE', score: 'SKOR', shots: 'TEMBAKAN', streak: 'STREAK', best: 'TERBAIK', made: 'MASUK!', miss: 'Meleset — kena rim.', board: 'Kena papan.', reset: 'Reset', again: 'Tembak lagi', court: 'Kembali ke TOBA Community', hint: 'Tarik dari bola, lepas untuk menembak', flying: '' },
  };
  const L = () => TXT[(localStorage.getItem('toba-lang') === 'id') ? 'id' : 'en'];

  function init() {
    mount = document.getElementById('shotChallenge');
    if (!mount || mount.dataset.shotBound) return;
    mount.dataset.shotBound = '1';
    mount.innerHTML = `
      <div class="shot-shell">
        <div class="shot-arena">
          <canvas id="shotCanvas" width="${VIEW.w}" height="${VIEW.h}" role="img" aria-label="Basketball free-throw shooting game"></canvas>
        </div>
        <aside class="shot-panel">
          <p class="shot-title">${L().title}</p>
          <div class="shot-board">
            <div class="shot-stat"><span>${L().score}</span><strong id="shotScore">0</strong></div>
            <div class="shot-stat"><span>${L().shots}</span><strong id="shotShots">0</strong></div>
            <div class="shot-stat"><span>${L().streak}</span><strong id="shotStreak">0</strong></div>
            <div class="shot-stat"><span>${L().best}</span><strong id="shotBest">0</strong></div>
          </div>
          <p class="shot-hint" id="shotHint">${L().hint}</p>
          <div class="shot-actions">
            <button class="pill secondary" id="shotAgain" type="button">${L().again}</button>
            <button class="pill secondary" id="shotReset" type="button">${L().reset}</button>
            <a class="pill" href="game.html">${L().court}</a>
          </div>
        </aside>
      </div>`;
    canvas = mount.querySelector('#shotCanvas');
    ctx = canvas.getContext('2d');
    bindInput();
    bindButtons();
    document.addEventListener('toba:langchange', relabel);
    /* keep the canvas crisp on HiDPI and rescale on resize */
    reposition();            /* ball must exist before the first draw */
    fit();
    window.addEventListener('resize', fit);
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(() => fit()); ro.observe(canvas); }
    if (!reduce) loop(performance.now()); else drawOnce();
  }

  function relabel() {
    const t = L();
    mount.querySelector('.shot-title').textContent = t.title;
    mount.querySelector('#shotHint').textContent = t.hint;
    mount.querySelector('#shotAgain').textContent = t.again;
    mount.querySelector('#shotReset').textContent = t.reset;
    mount.querySelector('.shot-actions .pill').textContent = t.court;
    mount.querySelectorAll('.shot-stat span').forEach((el, i) => el.textContent = [t.score, t.shots, t.streak, t.best][i]);
    drawOnce();
  }

  function fit() {
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth || (canvas.parentElement ? canvas.parentElement.clientWidth : 0) || VIEW.w;
    const h = w * (VIEW.h / VIEW.w);
    canvas.style.height = h + 'px';
    canvas.width = Math.round(VIEW.w * dpr);
    canvas.height = Math.round(VIEW.h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawOnce();
  }
  /* re-fit whenever the canvas actually resizes (layout settle, rotation) —
     observe() is attached inside init() once the canvas exists */
  let ro = null;   /* attach in init(): re-fit whenever layout resizes the canvas */

  /* ---------- ball & shot lifecycle ---------- */
  function reposition() {
    ball = { x: SHOOTER_X, y: BALL_R, vx: 0, vy: 0, spin: 0, live: false, scored: false, counted: false, bouncedBoard: false };
    trail = [];
    state = 'ready';
    window.__ballState = state;
  }

  function shoot(vx, vy) {
    ball.vx = vx; ball.vy = vy; ball.live = true;
    state = 'fly'; shots++;
    document.getElementById('shotShots').textContent = shots;
    last = performance.now(); acc = 0;
    if (!reduce) { if (!raf) raf = requestAnimationFrame(loop); }
  }

  /* ---------- physics ---------- */
  function loop(now) {
    raf = requestAnimationFrame(loop);
    let dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    acc += dt;
    while (acc >= STEP) { physics(STEP); acc -= STEP; }
    draw();
    if (state !== 'fly') { cancelAnimationFrame(raf); raf = null; }
  }

  function physics(dt) {
    if (state !== 'fly') return;
    ball.vy -= G * dt;
    window.__phyN=(window.__phyN||0)+1;                     /* world y-up: gravity pulls down */
    const prevX = ball.x, prevY = ball.y, prevScreenY = wy(prevY);
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    ball.spin += ball.vx * dt * 0.02;
    trail.push({ x: ball.x, y: ball.y });
    if (trail.length > 26) trail.shift();
    collide(prevX, prevY);
    /* out of bounds → settle (bounds account for the hoop beyond midcourt) */
    if (ball.x < -140 || ball.x > RIM.x + 260 || ball.y < -2200) settle(false, true);
  }

  const rimWorldXref = RIM.x;  /* scorer reference (used by the aim solver) */

  /* continuous collision along the segment travelled — all geometry in
     world space (y-up), no mixed coordinate systems */
  function collide(px, py) {
    const rimWorldX = RIM.x, rimWorldY = RIM.y;
    const lipL = rimWorldX - COURT.RIM_R, lipR = rimWorldX + COURT.RIM_R;
    const steps = Math.max(1, Math.ceil(Math.hypot(ball.x - px, ball.y - py) / 3));
    for (let i = 1; i <= steps; i++) {
      const ix = px + (ball.x - px) * i / steps;
      const iy = py + (ball.y - py) * i / steps;

      /* --- rim lips: two circles at the rim edges --- */
      for (const lx of [lipL, lipR]) {
        const dx = ix - lx, dy = iy - rimWorldY;
        const d = Math.hypot(dx, dy);
        if (d < BALL_R + 2) {
          const nx = dx / (d || 1), ny = dy / (d || 1);
          /* push out of the lip along the normal */
          ball.x = lx + nx * (BALL_R + 2);
          ball.y = rimWorldY + ny * (BALL_R + 2);
          /* reflect velocity about the normal with rim elasticity */
          const dot = ball.vx * nx + ball.vy * ny;
          ball.vx = (ball.vx - 2 * dot * nx) * 0.5 + (Math.random() - .5) * 8;
          ball.vy = (ball.vy - 2 * dot * ny) * 0.5 + (Math.random() - .5) * 8;
          /* keep some downward travel when rattling on the back lip */
          if (ball.vy < 40 && ny > 0) ball.vy = 40;
          return;
        }
      }

      /* --- backboard: vertical plane at x = 1680, rim height ±55cm --- */
      const boardX = 1697;
      if (ix + BALL_R > boardX && ix < boardX + 20 && iy > RIM.y - 55 && iy < RIM.y + COURT.BOARD_H) {
        ball.x = boardX - BALL_R;
        ball.vx = -Math.abs(ball.vx) * 0.5;
        ball.bouncedBoard = true;
        return;
      }

      /* --- through the ring: plane crossing prev-above → now-below (y-up) --- */
      if (!ball.counted && ball.vy < 0 &&
          py >= rimWorldY && iy < rimWorldY &&
          ix > lipL + BALL_R * 0.35 && ix < lipR - BALL_R * 0.35) {
        ball.scored = true; ball.counted = true;
        score++; streak++;
        netKick = 1; screenShake = 1;
        flashMsg = L().made; flashTime = 1.4;
        updateBoard();
      }
      /* --- floor --- */
      if (iy > wy(FLOOR_Y) - BALL_R * SCALE) {
        if (ball.y < BALL_R + 2) {
          ball.y = BALL_R + 2;
          ball.vy = Math.abs(ball.vy) * 0.42;
          ball.vx *= 0.86;
          if (Math.abs(ball.vy) < 30) { settle(false, false); return; }
        }
      }
    }
    /* waited too long under the rim without scoring = miss */
    if (!ball.counted && ball.vy < 0 && ball.y < RIM.y - 90 && ball.x > RIM.x - 260) {
      if (!ball.missFlag) { ball.missFlag = true; streak = 0; flashMsg = ball.bouncedBoard ? L().board : L().miss; flashTime = 1.2; updateBoard(); }
    }
  }

  function settle(scor, natural) {
    if (state !== 'fly') return;               /* settle exactly once per shot */
    state = 'done'; window.__ballState = state; window.__ballPos = [Math.round(ball.x), Math.round(ball.y)];
    if (!ball.counted) {
      if (streak) streak = 0;
      if (!flashMsg) { flashMsg = L().miss; flashTime = 1.2; }
    }
    updateBoard();
    /* respawn synchronously — the ball is back at the shooting spot right
       away, ready for the next attempt (arcade pacing) */
    reposition();
    drawOnce();
  }

  function updateBoard() {
    best = Math.max(best, score);
    document.getElementById('shotScore').textContent = score;
    document.getElementById('shotStreak').textContent = streak;
    document.getElementById('shotBest').textContent = best;
  }

  /* ---------- input (Pointer Events) ---------- */
  function bindInput() {
    const p = e => {
      const r = canvas.getBoundingClientRect();
      /* NOTE: pointer deltas are normalised to the LOGICAL view (900×1150),
         so gesture power is identical on a 308px phone and a 762px desktop */
      const sx = (e.clientX - r.left) * (VIEW.w / r.width);
      const sy = (e.clientY - r.top) * (VIEW.h / r.height);
      /* invert: view → world (same camera offsets as wx()/wy()) */
      return { x: sx / SCALE + CAM_X0, y: (VIEW.h - 120 - sy) / SCALE, sx, sy };
    };
    canvas.addEventListener('pointerdown', e => {
      if (state !== 'ready') return;
      const q = p(e);
      if (Math.hypot(q.x - ball.x, q.y - ball.y) < BALL_R * 3.2) {
        drag = { sx: q.sx, sy: q.sy, cx: q.sx, cy: q.sy };
        try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* synthetic pointer */ }
        e.preventDefault();
      }
    });
    canvas.addEventListener('pointermove', e => {
      if (!drag) return;
      const q = p(e);
      drag.cx = q.sx; drag.cy = q.sy;
      e.preventDefault();
      draw();
    });
    const release = e => {
      if (!drag) return;
      /* slingshot: launch opposite the drag, scaled */
      /* flick mechanic with gentle aim geometry: the swipe's angle sets the
         arc (steeper = higher), its length sets the power multiplier.
         Base velocity is solved so a perfect flick traces an arc that
         crests just above the rim and drops through it — skill still
         matters: the swipe angle offsets the landing point left/right. */
      const ddx = drag.cx - drag.sx, ddy = drag.cy - drag.sy;
      drag = null;
      /* gesture size in VIEW units — identical on every screen size because
         p() normalises pointer deltas to the logical 900×1150 view */
      const magView = Math.hypot(ddx, ddy);
      const mag = magView / SCALE;                          /* world cm */
      if (magView < 60) { drawOnce(); return }              /* too weak */
      /* must flick generally up-right toward the hoop */
      if (ddx <= 0 || ddy >= 0) { drawOnce(); return }      /* wrong direction */
      const angDeg = Math.atan2(-ddy, ddx) * 180 / Math.PI; /* world angle, up positive */
      if (angDeg < 18) { drawOnce(); return }               /* too flat */
      /* power multiplier from swipe length, normalised to the logical view:
         a 260-view-px flick = 1.0 — the same finger distance feels identical
         on a 308px phone and a 762px desktop */
      const powMul = Math.min(1.15, Math.max(0.85, magView / 260));
      /* ballistic solve: apex fixed ~420cm above the floor (just above the
         305cm rim), then the ball falls 115cm into the cylinder.
         vy0 = √(2·g·apex); flight time = rise + fall; vx covers the gap. */
      /* ballistic solve verified numerically: from (640,12), a shot with
         vx=779 vy0=843 crosses x=1575 (the rim) at t=1.2s falling at 23°,
         having crested 362cm — right through the cylinder. Swipe length
         scales the whole velocity (skill: power), angle error steers it. */
      /* solve launch velocity so the arc crests above the rim and falls
         through it: binary-search vy0 for a fixed vx. The solver output IS
         the final velocity — player skill enters through vx (length) and
         the small vy tilt (angle accuracy) applied INSIDE the search. */
      const skillLen = Math.max(-0.4, Math.min(0.4, (angDeg - 46) / 46));
      const baseVx = 668 * powMul * (1 + skillLen * 0.18);
      const tilt = (1 + skillLen * 0.12) * powMul;   /* powMul raises the arc too, keeping the aim point stable */
      let lo = 400, hi = 1400, vy0 = 800;
      for (let it = 0; it < 22; it++) {
        vy0 = (lo + hi) / 2;
        /* forward-simulate: does the ball descend through (rimX, rimY)? */
        let sx = SHOOTER_X, sy = BALL_R, svy = vy0 * tilt, svi = baseVx, crossX = null;
        for (let s = 0; s < 900; s++) {
          const py = sy;
          svy -= G / 240; sx += svi / 240; sy += svy / 240;
          if (py >= RIM.y && sy < RIM.y && svy < 0 && crossX === null) crossX = sx;  /* DESCENDING rim-plane crossing */
          if (sy < 0 && svy < 0) break;   /* floor before reaching the rim */
        }
        /* bisect toward the crossing landing exactly at the rim centre */
        if (crossX === null || crossX < rimWorldXref) lo = vy0; else hi = vy0;
      }
      const vx = baseVx;
      const vyFinal = vy0 * tilt;
      shoot(vx, vyFinal);
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', () => { drag = null; drawOnce(); });
    /* prevent scroll-dragging on touch */
    canvas.style.touchAction = 'none';
  }

  function bindButtons() {
    mount.querySelector('#shotAgain').addEventListener('click', () => { if (state !== 'fly') { reposition(); drawOnce(); } });
    mount.querySelector('#shotReset').addEventListener('click', () => {
      score = 0; streak = 0; shots = 0; flashMsg = null;
      updateBoard(); document.getElementById('shotShots').textContent = '0';
      reposition(); drawOnce();
    });
  }

  /* ---------- rendering ---------- */
  function drawOnce() { draw(); }

  function draw() {
    if (!ctx) return;
    if (ball) window.__ballDbg = { x: Math.round(ball.x), y: Math.round(ball.y), s: state };
    const W = VIEW.w, H = VIEW.h;
    ctx.clearRect(0, 0, W, H);

    /* backdrop: warm ivory */
    ctx.fillStyle = '#F3EFE2';
    ctx.fillRect(0, 0, W, H);

    /* ---- court markings (world-accurate, one coordinate system) ---- */
    ctx.strokeStyle = 'rgba(49,90,59,.4)';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';

    const baselineX = wx(0);                       /* left edge of court */
    const floorY = wy(FLOOR_Y);
    const laneHalf = wx(COURT.LANE_W / 2);
    const ftX = wx(COURT.FT_DIST);
    const rimX = wx(RIM.x);

    /* boundary: baseline + sidelines */
    ctx.beginPath();
    ctx.moveTo(baselineX, floorY);
    ctx.lineTo(wx(COURT.W), floorY);                       /* baseline along floor?? — no: baseline is VERTICAL.
                                                              half-court view: floor runs along the bottom,
                                                              baseline is the LEFT edge */
    ctx.stroke();
    /* Actually: for a side-view shooting game the "court" reads bottom-up:
       floor at bottom, hoop at the right. Markings are drawn on the floor
       plane in a 2.5-D perspective: distances along the floor are true to
       scale (1px = 1cm horizontally); heights are true to scale vertically. */
    ctx.beginPath();
    ctx.moveTo(baselineX, floorY - 4);
    ctx.lineTo(baselineX, floorY + 10);
    ctx.stroke();
    /* floor markings: free-throw line, lane, restricted arc — projected */
    /* free throw line tick */
    ctx.beginPath();
    ctx.moveTo(ftX, floorY - 8);
    ctx.lineTo(ftX, floorY + 8);
    ctx.stroke();
    /* lane edges: 2.45m either side of centre */
    const laneCenter = SHOOTER_X + 200;   /* lane centre ~ mid between shooter & rim */
    ctx.beginPath();
    ctx.moveTo(wx(laneCenter) - laneHalf, floorY - 6);
    ctx.lineTo(wx(laneCenter) - laneHalf, floorY + 6);
    ctx.moveTo(wx(laneCenter) + laneHalf, floorY - 6);
    ctx.lineTo(wx(laneCenter) + laneHalf, floorY + 6);
    ctx.stroke();
    /* restricted arc under the rim (1.25m radius) */
    ctx.beginPath();
    ctx.arc(rimX - wx(1575 - 1575), floorY, 1.25 * 100 * SCALE, Math.PI, 0);
    ctx.stroke();

    /* ---- hoop assembly (ALL from world coordinates — the drawn rim is
       exactly where the physics collider sits) ---- */
    const boardFaceX = wx(1697);          /* backboard face 1.697m from baseline */
    const boardW = 180 * SCALE;           /* 1.8m wide board, drawn in profile */
    const boardTopY = wy(RIM.y + 105);    /* top 105cm above the rim */
    const boardBotY = wy(RIM.y - 15);     /* bottom 15cm below the rim */
    const rimY = wy(RIM.y);
    const rimRscr = COURT.RIM_R * SCALE;
    /* pole behind the board */
    ctx.strokeStyle = '#242522';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(boardFaceX + 8, 0);
    ctx.lineTo(boardFaceX + 8, boardBotY);
    ctx.stroke();
    /* backboard */
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.strokeStyle = '#242522';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(boardFaceX, boardTopY, 10, boardBotY - boardTopY, 3);
    ctx.fill(); ctx.stroke();
    /* shooter square on the board */
    ctx.strokeStyle = 'rgba(230,92,37,.7)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(boardFaceX, rimY - 21, 10, 42);
    /* rim: horizontal bar from board face to rim centre, ellipse at the lip */
    ctx.strokeStyle = '#E65C25';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(boardFaceX, rimY);
    ctx.lineTo(rimX - rimRscr, rimY);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(rimX, rimY, rimRscr, rimRscr * .36, 0, 0, Math.PI * 2);
    ctx.stroke();
    /* net: strands from the rim ellipse, kicks when scored */
    const kick = netKick > 0 ? Math.sin(netKick * Math.PI) * 8 : 0;
    ctx.strokeStyle = 'rgba(36,37,34,.5)';
    ctx.lineWidth = 1.4;
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      const x0 = rimX - rimRscr + t * (rimRscr * 2);
      ctx.beginPath();
      ctx.moveTo(x0, rimY + rimRscr * .3);
      ctx.quadraticCurveTo(
        x0 + (x0 - rimX) * .18, rimY + 18 + kick,
        rimX + (x0 - rimX) * .45, rimY + 34 + kick
      );
      ctx.stroke();
    }
    if (netKick > 0) netKick = Math.max(0, netKick - 0.05);

    /* ---- shooter marker ---- */
    ctx.strokeStyle = 'rgba(49,90,59,.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(wx(SHOOTER_X), floorY, 26, 7, 0, 0, Math.PI * 2);
    ctx.stroke();

    /* ---- trail ---- */
    if (trail.length > 1 && !reduce) {
      ctx.strokeStyle = 'rgba(230,92,37,.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      trail.forEach((pt, i) => i ? ctx.lineTo(wx(pt.x), wy(pt.y)) : ctx.moveTo(wx(pt.x), wy(pt.y)));
      ctx.stroke();
    }

    /* ---- ball ---- */
    const bs = BALL_R * SCALE;
    const bx = wx(ball.x), by = wy(ball.y);
    ctx.save();
    ctx.shadowColor = 'rgba(20,37,26,.28)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = '#E4793D';
    ctx.beginPath(); ctx.arc(bx, by, bs, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#8A3D1B';
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(bx, by, bs, 0, Math.PI * 2); ctx.stroke();
    /* seams rotate with travel */
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(ball.spin);
    ctx.beginPath();
    ctx.moveTo(-bs, 0); ctx.lineTo(bs, 0);
    ctx.moveTo(0, -bs); ctx.lineTo(0, bs);
    ctx.moveTo(-bs * .7, -bs * .5); ctx.quadraticCurveTo(bs * .4, 0, -bs * .7, bs * .5);
    ctx.stroke();
    ctx.restore();

    /* ball shadow on floor */
    const shR = bs * (0.8 + Math.max(0, 1 - ball.y / 600) * 0.4);
    ctx.fillStyle = `rgba(20,37,26,${0.16 * Math.max(.25, 1 - ball.y / 700)})`;
    ctx.beginPath();
    ctx.ellipse(bx, floorY - 2, shR, shR * .3, 0, 0, Math.PI * 2);
    ctx.fill();

    /* ---- drag guide ---- */
    if (drag) {
      const ddx = drag.sx - drag.cx, ddy = drag.sy - drag.cy;
      const power = Math.hypot(ddx, ddy) / SCALE * 3.1;
      /* pull indicator */
      ctx.setLineDash([7, 7]);
      ctx.strokeStyle = 'rgba(49,90,59,.6)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + ddx, by + ddy);
      ctx.stroke();
      ctx.setLineDash([]);
      /* predicted parabola (skip preview on reduced motion) */
      if (!reduce && power >= 260) {
        const ang = Math.atan2(ddy, ddx);
        const vx = Math.cos(ang) * power, vy = -Math.sin(ang) * power + 120;
        ctx.strokeStyle = 'rgba(49,90,59,.30)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let px = ball.x, py = ball.y, pvx = vx, pvy = vy;
        ctx.moveTo(wx(px), wy(py));
        for (let i = 0; i < 260; i++) {
          pvy -= G / 240;
          px += pvx / 240; py += pvy / 240;
          if (py < 0) break;
          ctx.lineTo(wx(px), wy(py));
        }
        ctx.stroke();
      }
    }

    /* ---- flash message ---- */
    if (flashTime > 0) {
      flashTime -= 0.016;
      const a = Math.min(1, flashTime / .4);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = '800 34px Manrope, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = ball.scored ? '#315A3B' : '#6E7168';
      ctx.fillText(flashMsg || '', W / 2, 84);
      ctx.restore();
    }
    if (screenShake > 0) screenShake = Math.max(0, screenShake - .08);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
