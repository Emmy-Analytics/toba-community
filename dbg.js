const p = require('puppeteer');
const BASE = 'file:///' + encodeURI('G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY 2023-2026 - CASHIER GENERAL AFFAIR/EMMY/BDA/PROJECT 6/');
(async () => {
  const b = await p.launch();
  const pg = await b.newPage();
  await pg.goto(BASE + 'index.html', { waitUntil: 'networkidle2', timeout: 60000 });
  await pg.evaluate(() => { try { localStorage.setItem('toba-lang', 'id'); } catch (_) { } });
  await new Promise(r => setTimeout(r, 2600));
  await pg.click('.obi-skip').catch(() => { });
  await new Promise(r => setTimeout(r, 1500));
  const l = await pg.evaluate(() => { const e = document.getElementById('tobiLauncher').getBoundingClientRect(); return { x: Math.round(e.x + e.width / 2), y: Math.round(e.y + e.height / 2) }; });
  await pg.mouse.click(l.x, l.y);
  await new Promise(r => setTimeout(r, 900));
  await pg.evaluate(() => { window.__trace = []; const h = window.tobiPersona.handle; window.tobiPersona.handle = function (m) { window.__trace.push('IN:' + m); const r = h.call(this, m); window.__trace.push('OUT:' + String(r).slice(0, 80)); return r; }; });
  for (const msg of ['Tebak-tebakan dong.', 'Eh, lokasi TOBA di mana?']) {
    await pg.evaluate(m => { document.getElementById('tobiInput').value = m; document.getElementById('tobiForm').dispatchEvent(new Event('submit', { cancelable: true })); }, msg);
    await new Promise(r => setTimeout(r, 1500));
  }
  const t = await pg.evaluate(() => window.__trace);
  console.log('TRACE:', JSON.stringify(t, null, 1));
  const last = await pg.evaluate(() => { const bs = [...document.querySelectorAll('#tobiLog .tobi-bubble')]; return bs.slice(-2).map(x => x.innerText); });
  console.log('LAST2:', JSON.stringify(last));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
