const fs = require('fs');
let s = fs.readFileSync('_qa-shot3.mjs', 'utf8');
s = s.replace(
  "    return {\n      dScore:",
  "    const trace = [];\n    for (let i = 0; i < 50; i++) { trace.push(window.__ballState + ':' + JSON.stringify(window.__ballPos)); await new Promise(res => setTimeout(res, 80)); if (window.__ballState === 'ready') break; }\n    return {\n      trace: trace.slice(0, 14),\n      dScore:"
);
fs.writeFileSync('_qa-shot3.mjs', s);
console.log('trace in result');
