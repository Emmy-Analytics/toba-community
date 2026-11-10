const fs = require('fs');
let c = fs.readFileSync('style.css', 'utf8');

/* 1. drawer becomes a compact left panel */
c = c.replace(
  `.main-nav {\r\n    display: flex;\r\n    position: fixed;\r\n    inset: 0;\r\n    height: 100vh;\r\n    height: 100dvh;`,
  `.main-nav {\r\n    display: flex;\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    bottom: 0;\r\n    width: min(78vw, 340px);\r\n    height: 100vh;\r\n    height: 100dvh;`
);
c = c.replace(
  `    contain: paint;\r\n  }\r\n\r\n  .main-nav.open {`,
  `    contain: paint;\r\n    border-right: 1px solid var(--line);\r\n    box-shadow: 24px 0 48px rgba(20, 28, 22, .18);\r\n  }\r\n\r\n  .main-nav.open {`
);

/* 2. overlay: translucent scrim, sits BEHIND the panel (z 44 < 45) so the
   page remains visible to the right of the drawer */
c = c.replace(
  `.nav-backdrop {\r\n    position: fixed;\r\n    inset: 0;\r\n    background: rgba(20, 28, 22, .42);`,
  `.nav-backdrop {\r\n    position: fixed;\r\n    inset: 0;\r\n    background: rgba(20, 28, 22, .38);\r\n    backdrop-filter: blur(2px);\r\n    -webkit-backdrop-filter: blur(2px);`
);

/* 3. drawer paddings respect safe areas and stay compact */
c = c.replace(
  `.main-nav.open .drawer-head {\r\n    height: 64px;\r\n    padding: 0 4px;\r\n    margin-top: calc(10px + env(safe-area-inset-top, 0px));`,
  `.main-nav.open .drawer-head {\r\n    height: 64px;\r\n    padding: 0 4px;\r\n    margin-top: calc(10px + env(safe-area-inset-top, 0px));`
);

fs.writeFileSync('style.css', c);
console.log('left-panel drawer applied');
