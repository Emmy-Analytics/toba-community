export default async function run(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:8377/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  const res = await page.evaluate(async () => {
    document.getElementById('joinCtaBtn')?.click();
    await new Promise(r => setTimeout(r, 300));
    const f = document.querySelector('#joinModal form');
    f.querySelector('[name=nama]').value = 'Test User';
    f.querySelector('[name=phone]').value = '081212345678';
    f.querySelector('[name=ig]').value = '@test';
    f.querySelector('[name=domisili]').value = 'Jakarta Timur';
    f.querySelector('[name=team][value=Tobaladies]').checked = true;
    // Build expected url same way script does
    const msgTpl = 'Halo admin TOBA Community! Saya ingin bergabung atau meminta informasi mengenai komunitas TOBA.\n\nBerikut data saya:\n\nNama: {nama}\nNo. Telp/WA: {phone}\nInstagram: {ig}\nDomisili: {domisili}\nPilihan komunitas: {team}\n\nMohon informasi mengenai cara bergabung, jadwal bermain, dan kegiatan komunitas.\n\nTerima kasih!';
    const msg = msgTpl.replace('{nama}', 'Test User').replace('{phone}', '081212345678').replace('{ig}', '@test').replace('{domisili}', 'Jakarta Timur').replace('{team}', 'Tobaladies');
    return { expectedUrl: 'https://wa.me/6281285704946?text=' + encodeURIComponent(msg) };
  });
  const ctx = page.context();
  const modal = page.locator('#joinModal form');
  // Stub window.open BEFORE submit to capture
  await page.evaluate(() => {
    window.__captured = null;
    const ow = window.open;
    window.open = (u) => { window.__captured = u; return { focus() { }, close() { } }; };
    document.querySelector('#joinModal form').dispatchEvent(new Event('submit', { cancelable: true }));
  });
  await page.waitForTimeout(500);
  const got = await page.evaluate(() => ({ captured: window.__captured, modalClosed: document.getElementById('joinModal').hidden, errHidden: document.getElementById('joinErr').hidden }));
  return { expectedUrlStart: res.expectedUrl.slice(0, 120), got };
}
