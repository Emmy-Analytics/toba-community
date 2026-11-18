/* Hypothesis: doPost validates via e.postData && JSON.parse(contents) && checks EXACT keys maybe: 'name','group','rating','review','consent'? Or requires 'reviewId'? OR the doPost routes only 'api' values it knows and submit uses different name. Let's dump behavior differences: send garbage api and see message */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  for (const api of ['zzz', '', 'submitReview', 'reviews']) {
    const r = await fetch(URL, { method: 'POST', body: 'api=' + api + '&name=x', redirect: 'follow' });
    console.log('api=[' + api + '] ->', (await r.text()).slice(0, 150));
  }
  // Also try doPost through GET-style JSONP with submitReview + POST-like query — we saw HTML. Extract error text from one:
  const r = await fetch(URL + '?api=submitReview&callback=cb', { redirect: 'follow' });
  const t = await r.text();
  const m = t.match(/<div style="text-align:center[^>]*>([\s\S]{0,200})/);
  console.log('GET submitReview page msg:', m ? m[1].replace(/<[^>]+>/g, '') : t.slice(0, 0) || '(none)');
})();
