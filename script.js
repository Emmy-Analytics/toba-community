/* TOBA COMMUNITY — premium editorial content & interactions (bilingual via i18n.js)
   Preserved: events filtering, merchandise filtering + demo cart, partnership form,
   toasts, gallery API glue, language re-render, reveal system.
   Added: editorial page compositions, parallax engine, croc-eye interaction. */
const ASSET = 'assets/';
/* Local, curated cinematic basketball photography (assets/img, Unsplash license).
   Replacing remote hotlinks keeps pages fast and stable. */
const photos = {
  court: 'assets/img/court-wide.jpg',
  women: 'assets/img/court-floor.jpg',  /* placeholder until a licensed women's-game photo is added */
  men: 'assets/img/men-action.jpg',
  team: 'assets/img/game-bw.jpg',
  ball: 'assets/img/ball-close.jpg',
  arena: 'assets/img/arena-lights.jpg',
  hoop: 'assets/img/game-bw.jpg',
  floor: 'assets/img/court-floor.jpg'
};
const events = [
    { date: 'SAB', month: 'PEKANAN', year: '', title: 'TOBA Weekly Fun Game', type: 'Open Run', community: 'All Community', place: 'Brickhouse The East, Duren Sawit — Jakarta Timur', time: '18.00 – 20.00 WIB', img: photos.arena, memberOnly: true },
    { date: '06', month: 'DEC', year: '2026', title: 'Tobaladies Friendly Game', type: 'Friendly Game', community: 'Tobaladies', place: 'Venue akan dikonfirmasi', time: '15.00 – 17.00 WIB', img: photos.women },
    { date: '13', month: 'DEC', year: '2026', title: 'Tobadeli Sparring', type: 'Open Run', community: 'Tobadeli', place: 'Venue akan dikonfirmasi', time: '18.00 – 20.00 WIB', img: photos.men },
    { date: '18', month: 'JAN', year: '2027', title: 'TOBA 3x3 Day', type: 'Tournament', community: 'All Community', place: 'Venue akan dikonfirmasi', time: '08.00 – selesai', img: photos.court },
    { date: '24', month: 'JAN', year: '2027', title: 'Basketball Basics', type: 'Workshop', community: 'All Community', place: 'Venue akan dikonfirmasi', time: '10.00 – 12.00 WIB', img: photos.ball },
    { date: '07', month: 'FEB', year: '2027', title: 'Ladies Skill Session', type: 'Workshop', community: 'Tobaladies', place: 'Venue akan dikonfirmasi', time: '09.00 – 11.00 WIB', img: photos.team }
];
const products = [
    { name: 'Tobaladies Jersey', price: 299000, cat: 'Jersey', tone: 'pink' },
    { name: 'Tobadeli Jersey', price: 299000, cat: 'Jersey', tone: 'orange' },
    { name: 'TOBA Community Tee', price: 179000, cat: 'T-Shirt', tone: 'neutral' },
    { name: 'Tobaladies Tote Bag', price: 85000, cat: 'Accessories', tone: 'pink' },
    { name: 'TOBA Cap', price: 129000, cat: 'Accessories', tone: 'neutral' },
    { name: 'Court Crew Hoodie', price: 249000, cat: 'Limited Edition', tone: 'neutral' },
    { name: 'Croc Keychain', price: 49000, cat: 'Accessories', tone: 'pink' },
    { name: 'TOBA Water Bottle', price: 99000, cat: 'Accessories', tone: 'orange' }
];
const money = n => 'Rp ' + n.toLocaleString('id-ID');
const eventCard = e => `<article class="event-card" data-category="${e.type} ${e.community}"><img src="${e.img}" alt="${t('ui.illust.basket')} — ${e.title}" loading="lazy"><div class="date-badge">${e.date}<small>${e.month} ${e.year}</small></div><div class="pad"><span class="tag">${e.type}</span><h3>${e.title}</h3><p>${e.place}<br>${e.time}</p><div class="meta"><span>${e.community}</span></div><button class="pill event-interest" data-event="${e.title}">${t('ui.interest')}</button></div></article>`;
const productCard = (p, i) => `<article class="product-card" data-category="${p.cat}"><div class="product-art ${p.tone}"><span class="product-word">${p.name.split(' ').slice(-1)[0].toUpperCase()}</span></div><div class="pad"><div class="product-name">${p.name}</div><div class="price-row"><span class="price">${money(p.price)}</span><button class="add-cart" data-product="${i}" aria-label="${t('merch.aria')} ${p.name}">+</button></div></div></article>`;

/* ---------- HOME — cinematic scroll journey ---------- */
/* FIBA half-court markings, single coordinate system 0..1000 x 0..600.
   Hoop at (150,300), free-throw line x=250, three-point arc r=675 from hoop.
   All geometry derived from the hoop so lines never collide. */
const courtSVG = cls => `<svg class="hero-court ${cls || ''}" viewBox="0 0 1000 600" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice" data-parallax="0.045" data-pointer-depth="14">
  <rect x="20" y="20" width="960" height="560"/><line x1="500" y1="20" x2="500" y2="580"/>
  <circle cx="500" cy="300" r="90"/><line x1="500" y1="210" x2="500" y2="390"/>
  <rect x="20" y="230" width="230" height="140"/>
  <circle cx="250" cy="300" r="90"/>
  <path d="M20 155 A 265 265 0 0 1 20 445"/>
  <circle cx="150" cy="300" r="12"/>
</svg>`;

function home() {
    return `
<section class="hero hero-home kinetic">
  <div class="hero-atmosphere" aria-hidden="true" data-pointer-depth="7"></div>
  ${courtSVG()}
  <div class="hero-court-photo" aria-hidden="true"></div>
  <div class="hero-head"><p class="eyebrow">${t('hero.eyebrow')}</p>
    <h1 data-parallax="0.03" data-parallax-x="-0.015">${t('hero.h1a')}<br><span>${t('hero.h1b')}</span></h1></div>
  <div class="hero-visual">
    <div class="hero-ball" aria-hidden="true"></div>
    <img class="hero-mascot" src="assets/crocodile-head.png" alt="${t('ui.alt.mascot')}" data-parallax="0.06" data-parallax-rotate="-1.6" data-pointer-depth="24">
  </div>
  <div class="hero-body">
    <p class="hero-subtitle">${t('hero.sub')}</p>
    <div class="hero-actions"><a class="pill" href="partnership.html">${t('hero.cta1')}</a><a class="pill secondary" href="events.html">${t('hero.cta2')}</a><a class="text-link" href="game.html">${t('hero.cta3')}</a></div>
    <div class="hero-info"><div class="hero-info-item"><strong>${t('hero.info.game')}</strong><span>${t('hero.info.time')}</span></div><div class="hero-info-item"><strong>${t('hero.info.place')}</strong><span>${t('hero.info.comm')}</span></div></div>
  </div>
  <div class="scroll-cue"><span>${t('ui.scroll')}</span><span class="cue-line"></span></div></section>

<section class="section-wrap shortcuts"><div class="section-heading"><div><p class="eyebrow">${t('home.meet.eyebrow')}</p><h2>${t('home.meet.h')}</h2><p class="brand-note">${t('brand.note')}</p></div><p class="lede">${t('home.meet.lede')}</p></div>
  <div class="shortcut-grid">
    <a class="shortcut sc-ladies" href="tobaladies.html"><span class="shortcut-name">TOBALADIES</span><span class="shortcut-full">${t('hero.sc.ladies.k')}</span><span class="shortcut-desc">${t('hero.sc.ladies.d')}</span></a>
    <a class="shortcut sc-deli" href="tobadeli.html"><span class="shortcut-name">TOBADELI</span><span class="shortcut-full">${t('hero.sc.deli.k')}</span><span class="shortcut-desc">${t('hero.sc.deli.d')}</span></a>
    <a class="shortcut sc-court" href="game.html"><span class="shortcut-name">TOBA COURT</span><span class="shortcut-full">${t('game.subtitle')}</span><span class="shortcut-desc">${t('hero.sc.court.d')}</span></a>
  </div>
  <div class="feature-strip"><div class="feature"><strong>${t('home.f1')}</strong><span>${t('home.f1s')}</span></div><div class="feature"><strong>${t('home.f2')}</strong><span>${t('home.f2s')}</span></div><div class="feature"><strong>${t('home.f3')}</strong><span>${t('home.f3s')}</span></div><div class="feature"><strong>${t('home.f4')}</strong><span>${t('home.f4s')}</span></div></div></section>

<section class="dark-section"><div class="dark-section-inner"><div class="section-heading"><div><p class="eyebrow">${t('home.story.eyebrow')}</p><h2>${t('home.story.h')}</h2></div><p class="lede">${t('home.story.lede')}</p></div>
  <div class="two-col"><div class="photo-frame img-reveal" data-parallax="0.06"><img src="${photos.women}" alt="${t('ui.illust.women')}" loading="lazy"><span class="frame-caption accent-pink">TOBALADIES</span></div>
  <div class="photo-frame img-reveal" data-parallax="-0.05" style="margin-top:clamp(24px,4vw,56px)"><img src="${photos.men}" alt="${t('ui.illust.men')}" loading="lazy"><span class="frame-caption accent-orange">TOBADELI</span></div></div>
  <p style="margin-top:28px"><a class="text-link on-dark" href="gallery.html">${t('home.story.link')}</a></p></div></section>

<section class="section-wrap brand-story"><div class="section-heading"><div><p class="eyebrow">TOBA — TONGKRONGAN BASKET</p><h2>${t('brand.h')}</h2></div></div>
  <div class="brand-story-grid">
    <div><h3>TOBA</h3><p>${t('brand.p1')}</p></div>
    <div><h3 class="accent-pink">TOBALADIES</h3><p>${t('brand.p2')}</p></div>
    <div><h3 class="accent-orange">TOBADELI</h3><p>${t('brand.p3')}</p></div>
  </div></section>

<section class="section-wrap"><div class="section-heading"><div><p class="eyebrow">${t('home.events.eyebrow')}</p><h2>${t('home.events.h')}</h2></div><a class="text-link" href="events.html">${t('home.events.link')}</a></div><div class="event-grid">${events.slice(0, 3).map(eventCard).join('')}</div></section>

<section class="section-wrap"><div class="section-heading"><div><p class="eyebrow">${t('home.merch.eyebrow')}</p><h2>${t('home.merch.h')}</h2></div><a class="text-link" href="merchandise.html">${t('home.merch.link')}</a></div><div class="product-grid">${products.slice(0, 4).map(productCard).join('')}</div></section>

<section class="section-wrap"><div class="callout"><div><p class="eyebrow">${t('home.call.eyebrow')}</p><h3>${t('home.call.h')}</h3><p class="lede">${t('home.call.lede')}</p></div><a class="pill" href="partnership.html">${t('home.call.cta')}</a></div></section>`
}

/* ---------- COMMUNITY PAGES — distinct editorial rhythm ---------- */
function communityPage(which) {
    const women = which === 'tobaladies';
    const name = women ? 'TOBALADIES' : 'TOBADELI', tone = women ? 'pink' : 'orange';
    const sub = women ? t('comm.hero.lede1') : t('comm.hero.lede2'), desc = women ? t('comm.desc1') : t('comm.desc2');
    const img = women ? photos.women : photos.men;
    return `
<section class="hero section-wrap kinetic">
  <svg class="hero-court ${women ? 'court-pink' : 'court-orange'}" viewBox="0 0 1200 700" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice" data-parallax="0.05" data-pointer-depth="12">
    <!-- FIBA geometry, half-court emphasis: mascot side gets the key + arc -->
    <rect x="80" y="70" width="1040" height="560"/>
    <line x1="600" y1="70" x2="600" y2="630"/>
    <circle cx="600" cy="350" r="64"/>
    <path d="M80 246 h207 v208 h-207"/>
    <circle cx="287" cy="350" r="64"/>
    <path d="M287 286 a64 64 0 0 0 0 128"/>
    <path d="M80 575 L 190 575 A 241 241 0 0 0 190 125 L 80 125"/>
    <path d="M1120 246 h-207 v208 h207"/>
    <circle cx="913" cy="350" r="64"/>
    <path d="M913 286 a64 64 0 0 1 0 128"/>
    <path d="M1120 575 L 1010 575 A 241 241 0 0 1 1010 125 L 1120 125"/>
    <path d="M125 350 a45 45 0 0 1 90 0"/>
    <path d="M1075 350 a45 45 0 0 0 -90 0"/>
    <line x1="80" y1="290" x2="80" y2="410" stroke-width="4"/>
    <line x1="1120" y1="290" x2="1120" y2="410" stroke-width="4"/>
  </svg>
  <div class="hero-croc" data-parallax="-0.1" data-parallax-rotate="1.2" data-parallax-x="0.02"><img src="assets/crocodile-head.png" alt="${t('ui.alt.mascot')}"></div>
  <div class="hero-copy"><p class="eyebrow">${women ? 'TOBALADIES · BASKET PEREMPUAN JAKARTA TIMUR' : 'TOBADELI · BASKET PRIA JAKARTA TIMUR'}</p>
    <h1>${women ? '<span class="accent-pink">TOBA</span>LADIES' : '<span class="accent-orange">TOBA</span>DELI'}</h1>
    <p class="brand-fullname">${women ? t('brand.name.ladies') : t('brand.name.deli')}</p>
    <p class="hero-subtitle">${sub}. ${desc}</p>
    <div class="hero-actions"><a class="pill pill-${tone}" href="partnership.html">${t('comm.cta1')}</a><a class="pill secondary" href="events.html">${t('comm.cta2')}</a></div>
    <p class="eyebrow" style="color:var(--muted)">${t('comm.eyebrow2')}</p></div>
  <div class="scroll-cue"><span>${t('ui.scroll')}</span><span class="cue-line"></span></div></section>

<section class="section-wrap"><div class="two-col"><div class="photo-frame img-reveal" data-parallax="${women ? '0.07' : '-0.06'}"><img src="${img}" alt="${t('comm.illust')} ${name}" loading="lazy">${women ? '<img class="mascot mascot-wordmark" src="assets/logopinkpng.png" alt="Logo Tobaladies">' : ''}<span class="frame-caption accent-${tone}">${name}</span></div>
  <div style="align-self:end;padding-bottom:8px"><p class="eyebrow">${t('comm.about')}</p><h2>${t('comm.h')}</h2><p class="lede">${t('comm.lede')}</p>${women ? '' : `<p class="brand-note">${t('brand.deli.note')}</p>`}<a class="text-link" href="events.html">${t('comm.link')}</a></div></div></section>

<section class="dark-section"><div class="dark-section-inner">
  <div class="section-heading"><div><p class="eyebrow">NEXT UP</p><h2>COMMUNITY <span class="accent-${tone}">SCHEDULE.</span></h2></div><a class="text-link" href="events.html">${t('home.events.link')}</a></div>
  <div class="event-grid">${events.filter(e => e.community === (women ? 'Tobaladies' : 'Tobadeli') || e.community === 'All Community').slice(0, 3).map(eventCard).join('')}</div>
  <div class="feature-strip" style="border-color:rgba(237,233,222,.18);margin-top:clamp(40px,6vh,64px)"><div class="feature" style="border-color:rgba(237,233,222,.18)"><strong>${t('comm.f1')}</strong><span>${t('comm.f1s')}</span></div><div class="feature" style="border-color:rgba(237,233,222,.18)"><strong>${t('comm.f2')}</strong><span>${t('comm.f2s')}</span></div><div class="feature" style="border-color:rgba(237,233,222,.18)"><strong>${t('comm.f3')}</strong><span>${t('comm.f3s')}</span></div><div class="feature" style="border-color:rgba(237,233,222,.18)"><strong>${t('comm.f4')}</strong><span>${t('comm.f4s')}</span></div></div>
</div></section>

<section class="section-wrap"><div class="callout"><div><p class="eyebrow">${t('comm.join.eyebrow')}</p><h3>${t('comm.join.h')}</h3><p class="lede">${t('comm.pill.d')}</p></div><a class="pill" href="partnership.html">${t('comm.cta1')}</a></div></section>`
}

/* ---------- EVENTS — editorial timeline + preserved filters ---------- */
function eventsPage() {
    const labels = t('events.filters').split('|');
    return `
<section class="hero section-wrap" style="min-height:auto"><div class="hero-copy"><p class="eyebrow">${t('events.hero.eyebrow')}</p><h1>${t('events.hero.h')}</h1><p class="hero-subtitle">${t('events.hero.lede')}</p></div>
  <div class="page-hero" style="padding:0;grid-template-columns:1fr"><div class="photo-frame img-reveal" data-parallax="0.05"><img src="${photos.arena}" alt="${t('ui.illust.court')}"></div></div></section>
<section class="section-wrap"><div class="filters" id="eventFilters">${labels.map((x, i) => `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}</div>
  <div class="event-grid" id="eventGrid">${events.map(eventCard).join('')}</div>
  <div class="venue-note" style="margin-top:28px"><strong>${t('events.note.strong')}</strong> ${t('events.note')}<a class="venue-link" href="https://www.gelora.id/v/brickhouse" target="_blank" rel="noreferrer">Brickhouse The East, Duren Sawit</a>${t('events.note2')}</div></section>`
}

/* ---------- MERCH — product focus, preserved filters + cart ---------- */
function merchPage() {
    const labels = t('merch.filters').split('|');
    return `
<section class="hero section-wrap" style="min-height:auto"><div class="hero-copy"><p class="eyebrow">${t('home.merch.eyebrow')}</p><h1>TOBA<br><span class="accent-orange">MERCH.</span></h1><p class="hero-subtitle">${t('merch.hero.lede')}</p><p><span class="tag orange">${t('merch.tag')}</span></p></div></section>
<section class="section-wrap"><div class="filters" id="productFilters">${labels.map((x, i) => `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}<span style="margin-left:auto;font-size:12px;font-weight:700;align-self:center">${t('merch.bag')} <span id="cartCount">0</span></span></div>
  <div class="product-grid" id="productGrid">${products.map(productCard).join('')}</div>
  <div class="callout"><div><p class="eyebrow">${t('merch.call.eyebrow')}</p><h3>${t('merch.call.h')}</h3><p class="lede">${t('merch.call.lede')}</p></div><button class="pill" id="checkoutDemo">${t('merch.checkout')}</button></div></section>`
}

/* ---------- GALLERY — editorial, live API ---------- */
function galleryPage() {
    const labels = t('gallery.filters').split('|');
    return `
<section class="hero section-wrap" style="min-height:auto"><div class="hero-copy"><p class="eyebrow">${t('gallery.hero.eyebrow')}</p><h1>${t('gallery.hero.h')}</h1><p class="hero-subtitle">${t('gallery.hero.lede.live')}</p></div></section>
<section class="section-wrap wide"><div class="filters" id="galleryFilters">${labels.map((x, i) => `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}</div>
  <div id="galleryStatus"></div><div class="gallery-grid" id="galleryGrid"></div>
  <div class="venue-note" style="margin-top:35px">${t('gallery.hero.lede')}</div></section>`
}

/* ---------- PARTNERSHIP — professional & simple ---------- */
function partnershipPage() {
    return `
<section class="hero section-wrap" style="min-height:auto"><div class="hero-copy"><p class="eyebrow">${t('part.hero.eyebrow')}</p><h1>${t('part.hero.h')}</h1><p class="hero-subtitle">${t('part.hero.lede')}</p></div>
  <div class="page-hero" style="padding:0;grid-template-columns:1fr"><div class="photo-frame img-reveal" data-parallax="0.04"><img src="${photos.court}" alt="${t('ui.illust.court')}"></div></div></section>
<section class="section-wrap two-col"><div><p class="eyebrow">${t('part.ways')}</p><h2>${t('part.h')}</h2><div class="card-grid" style="grid-template-columns:1fr 1fr"><div class="info-card"><div class="pad"><h3>${t('part.c1')}</h3><p>${t('part.c1p')}</p></div></div><div class="info-card"><div class="pad"><h3>${t('part.c2')}</h3><p>${t('part.c2p')}</p></div></div><div class="info-card"><div class="pad"><h3>${t('part.c3')}</h3><p>${t('part.c3p')}</p></div></div><div class="info-card"><div class="pad"><h3>${t('part.c4')}</h3><p>${t('part.c4p')}</p></div></div></div></div>
<form class="form-card" id="partnerForm"><p class="eyebrow">${t('part.form.eyebrow')}</p><h3>${t('part.form.h')}</h3><div class="form-grid"><div class="field"><label for="name">${t('part.name')}</label><input id="name" name="name" required placeholder="${t('part.name.ph')}"></div><div class="field"><label for="org">${t('part.org')}</label><input id="org" name="org" placeholder="${t('part.org.ph')}"></div><div class="field"><label for="email">${t('part.contact')}</label><input id="email" name="email" required placeholder="${t('part.contact.ph')}"></div><div class="field"><label for="interest">${t('part.interest')}</label><select id="interest" name="interest"><option>${t('part.opt1')}</option><option>${t('part.opt2')}</option><option>${t('part.opt3')}</option><option>${t('part.opt4')}</option><option>${t('part.opt5')}</option></select></div><div class="field full"><label for="message">${t('part.message')}</label><textarea id="message" name="message" placeholder="${t('part.message.ph')}"></textarea></div><div class="field full"><button class="btn" type="submit">${t('part.send')}</button><small style="display:block;margin-top:10px;color:var(--muted)">${t('part.sent')}</small></div></div></form></section>`
}

const page = document.body.dataset.page; const appEl = document.getElementById('app');
const renderers = { home, tobaladies: () => communityPage('tobaladies'), tobadeli: () => communityPage('tobadeli'), events: eventsPage, merchandise: merchPage, gallery: galleryPage, partnership: partnershipPage };
if (page !== 'game') { appEl.innerHTML = (renderers[page] || home)(); }
document.querySelector(`[data-nav="${page}"]`)?.classList.add('active'); document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- nav ---------- */
/* ---------- nav: mega menu + mobile accordion ---------- */
(function () {
  const explore = document.getElementById('navExplore');
  const mega = document.getElementById('megaMenu');
  if (!explore || !mega) return;
  const header = explore.closest('.site-header');
  const mq = window.matchMedia('(max-width: 1000px)');

  function openMega() { mega.hidden = false; requestAnimationFrame(() => { mega.classList.add('open'); explore.setAttribute('aria-expanded', 'true'); header?.classList.add('menu-context') }) }
  function closeMega() { mega.classList.remove('open'); explore.setAttribute('aria-expanded', 'false'); header?.classList.remove('menu-context'); if (!mq.matches) setTimeout(() => { if (!mega.classList.contains('open')) mega.hidden = true }, 300); else mega.hidden = true; }

  explore.addEventListener('click', e => { e.stopPropagation(); mega.classList.contains('open') ? closeMega() : openMega() });
  mega.addEventListener('click', e => {
    const label = e.target.closest('.mega-label');
    if (!label || !mq.matches) return;
    e.preventDefault();
    /* accordion: only one group open at a time */
    const group = label.parentElement;
    const wasOpen = group.classList.contains('open');
    mega.querySelectorAll('.mega-group.open').forEach(g => g.classList.remove('open'));
    if (!wasOpen) group.classList.add('open');
  });
  mega.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', () => { closeMega(); closeNav(); }));
  document.addEventListener('click', e => { if (mega.classList.contains('open') && !e.target.closest('.main-nav') && !e.target.closest('#navExplore')) closeMega() });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mega.classList.contains('open')) { closeMega(); explore.focus() } });
  window.addEventListener('resize', () => { if (mq.matches) { closeMega() } else { mega.hidden = false } });
})();

const menuToggle = document.getElementById('menuToggle'), nav = document.getElementById('mainNav');
const backdrop = document.createElement('div');
backdrop.className = 'nav-backdrop';
document.body.appendChild(backdrop);
function closeNav() {
  nav.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  backdrop.classList.remove('show');
  document.documentElement.style.overflow = '';
  /* reset accordion state so no group stays open for the next visit */
  nav.querySelectorAll('.mega-group.open').forEach(g => g.classList.remove('open'));
}
window.closeNav = closeNav;
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  document.documentElement.style.overflow = open ? 'hidden' : '';
  backdrop.classList.toggle('show', open);
  /* mobile drawer needs the mega markup visible inside the drawer */
  const megaMenu = document.getElementById('megaMenu');
  if (open && megaMenu && window.innerWidth <= 1000) megaMenu.hidden = false;
  /* the Join CTA is static markup inside the drawer — no cloning needed */
  requestAnimationFrame(() => open ? nav.querySelector('.drawer-close')?.focus() : menuToggle.focus());
});
/* backdrop click closes */
backdrop.addEventListener('click', () => closeNav());
nav.querySelector('.drawer-close')?.addEventListener('click', () => closeNav());
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
/* Escape also closes the drawer */
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) closeNav() });

/* ---------- toast ---------- */
let toastTimer; function toast(msg) { const el = document.getElementById('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600) }

/* ---------- filters (preserved behavior) ---------- */
function setFilter(container, selector, filter) { container.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b.dataset.filter === filter)); document.querySelectorAll(selector).forEach(card => { const category = card.dataset.category || ''; card.style.display = (filter === 'All' || filter === 'All Events' || category === filter || category.includes(filter) || card.textContent.includes(filter)) ? '' : 'none' }); }
document.getElementById('eventFilters')?.addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (!b) return; setFilter(document.getElementById('eventFilters'), '.event-card', b.dataset.filter); if (b.dataset.filter === 'All Events') document.querySelectorAll('.event-card').forEach(c => c.style.display = '') });
document.getElementById('productFilters')?.addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (!b) return; setFilter(document.getElementById('productFilters'), '.product-card', b.dataset.filter === 'All' ? 'All' : b.dataset.filter) });

/* ---------- demo cart (preserved) ---------- */
let cart = []; document.addEventListener('click', e => { const add = e.target.closest('[data-product]'); if (add) { const p = products[Number(add.dataset.product)]; cart.push(p); document.getElementById('cartCount').textContent = cart.length; toast(`${p.name} ${t('merch.added')}`) } const interest = e.target.closest('.event-interest'); if (interest) toast(`${t('ui.demo')} ${interest.dataset.event}. ${t('ui.demo2')}`) });
document.getElementById('checkoutDemo')?.addEventListener('click', () => { if (!cart.length) { toast(t('merch.empty')); return } const total = cart.reduce((s, p) => s + p.price, 0); toast(`${t('merch.summary')} ${cart.length} ${t('merch.items')} ${money(total)}. ${t('merch.nocheckout')}`) });
document.getElementById('partnerForm')?.addEventListener('submit', e => { e.preventDefault(); toast(t('part.sent')); e.target.reset() });
document.getElementById('backTop').addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) });

/* ---------- live gallery: fetch after render (preserved) ---------- */
if (page === 'gallery') { loadGallery(); }

/* ---------- language re-render (preserved) ---------- */
document.addEventListener('toba:langchange', () => { if (page === 'game') return; appEl.innerHTML = (renderers[page] || home)(); document.querySelector(`[data-nav="${page}"]`)?.classList.add('active'); if (page === 'gallery') { galleryState === 'ok' ? renderGalleryUI() : loadGallery(); } initReveal(); initParallax(); initKinetic(); initPointerScene(); initMerchTilt(); });

/* ---------- reveal system (preserved + clip reveal for images) ---------- */
const revealObserver = ('IntersectionObserver' in window) ? new IntersectionObserver(es => { es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target) } }) }, { threshold: .12 }) : null;
function initReveal() {
    const els = document.querySelectorAll('.section-wrap,.event-card,.product-card,.community-card,.photo-frame,.dark-section');
    els.forEach((el, i) => {
        if (!revealObserver) { el.classList.add('in'); return }
        el.classList.add(el.classList.contains('photo-frame') ? 'img-reveal' : 'reveal');
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
        else { el.style.transitionDelay = (Math.min(i % 6, 5) * 60) + 'ms'; revealObserver.observe(el) }
    })
    /* re-check after images/layout settle so late-shifted elements also reveal */
    setTimeout(() => {
        document.querySelectorAll('.img-reveal:not(.in),.reveal:not(.in)').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
        });
    }, 1200);
    setTimeout(() => {
        document.querySelectorAll('.img-reveal:not(.in),.reveal:not(.in)').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
        });
    }, 3500);
}
initReveal();

/* ---------- advanced parallax engine (multi-axis, transform-only, no scroll lock) ----------
   data-parallax        vertical speed (e.g. 0.08 = moves 8% of viewport offset)
   data-parallax-x      horizontal drift speed
   data-parallax-rotate slow rotation (degrees per viewport of progress)
   data-parallax-scale  subtle scale change at viewport edges
   Touch devices get half intensity; prefers-reduced-motion disables everything. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const softTouch = window.matchMedia('(pointer: coarse)').matches ? 0.5 : 1;
let pxEls = [], pTick = false;
function initParallax() {
    pxEls = [...document.querySelectorAll('[data-parallax]')].map(el => ({
        el,
        sp: (parseFloat(el.dataset.parallax) || 0) * softTouch,
        sx: (parseFloat(el.dataset.parallaxX) || 0) * softTouch,
        rot: (parseFloat(el.dataset.parallaxRotate) || 0) * softTouch,
        sc: (parseFloat(el.dataset.parallaxScale) || 0) * softTouch
    }));
    if (reduceMotion || !pxEls.length) return;
    updateParallax();
}
function updateParallax() {
    if (!pxEls.length) return;
    const vh = window.innerHeight;
    pxEls.forEach(p => {
        const r = p.el.getBoundingClientRect();
        if (r.bottom < -260 || r.top > vh + 260) return;
        const progress = (r.top + r.height / 2 - vh / 2) / vh;
        let tf = `translate3d(${(progress * p.sx * 100).toFixed(2)}px, ${(progress * p.sp * 100).toFixed(2)}px, 0)`;
        if (p.rot) tf += ` rotate(${(progress * p.rot).toFixed(2)}deg)`;
        if (p.sc) tf += ` scale(${(1 + p.sc * Math.min(1, Math.abs(progress))).toFixed(4)})`;
        p.el.style.transform = tf;
    });
    pTick = false;
}
window.addEventListener('scroll', () => { if (!pTick && !reduceMotion) { pTick = true; requestAnimationFrame(updateParallax) } }, { passive: true });
window.addEventListener('resize', () => { if (!pTick && !reduceMotion) { pTick = true; requestAnimationFrame(updateParallax) } }, { passive: true });
initParallax();

/* ---------- kinetic typography: per-line reveal (scoped by .kinetic parent) ----------
   Splits only the hero H1s into masked lines — headings stay semantic (H1/H2). */
function initKinetic() {
    if (reduceMotion) return;
    document.querySelectorAll('.kinetic h1, .kinetic .hero-subtitle').forEach(node => {
        if (node.dataset.kineticDone) return;
        node.dataset.kineticDone = '1';
        const lines = node.innerHTML.split(/<br\s*\/?>(?:\s*)/i);
        node.innerHTML = lines.map((l, i) =>
            `<span class="kline" style="animation-delay:${0.12 + i * 0.14}s"><span class="kline-inner">${l}</span></span>`).join('');
        node.classList.add('kinetic-ready');
    });
}

/* ---------- pointer parallax for atmosphere + court geometry (fine pointers only) ---------- */
function initPointerScene() {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const scene = document.querySelector('.hero-home');
    if (!scene || scene.dataset.pointerScene) return;
    scene.dataset.pointerScene = '1';
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    const loop = () => {
        cx += (tx - cx) * .05; cy += (ty - cy) * .05;
        scene.querySelectorAll('[data-pointer-depth]').forEach(layer => {
            const d = parseFloat(layer.dataset.pointerDepth) || 0;
            layer.style.translate = `${(cx * d).toFixed(2)}px ${(cy * d).toFixed(2)}px`;
        });
        if (Math.abs(tx - cx) > .05 || Math.abs(ty - cy) > .05) raf = requestAnimationFrame(loop); else raf = null;
    };
    scene.addEventListener('mousemove', e => {
        tx = (e.clientX / window.innerWidth - .5) * 2;
        ty = (e.clientY / window.innerHeight - .5) * 2;
        if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
}

/* ---------- crocodile-eye cursor interaction (hero, pointer devices only) ---------- */
if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    const croc = document.querySelector('.hero-croc img');
    if (croc) {
        let cx = 0, cy = 0, tx = 0, ty = 0, raf = null;
        const loop = () => { cx += (tx - cx) * .06; cy += (ty - cy) * .06; croc.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`; if (Math.abs(tx - cx) > .1 || Math.abs(ty - cy) > .1) raf = requestAnimationFrame(loop); else raf = null };
        document.addEventListener('mousemove', e => {
            const nx = e.clientX / window.innerWidth - .5, ny = e.clientY / window.innerHeight - .5;
            tx = nx * 18; ty = ny * 12;
            if (!raf) raf = requestAnimationFrame(loop);
        }, { passive: true });
    }
}

/* first paint: run after all definitions (no TDZ issues) */
initKinetic();
initPointerScene();

/* ---------- merch tilt + event stagger (re-runnable) ---------- */
function initMerchTilt() {
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        document.body.classList.add('tilt-on');
        document.querySelectorAll('.product-card').forEach(card => {
            if (card.dataset.tiltBound) return;
            card.dataset.tiltBound = '1';
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
                card.style.transform = `perspective(700px) rotateY(${(nx * 7).toFixed(2)}deg) rotateX(${(-ny * 7).toFixed(2)}deg) translateY(-4px)`;
            }, { passive: true });
            card.addEventListener('mouseleave', () => { card.style.transform = '' });
        });
    }
    document.querySelectorAll('.event-grid').forEach(grid => {
        [...grid.children].forEach((card, i) => card.style.transitionDelay = (Math.min(i, 5) * 90) + 'ms');
    });
}
initMerchTilt();


/* ---------- home hero entrance: staged reveal after the welcome intro ----------
   The river + copy fade in as one choreographed moment; if the intro is skipped
   or reduced-motion is on, the hero settles immediately. */
(function () {
  if (document.body.dataset.page !== 'home') return;
  const hero = document.querySelector('.hero-home');
  if (!hero) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const settle = () => requestAnimationFrame(() => hero.classList.add('in'));
  if (reduce || !document.getElementById('tobaIntro')) settle();
  else document.addEventListener('toba:introdone', settle, { once: true });
})();
