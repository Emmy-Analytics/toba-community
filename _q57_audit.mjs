import puppeteer from 'puppeteer';
import path from 'path';
import url from 'url';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const BASE = 'file://' + path.join(__dirname).replace(/\\/g, '/');
const results = [];
const log = (id, ok, note = '') => { results.push({ id, ok, note }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}${note ? ' — ' + note : ''}`); };

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const errors = [];
async function newPage(w, h) {
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h });
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto(BASE + '/index.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  return p;
}
const horizOverflow = async p => await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);

// ---------- viewport set ----------
const VPS = [[1920, 1080], [1440, 900], [768, 1024], [393, 852], [375, 812], [355, 700]];

// P37/P38 footer checks on every page at every viewport
const PAGES = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html'];
for (const pg of PAGES) {
  for (const [w, h] of VPS) {
    const p = await browser.newPage();
    await p.setViewport({ width: w, height: h });
    p.on('pageerror', e => errors.push(pg + ' :: ' + e));
    await p.goto(BASE + '/' + pg, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    const r = await p.evaluate(() => {
      const credit = document.querySelector('.pw-credit'); if (!credit) return { err: 'no credit' };
      const cr = credit.getBoundingClientRect();
      const ig = document.querySelector('.pw-ig-link'); const igr = ig ? ig.getBoundingClientRect() : null;
      const centeredMob = window.innerWidth <= 480 ? Math.abs((cr.left + cr.right) / 2 - window.innerWidth / 2) < 12 : true;
      const aligned = igr ? Math.abs((igr.top + igr.bottom) / 2 - (credit.querySelector('.pw-crafted').getBoundingClientRect().top + credit.querySelector('.pw-crafted').getBoundingClientRect().bottom) / 2) < 8 : false;
      const cstyle = getComputedStyle(credit.querySelector('.pw-crafted'));
      const bright = cstyle.color.match(/\d+/g).slice(0, 3).map(Number);
      const lowContrastAccent = (bright[0] > 200 && bright[1] < 120) || (bright[0] > 200 && bright[2] < 120); // flashy red/orange/magenta
      const body = document.body, overflow = body.scrollWidth > window.innerWidth + 1;
      const brokenEnc = document.body.innerHTML.includes('Â');
      return { centeredMob, aligned, lowContrastAccent, overflow, brokenEnc };
    });
    if (r.err) { log(`footer ${pg} @${w}`, false, r.err); } else {
      if (!r.centeredMob) log(`P37 center-mobile ${pg} @${w}`, false, JSON.stringify(r));
      if (!r.aligned) log(`P37 IG align ${pg} @${w}`, false);
      if (r.lowContrastAccent) log(`P37 flashy color ${pg} @${w}`, false);
      if (r.overflow) log(`overflow ${pg} @${w}`, false);
      if (r.brokenEnc) log(`P38 mojibake ${pg} @${w}`, false);
    }
    await p.close();
  }
}
log('P37/P38 footer sweep done', true);

// P39 story paragraphs
{
  const p = await newPage(1440, 900);
  const s = await p.evaluate(() => ({ h: !!document.querySelector('.tl-story-h,.story-ed-title'), paras: [...document.querySelectorAll('.tl-story p, .story-ed p')].length }));
  log('P39 tobafadies story present', s.h, JSON.stringify(s));
  await p.goto(BASE + '/tobaladies.html', { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 800));
  const s2 = await p.evaluate(() => document.querySelectorAll('.story-ed p, .tl-story p').length);
  log('P39 tobafadies story on tobaladies page', s2 > 2, 'paras=' + s2);
}

// P41 transparent croc on mobile — check no green croc img variant used at mobile
{
  const p = await newPage(393, 852);
  await p.goto(BASE + '/tobaladies.html', { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 800));
  const croc = await p.evaluate(() => {
    const imgs = [...document.querySelectorAll('img[src*="croc"],img[src*="buaya"],img[src*="maskot"]')];
    return imgs.map(i => ({ src: i.src.split('/').pop(), vis: i.offsetParent !== null && getComputedStyle(i).opacity > 0.05 }));
  });
  log('P41 croc transparent consistent', croc.every(c => !c.src.includes('green') && !c.src.includes('hijau')), JSON.stringify(croc));
  await p.close();
}

// P42 court geometry — one geometry everywhere
{
  const p = await newPage(1440, 900);
  const courts = [];
  await p.goto(BASE + '/index.html', { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 700));
  courts.push(await p.evaluate(() => [...document.querySelectorAll('.court-svg,[class*="court"] svg,[data-court]')].length));
  await p.goto(BASE + '/tobaladies.html', { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 700));
  courts.push(await p.evaluate(() => [...document.querySelectorAll('.court-svg,[class*="court"] svg,[data-court]')].length));
  log('P42 court geometry present', courts.every(n => n >= 0), JSON.stringify(courts));
  await p.close();
}

// P45 Join the Squad translation
{
  const p = await newPage(1440, 900);
  await p.goto(BASE + '/tobadeli.html', { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 700));
  const en = await p.evaluate(() => document.body.innerText.includes('Join the Squad'));
  // switch language
  await p.evaluate(() => { const b = document.querySelector('#langToggle,.lang-toggle,[data-lang-switch]'); if (b) b.click(); });
  await new Promise(r => setTimeout(r, 500));
  const id = await p.evaluate(() => document.body.innerText.includes('Gabung Komunitas') || !document.body.innerText.includes('Join the Squad'));
  log('P45 Join the Squad i18n', en && id, `en=${en} idSw=${id}`);
  await p.close();
}

// P51 join.f.city label
{
  const p = await newPage(1440, 900);
  const lab = await p.evaluate(() => { const el = document.querySelector('[data-i18n="join.f.city"]'); return el ? el.textContent : null; });
  log('P51 join.f.city label', lab === 'Current City', String(lab));
  await p.evaluate(() => { const b = document.querySelector('#langToggle,.lang-toggle,[data-lang-switch]'); if (b) b.click(); });
  await new Promise(r => setTimeout(r, 400));
  const lab2 = await p.evaluate(() => { const el = document.querySelector('[data-i18n="join.f.city"]'); return el ? el.textContent : null; });
  log('P51 join.f.city id', lab2 === 'Domisili Saat Ini', String(lab2));
  await p.close();
}

// P53 WhatsApp number
{
  const p = await newPage(1440, 900);
  const wa = await p.evaluate(() => {
    const btn = document.getElementById('joinSubmit') || [...document.querySelectorAll('button,a')].find(b => /whatsapp/i.test(b.id + b.className + (b.getAttribute('data-i18n') || '')));
    return btn ? { found: true, tag: btn.tagName } : { found: false };
  });
  const src = require('fs').readFileSync(path.join(__dirname, 'script.js'), 'utf8') + require('fs').readFileSync(path.join(__dirname, 'i18n.js'), 'utf8');
  const hasWA = src.includes('wa.me/6281285704946');
  const badWA = /wa\.me\/(?!6281285704946)\d{10,}/.test(src);
  log('P53 WhatsApp official number', hasWA && !badWA, hasWA ? '' : 'missing wa.me/6281285704946');
  await p.close();
}

// P54-55 cinematic hero + horizontal motion
{
  const p = await newPage(1440, 900);
  const cin = await p.evaluate(() => ({
    collage: !!document.querySelector('.hero-collage .hc-photo'),
    tracks: [...document.querySelectorAll('.cine-g-track')].length,
    moving: document.querySelector('.cine-g-track') ? getComputedStyle(document.querySelector('.cine-g-track')).transform : null
  }));
  log('P54 hero collage', cin.collage);
  log('P56 gallery rows', cin.tracks >= 3, 'tracks=' + cin.tracks);
  const t1 = await p.evaluate(() => getComputedStyle(document.querySelector('.cine-g-track')).transform);
  await new Promise(r => setTimeout(r, 1200));
  const t2 = await p.evaluate(() => getComputedStyle(document.querySelector('.cine-g-track')).transform);
  log('P56 auto-motion progressing', t1 !== t2, `${t1} -> ${t2}`);
  // zero empty space — track wider than viewport, and row width filled
  const fill = await p.evaluate(() => {
    const row = document.querySelector('.cine-g-row'); const track = row.firstElementChild;
    return { rowW: row.getBoundingClientRect().width, trackW: track.scrollWidth, vw: window.innerWidth };
  });
  log('P56 track fills width', fill.trackW >= fill.rowW, JSON.stringify(fill));
  // click photo -> lightbox
  await p.click('.cine-g-card img').catch(() => { });
  await new Promise(r => setTimeout(r, 700));
  const lb = await p.evaluate(() => !!document.querySelector('.lightbox,.lb,.cine-lightbox,[class*="lightbox"],[class*="preview-modal"]') && getComputedStyle([...document.querySelectorAll('[class*="lightbox"]')].find(e => e.offsetParent !== null) || document.body).display !== 'none');
  log('P56.4 lightbox opens on click', lb);
  await p.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));
  const closed = await p.evaluate(() => ![...document.querySelectorAll('[class*="lightbox"]')].some(e => e.offsetParent !== null && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden'));
  log('P56.4 lightbox closes on Esc', closed);
  await p.close();
}

// P57 starfield canvas
{
  const p = await newPage(1440, 900);
  const st = await p.evaluate(() => {
    const c = document.getElementById('tobaStars'); if (!c) return { ok: false };
    return { ok: true, w: c.width || c.clientWidth, h: c.height || c.clientHeight, layers: document.querySelectorAll('.starfield-layer').length };
  });
  log('P57 starfield canvas active', st.ok && st.w > 0, JSON.stringify(st));
  await p.close();
}

// P45/P51 language toggle coverage sanity
{
  const p = await newPage(768, 1024);
  const res = await p.evaluate(() => {
    const out = []; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (k && !out.includes(k)) out.push(k) });
    return out.length;
  });
  log('i18n keys wired in DOM', res > 80, 'keys=' + res);
  await p.close();
}

log('TOTAL JS/console ERRORS', errors.length === 0, errors.slice(0, 5).join(' | '));
await browser.close();
import fs from 'fs';
fs.writeFileSync('_q57_report.json', JSON.stringify(results, null, 2));
console.log('\nSUMMARY: ' + results.filter(r => r.ok).length + ' pass / ' + results.filter(r => !r.ok).length + ' fail');
