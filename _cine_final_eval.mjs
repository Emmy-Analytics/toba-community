export default async () => {
  const errs = [];
  window.addEventListener('error', e => errs.push(String(e.message)));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const q = s => document.querySelectorAll(s).length;
  const out = {};

  // 1) gallery track motion
  const gal = document.querySelector('.cine-gallery');
  window.scrollTo(0, gal.offsetTop);
  await sleep(600);
  const t1 = document.querySelector('.cine-gal-track');
  const p1 = t1.getBoundingClientRect().x;
  await sleep(2500);
  const p2 = t1.getBoundingClientRect().x;
  out.trackMoved = p1 !== p2;
  out.trackSpeedPxPerSec = +(Math.abs(p2 - p1) / 2.5).toFixed(1);

  // 2) reviews crossfade
  window.scrollTo(0, 0);
  await sleep(300);
  const rev = document.querySelector('.cine-reviews');
  const bgEl = document.querySelector('.cine-rbg-img');
  const bgB = getComputedStyle(bgEl).opacity;
  window.scrollTo(0, rev.offsetTop);
  await sleep(6000);
  const bgA = getComputedStyle(bgEl).opacity;
  out.bgChanged = bgB !== bgA;

  // 3) marquee motion
  const mq = document.querySelector('.cine-m-track');
  const mqY = mq.getBoundingClientRect().top + window.scrollY - 200;
  window.scrollTo(0, mqY);
  await sleep(500);
  const m1 = mq.style.transform;
  await sleep(2000);
  out.marqueeMoved = m1 !== mq.style.transform;

  // 4) scroll bottom (no trap), overflow, footer
  window.scrollTo(0, document.body.scrollHeight);
  await sleep(900);
  out.footerLinks = [...document.querySelectorAll('a')].filter(a =>
    a.href.includes('wa.me') || a.href.includes('instagram.com')).map(a =>
      [(a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 36), a.href.replace('https://', '').slice(0, 62)]);

  out.counts = {
    tracks: q('.cine-gal-track'),
    gcards: q('.cine-g-card img'),
    rbg: q('.cine-rbg-img'),
    rpause: !!document.querySelector('.cine-rpause'),
    portoweb: q('a[href*="instagram.com/portoweb.id"]')
  };
  out.headline = (document.querySelector('.cine-reviews-headline') || {}).textContent || null;
  out.overflowX = document.documentElement.scrollWidth - window.innerWidth;
  out.domNodes = document.querySelectorAll('*').length;
  out.pageH = document.body.scrollHeight;
  out.errs = errs;
  return JSON.stringify(out);
};
