const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new' });
  const p = await b.newPage();
  await p.goto('https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const blankFrame = p.frames().find(f => f.url().includes('/blank'));
  // Find the list of valid functions exposed by google.script.run
  const fns = await blankFrame.evaluate(() => {
    const out = [];
    try {
      // google.script.run is a proxy-ish object; check known names
      const known = ['getSheet', 'getColumns', 'testSubmitReview', 'testPublishedReviewsApi', 'doGet', 'doPost', 'getPhotoReviewPage', 'approveAndArchiveSelected', 'publishSelectedPhotos', 'hideSelectedPhotos', 'copyApprovedPhotos', 'syncExistingArchiveStatus', 'scanAllPhotographers', 'scanFromDashboard', 'testDriveAuthorization', 'testArchiveFileAccess', 'testFileSharingPermission', 'testTobaConnection', 'getOrCreateTobaFolder', 'scanPhotographerFolder'];
      for (const k of known) { try { if (typeof google.script.run[k] === 'function') out.push(k + ':ok'); else out.push(k + ':no'); } catch (e) { out.push(k + ':err'); } }
    } catch (e) { out.push('ERR ' + e.message); }
    return out;
  });
  console.log(fns.join('\n'));
  await b.close();
})();
