const fs = require('fs');
let s = fs.readFileSync('shot-challenge.js', 'utf8');
s = s.replace('console.log("FLY x"',
    '(window.__shotLog=window.__shotLog||[]).push("FLY "+Math.round(ball.x)+","+Math.round(ball.y));console.log("FLY x"');
s = s.replace('console.log("SHOT debug power:"',
    '(window.__shotLog=window.__shotLog||[]).push("PWR "+Math.round(power)+" drag "+Math.round(drag.sx-drag.cx)+","+Math.round(drag.sy-drag.cy));console.log("SHOT debug power:"');
fs.writeFileSync('shot-challenge.js', s);
console.log('log-array instrumented');
