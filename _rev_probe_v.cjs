   /* doPost: e.parameter ALWAYS available for urlencoded POST to Apps Script... unless deployment access is set wrong. The blanket failure regardless of payload suggests doPost might require a token (e.g., parameter 'token' or 'key') and returns that same message for any invalid submit. Since testSubmitReview exists as a server function, frontend may be expected to call via JSONP GET like reviews... but GET submitReview returns the admin HTML app (doGet falls through). Wait — doGet probably routes api=reviews and api=hero/gallery; POST routing maybe expects parameter 'type'? Try 'type=review' variants already... 

One more idea: the doPost might read e.postData.contents with URLSearchParams? Or expects 'nova-reviews-web' secret? Check response for a hint: send empty POST */
const URL = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
(async () => {
  let r = await fetch(URL, { method: 'POST', body: '', redirect: 'follow' });
  console.log('empty ->', (await r.text()).slice(0, 200));
  r = await fetch(URL, { method: 'POST', body: 'a=1', redirect: 'follow' });
  console.log('a=1 ->', (await r.text()).slice(0, 200));
  // maybe success shape appears when we include ALL its checks incl honeypot field
  r = await fetch(URL, { method: 'POST', body: 'api=submitReview&name=QA-H&group=Tobaladies&rating=5&reviewText=Tes&consent=true&website=&honeypot=&_gamma=1', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, redirect: 'follow' });
  console.log('honey ->', (await r.text()).slice(0, 200));
})();
