import puppeteer from 'puppeteer';
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:8099/index.html', { waitUntil: 'networkidle2' });
const res = await p.evaluate(() => {
  const e = document.querySelector('[data-i18n="join.f.city"]');
  return { exists: !!e, text: e ? e.textContent : null, lang: typeof t !== 'undefined' ? t('join.f.city') : null, cur: currentLang };
});
console.log(JSON.stringify(res));
await b.close();
