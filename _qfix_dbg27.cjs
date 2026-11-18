/* Debug 27 — headless Chrome default viewport? Confirm responsive media state via matchMedia in page */
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852 });
  await page.goto('file:///G:/Users/HCI_PC_PRODUKSI_02/Documents/EMMY%202023-2026%20-%20CASHIER%20GENERAL%20AFFAIR/EMMY/BDA/PROJECT%206/index.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const d = await page.evaluate(() => ({
    mq760: matchMedia('(max-width: 760px)').matches,
    mq1001: matchMedia('(min-width: 1001px)').matches,
    mq761: matchMedia('(min-width: 761px)').matches,
    mq900: matchMedia('(max-width: 900px)').matches,
    innerW: innerWidth,
    visualVp: visualViewport.width
  }));
  console.log(JSON.stringify(d, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
