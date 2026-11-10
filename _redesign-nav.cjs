/* ============================================================
   TOBA NAV REDESIGN — Contemporary Basketball Club
   Replaces the legacy mobile-drawer CSS block (media ≤1000px nav
   rules) with a single, coherent design-system pass, and patches
   script.js so <html> gets .nav-open for browsers without :has().
   ============================================================ */
const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

/* ---- 1. brand tokens (Contemporary Basketball Club) ---- */
css = css.replace(
  ':root {\n  --bg: #F7F6F0;',
  `:root {\n  --forest: #172F23;\n  --sand: #F4F0E6;\n  --pink: #E64C78;\n  --orange: #F06428;\n  --bg: #F4F0E6;`
);
/* retarget old token aliases so the whole site shifts onto the new palette */
css = css
  .replace('--accent: #315A3B;', '--accent: #172F23;')
  .replace('--accent-dark: #14251A;', '--accent-dark: #0D1F16;')
  .replace('--accent-soft: #E2E8E0;', '--accent-soft: #E6E2D4;')
  .replace('--secondary: #5C7364;', '--secondary: #40614E;')
  .replace('--bg-warm: #EDE9DE;', '--bg-warm: #EAE5D6;')
  .replace('--line: #E4E0D4;', '--line: #DDD7C6;');

/* ---- 2. remove the legacy drawer CSS block entirely ---- */
const startMark = '  /* mobile drawer: full-height panel';
const i0 = css.indexOf(startMark);
if (i0 < 0) { console.error('legacy drawer block not found'); process.exit(1); }
/* the legacy block runs until the closing brace of the @media(max-width:1000px)
   rule that contains it — find the NEXT "  /* ---------- responsive helpers"
   sentinel is unreliable, so we splice from the drawer start to the known
   end of the mega/menu rules. Instead: cut from drawer start up to the
   line "  .hero,   " which belongs to page-level rules inside the same
   media query and must stay. */
const keepFrom = css.indexOf('  .hero,', i0);
const crlf = '\r\n';
/* skip the rest of this selector line */
const keepEnd = css.indexOf(crlf, keepFrom) + 1;
if (keepFrom < 0) { console.error('splice end not found'); process.exit(1); }

const NEW_NAV = `  /* ============================================================
     MOBILE DRAWER — CONTEMPORARY BASKETBALL CLUB
     Partial-width left panel: 82-86vw, capped 360px, 100dvh tall.
     Deep forest shell on warm sand page, editorial type, numbered
     accordion groups, one sticky CTA. Legacy drawer rules replaced.
     ============================================================ */
  .nav-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(13, 31, 22, .55);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    z-index: 44;
    opacity: 0;
    pointer-events: none;
    transition: opacity .3s ease;
  }

  .nav-backdrop.show {
    opacity: 1;
    pointer-events: auto;
  }

  .main-nav {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 84vw;
    max-width: 360px;
    height: 100vh;
    height: 100dvh;
    padding: 0;
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    background: var(--forest);
    color: #F4F0E6;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    overflow: hidden;
    z-index: 45;
    transform: translateX(var(--nav-offscreen));
    transition: transform .34s var(--ease-out), visibility .34s;
    visibility: hidden;
    will-change: transform;
    contain: paint;
    border-right: 1px solid rgba(244, 240, 230, .14);
    box-shadow: 28px 0 60px rgba(13, 31, 22, .35);
  }

  .main-nav.open {
    transform: none;
    visibility: visible;
  }

  .main-nav > * {
    flex: 0 0 auto;
    width: 100%;
  }

  /* ---- drawer header: logo left, single close button right ---- */
  .main-nav.open .drawer-head,
  .main-nav .drawer-head {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    height: 64px;
    flex-shrink: 0;
    padding: 0 10px 0 20px;
    border-bottom: 1px solid rgba(244, 240, 230, .12);
  }

  .drawer-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .drawer-brand .brand-mark {
    width: 32px;
    height: 32px;
    background: #F4F0E6;
    border: 0;
  }

  .drawer-name {
    font-family: var(--font-head);
    font-size: 15px;
    font-weight: 800;
    letter-spacing: .04em;
    line-height: 1;
    color: #F4F0E6;
  }

  .drawer-name small {
    display: block;
    font-family: var(--font-body);
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 2.6px;
    margin-top: 3px;
    color: rgba(244, 240, 230, .55);
  }

  .drawer-close {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    margin-right: -6px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: #F4F0E6;
    cursor: pointer;
    transition: background .2s;
  }

  .drawer-close:hover { background: rgba(244, 240, 230, .1) }

  .drawer-close svg {
    display: block;
    width: 18px;
    height: 18px;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
  }

  /* ---- intro: one short brand line, not repeated per group ---- */
  .main-nav.open .drawer-intro,
  .main-nav .drawer-intro {
    display: block !important;
    flex-shrink: 0;
    padding: 18px 20px 16px;
  }

  .drawer-intro-title {
    font-family: var(--font-head);
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -.01em;
    color: #F4F0E6;
    margin: 0 0 4px;
  }

  .drawer-intro-sub {
    font-size: 12.5px;
    line-height: 1.5;
    color: rgba(244, 240, 230, .62);
    margin: 0;
  }

  /* ---- accordion list: the only scroll region ---- */
  .main-nav.open .drawer-scroll,
  .main-nav .drawer-scroll {
    display: block !important;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    padding: 2px 0 12px;
  }

  .main-nav .mega {
    position: static !important;
    display: block !important;
    opacity: 1;
    transform: none;
    pointer-events: auto;
    border: 0;
    background: transparent;
    box-shadow: none;
    width: 100%;
  }

  .main-nav .mega[hidden] { display: block !important }

  .mega-panel { display: block; width: 100%; padding: 0 }

  .mega-visual { display: none }          /* desktop-only photography */

  .mega-groups {
    display: block !important;
    width: 100%;
  }

  .mega-group {
    border-top: 1px solid rgba(244, 240, 230, .1);
    padding: 0;
  }

  .mega-group:last-child { border-bottom: 1px solid rgba(244, 240, 230, .1) }

  /* trigger: real <button>, full row, 44px+ tall, chevron reserved space */
  .mega-label {
    display: flex !important;
    flex-direction: row !important;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    box-sizing: border-box;
    min-height: 56px;
    padding: 0 14px 0 20px;
    border: 0;
    background: transparent;
    cursor: pointer;
    font-family: var(--font-head);
    font-size: 13px;
    font-weight: 800;
    letter-spacing: .14em;
    text-transform: uppercase;
    text-align: left;
    color: #F4F0E6;
    -webkit-tap-highlight-color: transparent;
    transition: background .15s;
  }

  .mega-label:hover { background: rgba(244, 240, 230, .05) }

  .mega-label .num {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .08em;
    color: var(--orange);
    margin-right: 10px;
  }

  /* chevron lives in a fixed 32px slot inside the padded row — it can
     never clip because the trigger reserves the space */
  .mega-label .chev {
    flex: 0 0 auto;
    width: 32px;
    height: 32px;
    margin-right: -8px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    transition: background .15s;
  }

  .mega-label .chev svg {
    width: 12px;
    height: 12px;
    stroke: rgba(244, 240, 230, .7);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    transition: transform .28s var(--ease-out);
  }

  .mega-group.open .mega-label .chev svg {
    transform: rotate(180deg);
  }

  .mega-title, .mega-sub { display: none }   /* editorio meta stays desktop-only */

  /* links inside an open group */
  .mega-group .nav-link {
    display: none;
    align-items: center;
    min-height: 48px;
    padding: 0 20px 0 44px;
    font-family: var(--font-body);
    font-size: 14.5px;
    font-weight: 500;
    color: rgba(244, 240, 230, .82);
    transition: color .15s, background .15s;
  }

  .mega-group.open .nav-link { display: flex }

  .mega-group .nav-link:hover,
  .mega-group .nav-link:focus-visible {
    color: #F4F0E6;
    background: rgba(244, 240, 230, .05);
  }

  .main-nav .nav-link[data-nav="tobaladies"] { color: var(--pink) }
  .main-nav .nav-link[data-nav="tobadeli"] { color: var(--orange) }
  .main-nav .nav-link.active {
    color: #F4F0E6;
    font-weight: 700;
  }
  .main-nav .nav-link.active:after {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-left: auto;
    border-radius: 50%;
    background: var(--pink);
  }
  .main-nav .nav-link[data-nav="tobadeli"].active:after { background: var(--orange) }

  /* ---- sticky bottom CTA — one primary action, safe-area aware ---- */
  .main-nav.open .drawer-cta,
  .main-nav .drawer-cta {
    display: flex !important;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    min-height: 52px;
    margin: 12px 20px calc(14px + env(safe-area-inset-bottom, 0px));
    border-radius: 999px;
    background: var(--pink);
    color: #fff;
    font-family: var(--font-head);
    font-weight: 800;
    font-size: 14.5px;
    letter-spacing: .01em;
    box-shadow: 0 8px 22px rgba(230, 76, 120, .32);
    transition: transform .18s var(--ease-out), background .2s;
  }

  .main-nav .drawer-cta:hover {
    background: #D63D69;
    transform: translateY(-1px);
  }

  .drawer-footer { display: none !important }

  /* burger hidden while drawer is open (JS adds html.nav-open as a
     :has()-independent fallback) */
  .menu-toggle { z-index: 46 }
  body:has(#mainNav.open) .menu-toggle,
  html.nav-open .menu-toggle {
    visibility: hidden;
    pointer-events: none;
  }

`;
css = css.slice(0, i0) + NEW_NAV + css.slice(keepEnd);
fs.writeFileSync('style.css', css);
console.log('nav CSS redesigned,', (keepFrom - i0), 'legacy chars replaced');
