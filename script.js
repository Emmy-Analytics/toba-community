/* TOBA COMMUNITY — premium editorial content & interactions (bilingual via i18n.js)
   Preserved: events filtering, merchandise filtering + demo cart, partnership form,
   toasts, gallery API glue, language re-render, reveal system.
   Added: editorial page compositions, parallax engine, croc-eye interaction. */
const ASSET = 'assets/';
/* Local, curated cinematic basketball photography (assets/img, Unsplash license).
   Replacing remote hotlinks keeps pages fast and stable. */
const IMG = 'assets/img/web/';
const photos = {
  /* real TOBA documentation (web-optimized derivatives in assets/img/web; originals untouched) */
  court: 'assets/img/court-wide.jpg',
  women: IMG + 'toba-052.jpg',      /* Tobaladies game */
  women2: IMG + 'toba-053.jpg',     /* Tobaladies session */
  women3: IMG + 'toba-017.jpg',     /* Biru vs Pink game */
  men: IMG + 'toba-019.jpg',        /* GameTime action */
  men2: IMG + 'toba-023.jpg',       /* Pink vs Merah */
  team: IMG + 'toba-045.jpg',       /* Misc group */
  ball: 'assets/img/ball-close.jpg',
  arena: IMG + 'toba-015.jpg',      /* @abandmotret wide shot */
  hoop: IMG + 'toba-047.jpg',       /* SHOWTIME moment */
  floor: 'assets/img/court-floor.jpg',
  training: IMG + 'toba-008.jpg',   /* @abandmotret practice */
  founder: IMG + 'founder-cut.png',
  deli: IMG + 'toba-060.jpg',       /* deli-hero portrait */
  game2: IMG + 'toba-026.jpg',      /* Pink vs Hitam */
  ladies3: IMG + 'toba-056.jpg'     /* Tobaladies Game 05 */
};
const events = [
    { date: 'SAB', month: 'weekly', year: '', title: 'TOBA Weekly Fun Game', type: 'Open Run', community: 'All Community', place: 'Brickhouse The East, Duren Sawit — Jakarta Timur', time: '18.00 – 20.00 WIB', img: photos.arena, memberOnly: true },
    { date: '06', month: 'DEC', year: '2026', title: 'Tobaladies Friendly Game', type: 'Friendly Game', community: 'Tobaladies', place: 'tbc', time: '15.00 – 17.00 WIB', img: photos.women },
    { date: '13', month: 'DEC', year: '2026', title: 'Tobadeli Sparring', type: 'Open Run', community: 'Tobadeli', place: 'tbc', time: '18.00 – 20.00 WIB', img: photos.men },
    { date: '18', month: 'JAN', year: '2027', title: 'TOBA 3x3 Day', type: 'Tournament', community: 'All Community', place: 'tbc', time: '08.00 – selesai', img: photos.court },
    { date: '24', month: 'JAN', year: '2027', title: 'Basketball Basics', type: 'Workshop', community: 'All Community', place: 'tbc', time: '10.00 – 12.00 WIB', img: photos.ball },
    { date: '07', month: 'FEB', year: '2027', title: 'Ladies Skill Session', type: 'Workshop', community: 'Tobaladies', place: 'tbc', time: '09.00 – 11.00 WIB', img: photos.team }
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
const eventCard = e => { const place = e.place === 'tbc' ? t('events.venue.tbc') : e.place; const month = e.month === 'weekly' ? t('events.weekly') : e.month;
    return `<article class="event-card" data-category="${e.type} ${e.community}"><img src="${e.img}" alt="${t('ui.illust.basket')} — ${e.title}" loading="lazy"><div class="date-badge">${e.date}<small>${month} ${e.year}</small></div><div class="pad"><span class="tag">${e.type}</span><h3>${e.title}</h3><p>${place}<br>${e.time}</p><div class="meta"><span>${e.community}</span></div><button class="pill event-interest" data-event="${e.title}">${t('ui.interest')}</button></div></article>`; };
const eventScroller = cards => `<div class="event-scroll-wrap"><div class="event-grid events-scroll">${cards}</div></div>`;

/* editorial facts block under the gallery — replaces flat info columns */
const infoEditorial = () => `<aside class="info-editorial"><div class="ie-lead"><p class="eyebrow">${t('info.eyebrow')}</p><h2>${t('info.h')}</h2><p>${t('info.p')}</p><a class="text-link" href="events.html">${t('info.link')}</a></div><dl class="ie-facts">
  <div class="ie-fact"><dt>${t('info.f1')}</dt><dd>${t('info.f1v')}</dd><small>${t('info.f1s')}</small></div>
  <div class="ie-fact"><dt>${t('info.f2')}</dt><dd>${t('info.f2v')}</dd><small>${t('info.f2s')}</small></div>
  <div class="ie-fact"><dt>${t('info.f3')}</dt><dd>${t('info.f3v')}</dd><small>${t('info.f3s')}</small></div>
</dl></aside>`;
const productCard = (p, i) => `<article class="product-card" data-category="${p.cat}"><div class="product-art ${p.tone}"><span class="product-word">${p.name.split(' ').slice(-1)[0].toUpperCase()}</span></div><div class="pad"><div class="product-name">${p.name}</div><div class="price-row"><span class="price">${money(p.price)}</span><button class="add-cart" data-product="${i}" aria-label="${t('merch.aria')} ${p.name}">+</button></div></div></article>`;

/* ---------- HOME — cinematic scroll journey ---------- */
/* Bagian 3: master geometry lapangan dipindah ke court-geometry.js
   (satu sumber untuk Intro, Home, Tobaladies, Tobadeli).
   PX, HH, HW, COURT_MARKINGS, courtSVG tetap tersedia sebagai const global. */

function home() {
    return `
<section class="hero hero-home kinetic">
  <div class="hero-atmosphere" aria-hidden="true" data-pointer-depth="7"></div>
  <div class="hero-head"><p class="hero-identity brand-wordmark" translate="no"><span class="id-toba">TOBA</span><span class="id-comm">COMMUNITY</span></p><small class="hero-sub-identity">${t('hero.identity.sub')}</small></div>
  <div class="hero-body">
    <div class="hero-actions"><a class="pill" href="partnership.html">${t('hero.cta1')}</a><a class="pill secondary" href="events.html">${t('hero.cta2')}</a></div>
    <div class="hero-info"><div class="hero-info-item"><strong>${t('hero.info.game')}</strong><span>${t('hero.info.time')}</span></div><div class="hero-info-item"><strong>${t('hero.info.place')}</strong><span>${t('hero.info.place.v')}</span></div><div class="hero-info-item"><strong>${t('hero.info.comm')}</strong><span>${t('hero.info.comm.v')}</span></div></div>
  </div>
</section>

<section class="section-wrap comm-cards"><div class="section-heading"><div><p class="eyebrow">${t('comm.cards.eyebrow')}</p><h2>${t('comm.cards.h')}</h2><p class="section-sub">${t('comm.cards.sub')}</p></div></div>
<div class="community-photo-grid">
    <a class="comm-photo-card card-pink" href="tobaladies.html">
    <div class="comm-photo"><img src="${photos.women}" alt="${t('ui.illust.women')}" loading="lazy"></div>
    <div class="comm-copy"><span class="comm-flag" aria-hidden="true"></span><h3>TOBALADIES</h3><p>${t('hero.sc.ladies.d')}</p><span class="comm-link">${t('comm.cards.link')}</span></div>
    </a>
    <a class="comm-photo-card card-orange" href="tobadeli.html">
    <div class="comm-photo"><img src="${photos.men}" alt="${t('ui.illust.men')}" loading="lazy"></div>
    <div class="comm-copy"><span class="comm-flag" aria-hidden="true"></span><h3>TOBADELI</h3><p>${t('hero.sc.deli.d')}</p><span class="comm-link">${t('deli.meet')}</span></div>
    </a>
  </div>
  <div class="feature-strip feature-checklist" role="list"><div class="feature feature-check" role="listitem"><span class="check-ind" aria-hidden="true"><svg viewBox="0 0 16 16" width="10" height="10" fill="none"><path d="M2.5 8.5l3.5 3.5 7-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><div class="check-copy"><strong>${t('home.f1')}</strong><span>${t('home.f1s')}</span></div></div><div class="feature feature-check" role="listitem"><span class="check-ind" aria-hidden="true"><svg viewBox="0 0 16 16" width="10" height="10" fill="none"><path d="M2.5 8.5l3.5 3.5 7-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><div class="check-copy"><strong>${t('home.f2')}</strong><span>${t('home.f2s')}</span></div></div><div class="feature feature-check" role="listitem"><span class="check-ind" aria-hidden="true"><svg viewBox="0 0 16 16" width="10" height="10" fill="none"><path d="M2.5 8.5l3.5 3.5 7-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><div class="check-copy"><strong>${t('home.f3')}</strong><span>${t('home.f3s')}</span></div></div><div class="feature feature-check" role="listitem"><span class="check-ind" aria-hidden="true"><svg viewBox="0 0 16 16" width="10" height="10" fill="none"><path d="M2.5 8.5l3.5 3.5 7-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><div class="check-copy"><strong>${t('home.f4')}</strong><span>${t('home.f4s')}</span></div></div></div></section>

<section class="story-ed" id="storyline" aria-label="${t('story.h')}">
  <div class="story-ed-inner">
    <div class="story-ed-chapter story-ch1" data-reveal-step>
      <p class="eyebrow accent-green">${t('story.kicker')}</p>
      <h2 class="story-ed-title" data-parallax="0.03">${t('story.h')}</h2>
      <p class="story-ed-lede" data-reveal-step>${t('story.lead')}</p>
    </div>
    <figure class="story-ed-photo" data-parallax="0.07">
      <img src="${photos.training}" alt="${t('ui.illust.basket')}" loading="lazy">
    </figure>
    <div class="story-ed-chapter story-ch2">
      <div class="story-circle story-circle-ladies" data-reveal-step>
        <p class="story-circle-name">TOBALADIES</p>
        <h3>${t('story.ladies.name')}</h3>
        <p>${t('story.ladies.d')}</p>
      </div>
      <div class="story-circle story-circle-deli" data-reveal-step>
        <p class="story-circle-name">TOBADELI</p>
        <h3>${t('story.deli.name')}</h3>
        <p>${t('story.deli.d')}</p>
      </div>
      <p class="story-circle-lede" data-reveal-step>${t('story.circle.lede')}</p>
    </div>
    <div class="story-ed-chapter story-ch3" data-reveal-step>
      <h3 class="story-bridge-title">${t('story.bridge.h')}</h3>
      <p class="story-bridge-p">${t('story.bridge.p')}</p>
    </div>
  </div>
</section>

<section class="section-wrap founder-story founder-block founder-parallax"><div class="founder-grid">
  <div class="photo-frame founder-photo"><img src="${photos.founder}" alt="${t('founder.name')}, ${t('founder.role')}" onerror="this.parentElement.classList.add('img-broken')"></div>
  <div class="founder-copy">
    <p class="eyebrow accent-green">${t('founder.eyebrow')}</p>
    <h2>${t('founder.name')}</h2>
    <p class="founder-role">${t('founder.role')}</p>
    <p class="story-copy">${t('founder.body')}</p>
    <p class="founder-note"><small>${t('founder.note')}</small></p>
  </div>
</div></section>

<section class="dark-section"><div class="dark-section-inner"><div class="section-heading"><div><p class="eyebrow">${t('home.story.eyebrow')}</p><h2>${t('home.story.h')}</h2></div><p class="lede">${t('home.story.lede')}</p></div>
  <div class="two-col"><div class="photo-frame img-reveal" data-parallax="0.06"><img src="${photos.women}" alt="${t('ui.illust.women')}" loading="lazy"><span class="frame-caption accent-pink">TOBALADIES</span></div>
  <div class="photo-frame img-reveal" data-parallax="-0.05" style="margin-top:clamp(24px,4vw,56px)"><img src="${photos.men}" alt="${t('ui.illust.men')}" loading="lazy"><span class="frame-caption accent-orange">TOBADELI</span></div></div>
  <p style="margin-top:28px"><a class="text-link on-dark" href="gallery.html">${t('home.story.link')}</a></p></div></section>

<section class="section-wrap agenda-section"><div class="section-heading"><div><p class="eyebrow">${t('home.events.eyebrow')}</p><h2>${t('home.events.h')}</h2></div><a class="text-link" href="events.html">${t('home.events.link')}</a></div>${eventScroller(events.slice(0, 4).map(eventCard).join(''))}</section>

<section class="section-wrap merch-section"><div class="section-heading"><div><p class="eyebrow">${t('home.merch.eyebrow')}</p><h2>${t('home.merch.h')}</h2></div><a class="text-link" href="merchandise.html">${t('home.merch.link')}</a></div><div class="product-grid">${products.slice(0, 4).map(productCard).join('')}</div></section>

<section class="section-wrap contact-section"><a class="contact-card" href="partnership.html"><div class="contact-copy"><p class="eyebrow">${t('home.call.eyebrow')}</p><h3>${t('home.call.h')}</h3><p class="lede">${t('home.call.lede')}</p></div><span class="pill contact-cta">${t('home.call.cta')}</span></a></section>`
}

/* ---------- COMMUNITY PAGES — distinct editorial rhythm ---------- */
function communityPage(which) {
    const women = which === 'tobaladies';
    const name = women ? 'TOBALADIES' : 'TOBADELI', tone = women ? 'pink' : 'orange';
    /* Bagian 14: CTA Tobadeli memakai gaya maskulin, Tobaladies tetap hangat */
    const cta1 = women ? t('comm.cta1') : t('deli.cta1');
    const cta2 = women ? t('comm.cta2') : t('deli.cta2');
    const ctaJoin = women ? t('comm.cta1') : t('deli.cta1');
    const sub = women ? t('comm.hero.lede1') : t('comm.hero.lede2'), desc = women ? t('comm.desc1') : t('comm.desc2');
    const img = women ? photos.women : photos.men;
    return `
<section class="hero hero-community-flow section-wrap kinetic">
  <svg class="hero-court ${women ? 'court-pink' : 'court-orange'}" viewBox="${-HW} ${-HH} ${HW * 2} ${HH * 2}" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice" data-parallax="0.05" data-pointer-depth="12">
    ${COURT_MARKINGS}
  </svg>
  <div class="hero-croc" data-parallax="-0.1" data-parallax-rotate="1.2" data-parallax-x="0.02"><img src="assets/crocodile-head-trans.png" alt="${t('ui.alt.mascot')}"></div>
  <div class="hero-copy"><p class="eyebrow">${women ? 'TOBALADIES BASKET PEREMPUAN JAKARTA TIMUR' : 'TOBADELI BASKET PRIA JAKARTA TIMUR'}</p>
    <h1>${women ? '<span class="accent-pink">TOBA</span>LADIES' : '<span class="accent-orange">TOBA</span>DELI'}</h1>
    <p class="brand-fullname">${women ? t('brand.name.ladies') : t('brand.name.deli')}</p>
    <p class="hero-subtitle">${sub}. ${desc}</p>
    <div class="hero-actions"><a class="pill pill-${tone}" href="partnership.html">${cta1}</a><a class="pill secondary" href="events.html">${cta2}</a></div>
    <p class="eyebrow" style="color:var(--muted)">${t('comm.eyebrow2')}</p></div></section>

<section class="section-wrap"><div class="two-col"><div class="photo-frame img-reveal" data-parallax="${women ? '0.07' : '-0.06'}"><img src="${img}" alt="${t('comm.illust')} ${name}" loading="lazy">${women ? '<img class="mascot mascot-wordmark" src="assets/logopinkpng.png" alt="Logo Tobaladies">' : ''}<span class="frame-caption accent-${tone}">${name}</span></div>
  <div style="align-self:end;padding-bottom:8px"><p class="eyebrow">${t('comm.about')}</p><h2>${t('comm.h')}</h2><p class="lede">${t('comm.lede')}</p>${women ? '' : `<p class="brand-note">${t('brand.deli.note')}</p>`}<a class="text-link" href="events.html">${t('comm.link')}</a></div></div></section>

<section class="dark-section"><div class="dark-section-inner">
  <div class="section-heading"><div><p class="eyebrow">${tPair('NEXT UP','SELANJUTNYA')}</p><h2>${tPair('COMMUNITY <span class="accent-' + tone + '">SCHEDULE.</span>','JADWAL <span class="accent-' + tone + '">KOMUNITAS.</span>')}</h2></div><a class="text-link" href="events.html">${t('home.events.link')}</a></div>
  ${eventScroller(events.filter(e => e.community === (women ? 'Tobaladies' : 'Tobadeli') || e.community === 'All Community').slice(0, 4).map(eventCard).join(''))}
  <div class="feature-strip" style="border-color:rgba(237,233,222,.18);margin-top:clamp(40px,6vh,64px)"><div class="feature" style="border-color:rgba(237,233,222,.18)"><strong>${t('comm.f1')}</strong><span>${t('comm.f1s')}</span></div><div class="feature" style="border-color:rgba(237,233,222,.18)"><strong>${t('comm.f2')}</strong><span>${t('comm.f2s')}</span></div><div class="feature" style="border-color:rgba(237,233,222,.18)"><strong>${t('comm.f3')}</strong><span>${t('comm.f3s')}</span></div><div class="feature" style="border-color:rgba(237,233,222,.18)"><strong>${t('comm.f4')}</strong><span>${t('comm.f4s')}</span></div></div>
</div></section>

<section class="section-wrap"><div class="callout"><div><p class="eyebrow">${t('comm.join.eyebrow')}</p><h3>${t('comm.join.h')}</h3><p class="lede">${t('comm.pill.d')}</p></div><a class="pill" href="partnership.html">${ctaJoin}</a></div></section>${women ? ladiesStory() : ''}`
}

/* ---------- FAQ accordion + Weekly Fun Game facts ---------- */
function faqSection() {
    const items = [1,2,3,4,5,6,7].map(i => `
    <div class="faq-item"><button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-a${i}">${t('faq.q'+i)}<span class="faq-chev" aria-hidden="true"></span></button>
    <div class="faq-a" id="faq-a${i}" hidden><p>${t('faq.a'+i)}</p></div></div>`).join('');
    const wfg = [1,2,3,4,5,6,7].map(i => `<div class="ie-fact"><dt>${t('faq.wfg.item'+i)}</dt><dd>${t('faq.wfg.v'+i)}</dd></div>`).join('');
    return `
<section class="section-wrap faq-wrap"><div class="faq-grid">
  <div class="faq-head"><p class="eyebrow">${t('faq.eyebrow')}</p><h2>${t('faq.h')}</h2><p class="lede">${t('faq.lede')}</p>
    <div class="wfg-card"><h3>${t('faq.wfg.h')}</h3><dl class="ie-facts">${wfg}</dl><p class="wfg-note"><small>${t('faq.wfg.pricing.note')}</small></p></div>
  </div>
  <div class="faq-list">${items}</div>
</div></section>`;
}

/* ---------- TOBALADIES storyline + founder (editorial) ---------- */
function ladiesStory() {
    return `
<section class="tl-story section-wrap"><div class="tl-story-grid">
  <div class="tl-story-copy">
    <p class="eyebrow accent-pink">${t('tl.story.eyebrow')}</p>
    <h2>${t('tl.story.h')}</h2>
    <p class="tl-lead">${t('tl.story.lead')}</p>
    <p>${t('tl.story.p1')}</p>
    <p>${t('tl.story.p2')}</p>
    <div class="photo-frame tl-story-photo img-reveal" data-parallax="0.05"><img src="${photos.women2}" alt="${t('ui.illust.women')}" loading="lazy"><span class="frame-caption accent-pink">TOBALADIES</span></div>
    <p>${t('tl.story.p3')}</p>
    <p>${t('tl.story.p4')}</p>
  </div>
  <div class="tl-story-side">
    <div class="photo-frame tl-story-photo img-reveal" data-parallax="-0.04"><img src="${photos.ladies3}" alt="${t('ui.illust.women')}" loading="lazy"></div>
    <div class="tl-acts"><p class="tl-acts-label">${t('tl.story.acts')}</p>
      <ul><li>${t('tl.story.acts.1')}</li><li>${t('tl.story.acts.2')}</li><li>${t('tl.story.acts.3')}</li><li>${t('tl.story.acts.4')}</li></ul>
    </div>
  </div>
</div></section>`
}

/* ---------- EVENTS — editorial timeline + preserved filters ---------- */
function eventsPage() {
    const labels = t('events.filters').split('|');
    return `
<section class="hero section-wrap" style="min-height:auto"><div class="hero-copy"><p class="eyebrow">${t('events.hero.eyebrow')}</p><h1>${t('events.hero.h')}</h1><p class="hero-subtitle">${t('events.hero.lede')}</p></div>
  <div class="page-hero" style="padding:0;grid-template-columns:1fr"><div class="photo-frame img-reveal" data-parallax="0.05"><img src="${photos.arena}" alt="${t('ui.illust.court')}"></div></div></section>
<section class="section-wrap"><div class="filters" id="eventFilters">${labels.map((x, i) => `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}</div>
  <div class="event-grid events-scroll" id="eventGrid">${events.map(eventCard).join('')}</div>
  <div class="venue-note" style="margin-top:28px"><strong>${t('events.note.strong')}</strong> ${t('events.note')}<a class="venue-link" href="https://www.gelora.id/v/brickhouse" target="_blank" rel="noreferrer">Brickhouse The East, Duren Sawit</a>${t('events.note2')}</div></section>${faqSection()}`
}

/* ---------- MERCH — product focus, preserved filters + cart ---------- */
function merchPage() {
    const labels = t('merch.filters').split('|');
    return `
<section class="hero section-wrap" style="min-height:auto"><div class="hero-copy"><p class="eyebrow">${t('home.merch.eyebrow')}</p><h1>TOBA<br><span class="accent-orange">MERCH.</span></h1><p class="hero-subtitle">${t('merch.hero.lede')}</p></div></section>
<section class="section-wrap"><div class="filters" id="productFilters">${labels.map((x, i) => `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}<span style="margin-left:auto;font-size:12px;font-weight:700;align-self:center">${t('merch.bag')} <span id="cartCount">0</span></span></div>
  <div class="product-grid" id="productGrid">${products.map(productCard).join('')}</div>
  <div class="callout"><div><p class="eyebrow">${t('merch.call.eyebrow')}</p><h3>${t('merch.call.h')}</h3><p class="lede">${t('merch.call.lede')}</p></div><button class="pill" id="checkoutDemo">${t('merch.checkout')}</button></div></section>`
}

/* ---------- GALLERY — editorial, live API ---------- */
function galleryPage() {
    const labels = t('gallery.filters').split('|');
    return `
<section class="gallery-hero-blur"><section class="hero section-wrap" style="min-height:auto"><div class="hero-copy"><p class="eyebrow">${t('gallery.hero.eyebrow')}</p><h1>${t('gallery.hero.h')}</h1><p class="hero-subtitle">${t('gallery.hero.lede.live')}</p></div></section></section>
<section class="gallery-shell"><div class="section-wrap wide" style="padding-top:clamp(28px,4vh,56px)"><div class="filters" id="galleryFilters">${labels.map((x, i) => `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}</div>
  <div id="galleryStatus"></div><div class="gallery-grid" id="galleryGrid"></div>
  <div class="venue-note" style="margin-top:35px">${t('gallery.hero.lede')}</div></div>${infoEditorial()}</section>`
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

/* ---------- nav: mega menu (desktop) + accordion drawer (mobile) ---------- */
(function () {
  const explore = document.getElementById('navExplore');
  const mega = document.getElementById('megaMenu');
  if (!explore || !mega) return;
  const header = explore.closest('.site-header');
  const mq = window.matchMedia('(max-width: 1000px)');

  function openMega() { mega.hidden = false; requestAnimationFrame(() => { mega.classList.add('open'); explore.setAttribute('aria-expanded', 'true'); header?.classList.add('menu-context') }) }
  function closeMega() { mega.classList.remove('open'); explore.setAttribute('aria-expanded', 'false'); header?.classList.remove('menu-context'); setTimeout(() => { if (!mega.classList.contains('open')) mega.hidden = true }, 300) }

  explore.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); mega.classList.contains('open') ? closeMega() : openMega() });
  document.addEventListener('click', e => { if (mega.classList.contains('open') && !e.target.closest('.main-nav') && !e.target.closest('#navExplore')) closeMega() });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mega.classList.contains('open')) { closeMega(); explore.focus() } });
})();

const menuToggle = document.getElementById('menuToggle'), nav = document.getElementById('mainNav');
const backdrop = document.createElement('div');
backdrop.className = 'nav-backdrop';
/* the scrollable middle of the drawer — head + footer stay fixed */
nav.querySelector('.mega')?.classList.add('drawer-scroll');
document.body.appendChild(backdrop);

function setGroup(group, open) {
  group.classList.toggle('open', open);
  group.querySelector('.mega-label')?.setAttribute('aria-expanded', String(open));
}

function closeNav() {
  nav.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  backdrop.classList.remove('show');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  /* reset accordion state so no group stays open for the next visit */
  nav.querySelectorAll('.mega-group.open').forEach(g => setGroup(g, false));
}
window.closeNav = closeNav;

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  /* lock the page behind the drawer */
  document.documentElement.style.overflow = open ? 'hidden' : '';
  document.body.style.overflow = open ? 'hidden' : '';
  backdrop.classList.toggle('show', open);
  if (open) {
    /* the mega markup renders as the drawer accordion — always visible */
    const megaMenu = document.getElementById('megaMenu');
    if (megaMenu) megaMenu.hidden = false;
    nav.querySelector('.drawer-close')?.focus();
  } else {
    menuToggle.focus();
  }
});

/* single-open accordion on the drawer groups (keyboard accessible) */
nav.querySelectorAll('.mega-group').forEach(group => {
  const label = group.querySelector('.mega-label');
  if (!label) return;
  label.setAttribute('role', 'button');
  label.setAttribute('tabindex', '0');
  label.setAttribute('aria-expanded', 'false');
  const toggle = () => {
    const wasOpen = group.classList.contains('open');
    nav.querySelectorAll('.mega-group.open').forEach(g => setGroup(g, false));
    if (!wasOpen) setGroup(group, true);
  };
  label.addEventListener('click', toggle);
  label.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } });
});

/* backdrop click closes */
backdrop.addEventListener('click', () => closeNav());
nav.querySelector('.drawer-close')?.addEventListener('click', () => closeNav());
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
/* Escape also closes the drawer */
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeNav(); menuToggle.focus() } });

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

/* ---------- FAQ accordion behavior (single-open, keyboard friendly) ---------- */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q || q.dataset.bound) return;
    q.dataset.bound = '1';
    q.addEventListener('click', () => {
      const open = q.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(other => {
        if (other !== q) {
          other.setAttribute('aria-expanded', 'false');
          other.parentElement.classList.remove('open');
        }
      });
      q.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('open', !open);
    });
  });
}

/* ---------- language re-render (preserved) ---------- */
document.addEventListener('toba:langchange', () => { if (page === 'game') return; appEl.innerHTML = (renderers[page] || home)(); document.querySelector(`[data-nav="${page}"]`)?.classList.add('active'); if (page === 'gallery') { galleryState === 'ok' ? renderGalleryUI() : loadGallery(); } initReveal(); initStorySteps(); initParallax(); initKinetic(); initPointerScene(); initMerchTilt(); initFaq(); });

/* ---------- reveal system (preserved + clip reveal for images) ---------- */
const revealObserver = ('IntersectionObserver' in window) ? new IntersectionObserver(es => { es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target) } }) }, { threshold: .12 }) : null;
function initReveal() {
    const els = document.querySelectorAll('.section-wrap,.event-card,.product-card,.community-card,.photo-frame,.dark-section,.tl-founder-photo,.tl-story-photo');
    els.forEach((el, i) => {
        if (!revealObserver) { el.classList.add('in'); return }
        /* never stack .reveal on elements that already carry img-reveal (would double-hide) */
        if (!el.classList.contains('img-reveal')) el.classList.add(el.classList.contains('photo-frame') ? 'img-reveal' : 'reveal');
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

/* ---------- Prompt 40: staged reveal untuk editorial storytelling ---------- */
const stepObserver = ('IntersectionObserver' in window) ? new IntersectionObserver(es => {
  es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('step-in'); stepObserver.unobserve(en.target) } })
}, { threshold: .2 }) : null;
function initStorySteps() {
  document.querySelectorAll('[data-reveal-step]').forEach(el => {
    if (el.dataset.stepBound) return;
    el.dataset.stepBound = '1';
    if (!stepObserver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('step-in'); return }
    stepObserver.observe(el);
  });
}
initStorySteps();

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
initFaq();


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
  else {
    document.addEventListener('toba:introdone', settle, { once: true });
    /* safety nets: intro removed externally, or its script never fires */
    const poll = setInterval(() => { if (!document.getElementById('tobaIntro')) { clearInterval(poll); settle(); } }, 300);
    setTimeout(() => { clearInterval(poll); settle(); }, 3000);
  }
})();
