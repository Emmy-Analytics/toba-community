/* Prompt 21–36 QA — toba community */
const SKILL = 'C:/Users/hope channel cashier/.codegpt/skills/browser-automation';

const pages = ['index.html', 'tobaladies.html', 'tobadeli.html', 'events.html', 'merchandise.html', 'gallery.html', 'partnership.html'];
const widths = [355, 375, 393, 430, 768, 1024, 1440, 1920];

const out = {};

export default async function run(page, ui) {
  const results = [];
  for (const p of pages) {
    for (const w of widths) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('http://localhost:8377/' + p, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => { });
      await page.waitForTimeout(400);
      const r = await page.evaluate(() => {
        const docEl = document.documentElement;
        const overflow = docEl.scrollWidth - docEl.clientWidth;
        const blankChecks = [];
        // sections that must be visible
        document.querySelectorAll('main h2, main h3, main h1, main section').forEach(() => { });
        const allSections = [...document.querySelectorAll('main section')];
        let hidden = 0;
        allSections.forEach(s => {
          const cs = getComputedStyle(s);
          const r = s.getBoundingClientRect();
          if (cs.display === 'none' || cs.visibility === 'hidden' || (parseFloat(cs.opacity) === 0 && !s.closest('[data-page="game"]'))) hidden++;
        });
        // join modal present on home?
        const jm = document.getElementById('joinModal');
        // footer reachable
        const foot = document.querySelector('footer');
        const fr = foot ? foot.getBoundingClientRect() : null;
        return {
          overflow,
          sections: allSections.length,
          hiddenSections: hidden,
          hasJoinModal: !!jm,
          footerHeight: fr ? Math.round(fr.height) : 0,
          scrollH: document.body.scrollHeight
        };
      });
      results.push({ p, w, ...r });
    }
  }
  out.responsive = results;

  // functional checks on desktop home
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const fn = await page.evaluate(async () => {
    const res = {};
    // P21 copy
    res.galleryCopy = document.querySelector('.cine-g-title')?.textContent.trim();
    res.galleryEyebrow = document.querySelector('.cine-gallery .eyebrow')?.textContent.trim();
    // P23 apparel sentence removed
    res.apparelSub = document.querySelector('.cine-m-sub')?.textContent.trim();
    // P30 tracks: gap check — measure sequences
    res.tracks = [...document.querySelectorAll('.cine-g-track')].map(t => {
      const seqs = t.querySelectorAll('.cine-g-seq');
      return { n: seqs.length, w: seqs[0]?.scrollWidth, dir: t.dataset.dir, speed: t.dataset.speed };
    });
    // P27: form CTA
    const btn = document.getElementById('joinCtaBtn') || document.getElementById('footerWaBtn');
    btn && btn.click();
    await new Promise(r => setTimeout(r, 300));
    const modal = document.getElementById('joinModal');
    res.modalOpens = modal && !modal.hidden;
    // validate empty submit
    modal?.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true }));
    await new Promise(r => setTimeout(r, 100));
    res.errShown = !(document.getElementById('joinErr')?.hidden);
    res.fields = [...(modal?.querySelectorAll('input,fieldset') || [])].map(x => x.name || x.tagName);
    // fill form, capture WA URL
    const f = modal?.querySelector('form');
    if (f) {
      f.querySelector('[name=nama]').value = 'Test';
      f.querySelector('[name=phone]').value = '+62812';
      f.querySelector('[name=ig]').value = '@test';
      f.querySelector('[name=domisili]').value = 'Jakarta';
      f.querySelector('[name=team][value=Tobaladies]').checked = true;
      let captured = null;
      const ow = window.open; window.open = u => { captured = u; return null; };
      f.dispatchEvent(new Event('submit', { cancelable: true }));
      window.open = ow;
      res.waUrl = captured;
    }
    res.modalCloseAfter = modal.hidden;
    return res;
  });
  out.functional = fn;

  // language switch check
  const lang = await page.evaluate(async () => {
    document.querySelector('.lang-btn[data-lang="en"]')?.click();
    await new Promise(r => setTimeout(r, 600));
    return {
      eyebrow: document.querySelector('.cine-gallery .eyebrow')?.textContent.trim(),
      title: document.querySelector('.cine-g-title')?.textContent.trim(),
      cta: document.querySelector('.cine-g-head .text-link')?.textContent.trim(),
      joinTitle: document.getElementById('joinTitle')?.textContent.trim()
    };
  });
  out.en = lang;

  // console errors captured by runner report anyway; check dead images
  const imgs = await page.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src));
  out.brokenImgs = imgs;
  return out;
}
