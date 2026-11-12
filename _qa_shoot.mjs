export default async function run(page) {
  const steps = [
    { url: 'http://localhost:8377/index.html', sel: null, out: '_qa_home_desktop.png' },
    { url: 'http://localhost:8377/index.html', sel: '.cine-gallery', out: '_qa_gallery.png' },
    { url: 'http://localhost:8377/index.html', sel: '#cineApparel', out: '_qa_apparel_merch.png' },
    { url: 'http://localhost:8377/index.html', sel: '.contact-section', out: '_qa_contact.png' },
    { url: 'http://localhost:8377/tobadeli.html', sel: '.hero', out: '_qa_deli_mobile.png' },
    { url: 'http://localhost:8377/tobadeli.html', sel: '.hero', out: '_qa_deli_desktop.png' },
    { url: 'http://localhost:8377/index.html', sel: '.hero', out: '_qa_home_mobile.png' },
  ];
  for (const s of steps) {
    await page.setViewportSize({ width: s.out.includes('mobile') ? 375 : 1440, height: s.out.includes('mobile') ? 812 : 900 });
    await page.goto(s.url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => { });
    await page.evaluate(() => {
      document.getElementById('tobaIntro')?.remove();
      document.getElementById('tdlIntro')?.remove();
      document.getElementById('tldIntro')?.remove();
      document.querySelector('.hero-home')?.classList.add('in');
      document.querySelectorAll('.reveal:not(.in),.img-reveal:not(.in)').forEach(el => el.classList.add('in'));
      document.querySelectorAll('.cine-focus:not(.cine-in)').forEach(el => el.classList.add('cine-in'));
      sessionStorage.setItem('toba-intro-seen', '1');
      sessionStorage.setItem('tobaladies-intro-seen', '1');
      sessionStorage.setItem('tobadeli-intro-seen', '1');
    });
    if (s.sel) await page.evaluate(sel => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), s.sel);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: s.out });
  }
  return 'done';
}
