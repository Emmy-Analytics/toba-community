const p = require('puppeteer');
const BASE = 'file:///' + encodeURI('G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY 2023-2026 - CASHIER GENERAL AFFAIR/EMMY/BDA/PROJECT 6/');

async function chat(pg, msg) {
  await pg.evaluate(m => {
    const inp = document.getElementById('tobiInput');
    inp.value = m;
    document.getElementById('tobiForm').dispatchEvent(new Event('submit', { cancelable: true }));
  }, msg);
  await new Promise(r => setTimeout(r, 1400));
  return pg.evaluate(() => {
    const bubbles = [...document.querySelectorAll('#tobiLog .tobi-bubble')];
    const last = bubbles[bubbles.length - 1];
    return { text: last ? last.innerText.replace(/\n/g, ' | ') : '', link: last && last.querySelector('a.tobi-page-link') ? last.querySelector('a.tobi-page-link').textContent : null };
  });
}

async function freshChat(pg, lang) {
  await pg.goto(BASE + 'index.html', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2600));
  await pg.click('.obi-skip').catch(() => { });
  await new Promise(r => setTimeout(r, 1500));
  const l = await pg.evaluate(() => { const e = document.getElementById('tobiLauncher').getBoundingClientRect(); return { x: Math.round(e.x + e.width / 2), y: Math.round(e.y + e.height / 2) }; });
  await pg.mouse.click(l.x, l.y);
  await new Promise(r => setTimeout(r, 900));
}

(async () => {
  const b = await p.launch();
  const pg = await b.newPage();
  await pg.setViewport({ width: 1280, height: 800 });

  await pg.goto(BASE + 'index.html', { waitUntil: 'networkidle2', timeout: 60000 });
  await pg.evaluate(() => { try { localStorage.setItem('toba-lang', 'id'); } catch (_) { } });

  // B: game → topic switch (fresh)
  await freshChat(pg, 'ID');
  await chat(pg, 'Tebak-tebakan dong.');
  let r = await chat(pg, 'Eh, lokasi TOBA di mana?');
  console.log('B lokasi switch:', JSON.stringify(r));

  // C: back-ref
  r = await chat(pg, 'Jadwal Tobaladies kapan?');
  r = await chat(pg, 'Tadi yang Sabtu itu Tobaladies kan?');
  console.log('C back-ref:', JSON.stringify(r));

  // E: decline (fresh, no prior join)
  await freshChat(pg, 'ID');
  await chat(pg, 'Mau ikut Fun Game.');
  r = await chat(pg, 'Enggak ah, nanti aja.');
  console.log('E decline:', JSON.stringify(r));

  // berapa short
  await freshChat(pg, 'ID');
  await chat(pg, 'Jadwal Tobaladies kapan?');
  r = await chat(pg, 'Berapa?');
  console.log('pendek berapa:', JSON.stringify(r));

  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
