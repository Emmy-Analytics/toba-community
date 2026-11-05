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
function home() {
    return `
<section class="hero hero-home section-wrap">
  <div class="hero-atmosphere" aria-hidden="true"></div>
  <div class="hero-head"><p class="eyebrow">${t('hero.eyebrow')}</p>
    <h1>${t('hero.h1a')}<br><span>${t('hero.h1b')}</span></h1></div>
  <div class="hero-visual">
    <img class="hero-mascot" src="assets/crocodile-head-trans.png" alt="${t('ui.alt.mascot')}">
  </div>
  <div class="hero-body">
    <p class="hero-subtitle">${t('hero.sub')}</p>
    <div class="hero-actions"><a class="pill" href="tobaladies.html">${t('hero.cta1')}</a><a class="pill pill-orange" href="tobadeli.html">${t('hero.cta2')}</a><a class="text-link" href="game.html">${t('hero.cta3')}</a></div>
    <div class="hero-stats"><div class="stat"><strong>02</strong><span>${t('hero.s1')}</span></div><div class="stat"><strong>WEEKLY</strong><span>${t('hero.s2')}</span></div><div class="stat"><strong>02</strong><span>${t('hero.s3')}</span></div></div>
  </div>
  <div class="scroll-cue"><span>${t('ui.scroll')}</span><span class="cue-line"></span></div></section>

<section class="section-wrap"><div class="section-heading"><div><p class="eyebrow">${t('home.meet.eyebrow')}</p><h2>${t('home.meet.h')}</h2></div><p class="lede">${t('home.meet.lede')}</p></div>
  <div class="community-grid">
    <article class="community-card card-ladies" data-parallax="0.05" style="--card-image:url('${photos.women}')"><div class="card-copy"><span class="tag tag-pink">${t('home.card1.tag')}</span><h3 class="accent-pink">TOBALADIES</h3><p>${t('home.card1.sub')}</p><a class="btn btn-pink" href="tobaladies.html">${t('home.card1.cta')}</a></div></article>
    <article class="community-card men card-deli" data-parallax="0.09" style="--card-image:url('${photos.men}');margin-top:clamp(24px,4vw,64px)"><div class="card-copy"><span class="tag tag-orange">${t('home.card2.tag')}</span><h3 class="accent-orange">TOBADELI</h3><p>${t('home.card2.sub')}</p><a class="btn" href="tobadeli.html">${t('home.card2.cta')}</a></div></article>
  </div>
  <div class="feature-strip"><div class="feature"><strong>${t('home.f1')}</strong><span>${t('home.f1s')}</span></div><div class="feature"><strong>${t('home.f2')}</strong><span>${t('home.f2s')}</span></div><div class="feature"><strong>${t('home.f3')}</strong><span>${t('home.f3s')}</span></div><div class="feature"><strong>${t('home.f4')}</strong><span>${t('home.f4s')}</span></div></div></section>

<section class="dark-section"><div class="dark-section-inner"><div class="section-heading"><div><p class="eyebrow">${t('home.story.eyebrow')}</p><h2>${t('home.story.h')}</h2></div><p class="lede">${t('home.story.lede')}</p></div>
  <div class="two-col"><div class="photo-frame img-reveal" data-parallax="0.06"><img src="${photos.women}" alt="${t('ui.illust.women')}" loading="lazy"><span class="frame-caption accent-pink">TOBALADIES</span></div>
  <div class="photo-frame img-reveal" data-parallax="-0.05" style="margin-top:clamp(24px,4vw,56px)"><img src="${photos.men}" alt="${t('ui.illust.men')}" loading="lazy"><span class="frame-caption accent-orange">TOBADELI</span></div></div>
  <p style="margin-top:28px"><a class="text-link on-dark" href="gallery.html">${t('home.story.link')}</a></p></div></section>

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
<section class="hero section-wrap"><div class="hero-croc" data-parallax="-0.1"><img src="assets/crocodile-head-trans.png" alt="${t('ui.alt.mascot')}"></div>
  <div class="hero-copy"><p class="eyebrow">${women ? 'TOBALADIES · BASKET PUTRI JAKARTA' : 'TOBADELI · BASKET PUTRA JAKARTA'}</p>
    <h1>${women ? '<span class="accent-pink">TOBA</span>LADIES' : '<span class="accent-orange">TOBA</span>DELI'}</h1>
    <p class="hero-subtitle">${sub}. ${desc}</p>
    <div class="hero-actions"><a class="pill pill-${tone}" href="partnership.html">${t('comm.cta1')}</a><a class="pill secondary" href="events.html">${t('comm.cta2')}</a></div>
    <p class="eyebrow" style="color:var(--muted)">${t('comm.eyebrow2')}</p></div>
  <div class="scroll-cue"><span>${t('ui.scroll')}</span><span class="cue-line"></span></div></section>

<section class="section-wrap"><div class="two-col"><div class="photo-frame img-reveal" data-parallax="${women ? '0.07' : '-0.06'}"><img src="${img}" alt="${t('comm.illust')} ${name}" loading="lazy">${women ? '<img class="mascot mascot-wordmark" src="assets/logopinkpng.png" alt="Logo Tobaladies">' : ''}<span class="frame-caption accent-${tone}">${name}</span></div>
  <div style="align-self:end;padding-bottom:8px"><p class="eyebrow">${t('comm.about')}</p><h2>${t('comm.h')}</h2><p class="lede">${t('comm.lede')}</p><a class="text-link" href="events.html">${t('comm.link')}</a></div></div></section>

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

const page = document.body.dataset.page; const app = document.getElementById('app');
const renderers = { home, tobaladies: () => communityPage('tobaladies'), tobadeli: () => communityPage('tobadeli'), events: eventsPage, merchandise: merchPage, gallery: galleryPage, partnership: partnershipPage };
if (page !== 'game') { app.innerHTML = (renderers[page] || home)(); }
document.querySelector(`[data-nav="${page}"]`)?.classList.add('active'); document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- nav ---------- */
const menuToggle = document.getElementById('menuToggle'), nav = document.getElementById('mainNav');
function closeNav() { nav.classList.remove('open'); menuToggle.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); document.documentElement.style.overflow = ''; }
menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuToggle.classList.toggle('open', open); menuToggle.setAttribute('aria-expanded', String(open)); document.documentElement.style.overflow = open ? 'hidden' : ''; });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

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
document.addEventListener('toba:langchange', () => { if (page === 'game') return; app.innerHTML = (renderers[page] || home)(); document.querySelector(`[data-nav="${page}"]`)?.classList.add('active'); if (page === 'gallery') { galleryState === 'ok' ? renderGalleryUI() : loadGallery(); } initReveal(); initParallax(); });

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

/* ---------- parallax engine (rAF, transform-only, no scroll lock) ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let pxEls = [], pTick = false;
function initParallax() {
    pxEls = [...document.querySelectorAll('[data-parallax]')];
    if (reduceMotion || !pxEls.length) return;
    updateParallax();
}
function updateParallax() {
    if (!pxEls.length) return;
    const vh = window.innerHeight;
    pxEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const speed = parseFloat(el.dataset.parallax) || 0;
        const progress = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0, ${(progress * speed * 100).toFixed(2)}px, 0)`;
    });
    pTick = false;
}
window.addEventListener('scroll', () => { if (!pTick && !reduceMotion) { pTick = true; requestAnimationFrame(updateParallax) } }, { passive: true });
window.addEventListener('resize', () => { if (!pTick && !reduceMotion) { pTick = true; requestAnimationFrame(updateParallax) } }, { passive: true });
initParallax();

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
