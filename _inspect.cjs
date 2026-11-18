const s = require('fs').readFileSync('script.js', 'utf8');
const i = s.indexOf('body.dataset.page;');
console.log(JSON.stringify(s.slice(i - 200, i + 400)));
