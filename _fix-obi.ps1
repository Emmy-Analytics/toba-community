$ErrorActionPreference = 'Stop'
$p = 'style.css'
$lines = Get-Content $p -Encoding UTF8
$block = @'
/* ============================================================
   MAIN TOBA INTRO - "THE COURT IS OPEN" (~4.2s)
   Bright ivory + sage atmosphere, court geometry, mascot focal.
   ============================================================ */
#tobaIntro {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: #F7F6F0;
  overflow: hidden;
  user-select: none;
  opacity: 1;
  transition: opacity .55s ease
}

#tobaIntro.obi-out {
  opacity: 0;
  pointer-events: none
}

#tobaIntro.obi-out .obi-copy,
#tobaIntro.obi-out .obi-figure {
  opacity: 0 !important;
  transition: opacity .3s ease !important
}

.obi-stage {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center
}

/* atmospheric sage wash (same family as the homepage hero) */
.obi-atmosphere {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.4s ease
}

.obi-stage.run .obi-atmosphere {
  opacity: 1
}

.obi-atmosphere:before,
.obi-atmosphere:after {
  content: '';
  position: absolute;
  inset: -20%;
  filter: blur(70px);
  will-change: transform;
  border-radius: 46% 54% 58% 42% / 62% 48% 52% 38%
}

.obi-atmosphere:before {
  background: radial-gradient(44% 42% at 30% 30%, rgba(49, 90, 59, .16) 0%, rgba(49, 90, 59, 0) 70%),
              radial-gradient(50% 46% at 76% 66%, rgba(143, 191, 156, .3) 0%, rgba(143, 191, 156, 0) 70%);
  animation: obiDriftA 20s ease-in-out infinite alternate
}

.obi-atmosphere:after {
  background: radial-gradient(56% 50% at 50% 84%, rgba(226, 232, 224, .9) 0%, rgba(226, 232, 224, 0) 72%);
  animation: obiDriftB 24s ease-in-out infinite alternate
}

@keyframes obiDriftA {
  from { transform: translate(-3%, 2%) scale(1) }
  50%  { transform: translate(2.5%, -1.5%) scale(1.05) }
  to   { transform: translate(-1.5%, 3%) scale(1.02) }
}

@keyframes obiDriftB {
  from { transform: translate(3%, 0) scale(1.03) }
  to   { transform: translate(-2.5%, 2.5%) scale(1) }
}

/* scene: court geometry draws itself, forest green on ivory */
.obi-court {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%
}

.ocl {
  stroke: rgba(49, 90, 59, .4);
  stroke-width: 2;
  fill: none;
  stroke-dasharray: 1600;
  stroke-dashoffset: 1600
}

.ocl-soft {
  fill: rgba(49, 90, 59, .28);
  opacity: 0
}

.ocl-arc {
  stroke: rgba(49, 90, 59, .26);
  stroke-width: 2;
  fill: none;
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200
}

.obi-stage.run .ocl {
  animation: obiDraw 1.9s var(--ease-out) forwards
}

.obi-stage.run .ocl:nth-of-type(2) { animation-delay: .2s }
.obi-stage.run .ocl:nth-of-type(3) { animation-delay: .4s }
.obi-stage.run .ocl:nth-of-type(4) { animation-delay: .65s }

.obi-stage.run .ocl-arc {
  animation: obiDraw 1.6s var(--ease-out) .9s forwards
}

.obi-stage.run .ocl-soft {
  animation: obiFade .7s ease 1.4s forwards
}

@keyframes obiDraw {
  to { stroke-dashoffset: 0 }
}

@keyframes obiFade {
  to { opacity: 1 }
}

/* scene: mascot surfaces as the focal point */
.obi-figure {
  position: relative;
  z-index: 4;
  width: clamp(280px, 38vmin, 460px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  opacity: 0;
  transform: translateY(34px) scale(.94);
  transition: opacity .9s var(--ease-out), transform 1.2s var(--ease-cine)
}

.obi-figure.in {
  opacity: 1;
  transform: translateY(0) scale(1)
}

.obi-figure.settle {
  transform: translateY(0) scale(1.02);
  transition: transform 1.6s var(--ease-cine)
}

.obi-figure img {
  width: 88%;
  height: auto;
  filter: drop-shadow(0 30px 60px rgba(20, 37, 26, .2))
}

.obi-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(49, 90, 59, .28);
  background: radial-gradient(closest-side, rgba(255, 255, 255, .92), rgba(255, 255, 255, .4) 72%, transparent)
}

.obi-figure.in .obi-ring {
  animation: obiBreathe 3.4s ease-in-out .6s infinite
}

@keyframes obiBreathe {
  50% { transform: scale(1.06); border-color: rgba(49, 90, 59, .4) }
}

/* scene: wordmark + welcome typography */
.obi-copy {
  position: absolute;
  left: 50%;
  bottom: 9%;
  transform: translateX(-50%) translateY(16px);
  z-index: 6;
  width: min(760px, 90vw);
  text-align: center;
  opacity: 0;
  transition: opacity .9s var(--ease-out), transform 1s var(--ease-cine)
}

.obi-copy.in {
  opacity: 1;
  transform: translateX(-50%) translateY(0)
}

.obi-wordmark {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: clamp(30px, 4.6vw, 54px);
  letter-spacing: .3em;
  color: #242522;
  margin: 0
}

.obi-wordmark small {
  display: block;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: .5em;
  margin-top: 8px;
  color: var(--muted)
}

.obi-welcome {
  font-size: clamp(15px, 2vw, 20px);
  color: #315A3B;
  font-weight: 600;
  margin: 18px 0 6px
}

.obi-sub {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0
}

.obi-skip {
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 8;
  border: 1px solid rgba(36, 37, 34, .22);
  background: rgba(255, 255, 255, .65);
  color: #242522;
  border-radius: 999px;
  padding: 9px 17px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: .2s
}

.obi-skip:hover { background: #fff }

.obi-stage.dim .obi-court,
.obi-stage.dim .obi-court * {
  opacity: .3;
  transition: opacity 1s ease
}

/* mobile */
@media(max-width:760px) {
  .obi-figure { width: min(72vw, 300px) }
  .obi-copy { bottom: 7% }
  .obi-wordmark { font-size: clamp(24px, 7vw, 34px) }
  .obi-skip { bottom: 18px; right: 16px }
}

'@
$new = ($lines[0..1635] + ($block -split "`r?`n") + $lines[1853..($lines.Count - 1)])
Set-Content $p -Value $new -Encoding UTF8
Write-Output "old=$($lines.Count) new=$((Get-Content $p).Count)"
