const fs = require('fs');
let c = fs.readFileSync('style.css', 'utf8');

/* tablet: drawer max 360px between 601–1000px (media query breakpoint).
   The existing drawer rules live in @media(max-width:1000px); append a
   width refinement right after the drawer block. */
const anchor = `  .main-nav .mega[hidden] { display: table !important }`;
const tablet = `

  /* tablet 601-1000px: drawer stays proportional, capped at 360px — never
     fills the whole screen, the content remains visible beside it */
  .main-nav {
    width: min(78vw, 360px);
  }
`;
if (!c.includes(anchor)) { console.log('anchor missing'); process.exit(1); }
c = c.replace(anchor, anchor + tablet);
fs.writeFileSync('style.css', c);
console.log('tablet width refinement added');
