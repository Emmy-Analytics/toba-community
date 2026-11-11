/* TOBA COMMUNITY — Bagian 3: satu sumber geometry lapangan basket.
   Master geometry FIBA (28×15m, skala 35.7 px/m) dipindah ke sini supaya
   Intro, Home, Tobaladies, dan Tobadeli memakai struktur SVG yang IDENTIK.
   script.js membaca COURT_MARKINGS / courtSVG dari file ini; sebelum edit,
   fungsi-fungsi ini hidup di script.js (dipindah utuh, tidak diubah nilainya). */
const PX = 35.7;               // px per metre
const HH = PX * 7.5;           // half height (15m / 2)
const HW = PX * 14;            // half length (28m / 2)
const RING = PX * 12.575;      // ring centre distance from half-court line
const BACKBOARD = PX * 13.2;   // backboard line (1.2m from baseline)
const KEYD = PX * 5.8;         // key depth from baseline
const KEYW = PX * 2.9;         // key half width
const CORNER = PX * 6.6;       // three-point corner straight y (0.9m from sideline)
const TP_R = PX * 6.75;        // three-point arc radius
const R_FT = PX * 1.8;         // free-throw / centre circle radius
const R_RES = PX * 1.25;       // restricted area radius
const courtHalf = S => {
  const bx = S * HW, kx = S * (HW - KEYD), cx = S * BACKBOARD, rx = S * RING;
  /* three-point corner straight meets the 6.75m arc exactly (Pythagoras):
     tangent x measured from the ring centre */
  const tx = rx - S * Math.sqrt(TP_R * TP_R - CORNER * CORNER);
  /* arc sweeps toward half-court: sweep flag depends on side */
  const tpSweep = S > 0 ? 0 : 1;
  const ftSweep = S > 0 ? 0 : 1;   /* dashed half of FT circle faces half-court */
  const resSweep = S > 0 ? 0 : 1;  /* restricted arc bulges toward half-court */
  return `
  <path d="M ${bx.toFixed(1)} ${-CORNER.toFixed(1)} L ${tx.toFixed(1)} ${-CORNER.toFixed(1)} A ${TP_R.toFixed(1)} ${TP_R.toFixed(1)} 0 0 ${tpSweep} ${tx.toFixed(1)} ${CORNER.toFixed(1)} L ${bx.toFixed(1)} ${CORNER.toFixed(1)}"/>
  <path d="M ${bx.toFixed(1)} ${-KEYW.toFixed(1)} L ${kx.toFixed(1)} ${-KEYW.toFixed(1)} L ${kx.toFixed(1)} ${KEYW.toFixed(1)} L ${bx.toFixed(1)} ${KEYW.toFixed(1)}"/>
  <circle cx="${kx.toFixed(1)}" cy="0" r="${R_FT.toFixed(1)}"/>
  <path d="M ${kx.toFixed(1)} ${-R_FT.toFixed(1)} A ${R_FT.toFixed(1)} ${R_FT.toFixed(1)} 0 0 ${ftSweep} ${kx.toFixed(1)} ${R_FT.toFixed(1)}"/>
  <path d="M ${rx.toFixed(1)} ${-R_RES.toFixed(1)} A ${R_RES.toFixed(1)} ${R_RES.toFixed(1)} 0 0 ${resSweep} ${rx.toFixed(1)} ${R_RES.toFixed(1)}"/>
  <line x1="${cx.toFixed(1)}" y1="${-PX * 0.9}" x2="${cx.toFixed(1)}" y2="${PX * 0.9}" stroke-width="3"/>
  <circle cx="${rx.toFixed(1)}" cy="0" r="2.6"/>`;
};
const COURT_MARKINGS = `
  <rect x="${-HW}" y="${-HH}" width="${HW * 2}" height="${HH * 2}"/>
  <line x1="0" y1="${-HH}" x2="0" y2="${HH}"/>
  <circle cx="0" cy="0" r="${R_FT}"/>
  ${courtHalf(-1)}
  ${courtHalf(1)}`;

const courtSVG = cls => `<svg class="hero-court ${cls || ''}" viewBox="${-HW} ${-HH} ${HW * 2} ${HH * 2}" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice" data-parallax="0.045" data-pointer-depth="14">${COURT_MARKINGS}</svg>`;
