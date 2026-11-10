const fs = require('fs');
let c = fs.readFileSync('shot-challenge.js', 'utf8');
c = c.replace(
  "if (power < 120) { draw(); return }",
  'console.log("SHOT debug power:", Math.round(power), "state:", state, "ballPos:", Math.round(ball.x), Math.round(ball.y));\n      if (power < 120) { draw(); return }'
);
fs.writeFileSync('shot-challenge.js', c);
console.log('instrumented ok');
