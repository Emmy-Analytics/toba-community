export default async function run(page, ui) {
  await page.goto('file:///g:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/gallery.html');
  await page.waitForTimeout(9000);
  return await page.evaluate(() => {
    const hl = document.querySelector('.hl-panel.active');
    return {
      items: document.querySelectorAll('.gallery-item').length,
      imgOK: Array.from(document.querySelectorAll('.gallery-item img')).every(i=>i.complete&&i.naturalWidth>0),
      count: (document.getElementById('galleryCount') || {}).textContent,
      hlPanels: document.querySelectorAll('.hl-panel').length,
      hlAccents: Array.from(document.querySelectorAll('.hl-panel')).map(p=>getComputedStyle(p).getPropertyValue('--panel-accent').trim()),
      accent: hl ? getComputedStyle(hl).getPropertyValue('--panel-accent').trim() : null,
      ctaText: document.querySelector('.gallery-cta')?.innerText,
      partnerLogos: Array.from(document.querySelectorAll('.pp-logos img')).map(i=>({src:i.getAttribute('src'), w:i.naturalWidth, h:i.naturalHeight})),
      oldInfoSection: !!document.querySelector('.info-editorial'),
      partnerCardText: document.querySelector('.photo-partner')?.innerText
    };
  });
}
