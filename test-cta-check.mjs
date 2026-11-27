export default async function run(page, ui) {
  await page.goto('file:///g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/gallery.html');
  await page.waitForTimeout(8000);
  const res = {};
  res.count = await page.evaluate(() => document.getElementById('galleryCount').textContent);
  // scroll to CTA / partner section
  await page.locator('.gallery-cta').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  res.ctaBox = await page.evaluate(() => {
    const el = document.querySelector('.gallery-cta');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { text: el.innerText.replace(/\n+/g, ' | '), top: r.top, h: r.height };
  });
  res.partner = await page.evaluate(() => {
    const el = document.querySelector('.photo-partner');
    if (!el) return null;
    const img = el.querySelector('img');
    const r = el.getBoundingClientRect();
    const ir = img ? img.getBoundingClientRect() : null;
    return {
      text: el.innerText.trim(),
      h: r.height,
      imgSrc: img?.getAttribute('src'),
      imgVisible: ir ? (ir.width > 10 && ir.height > 10 && ir.top < window.innerHeight) : false,
      imgRect: ir ? { w: Math.round(ir.width), h: Math.round(ir.height) } : null,
      natural: img ? { nw: img.naturalWidth, nh: img.naturalHeight } : null,
      href: el.querySelector('a')?.href
    };
  });
  await page.screenshot({ path: 'g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY 2023-2026 - CASHIER GENERAL AFFAIR/EMMY/BDA/PROJECT 6/test-cta.png' });
  return res;
}
