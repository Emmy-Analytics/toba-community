import puppeteer from 'puppeteer';
const BASE = 'http://127.0.0.1:8471';
const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'gallery.html', 'merchandise.html', 'partnership.html', 'game.html'];
const sizes = [[320, 720], [375, 720], [390, 780], [414, 860], [768, 1024], [1440, 900]];
const langs = ['id', 'en'];
const browser = await puppeteer.launch({ headless: 'new' });
const results = [];
const page = await browser.newPage();
for (const lang of langs) {
  for (const [w, h] of sizes) {
    await page.setViewport({ width: w, height: h });
    for (const p of pages) {
      await page.goto(`${BASE}/${p}?lang=${lang}`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => { });
      await new Promise(r => setTimeout(r, 1200));
      // skip intro overlays if any
      await page.evaluate(() => { document.querySelectorAll('.obi-skip,.tld-skip,.tdl-skip,[class*=skip]').forEach(b => b && b.click && b.click()); });
      await new Promise(r => setTimeout(r, 400));
      const check = await page.evaluate(() => {
        const de = document.documentElement;
        const overflowX = Math.max(de.scrollWidth, document.body.scrollWidth) - window.innerWidth;
        // script elements clipping check
        const clipped = [];
        document.querySelectorAll('.script-accent').forEach(el => {
          const cs = getComputedStyle(el);
          const parent = el.closest('h1,h2,h3,p');
          if (parent && parent.scrollHeight > parent.clientHeight + 4) clipped.push('clipped:' + el.textContent.trim().slice(0, 20));
        });
        // scripts used outside allowed contexts
        const misuse = !!document.querySelector('nav .script-accent, form .script-accent, button .script-accent, .main-nav .script-accent');
        return { overflowX, clipped, misuse, fontsLoaded: document.fonts.status };
      });
      results.push(`${lang} ${w}x${h} ${p}: overflowX=${check.overflowX} fonts=${check.fontsLoaded}${check.clipped.length ? ' CLIPPED:' + check.clipped.join('|') : ''}${check.misuse ? ' SCRIPT-MISUSE' : ''}`);
      if (['index.html', 'tobaladies.html', 'tobadeli.html'].includes(p) && (w === 320 || w === 390 || w === 1440)) {
        await page.screenshot({ path: `_typo-${lang}-${w}-${p.replace('.html', '')}.png`, clip: { x: 0, y: 0, width: w, height: Math.min(h, 900) } });
      }
    }
  }
}
console.log(results.join('\n'));
await browser.close();
