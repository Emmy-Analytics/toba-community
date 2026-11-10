const fs = require('fs');
let c = fs.readFileSync('shot-challenge.js', 'utf8');
c = c.replace(
  "if (raf) cancelAnimationFrame(raf);\n    let last = performance.now();",
  'if (raf) cancelAnimationFrame(raf);\n    let last = performance.now();\n    let dbgN = 0;'
);
c = c.replace(
  "      draw();\n      if (ball.y > H + 60",
  '      if (dbgN++ % 6 === 0) console.log("FLY x", Math.round(ball.x), "y", Math.round(ball.y), "vx", Math.round(ball.vx), "vy", Math.round(ball.vy));\n      draw();\n      if (ball.y > H + 60'
);
fs.writeFileSync('shot-challenge.js', c);
console.log('fly instrumented ok');
