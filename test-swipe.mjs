export default async function run(page, ui) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('file:///g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/gallery.html');
  await page.waitForTimeout(8000);
  const r = await page.evaluate(() => {
    const c = document.getElementById('hlCarousel');
    // tap deli (idx1)
    c.querySelector('.hl-panel[data-idx="1"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const t0 = { active: document.querySelector('.hl-panel.active')?.dataset.idx };
    const r0 = c.getBoundingClientRect();
    const y = r0.top + r0.height / 2, x0 = r0.left + r0.width / 2;
    const t = (x) => new Touch({ identifier: 1, target: c, clientX: x, clientY: y, radiusX: 2, radiusY: 2, rotationAngle: 0, force: 1 });
    const swipe = (dx) => {
      c.dispatchEvent(new TouchEvent('touchstart', { touches: [t(x0)], bubbles: true, cancelable: true }));
      for (let i = 1; i <= 8; i++) c.dispatchEvent(new TouchEvent('touchmove', { touches: [t(x0 + dx * i / 8)], bubbles: true, cancelable: true }));
      c.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [t(x0 + dx)], bubbles: true, cancelable: true }));
    };
    swipe(-120); // left → next (events idx3)
    const t1 = { active: document.querySelector('.hl-panel.active')?.dataset.idx };
    swipe(-120); // left again → wrap to ladies (idx2)
    const t2 = { active: document.querySelector('.hl-panel.active')?.dataset.idx, n: document.querySelectorAll('.hl-panel.active').length };
    swipe(120); // right → back to events (idx3)
    const t3 = { active: document.querySelector('.hl-panel.active')?.dataset.idx };
    swipe(-20); // small drag → stays
    const t4 = { active: document.querySelector('.hl-panel.active')?.dataset.idx };
    const accent = getComputedStyle(document.querySelector('.gallery-hero-title .gh-accent')).color;
    const trackT = getComputedStyle(c.querySelector('.hl-track')).transform;
    return { t0, t1, t2, t3, t4, accent, trackT };
  });
  return r;
}
