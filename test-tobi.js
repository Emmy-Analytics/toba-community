const p = require('puppeteer');
const BASE = 'file:///' + encodeURI('G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY 2023-2026 - CASHIER GENERAL AFFAIR/EMMY/BDA/PROJECT 6/');

async function freshChat(pg, lang, msgs, label) {
  await pg.evaluateOnNewDocument(() => { try { sessionStorage.clear(); } catch(_){} });
  await pg.goto(BASE + 'index.html', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2600));
  await pg.click('.obi-skip').catch(() => {});
  await new Promise(r => setTimeout(r, 1500));
  const l = await pg.evaluate(() => { const e = document.getElementById('tobiLauncher').getBoundingClientRect(); return { x: Math.round(e.x + e.width / 2), y: Math.round(e.y + e.height / 2) }; });
  await pg.mouse.click(l.x, l.y);
  await new Promise(r => setTimeout(r, 900));
  const chips0 = await pg.evaluate(() => [...document.querySelectorAll('#tobiChips .tobi-chip')].map(c => c.textContent));
  console.log('[' + lang + '] initial chips:', JSON.stringify(chips0));
  let out = null;
  for (const m of msgs) out = await chat(pg, m);
  console.log('[' + lang + '] ' + label + ':', JSON.stringify(out));
  return out;
}

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
    return { text: last ? last.innerText.replace(/\n/g, ' | ') : '', link: last && last.querySelector('a.tobi-page-link') ? last.querySelector('a.tobi-page-link').textContent : null, chips: [...document.querySelectorAll('#tobiChips .tobi-chip')].map(c => c.textContent) };
  });
}

(async () => {
  const b = await p.launch();
  const pg = await b.newPage();
  await pg.setViewport({ width: 1280, height: 800 });

  /* ============ ID SCENARIOS ============ */
  await pg.goto(BASE + 'index.html', { waitUntil: 'networkidle2', timeout: 60000 });
  await pg.evaluate(() => { try { localStorage.setItem('toba-lang', 'id'); } catch(_){} });
  await freshChat(pg, 'ID', ['Mau kenalan sama TOBA.', 'Kapan mulai?'], 'A kapan mulai');

  // B: game → topic switch
  await chat(pg, 'Tebak-tebakan dong.');
  let r = await chat(pg, 'Eh, lokasi TOBA di mana?');
  console.log('B lokasi switch:', JSON.stringify(r));

  // C: sched then back-ref
  await chat(pg, 'Jadwal Tobaladies kapan?');
  r = await chat(pg, 'Tadi yang Sabtu itu Tobaladies kan?');
  console.log('C back-ref:', JSON.stringify(r));

  // D: short ack
  r = await chat(pg, 'Ohh.');
  console.log('D ohh:', JSON.stringify(r));

  // E: decline
  await chat(pg, 'Mau ikut Fun Game.');
  r = await chat(pg, 'Enggak ah, nanti aja.');
  console.log('E decline:', JSON.stringify(r));

  // F: join with button
  r = await chat(pg, 'Mau gabung.');
  console.log('F join:', JSON.stringify(r));

  // pendek: berapa, dimana
  r = await chat(pg, 'Berapa?');
  console.log('pendek berapa:', JSON.stringify(r));
  r = await chat(pg, 'Di mana?');
  console.log('pendek dimana:', JSON.stringify(r));
  r = await chat(pg, 'Yang mana?');
  console.log('pendek yangmana:', JSON.stringify(r));

  /* ============ EN MODE (fresh session) ============ */
  await pg.evaluate(() => { localStorage.setItem('toba-lang', 'en'); });
  await freshChat(pg, 'EN', [], 'open');
  r = await chat(pg, 'When do you play?');
  console.log('EN sched:', JSON.stringify(r));
  r = await chat(pg, 'I want to join.');
  console.log('EN join:', JSON.stringify(r));
  r = await chat(pg, 'Partnership Info');
  console.log('EN partnership chip:', JSON.stringify(r));
  r = await chat(pg, 'Fun Game Info');
  console.log('EN fungame chip:', JSON.stringify(r));
  r = await chat(pg, 'Where?');
  console.log('EN where:', JSON.stringify(r));

  // Test C: switch to ID mid-conversation (no reload — toba:langchange)
  await pg.evaluate(() => { localStorage.setItem('toba-lang', 'id'); document.documentElement.lang = 'id'; document.dispatchEvent(new Event('toba:langchange')); });
  await new Promise(r2 => setTimeout(r2, 900));
  r = await chat(pg, 'Jadwal Tobaladies kapan?');
  console.log('switch→ID sched:', JSON.stringify(r));
  r = await chat(pg, 'Kapan mulai?');
  console.log('switch→ID kapan:', JSON.stringify(r));

  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });

async function unused(){}
