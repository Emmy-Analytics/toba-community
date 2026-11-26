/* TOBA COMMUNITY – premium editorial content & interactions (bilingual via i18n.js)
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
 women: IMG + 'toba-052.jpg', /* Tobaladies game */
 women2: IMG + 'toba-053.jpg', /* Tobaladies session */
 women3: IMG + 'toba-017.jpg', /* Biru vs Pink game */
 men: IMG + 'toba-019.jpg', /* GameTime action */
 men2: IMG + 'toba-023.jpg', /* Pink vs Merah */
 team: IMG + 'toba-045.jpg', /* Misc group */
 ball: 'assets/img/ball-close.jpg',
 arena: IMG + 'toba-015.jpg', /* @abandmotret wide shot */
 hoop: IMG + 'toba-047.jpg', /* SHOWTIME moment */
 floor: 'assets/img/court-floor.jpg',
 training: IMG + 'toba-008.jpg', /* @abandmotret practice */
 founder: IMG + 'founder-cut.png',
 deli: IMG + 'toba-060.jpg', /* deli-hero portrait */
 game2: IMG + 'toba-026.jpg', /* Pink vs Hitam */
 ladies3: IMG + 'toba-056.jpg' /* Tobaladies Game 05 */
};
const events = [
 { date: 'SAB', month: 'weekly', year: '', title: 'TOBA Weekly Fun Game', type: 'Open Run', community: 'All Community', place: 'Brickhouse The East, Duren Sawit – Jakarta Timur', time: '18.00 – 20.00 WIB', img: photos.arena, memberOnly: true },
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
const eventCard = e => { const place = e.place === 'tbc'? t('events.venue.tbc') : e.place; const month = e.month === 'weekly'? t('events.weekly') : e.month;
 return `<article class="event-card" data-category="${e.type} ${e.community}"><img src="${e.img}" alt="${t('ui.illust.basket')} – ${e.title}" loading="lazy"><div class="date-badge">${e.date}<small>${month} ${e.year}</small></div><div class="pad"><span class="tag">${e.type}</span><h3>${e.title}</h3><p>${place}<br>${e.time}</p><div class="meta"><span>${e.community}</span></div><button class="pill event-interest" data-event="${e.title}">${t('ui.interest')}</button></div></article>`; };
const eventScroller = cards => `<div class="event-scroll-wrap"><div class="event-grid events-scroll">${cards}</div></div>`;

/* editorial facts block under the gallery – replaces flat info columns */
const infoEditorial = () => `<aside class="info-editorial"><div class="ie-lead"><p class="eyebrow">${t('info.eyebrow')}</p><h2>${t('info.h')}</h2><p>${t('info.p')}</p><a class="text-link" href="events.html">${t('info.link')}</a></div><dl class="ie-facts">
 <div class="ie-fact"><dt>${t('info.f1')}</dt><dd>${t('info.f1v')}</dd><small>${t('info.f1s')}</small></div>
 <div class="ie-fact"><dt>${t('info.f2')}</dt><dd>${t('info.f2v')}</dd><small>${t('info.f2s')}</small></div>
 <div class="ie-fact"><dt>${t('info.f3')}</dt><dd>${t('info.f3v')}</dd><small>${t('info.f3s')}</small></div>
</dl></aside>`;
const productCard = (p, i) => `<article class="product-card" data-category="${p.cat}"><div class="product-art ${p.tone}"><span class="product-word">${p.name.split(' ').slice(-1)[0].toUpperCase()}</span></div><div class="pad"><div class="product-name">${p.name}</div><div class="price-row"><span class="price">${money(p.price)}</span><button class="add-cart" data-product="${i}" aria-label="${t('merch.aria')} ${p.name}">+</button></div></div></article>`;

/* ---------- HOME – cinematic scroll journey ---------- */
/* Bagian 3: master geometry lapangan dipindah ke court-geometry.js
 (satu sumber untuk Intro, Home, Tobaladies, Tobadeli).
 PX, HH, HW, COURT_MARKINGS, courtSVG tetap tersedia sebagai const global. */

function home() {
 return `
<section class="hero hero-home kinetic">
 <div class="hero-gradient-shift" aria-hidden="true"></div> <!-- Prompt 36: pergantian warna perlahan -->
 <div class="hero-atmosphere" aria-hidden="true" data-pointer-depth="7"></div>
 <!-- Prompt 54: cinematic photo collage – dokumentasi asli TOBA, layered editorial -->
 <div class="hero-collage" aria-hidden="true">
 <figure class="hc-photo hc-a" data-cine-h="0.22"><img src="${photos.training}" alt="" loading="eager"></figure>
 <figure class="hc-photo hc-b" data-cine-h="0.38"><img src="${photos.women}" alt="" loading="lazy"></figure>
 <figure class="hc-photo hc-c" data-cine-h="0.55"><img src="${photos.men}" alt="" loading="lazy"></figure>
 <figure class="hc-photo hc-d" data-cine-h="0.7"><img src="${photos.arena}" alt="" loading="lazy"></figure>
 </div>
 <!-- Prompt 37-38: multiple SVG cutout composition – di dalam kolom head/body flow -->
 <div class="hero-cut-slideshow" id="heroCutShow" aria-hidden="true"></div>
 <div class="hero-head"><p class="hero-identity brand-wordmark" translate="no"><span class="id-toba">TOBA</span><span class="id-comm">COMMUNITY</span></p><small class="hero-sub-identity">${t('hero.identity.sub')}</small></div>
 <div class="hero-body">
 <div class="hero-actions"><a class="pill" href="partnership.html">${t('hero.cta1')}</a><a class="pill secondary" href="events.html">${t('hero.cta2')}</a></div>
 <div class="hero-info"><div class="hero-info-item"><strong>${t('hero.info.game')}</strong><span>${t('hero.info.time')}</span></div><div class="hero-info-item"><strong>${t('hero.info.place')}</strong><span>${t('hero.info.place.v')}</span></div><div class="hero-info-item"><strong>${t('hero.info.comm')}</strong><span>${t('hero.info.comm.v')}</span></div></div>
 </div>
 <div class="hero-group-slideshow" id="heroGroupShow" aria-hidden="true"></div>
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

<section class="cine-reviews" id="cineReviews" aria-label="${t('cine.reviews.aria')}">
 <div class="cine-rbg" aria-hidden="true">
 ${cinePhotos.map((p,i)=>`<div class="cine-rbg-img${i===0?' active':''}" style="background-image:url('${p}')"></div>`).join('')}
 <!-- Prompt 57: starfield canvas – partikel berlapis depth, twinkle halus -->
 <div class="starfield-layer"><canvas id="tobaStars"></canvas></div>
 </div>
 <div class="cine-rbg-overlay" aria-hidden="true"></div>
 <div class="cine-rcenter">
 <h2 class="cine-rheadline">${t('cine.reviews.h')}</h2>
 <p class="cine-rsub">${t('cine.reviews.sub')}</p>
 <button class="pill cine-rform-btn" id="reviewOpenBtn" type="button">${t('reviews.write')}</button>
 </div>
 <div class="cine-rcards" aria-live="polite"></div>
</section>

<!-- Prompt 69: section hijau "LANGSUNG DARI LAPANGAN" dihapus –
 dokumentasinya sudah tampil di galeri bergerak di bawah -->

<section class="section-wrap agenda-section"><div class="section-heading"><div><p class="eyebrow">${t('home.events.eyebrow')}</p><h2>${t('home.events.h')}</h2></div><a class="text-link" href="events.html">${t('home.events.link')}</a></div>
 <!-- Prompt 9: filter kategori agenda – sistem & label sama dengan halaman Events -->
 <div class="filters agenda-filters" id="agendaFilters">${t('events.filters').split('|').map((x, i) => `<button class="filter-btn ${i === 0? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}</div>
 <div class="event-grid" id="agendaGrid">${events.map(eventCard).join('')}</div>
</section>

<section class="cine-gallery" aria-label="${t('cine.gallery.aria')}">
 <div class="cine-g-head"><p class="eyebrow">${t('cine.gallery.eyebrow')}</p><h2 class="cine-g-title">${t('cine.gallery.h')}</h2><a class="text-link" href="gallery.html">${t('cine.gallery.cta')}</a></div>
 <div class="cine-g-row cine-g-r1"><div class="cine-g-track" data-dir="rtl" data-speed="12">${cineRow(cineRow1)}</div></div>
 <div class="cine-g-row cine-g-r2"><div class="cine-g-track" data-dir="ltr" data-speed="16">${cineRow(cineRow2)}</div></div>
 <div class="cine-g-row cine-g-r3"><div class="cine-g-track" data-dir="rtl" data-speed="20">${cineRow(cineRow3)}</div></div>
 <p class="cine-g-empty" hidden>${t('cine.gallery.empty')}</p>
</section>

<section class="cine-marquee" id="cineApparel" aria-label="TOBA APPAREL">
 <div class="cine-marquee-inner"></div>
</section>

<section class="section-wrap merch-section"><div class="section-heading"><div><p class="eyebrow">${t('home.merch.eyebrow')}</p><h2><span class="mw-ink">TOBA</span> <span class="accent-orange">MERCH.</span></h2></div><a class="text-link" href="merchandise.html">${t('home.merch.link')}</a></div><div class="product-grid">${products.slice(0, 4).map(productCard).join('')}</div></section>

<section class="section-wrap contact-section"><button class="contact-card part-card-inner" id="joinCtaBtn" type="button" aria-label="${t('home.call.btn')}"><div class="contact-copy"><p class="eyebrow">${t('home.call.label')}</p><h3>${t('home.call.h')}</h3><p class="lede">${t('home.call.d')}</p></div><span class="pill contact-cta">${t('home.call.btn')}</span></button></section>

`
}

/* ---------- PROMPT 1-10 – CINEMATIC MODULE (namespace.cine-) ---------- */
const cinePhotos = [photos.women, photos.men, photos.training, photos.women2, photos.arena, photos.game2];
const cineRow1 = [photos.game2, photos.men, photos.women, photos.men2, photos.women3, photos.arena, photos.training, photos.women2];
const cineRow2 = [photos.team, photos.women3, photos.hoop, photos.training, photos.ladies3, photos.men2, photos.ball, photos.floor, photos.women, photos.men, photos.game2]; /* Prompt 57: +3 foto agar kelompok cukup lebar untuk viewport */
const cineRow3 = [photos.hoop, photos.ladies3, photos.ball, photos.floor, photos.men2, photos.team, photos.women, photos.game2];
const cineReviews = []; /* isi dengan review asli berizin: {name:'–', text:'–'} – kosong = kartu disembunyikan, tidak ada data fiktif */
function cineRow(arr){
 const card = (src,i)=>`<figure class="cine-g-card"><img src="${src}" alt="${t('cine.gallery.alt')}" loading="lazy" onerror="this.parentElement.classList.add('cine-g-dead')"></figure>`;
 const seq = arr.map(card).join('');
 /* Prompt 30/42: spacer penutup di DALAM tiap seq – jarak antar-seq identik
 dengan jarak antar-card, sehingga wrap modulo tidak menyisakan celah kosong.
 Prompt 42: tiap baris diberi 3 kelompok identik – satu kelompok terlalu
 pendek utk viewport lebar membuat sisi kanan kosong saat animasi berjalan;
 engine memakai kelompok pertama sebagai satuan loop (half). */
 /* Prompt 57: 4 kelompok identik per baris – kelompok foto pendek (row2
 memakai foto landscape/kecil, lebar total < viewport) membuat sisi kanan
 kosong; menambah kelompok menjamin track total selalu > 2– viewport.
 Semua kelompok urutan/lebar/gap identik? wrap modulo tetap seamless. */
 const grp = `<div class="cine-g-seq">${seq}</div>`;
 return grp + `<div class="cine-g-seq" aria-hidden="true">${seq}</div><div class="cine-g-seq" aria-hidden="true">${seq}</div><div class="cine-g-seq" aria-hidden="true">${seq}</div>`;
}

/* ---------- COMMUNITY PAGES – distinct editorial rhythm ---------- */
function communityPage(which) {
 const women = which === 'tobaladies';
 const name = women? 'TOBALADIES' : 'TOBADELI', tone = women? 'pink' : 'orange';
 /* Bagian 14: CTA Tobadeli memakai gaya maskulin, Tobaladies tetap hangat */
 const cta1 = women? t('comm.cta1') : t('deli.cta1');
 const cta2 = women? t('comm.cta2') : t('deli.cta2');
 const ctaJoin = women? t('comm.cta1') : t('deli.cta1');
 const sub = women? t('comm.hero.lede1') : t('comm.hero.lede2'), desc = women? t('comm.desc1') : t('comm.desc2');
 const img = women? photos.women : photos.men;
 return `
<section class="hero hero-community-flow section-wrap kinetic">
 <svg class="hero-court ${women? 'court-pink' : 'court-orange'}" viewBox="${-HW} ${-HH} ${HW * 2} ${HH * 2}" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice" data-parallax="0.05" data-pointer-depth="12">
 ${COURT_MARKINGS}
 </svg>
 <div class="hero-croc" data-parallax="-0.1" data-parallax-rotate="1.2" data-parallax-x="0.02"><img src="assets/crocodile-head-trans.png" alt="${t('ui.alt.mascot')}"></div>
 <div class="hero-copy"><p class="eyebrow">${women? t('intro.ladies.eyebrow') : t('intro.deli.eyebrow')}</p>
 <h1>${women? '<span class="accent-pink">TOBA</span>LADIES' : '<span class="accent-orange">TOBA</span>DELI'}</h1>
 <p class="brand-fullname">${women? t('brand.name.ladies') : t('brand.name.deli')}</p>
 <p class="hero-subtitle">${sub}. ${desc}</p>
 <div class="hero-actions"><a class="pill pill-${tone}" href="partnership.html">${cta1}</a><a class="pill secondary" href="events.html">${cta2}</a></div>
 <p class="eyebrow" style="color:var(--muted)">${t('comm.eyebrow2')}</p></div></section>

<section class="section-wrap"><div class="two-col"><div class="photo-frame img-reveal" data-parallax="${women? '0.07' : '-0.06'}"><img src="${img}" alt="${t('comm.illust')} ${name}" loading="lazy">${women? '<img class="mascot mascot-wordmark" src="assets/logopinkpng.png" alt="Logo Tobaladies">' : ''}<span class="frame-caption accent-${tone}">${name}</span></div>
 <div style="align-self:end;padding-bottom:8px"><p class="eyebrow">${t('comm.about')}</p><h2>${t('comm.h')}</h2><p class="lede">${t('comm.lede')}</p>${women? '' : `<p class="brand-note">${t('brand.deli.note')}</p>`}<a class="text-link" href="events.html">${t('comm.link')}</a></div></div></section>

<section class="section-wrap comm-story"><div class="comm-story-grid">
 <div class="photo-frame img-reveal" data-parallax="${women? '0.06' : '-0.05'}"><img src="${women? photos.ladies3 : photos.men2}" alt="${t('comm.illust')} ${name}" loading="lazy"><span class="frame-caption accent-${tone}">${name}</span></div>
 <div class="comm-story-copy">
 <p class="eyebrow accent-${tone}">${t(women? 'tl.story.eyebrow' : 'deli.story.eyebrow')}</p>
 <h2>${t(women? 'tl.story.h' : 'deli.story.h')}</h2>
 <p class="tl-lead">${t(women? 'tl.story.lead' : 'deli.story.p1')}</p>
 <p>${t(women? 'tl.story.p1' : 'deli.story.p2')}</p>
 ${women? `<p>${t('tl.story.p2')}</p>` : ''}
 </div>
</div></section>

<section class="dark-section"><div class="dark-section-inner">
 <div class="section-heading"><div><p class="eyebrow">${tPair('NEXT UP','SELANJUTNYA')}</p><h2>${tPair('COMMUNITY <span class="accent-' + tone + '">SCHEDULE.</span>','JADWAL <span class="accent-' + tone + '">KOMUNITAS.</span>')}</h2></div><a class="text-link" href="events.html">${t('home.events.link')}</a></div>
 ${eventScroller(events.filter(e => e.community === (women? 'Tobaladies' : 'Tobadeli') || e.community === 'All Community').slice(0, 4).map(eventCard).join(''))}
 <div class="feature-strip feature-checklist" role="list" style="margin-top:clamp(40px,6vh,64px)">${[1,2,3,4].map(n=>`<div class="feature feature-check" role="listitem"><span class="check-ind" aria-hidden="true"><svg viewBox="0 0 16 16" width="13" height="13" fill="none"><path d="M2.5 8.5l3.5 3.5 7-8" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span><div class="check-copy"><strong>${t('comm.f'+n)}</strong><span>${t('comm.f'+n+'s')}</span></div></div>`).join('')}</div>
</div></section>

<section class="section-wrap"><div class="callout"><div><p class="eyebrow">${t('comm.join.eyebrow')}</p><h3>${t('comm.join.h')}</h3><p class="lede">${t('comm.pill.d')}</p></div><a class="pill" href="partnership.html">${ctaJoin}</a></div></section>`
}

/* ---------- P25: FAQ – percakapan TOBA Assistant dipindah ke chatbot global
 (script.js, modul TOBI). Yang tersisa di halaman Events: kartu info
 Weekly Fun Game. Tanpa bubble percakapan statis lagi. ---------- */
function faqSection() {
 const wfg = [1,2,3,4,5,6,7].map(i => `<div class="ie-fact"><dt>${t('faq.wfg.item'+i)}</dt><dd>${t('faq.wfg.v'+i)}</dd></div>`).join('');
 return `
<section class="section-wrap faq-wrap"><div class="faq-grid">
 <div class="faq-head"><p class="eyebrow">${t('faq.eyebrow')}</p><h2>${t('faq.h')}</h2><p class="lede">${t('faq.lede')}</p>
 <div class="wfg-card"><h3>${t('faq.wfg.h')}</h3><dl class="ie-facts">${wfg}</dl><p class="wfg-note"><small>${t('faq.wfg.pricing.note')}</small></p></div>
 </div>
</div></section>`;
}

/* ---------- TOBALADIES storyline + founder (editorial) ----------
 Prompt 24/25: cerita komunitas kini dirender di communityPage (comm-story)
 untuk Tobaladies DAN Tobadeli; ladiesStory() lama tidak dipakai lagi. */
function ladiesStory() {
 return `
<section class="tl-story section-wrap"><div class="tl-story-grid">
 <div class="tl-story-copy">
 <p class="eyebrow accent-pink">${t('tl.story.eyebrow')}</p>
 <h2>${t('tl.story.h')}</h2>
 <p class="tl-lead">${t('tl.story.lead')}</p>
 <p>${t('tl.story.p1')}</p>
 <p>${t('tl.story.p2')}</p>
 </div>
</div></section>`
}

/* ---------- EVENTS – editorial timeline + preserved filters ---------- */
function eventsPage() {
 const labels = t('events.filters').split('|');
 return `
<section class="hero section-wrap" style="min-height:auto"><div class="hero-copy"><p class="eyebrow">${t('events.hero.eyebrow')}</p><h1>${t('events.hero.h')}</h1><p class="hero-subtitle">${t('events.hero.lede')}</p></div>
 <div class="page-hero" style="padding:0;grid-template-columns:1fr"><div class="photo-frame img-reveal" data-parallax="0.05"><img src="${photos.arena}" alt="${t('ui.illust.court')}"></div></div></section>
<section class="section-wrap"><div class="filters" id="eventFilters">${labels.map((x, i) => `<button class="filter-btn ${i === 0? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}</div>
 <div class="event-grid events-scroll" id="eventGrid">${events.map(eventCard).join('')}</div>
 <div class="venue-note" style="margin-top:28px"><strong>${t('events.note.strong')}</strong> ${t('events.note')}<a class="venue-link" href="https://www.gelora.id/v/brickhouse" target="_blank" rel="noreferrer">Brickhouse The East, Duren Sawit</a>${t('events.note2')}</div></section>${faqSection()}`
}

/* ---------- MERCH – product focus, preserved filters + cart ---------- */
function merchPage() {
 const labels = t('merch.filters').split('|');
 return `
<section class="hero section-wrap" style="min-height:auto"><div class="hero-copy"><p class="eyebrow">${t('home.merch.eyebrow')}</p><h1>TOBA<br><span class="accent-orange">MERCH.</span></h1><p class="hero-subtitle">${t('merch.hero.lede')}</p></div></section>
<section class="section-wrap merch-page-wrap"><div class="filters" id="productFilters">${labels.map((x, i) => `<button class="filter-btn ${i === 0? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}<button class="pill cart-toggle" id="toggleCart" type="button" aria-expanded="false">${t('merch.bag')} <span id="cartCount">0</span></button></div>
 <div class="product-grid" id="productGrid">${products.map(productCard).join('')}</div>
 <!-- Prompt 22: isi keranjang (qty –, hapus, total otomatis) -->
 <div class="cart-box" id="cartBox" hidden aria-live="polite"></div>
 <!-- Prompt 23: order card – terpisah proporsional dari produk terakhir -->
 <div class="order-card"><div class="order-copy"><p class="eyebrow accent-orange">${t('merch.order.eyebrow')}</p><h3>${t('merch.order.h')}</h3><p class="lede">${t('merch.order.d')}</p><p class="order-note"><small>${t('merch.hero.lede')}</small></p></div><div class="order-actions"><button class="pill order-cta" id="checkoutWA" type="button">${t('merch.order.cta')}</button><button class="pill secondary" id="orderScrollTop" type="button" onclick="document.getElementById('productGrid').scrollIntoView({behavior:'smooth'})">${t('merch.order.cta2')}</button></div></div>
</section>`
}

/* ---------- GALLERY – editorial, live API ---------- */
function renderGalleryPageShell() {
 const labels = t('gallery.filters').split('|');
 const phOpts = t('gallery.ph.all');
 const perOpts = [12, 24].map(n => `<option value="${n}"${n === 12 ? ' selected' : ''}>${n}</option>`).join('');
 const searchHint = t('gallery.search.hint');
 return `
<section class="gallery-hero-blur">
 <section class="hero gallery-hero section-wrap" style="min-height:auto">
   <div class="hero-copy gallery-hero-copy">
    <p class="eyebrow">${t('gallery.hero.eyebrow')}</p>
    <h1>${t('gallery.hero.h')}</h1>
    <p class="hero-subtitle">${t('gallery.hero.lede.live')}</p>
   </div>
   <!-- Five Interactive Glass Highlight Panels — centered horizontal swap carousel -->
   <div class="hl-wrap">
    <button class="hl-arrow hl-arrow-l" id="hlPrev" type="button" aria-label="${t('hl.prev')}">‹</button>
    <div class="hl-carousel" id="hlCarousel" role="listbox" aria-label="${t('gallery.hero.eyebrow')}"></div>
    <button class="hl-arrow hl-arrow-r" id="hlNext" type="button" aria-label="${t('hl.next')}">›</button>
   </div>
 </section>
</section>
<section class="gallery-featured" id="galleryFeatured" hidden>
 <div class="section-wrap wide"><div class="gf-head"><p class="eyebrow accent-orange">${t('gallery.featured.eyebrow')}</p><h2>${t('gallery.featured.h')}</h2></div>
 <div class="gf-grid" id="gfGrid"></div></div>
</section>
<section class="gallery-shell"><div class="section-wrap wide" style="padding-top:clamp(28px,4vh,56px)">
 <div class="filters filters-scroll" id="galleryFilters">${labels.map((x, i) => `<button class="filter-btn ${i === 0? 'active' : ''}" data-filter="${x}">${x}</button>`).join('')}</div>
 <div class="gallery-tools">
   <div class="gallery-search-wrap">
    <input class="gallery-search" id="gallerySearch" type="search" placeholder="${t('gallery.search.ph')}" aria-label="${t('gallery.search.ph')}">
    <p class="gallery-search-hint">${searchHint}</p>
   </div>
   <select class="gallery-select" id="galleryPhotographer" aria-label="${t('gallery.ph.all')}"><option value="">${phOpts}</option></select>
   <label class="gallery-perpage" id="galleryPerPageWrap"><span>${t('gallery.perpage')}</span><select class="gallery-select gallery-select-sm" id="galleryPerPage" aria-label="${t('gallery.perpage')}">${perOpts}</select></label>
 </div>
 <div class="gallery-meta"><p class="gallery-count" id="galleryCount" aria-live="polite"></p></div>
 <div id="galleryStatus"></div><div class="gallery-grid" id="galleryGrid"></div>
 <div class="gallery-pager" id="galleryPager" hidden>
   <button class="gallery-pbtn" id="galleryPrev" type="button" aria-label="${t('gallery.prev')}">‹</button>
   <label class="gallery-jump"><span>${t('gallery.page')}</span><select class="gallery-select gallery-select-sm" id="galleryJump" aria-label="${t('gallery.page')}"></select></label>
   <p class="gallery-pageinfo" id="galleryPageInfo"></p>
   <button class="gallery-pbtn" id="galleryNext" type="button" aria-label="${t('gallery.next')}">›</button>
 </div>
 <div class="venue-note" style="margin-top:35px">${t('gallery.hero.lede')}</div></div>${infoEditorial()}</section>`
}

/* ---------- PARTNERSHIP – simple premium – cinematic sports ---------- */
function partnershipPage() {
 const pImg = 'assets/img/partnership/';
 return `
<section class="hero-p">
 <div class="hp-inner section-wrap">
 <p class="eyebrow hp-eyebrow">${t('part.hero.eyebrow')}</p>
 <h1>
 ${t('part.hero.h1')}
 <br>
 <span class="accent-orange">
 ${currentLang === 'en'
? t('part.hero.h2').replace(' WITH TOBA!', '')
 : t('part.hero.h2')}
 </span>
 ${currentLang === 'en'
? '<br><span class="accent-orange">WITH TOBA!</span>'
 : ''}
 </h1>
 <p class="hero-subtitle">${t('part.hero.lede')}</p>
 <div class="hero-actions"><a class="pill" href="#partnerForm">${t('part.cta.submit')}</a></div>
 <div class="hp-prev">
 <p class="hp-prev-label">${t('part.prev.label')}</p>
 <div class="hp-logos" data-reveal-step>
 <img src="${pImg}Logo Decathlon - Blue@2x.png" alt="Decathlon" loading="lazy">
 <img src="${pImg}SUMMAREON MALL BEKASI LOGO.png" alt="Summarecon Mall Bekasi" loading="lazy">
 </div>
 </div>
 </div>
</section>

<section class="part-opp-wrap" id="collabOpps">
 <div class="section-wrap">
 <div class="po-head" data-reveal-step>
 <p class="eyebrow">${t('part.ways')}</p>
 <h2>${t('part.h')}</h2>
 </div>
 <div class="po-court" aria-hidden="true" data-reveal-step>
 <div class="pc-layer pc-back" data-parallax="0.06"><svg class="pc-svg" viewBox="${-HW} ${-HH} ${HW*2} ${HH*2}" fill="none" stroke="#315A3B" stroke-opacity=".28" stroke-width="2.2" preserveAspectRatio="xMidYMid slice">${COURT_MARKINGS}</svg></div>
 <div class="pc-layer pc-mid" data-parallax="0.1"><svg class="pc-svg" viewBox="${-HW} ${-HH} ${HW*2} ${HH*2}" fill="none" stroke="#E8722A" stroke-opacity=".4" stroke-width="2" preserveAspectRatio="xMidYMid slice">${COURT_MARKINGS}</svg></div>
 <div class="pc-layer pc-front"><svg class="pc-svg" viewBox="${-HW} ${-HH} ${HW*2} ${HH*2}" fill="none" stroke="#242522" stroke-opacity=".5" stroke-width="1.6" preserveAspectRatio="xMidYMid slice">${COURT_MARKINGS}</svg></div>
 </div>
 <div class="po-tabs" data-reveal-step>
 <div class="po-tablist" role="tablist">${['k1','k2','k3','k4'].map((k,i)=>`<button class="po-tab${i===0?' active':''}" role="tab" data-cat="${k}" aria-selected="${i===0}">${t('part.'+k+'.t')}</button>`).join('')}</div>
 <div class="po-panels">${['k1','k2','k3','k4'].map((k,i)=>`<div class="po-panel${i===0?' active':''}" data-cat="${k}" role="tabpanel"><ul>${t('part.'+k+'.d').split('|').map(b=>`<li>${b}</li>`).join('')}</ul></div>`).join('')}</div>
 </div>
 <p class="po-more" data-reveal-step><span class="pm-1">${t('part.opp.more1')}</span><br><span class="pm-2">${t('part.opp.more2')}</span></p>
 </div>
</section>

<section class="section-wrap collab-showcase" id="pastCollabs">
 <div class="cs-intro" data-reveal-step>
 <p class="eyebrow">${t('cs.label')}</p>
 <h2>3X3 AUGUST RUSH</h2>
 <div class="cs-brands">
 <img src="${pImg}Logo Decathlon - Blue@2x.png" alt="Decathlon" loading="lazy">
 <img src="${pImg}SUMMAREON MALL BEKASI LOGO.png" alt="Summarecon Mall Bekasi" loading="lazy">
 </div>
 </div>
 <div class="cs-event" data-reveal-step>
 <figure class="cs-photo cs-a photo-frame"><img src="${pImg}IMG_4124.JPG" alt="${t('cs.alt')}"></figure>
 <figure class="cs-photo cs-b photo-frame"><img src="${pImg}IMG_4109.JPG" alt="${t('cs.alt')}" loading="lazy"></figure>
 <figure class="cs-photo cs-poster photo-frame"><img src="${pImg}fix poster smb.jpeg" alt="${t('cs.poster.alt')}"></figure>
 </div>
</section>

<section class="section-wrap part-inquiry" id="partnerForm">
 <div class="pi-grid">
 <div class="pi-copy" data-reveal-step>
 <p class="eyebrow">${t('part.form.eyebrow')}</p>
 <h2>${t('part.form.h')}</h2>
 <p class="lede">${t('part.form.lede')}</p>
 <div class="pi-contact">
 <a
 href="https://wa.me/6281285704946?text=Halo%20TOBA%20Community%2C%20saya%20tertarik%20untuk%20membahas%20peluang%20partnership%20atau%20kolaborasi%20bersama%20TOBA.%20Saya%20ingin%20berdiskusi%20lebih%20lanjut%20mengenai%20kemungkinan%20kerja%20sama%20ini.%20Terima%20kasih."
 target="_blank"
 rel="noopener noreferrer"
 >${t('part.contact.h')}</a>
 </div>
 </div>
 <form class="form-card" id="partnerInquiryForm"><div class="form-grid"><div class="field"><label for="name">${t('part.name')}</label><input id="name" name="name" required placeholder="${t('part.name.ph')}"></div><div class="field"><label for="org">${t('part.org')}</label><input id="org" name="org" placeholder="${t('part.org.ph')}"></div><div class="field"><label for="email">${t('part.contact')}</label><input id="email" name="email" required placeholder="${t('part.contact.ph')}"></div><div class="field"><label for="interest">${t('part.interest')}</label><select id="interest" name="interest"><option value="brand_product">${t('part.opt1')}</option><option value="event_tournament">${t('part.opt2')}</option><option value="coaching">${t('part.opt3')}</option><option value="official_crew">${t('part.opt4')}</option></select></div><div class="field"><label for="timing">${t('part.timing')}</label><input id="timing" name="timing" placeholder="${t('part.timing.ph')}"></div><div class="field"><label for="location">${t('part.location')}</label><input id="location" name="location" placeholder="${t('part.location.ph')}"></div><div class="field full"><label for="message">${t('part.message')}</label><textarea id="message" name="message" rows="4" required placeholder="${t('part.message.ph')}"></textarea></div><div class="field full"><button class="btn" type="submit">${t('part.send')}</button></div></div></form>
 </div>
</section>`
}

const page = document.body.dataset.page; const appEl = document.getElementById('app');
const renderers = { home, tobaladies: () => communityPage('tobaladies'), tobadeli: () => communityPage('tobadeli'), events: eventsPage, merchandise: merchPage, gallery: renderGalleryPageShell, partnership: partnershipPage };
if (page!== 'game') { appEl.innerHTML = (renderers[page] || home)(); }
document.querySelector(`[data-nav="${page}"]`)?.classList.add('active'); document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- partnership: interactive categories (one-time binding) ----------
 Bind via delegation so it survives language re-renders. */
document.addEventListener('click', e => {
 const tab = e.target.closest('.po-tab');
 if (!tab) return;
 const scope = tab.closest('.po-tabs');
 if (!scope) return;
 scope.querySelectorAll('.po-tab').forEach(b => { b.classList.toggle('active', b === tab); b.setAttribute('aria-selected', b === tab? 'true' : 'false'); });
 scope.querySelectorAll('.po-panel').forEach(p => p.classList.toggle('active', p.dataset.cat === tab.dataset.cat));
});

/* ---------- partnership: automatic tab rotation ---------- */
(() => {
 const ROTATION_DELAY = 4000;

 setInterval(() => {
 const scope = document.querySelector('.po-tabs');

 if (!scope ||!scope.getClientRects().length) return;

 // Jangan berpindah ketika pengunjung sedang berinteraksi
 if (
 scope.matches(':hover') ||
 scope.contains(document.activeElement)
 ) return;

 const tabs = [...scope.querySelectorAll('.po-tab')];

 if (tabs.length < 2) return;

 const activeIndex = tabs.findIndex(tab =>
 tab.classList.contains('active')
 );

 const nextIndex = (activeIndex + 1) % tabs.length;

 tabs[nextIndex].click();
 }, ROTATION_DELAY);
})();

/* ---------- nav: mega menu (desktop) + accordion drawer (mobile) ---------- */
(function () {
 const explore = document.getElementById('navExplore');
 const mega = document.getElementById('megaMenu');
 if (!explore ||!mega) return;
 const header = explore.closest('.site-header');
 const mq = window.matchMedia('(max-width: 1000px)');

 function openMega() { mega.hidden = false; requestAnimationFrame(() => { mega.classList.add('open'); explore.setAttribute('aria-expanded', 'true'); header?.classList.add('menu-context') }) }
 function closeMega() { mega.classList.remove('open'); explore.setAttribute('aria-expanded', 'false'); header?.classList.remove('menu-context'); setTimeout(() => { if (!mega.classList.contains('open')) mega.hidden = true }, 300) }

 explore.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); mega.classList.contains('open')? closeMega() : openMega() });
 document.addEventListener('click', e => { if (mega.classList.contains('open') &&!e.target.closest('.main-nav') &&!e.target.closest('#navExplore')) closeMega() });
 document.addEventListener('keydown', e => { if (e.key === 'Escape' && mega.classList.contains('open')) { closeMega(); explore.focus() } });
})();

const menuToggle = document.getElementById('menuToggle'), nav = document.getElementById('mainNav');
const backdrop = document.createElement('div');
backdrop.className = 'nav-backdrop';
/* the scrollable middle of the drawer – head + footer stay fixed */
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
 document.documentElement.style.overflow = open? 'hidden' : '';
 document.body.style.overflow = open? 'hidden' : '';
 backdrop.classList.toggle('show', open);
 if (open) {
 /* the mega markup renders as the drawer accordion – always visible */
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

/* PROMPT 2 Mobile Flip: orientasi berubah saat drawer terbuka – nav-scroll
 menyesuaikan ulang lewat resize; tidak ada yang tertutup header/CTA. */
window.addEventListener('orientationchange', () => {
 if (nav.classList.contains('open')) {
 nav.style.height = '100dvh';
 setTimeout(() => { nav.style.height = ''; }, 120);
 }
});

/* ---------- toast ---------- */
let toastTimer; function toast(msg) { const el = document.getElementById('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600) }

/* ---------- filters (preserved behavior) ---------- */
function setFilter(container, selector, filter) { container.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b.dataset.filter === filter)); document.querySelectorAll(selector).forEach(card => { const category = card.dataset.category || ''; card.style.display = (filter === 'All' || filter === 'All Events' || category === filter || category.includes(filter) || card.textContent.includes(filter))? '' : 'none' }); }
document.getElementById('eventFilters')?.addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (!b) return; setFilter(document.getElementById('eventFilters'), '.event-card', b.dataset.filter); if (b.dataset.filter === 'All Events') document.querySelectorAll('.event-card').forEach(c => c.style.display = '') });
/* Prompt 9: filter agenda di homepage – pakai setFilter yang sama (compat dengan Events) */
document.getElementById('agendaFilters')?.addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (!b) return; setFilter(document.getElementById('agendaFilters'), '#agendaGrid.event-card', b.dataset.filter); if (b.dataset.filter === 'All Events' || b.dataset.filter === 'Semua Event') document.querySelectorAll('#agendaGrid.event-card').forEach(c => c.style.display = '') });
document.getElementById('productFilters')?.addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (!b) return; setFilter(document.getElementById('productFilters'), '.product-card', b.dataset.filter === 'All'? 'All' : b.dataset.filter) });

/* ---------- P22: keranjang belanja + checkout WhatsApp ----------
 Nomor WA resmi TOBA yang sudah ada di konfigurasi (footer): 6281285704946.
 Tidak ada klaim pembayaran/pesanan – hanya template pesan rapi ke admin. */
const TOBA_WA = '6281285704946';
let cart = []; /* {p: product, qty: n} */
const cartTotal = () => cart.reduce((s, l) => s + l.p.price * l.qty, 0);
const cartCount = () => cart.reduce((s, l) => s + l.qty, 0);
function renderCartUI() {
 document.getElementById('cartCount').textContent = cartCount();
 const box = document.getElementById('cartBox');
 if (!box) return;
 if (!cart.length) { box.innerHTML = `<p class="cart-empty">${t('merch.empty')}</p>`; return; }
 box.innerHTML = cart.map((l, i) => `
 <div class="cart-line">
 <div class="cart-info"><strong>${l.p.name}</strong><span>${money(l.p.price)} – ${l.qty} = <b>${money(l.p.price * l.qty)}</b></span></div>
 <div class="cart-qty">
 <button type="button" class="cart-step" data-cart-step="-1" data-cart-line="${i}" aria-label="-">-</button>
 <span>${l.qty}</span>
 <button type="button" class="cart-step" data-cart-step="1" data-cart-line="${i}" aria-label="+">+</button>
 <button type="button" class="cart-del" data-cart-del="${i}" aria-label="Hapus">?</button>
 </div>
 </div>`).join('') + `<div class="cart-total"><span>${t('merch.total')}</span><b>${money(cartTotal())}</b></div>`;
}
document.addEventListener('click', e => {
 const add = e.target.closest('[data-product]');
 if (add) {
 const p = products[Number(add.dataset.product)];
 const line = cart.find(l => l.p === p); line? line.qty++ : cart.push({ p, qty: 1 });
 document.getElementById('cartCount').textContent = cartCount(); renderCartUI();
 toast(`${p.name} ${t('merch.added')}`);
 }
 const step = e.target.closest('[data-cart-step]');
 if (step) { const l = cart[Number(step.dataset.cartLine)]; l.qty += Number(step.dataset.cartStep); if (l.qty <= 0) cart.splice(Number(step.dataset.cartLine), 1); renderCartUI(); }
 const del = e.target.closest('[data-cart-del]');
 if (del) { cart.splice(Number(del.dataset.cartDel), 1); renderCartUI(); }
 const interest = e.target.closest('.event-interest'); if (interest) toast(`${t('ui.demo')} ${interest.dataset.event}. ${t('ui.demo2')}`)
});
document.getElementById('checkoutWA')?.addEventListener('click', () => {
 if (!cart.length) { toast(t('merch.empty')); return; }
 const lines = cart.map((l, i) =>
 `${i + 1}. ${l.p.name}\n ${t('merch.msg.qty')}: ${l.qty}\n ${t('merch.msg.price')}: ${money(l.p.price)}\n ${t('merch.msg.sub')}: ${money(l.p.price * l.qty)}`).join('\n');
 const msg = `${t('merch.msg.hello')}\n\n${t('merch.msg.detail')}:\n${lines}\n\n${t('merch.msg.total')}: ${money(cartTotal())}\n\n${t('merch.msg.confirm')} ${t('merch.msg.thanks')}!`;
 window.open('https://wa.me/' + TOBA_WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
 toast(t('merch.wa.open'));
});
document.getElementById('toggleCart')?.addEventListener('click', () => {
 const box = document.getElementById('cartBox');
 if (box) box.hidden =!box.hidden;
});
document.getElementById('partnerForm')?.addEventListener('submit', e => { e.preventDefault(); toast(t('part.sent')); e.target.reset() });document.getElementById('partnerInquiryForm')?.addEventListener('submit', e => {
 e.preventDefault();

 const form = e.target;
 const data = new FormData(form);

 const nama = data.get('name')?.trim() || '-';
 const organisasi = data.get('org')?.trim() || '-';
 const kontak = data.get('email')?.trim() || '-';
 const minat = data.get('interest')?.trim() || '-';
 const waktu = data.get('timing')?.trim() || '-';
 const lokasi = data.get('location')?.trim() || '-';
 const pesan = data.get('message')?.trim() || '-';

 const message = `Halo Tim TOBA Community!

Saya ingin mengajukan permintaan kolaborasi / partnership bersama TOBA Community.

Berikut detail pengajuan saya:

Nama: ${nama}
Organisasi / Brand: ${organisasi}
Email / WhatsApp: ${kontak}
Jenis Kolaborasi: ${minat}
Rencana Waktu: ${waktu}
Lokasi: ${lokasi}

Detail Kebutuhan:
${pesan}

Saya berharap kita bisa berdiskusi lebih lanjut mengenai peluang kerja sama ini.

Terima kasih!
`;

 const waUrl = 'https://wa.me/6281285704946?text=' + encodeURIComponent(message);

 window.open(waUrl, '_blank', 'noopener');
});
/* Prompt 9/21: "Kembali ke atas" dihapus dari semua halaman – guard agar error tidak muncul jika markup sisa */
document.getElementById('backTop')?.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) });

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
 if (other!== q) {
 other.setAttribute('aria-expanded', 'false');
 other.parentElement.classList.remove('open');
 }
 });
 q.setAttribute('aria-expanded', String(!open));
 item.classList.toggle('open',!open);
 });
 });
}

/* ---------- language re-render (preserved) ---------- */
document.addEventListener('toba:langchange', () => { if (page === 'game') return; appEl.innerHTML = (renderers[page] || home)(); document.querySelector(`[data-nav="${page}"]`)?.classList.add('active'); if (page === 'gallery') { galleryState === 'ok'? renderGalleryUI() : loadGallery(); } initReveal(); initStorySteps(); initParallax(); initKinetic(); initPointerScene(); initMerchTilt(); initFaq(); window.__cineReset && window.__cineReset(); window.__starsReset && window.__starsReset(); });

/* ---------- reveal system (preserved + clip reveal for images) ---------- */
const revealObserver = ('IntersectionObserver' in window)? new IntersectionObserver(es => { es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target) } }) }, { threshold:.12 }) : null;
function initReveal() {
 const els = document.querySelectorAll('.section-wrap,.event-card,.product-card,.community-card,.photo-frame,.dark-section,.tl-founder-photo,.tl-story-photo');
 els.forEach((el, i) => {
 if (!revealObserver) { el.classList.add('in'); return }
 /* never stack.reveal on elements that already carry img-reveal (would double-hide) */
 if (!el.classList.contains('img-reveal')) el.classList.add(el.classList.contains('photo-frame')? 'img-reveal' : 'reveal');
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
const stepObserver = ('IntersectionObserver' in window)? new IntersectionObserver(es => {
 es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('step-in'); stepObserver.unobserve(en.target) } })
}, { threshold:.08 }) : null;
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
 data-parallax vertical speed (e.g. 0.08 = moves 8% of viewport offset)
 data-parallax-x horizontal drift speed
 data-parallax-rotate slow rotation (degrees per viewport of progress)
 data-parallax-scale subtle scale change at viewport edges
 Touch devices get half intensity; prefers-reduced-motion disables everything. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const softTouch = window.matchMedia('(pointer: coarse)').matches? 0.5 : 1;
let pxEls = [], pTick = false;
function initParallax() {
 pxEls = [...document.querySelectorAll('[data-parallax]')].map(el => ({
 el,
 sp: (parseFloat(el.dataset.parallax) || 0) * softTouch,
 sx: (parseFloat(el.dataset.parallaxX) || 0) * softTouch,
 rot: (parseFloat(el.dataset.parallaxRotate) || 0) * softTouch,
 sc: (parseFloat(el.dataset.parallaxScale) || 0) * softTouch
 }));
 if (reduceMotion ||!pxEls.length) return;
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
window.addEventListener('scroll', () => { if (!pTick &&!reduceMotion) { pTick = true; requestAnimationFrame(updateParallax) } }, { passive: true });
window.addEventListener('resize', () => { if (!pTick &&!reduceMotion) { pTick = true; requestAnimationFrame(updateParallax) } }, { passive: true });
initParallax();

/* ---------- kinetic typography: per-line reveal (scoped by.kinetic parent) ----------
 Splits only the hero H1s into masked lines – headings stay semantic (H1/H2). */
function initKinetic() {
 if (reduceMotion) return;
 document.querySelectorAll('.kinetic h1,.kinetic.hero-subtitle').forEach(node => {
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
 if (reduceMotion ||!window.matchMedia('(pointer: fine)').matches) return;
 const scene = document.querySelector('.hero-home');
 if (!scene || scene.dataset.pointerScene) return;
 scene.dataset.pointerScene = '1';
 let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
 const loop = () => {
 cx += (tx - cx) *.05; cy += (ty - cy) *.05;
 scene.querySelectorAll('[data-pointer-depth]').forEach(layer => {
 const d = parseFloat(layer.dataset.pointerDepth) || 0;
 layer.style.translate = `${(cx * d).toFixed(2)}px ${(cy * d).toFixed(2)}px`;
 });
 if (Math.abs(tx - cx) >.05 || Math.abs(ty - cy) >.05) raf = requestAnimationFrame(loop); else raf = null;
 };
 scene.addEventListener('mousemove', e => {
 tx = (e.clientX / window.innerWidth -.5) * 2;
 ty = (e.clientY / window.innerHeight -.5) * 2;
 if (!raf) raf = requestAnimationFrame(loop);
 }, { passive: true });
}

/* ---------- crocodile-eye cursor interaction (hero, pointer devices only) ---------- */
if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
 const croc = document.querySelector('.hero-croc img');
 if (croc) {
 let cx = 0, cy = 0, tx = 0, ty = 0, raf = null;
 const loop = () => { cx += (tx - cx) *.06; cy += (ty - cy) *.06; croc.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`; if (Math.abs(tx - cx) >.1 || Math.abs(ty - cy) >.1) raf = requestAnimationFrame(loop); else raf = null };
 document.addEventListener('mousemove', e => {
 const nx = e.clientX / window.innerWidth -.5, ny = e.clientY / window.innerHeight -.5;
 tx = nx * 18; ty = ny * 12;
 if (!raf) raf = requestAnimationFrame(loop);
 }, { passive: true });
 }
}

/* first paint: run after all definitions (no TDZ issues) */
initKinetic();
initPointerScene();
initFaq();

/* =====================================================================
 PROMPT 54-55 – CINEMATIC SCROLL ENGINE – hero collage drifts RIGHT
 as the user scrolls (no hijack: pure rAF + scrollY). Layer speeds come
 from data-cine-h (0=still, 1=fast). Reduced-motion skips everything.
 ===================================================================== */
(function cineHeroScroll(){
 if (document.body.dataset.page!== 'home') return;
 if (reduceMotion) return;
 const layers = [...document.querySelectorAll('.hc-photo[data-cine-h]')].map(el => ({
 el, h: parseFloat(el.dataset.cineH) || 0
 }));
 if (!layers.length) return;
 let ticking = false;
 function update(){
 ticking = false;
 const y = window.scrollY;
 layers.forEach(l => {
 /* drift to the right proportional to scroll; cap so layers stay inside hero */
 const x = Math.min(y * l.h * 0.42, 260);
 const rise = Math.min(y * l.h * 0.06, 36); /* slight upward lift */
 l.el.style.transform = `translate3d(${x.toFixed(1)}px, ${(-rise).toFixed(1)}px, 0)`;
 });
 }
 window.addEventListener('scroll', () => {
 if (!ticking) { ticking = true; requestAnimationFrame(update); }
 }, { passive: true });
 update();
})();


/* ---------- merch tilt + event stagger (re-runnable) ---------- */
function initMerchTilt() {
 if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
 document.body.classList.add('tilt-on');
 document.querySelectorAll('.product-card').forEach(card => {
 if (card.dataset.tiltBound) return;
 card.dataset.tiltBound = '1';
 card.addEventListener('mousemove', e => {
 const r = card.getBoundingClientRect();
 const nx = (e.clientX - r.left) / r.width -.5, ny = (e.clientY - r.top) / r.height -.5;
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


/* =====================================================================
 PROMPT 57 – STARFIELD ENGINE – cinematic depth particles (canvas)
 ===================================================================== */
(function starfield(){
 if (document.body.dataset.page!== 'home') return;
 if (reduceMotion) return;
 let canvas = null, ctx = null, raf = 0, running = false, stars = [], W = 0, H = 0;
 const mobile = window.matchMedia('(max-width: 760px)').matches;
 const COUNT = mobile? 55 : 130;
 const COLORS = ['255,255,255', '214,234,222', '190,220,200'];

 function init(){
 canvas = document.getElementById('tobaStars');
 if (!canvas) return;
 if (canvas.dataset.bound) return;
 canvas.dataset.bound = '1';
 ctx = canvas.getContext('2d');
 resize(); seed();
 window.addEventListener('resize', onResize, { passive: true });
 const sec = document.getElementById('cineReviews');
 if ('IntersectionObserver' in window && sec) {
 new IntersectionObserver(es => es.forEach(en => {
 en.isIntersecting? wake() : sleep();
 }), { rootMargin: '60px' }).observe(sec);
 } else wake();
 document.addEventListener('visibilitychange', () => document.hidden? sleep() : wake());
 }
 function resize(){
 const r = canvas.parentElement.getBoundingClientRect();
 const dpr = Math.min(window.devicePixelRatio || 1, 2);
 W = r.width; H = r.height;
 canvas.width = W * dpr; canvas.height = H * dpr;
 ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 }
 function onResize(){ clearTimeout(starfield._rz); starfield._rz = setTimeout(() => { resize(); seed(); if (!running) draw(0); }, 160); }
 function seed(){
 stars = Array.from({ length: COUNT }, (_, i) => ({
 x: Math.random() * W,
 y: Math.random() * H,
 z: 0.25 + Math.random() * 0.75,
 r: (0.6 + Math.random() * 1.7) * (mobile? 0.85 : 1),
 baseA: 0.18 + Math.random() * 0.5,
 tw: 0.4 + Math.random() * 1.6,
 ph: Math.random() * Math.PI * 2,
 vy: 2 + Math.random() * 7,
 c: COLORS[i % COLORS.length]
 }));
 }
 let lastT = 0;
 function draw(t){
 raf = 0;
 const dt = lastT? Math.min((t - lastT) / 1000,.05) :.016;
 lastT = t;
 ctx.clearRect(0, 0, W, H);
 for (const s of stars) {
 s.y -= s.vy * s.z * dt;
 if (s.y < -4) { s.y = H + 4; s.x = Math.random() * W; }
 const a = s.baseA * (0.72 + 0.28 * Math.sin(s.ph + t / 1000 * s.tw));
 ctx.beginPath();
 ctx.arc(s.x, s.y, s.r * (0.5 + s.z * 0.5), 0, Math.PI * 2);
 ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
 ctx.fill();
 }
 if (running) raf = requestAnimationFrame(draw);
 }
 function wake(){ if (running || reduceMotion) return; running = true; lastT = 0; raf = requestAnimationFrame(draw); }
 function sleep(){ running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
 window.__starsReset = () => { sleep(); if (canvas) delete canvas.dataset.bound; init(); };
 init();
})();

/* =====================================================================
 HERO SVG CUTOUT — CENTER STAGE PLAYER CAROUSEL (redesign 2026-11)
 =====================================================================
 Konsep visual baru: PLAYER CUTOUT CENTER STAGE.
 • SATU pemain utama besar di tengah (main), dua pemain preview lebih
 kecil (~50%) di kiri & kanan sebagai depth/preview.
 • Satu sistem index + satu timer autoplay (~4.5s), looping tanpa jeda.
 • Swipe (mobile) & drag (desktop) mengganti pemain; interaksi manual
 mereset timer autoplay.
 • GROUP PHOTO slideshow landscape terpisah — timer sendiri (7s).
 • BOLA BASKET tetap elemen persisten + modul fisika interaktif lama
 (.hero-cut-img.cut-ball) tidak disentuh.
 Arsitektur:
 - renderPlayerCarousel() : 1 sumber DOM (stage.tier-main/left/right)
 - applyCarousel() : transform/opacity by tier — smooth, loop
 - startPlayerAuto/stopPlayerAuto : SATU timer autoplay pemain
 - groupTimer : SATU timer slideshow grup (7s)
 - restartHeroCut() : kompatibel event 'toba:langchange'
 - buildLocal()/prepareApiPhotos() : fallback lokal + Google Sheets API
 (endpoint, cache & JSONP TIDAK diubah)
 ===================================================================== */
(function heroCutShow() {
 if (document.body.dataset.page!== 'home') return;
 const CUT = 'assets/img/cutout/';
 let box = document.getElementById('heroCutShow');
 let groupBox = document.getElementById('heroGroupShow');
 if (!box) return;
 const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

 /* ---- GOOGLE SHEETS API (api=hero, JSONP) — TIDAK DIUBAH ---- */
 const HERO_API = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
 const HERO_CACHE_KEY = 'tobaHeroCache.v4';
 const HERO_CACHE_TTL = 5 * 60 * 1000;

 function heroCacheRead() {
 try {
 const raw = sessionStorage.getItem(HERO_CACHE_KEY);
 if (!raw) return null;
 const obj = JSON.parse(raw);
 if (!obj ||!Array.isArray(obj.photos) || (Date.now() - obj.ts) > HERO_CACHE_TTL) return null;
 return obj.photos;
 } catch (_) { return null; }
 }
 function heroCacheWrite(photos) {
 try { sessionStorage.setItem(HERO_CACHE_KEY, JSON.stringify({ ts: Date.now(), photos: photos })); } catch (_) { }
 }

 let heroJsonp = null;
 function heroFetchApi(cb) {
 const cached = heroCacheRead();
 if (cached) { cb(cached, 'cache'); return; }
 if (heroJsonp) { clearTimeout(heroJsonp.timeout); heroJsonp.script.remove(); heroJsonp = null; }
 const old = document.getElementById('tobaHeroJsonp'); if (old) old.remove();
 const script = document.createElement('script');
 script.id = 'tobaHeroJsonp';
 script.src = HERO_API + '?api=hero&callback=tobaHeroCallback';
 heroJsonp = { script: script, timeout: setTimeout(() => { heroJsonp = null; cb(null, 'timeout'); }, 15000) };
 script.onerror = () => { heroJsonp = null; cb(null, 'network'); };
 document.body.appendChild(script);
 }

 let heroImageRequestId = 0;
 function heroFetchSvg(photoId) {
 return new Promise(resolve => {
 const callbackName = 'tobaHeroImageCallback' + (++heroImageRequestId);
 const script = document.createElement('script');
 let finished = false;
 const cleanup = result => {
 if (finished) return;
 finished = true;
 clearTimeout(timer);
 script.remove();
 delete window[callbackName];
 resolve(result);
 };
 window[callbackName] = res => {
 const photo = res?.photos?.find(item => item.photoId === photoId);
 const dataUrl = photo?.imageDataUrl;
 if (res?.success && typeof dataUrl === 'string' && dataUrl.startsWith('data:image/svg+xml;base64,')) {
 cleanup(dataUrl);
 } else {
 console.warn('[TOBA Hero] SVG tidak tersedia:', photoId, res);
 cleanup(null);
 }
 };
 const timer = setTimeout(() => { console.warn('[TOBA Hero] timeout SVG:', photoId); cleanup(null); }, 20000);
 script.onerror = () => cleanup(null);
 script.src = HERO_API + '?api=hero&callback=' + callbackName + '&photoId=' + encodeURIComponent(photoId);
 document.body.appendChild(script);
 });
 }

 window.tobaHeroCallback = async function (res) {
 if (heroJsonp) { clearTimeout(heroJsonp.timeout); heroJsonp.script.remove(); heroJsonp = null; }
 const out = [];
 if (res && res.success && Array.isArray(res.photos)) {
 const photos = res.photos.filter(p =>
 p && (p.active === undefined || p.active === true || p.active === 'TRUE' || p.active === 'true') && p.photoId
 );
 for (const p of photos) {
 const imageDataUrl = await heroFetchSvg(p.photoId);
 if (!imageDataUrl) { console.warn('[TOBA Hero] SVG gagal:', p.photoId); continue; }
 out.push({
 id: p.photoId,
 title: String(p.title || '').trim(),
 type: (p.photoType || 'PLAYER').toUpperCase(),
 role: (p.displayRole || 'SECONDARY').toUpperCase(),
 order: Number(p.displayOrder) || 99,
 alt: p.altText || p.title || 'Foto TOBA Community',
 url: imageDataUrl
 });
 }
 out.sort((a, b) => a.order - b.order);
 heroCacheWrite(out);
 }
 if (heroApiDone) heroApiDone(out.length? out : null, out.length? 'api' : 'empty');
 };

 let heroApiDone = null;

 /* preload + validasi gambar; gagal load → dibuang */
 function validatePhotos(list, cb) {
 if (!list ||!list.length) { cb([]); return; }
 let left = list.length;
 const ok = [];
 list.forEach(p => {
 const im = new Image();
 im.decoding = 'async';
 let settled = false;
 const done = good => {
 if (settled) return;
 settled = true;
 if (good) ok.push(Object.assign(p, { img: im }));
 else console.warn('[TOBA Hero] gambar gagal dimuat:', p.id, p.title, p.url);
 if (--left === 0) cb(ok.sort((a, b) => a.order - b.order));
 };
 im.onload = () => done(true);
 im.onerror = () => done(false);
 im.src = p.url;
 setTimeout(() => { if (!im.complete) done(false); }, 12000);
 });
 }

 /* fallback aset lokal (dipakai bila API gagal/kosong) */
 const PLAYER_PLAN = [
 { file: 'fuzisal.svg', cls: 'cut-p2' },
 { file: 'bola basket.svg', cls: 'cut-p3', ball: true },
 { file: 'vina.svg', cls: 'cut-p4' },
 { file: 'yuki.svg', cls: 'cut-p5' },
 { file: 'mandy.svg', cls: 'cut-p6' },
 { file: 'dw nai.svg', cls: 'cut-p7' },
 { file: 'zia.svg', cls: 'cut-p8' },
 { file: 'yuiii.svg', cls: 'cut-p10' },
 { file: 'dw.svg', cls: 'cut-p11' },
 { file: 'anon.svg', cls: 'cut-p12' }
 ];
 const GROUP_PLAN = [
 { file: 'grup dina.svg', cls: 'cut-p1', type: 'group' },
 { file: 'grup lastri.svg', cls: 'cut-p9', type: 'group' }
 ];
 const PLAN = PLAYER_PLAN.concat(GROUP_PLAN);

 /* preload semua aset sekali */
 const cache = {};
 PLAN.forEach(p => {
 const i = new Image();
 i.src = CUT + encodeURIComponent(p.file);
 i.decoding = 'async';
 cache[p.file] = i;
 });

 let ball = null; /* bola: elemen persisten, di luar carousel */
 let playerSources = []; /* daftar foto pemain { img, alt, id } */
 let groupPhotos = [];
 let groupTimer = 0;
 let groupIndex = 0;
 let playerIndex = 0;
 let playerTimer = 0;

 const AUTO_MS = 4500; /* autoplay player carousel */
 const GROUP_MS = 7000; /* slideshow foto grup */
 const isDesktop = () => window.matchMedia('(min-width: 761px)').matches;

 /* ---------- GROUP SLIDESHOW (landscape, timer terpisah 7s) ---------- */
 function renderGroupSlideshow(list) {
 if (!groupBox) return;
 clearTimeout(groupTimer);
 groupTimer = 0;
 groupIndex = 0;
 groupBox.innerHTML = '';
 if (!list ||!list.length) return;
 const nodes = list.map(photo => {
 const img = photo.img.cloneNode(false);
 img.className = 'hero-group-img';
 img.alt = photo.alt || 'Foto kegiatan TOBA Community';
 img.setAttribute('aria-hidden', 'true');
 groupBox.appendChild(img);
 return img;
 });
 nodes.forEach((img, i) => { img.style.opacity = i === 0? '1' : '0'; });
 if (reduce || nodes.length < 2) return;
 function rotateGroup() {
 const prev = groupIndex;
 groupIndex = (groupIndex + 1) % nodes.length;
 nodes[prev].style.opacity = '0';
 nodes[groupIndex].style.opacity = '1';
 groupTimer = setTimeout(rotateGroup, GROUP_MS);
 }
 groupTimer = setTimeout(rotateGroup, GROUP_MS);
 }

 /* ---------- CENTER STAGE PLAYER CAROUSEL ---------- */
 function makePlayerNode(src) {
 const node = src.img.cloneNode(false);
 node.className = 'hero-cut-img player-img';
 node.alt = src.alt || '';
 node.setAttribute('aria-hidden', 'true');
 node.loading = 'eager';
 node.decoding = 'async';
 node.draggable = false;
 return node;
 }

 function makeBallNode(src) {
 const node = src.img.cloneNode(false);
 node.className = 'hero-cut-img cut-ball';
 node.alt = '';
 node.setAttribute('aria-hidden', 'true');
 node.loading = 'eager';
 node.decoding = 'async';
 return node;
 }

 function findBallSource(list) {
 const apiBall = list.find(p => p.type === 'BALL');
 if (apiBall) return { img: apiBall.img, alt: apiBall.alt };
 const f = PLAN.find(p => p.ball);
 return f && cache[f.file] && cache[f.file].complete && cache[f.file].naturalWidth > 0
? { img: cache[f.file], alt: '' } : null;
 }

 function renderPlayerCarousel() {
 if (!box) return;
 ball = null;

 /* stage + ball layer PERSISTEN: dibuat sekali per BOX. Listener gesture
 menempel di box? tidak pernah ter-drop saat re-render pemain. */
 let stage = box.querySelector('.cut-stage');
 if (!stage) {
 box.innerHTML = '';
 stage = document.createElement('div');
 stage.className = 'cut-stage';
 box.appendChild(stage);
 }
 let ballLayer = box.querySelector('.cut-ball-layer');
 if (!ballLayer) {
 ballLayer = document.createElement('div');
 ballLayer.className = 'cut-ball-layer';
 box.appendChild(ballLayer);
 }

 const bs = findBallSource(currentList);
 if (bs) { ball = makeBallNode(bs); ballLayer.innerHTML = ''; ballLayer.appendChild(ball); }

 applyCarousel(true);
 }

 let currentList = [];
 function applyCarousel(instant) {
 const stage = box? box.querySelector('.cut-stage') : null;
 if (!stage) return;
 const n = playerSources.length;
 if (!n) { stage.innerHTML = ''; return; }
 const idx = ((playerIndex % n) + n) % n;
 const at = k => playerSources[((idx + k) % n + n) % n];

 stage.innerHTML = '';
 const tiers = [
 { src: at(-1), cls: 'tier-side tier-left' },
 { src: at(0), cls: 'tier-main' },
 { src: at(1), cls: 'tier-side tier-right' }
 ];
 const showAll = n >= 3;
 tiers.forEach((t, pos) => {
 if (!showAll && pos!== 1) return; /* <3 foto → hanya main */
 const el = makePlayerNode(t.src);
 el.classList.add(...t.cls.split(' '));
 if (t.cls === 'tier-main') el.classList.add('cut-on');
 else if (!instant) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('cut-on')));
 else el.classList.add('cut-on');
 stage.appendChild(el);
 });
 }

 function nextPlayer(dir) {
 const n = playerSources.length;
 if (!n) return;
 playerIndex = (((playerIndex + dir) % n) + n) % n;
 applyCarousel(false);
 }

 function startPlayerAuto() {
 stopPlayerAuto();
 if (reduce || playerSources.length < 2) return;
 playerTimer = setInterval(() => nextPlayer(1), AUTO_MS);
 }
 function stopPlayerAuto() {
 if (playerTimer) { clearInterval(playerTimer); playerTimer = 0; }
 }
 function resetPlayerAuto() { stopPlayerAuto(); startPlayerAuto(); }

 /* --- swipe (mobile) + drag (desktop): pointer events, threshold 40px --- */
 function bindGestures() {
 if (!box || box.dataset.heroGestures) return;
 box.dataset.heroGestures = '1';
 let startX = 0, startY = 0, active = false, moved = false;
 box.addEventListener('pointerdown', e => {
 if (e.target.closest('.hero-cut-img.cut-ball')) return; /* bola = fisika lama */
 startX = e.clientX; startY = e.clientY; active = true; moved = false;
 }, { passive: true });
 box.addEventListener('pointermove', e => {
 if (!active) return;
 const dx = e.clientX - startX, dy = e.clientY - startY;
 if (!moved && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) moved = true;
 }, { passive: true });
 const end = e => {
 if (!active) return;
 active = false;
 const dx = e.clientX - startX, dy = e.clientY - startY;
 if (moved && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
 nextPlayer(dx < 0? 1 : -1);
 resetPlayerAuto();
 }
 };
 box.addEventListener('pointerup', end, { passive: true });
 box.addEventListener('pointercancel', () => { active = false; }, { passive: true });
 }

 /* ---------- DATA SOURCES: lokal dulu, API Sheets menyusul ---------- */
 function buildLocal() {
 /* preload SVG lokal bisa belum selesai di first paint – retry sampai
 aset siap (biasanya <1s, aset sudah dipreload oleh cache[]) */
 const okImg = i => i && i.complete && i.naturalWidth > 0;
 const localPlayers = PLAN
.filter(p =>!p.type &&!p.ball)
.map(p => ({ img: cache[p.file], alt: '', id: p.file }))
.filter(p => okImg(p.img));
 const localGroups = PLAN
.filter(p => p.type === 'group')
.map(p => ({ img: cache[p.file], alt: 'Foto kegiatan TOBA Community' }))
.filter(p => okImg(p.img));
 if (!localPlayers.length ||!localGroups.length) {
 if (buildLocal.tries === undefined) buildLocal.tries = 0;
 if (++buildLocal.tries < 40) { setTimeout(buildLocal, 250); return; }
 console.warn('[TOBA Hero] aset lokal belum siap – tampilkan apa adanya');
 }
 buildLocal.tries = 0;
 /* FIX bug "gambar grup baru muncul setelah refresh": kalau grup lokal
 masih belum siap tapi pemain sudah, render yang ada dulu – lalu pantau
 image yang belum selesai dan render ulang begitu grup siap. Tanpa ini,
 group slideshow dirender kosong dan hanya pulih setelah API (bisa 15s+
 atau gagal) – refresh manual jadi satu-satunya jalan keluar. */
 if (!localGroups.length && localPlayers.length) {
 const pending = PLAN.filter(p => p.type === 'group')
.map(p => cache[p.file]).filter(i => i &&!okImg(i));
 if (pending.length) {
 pending.forEach(i => { i.onload = i.onerror = () => { buildLocal.tries = 99; }; });
 const recheck = setInterval(() => {
 const ready = PLAN.filter(p => p.type === 'group')
.map(p => cache[p.file]).filter(okImg);
 if (ready.length) { clearInterval(recheck); buildLocal(); }
 }, 400);
 setTimeout(() => clearInterval(recheck), 15000);
 }
 }
 playerSources = localPlayers;
 currentList = localPlayers.concat(localGroups);
 renderGroupSlideshow(localGroups);
 renderPlayerCarousel();
 bindGestures();
 startPlayerAuto();
 }

 function prepareApiPhotos(list) {
 groupPhotos = list.filter(p => p.type === 'GROUP');
 if (groupPhotos.length) renderGroupSlideshow(groupPhotos);
 const players = list.filter(p => p.type === 'PLAYER');
 if (players.length) {
 /* PRIMARY dari Sheet jadi titik awal carousel */
 const pi = players.findIndex(p => p.role === 'PRIMARY');
 if (pi > 0) players.unshift(players.splice(pi, 1)[0]);
 playerSources = players.map(p => ({ img: p.img, alt: p.alt, id: p.id }));
 currentList = list;
 playerIndex = 0;
 renderPlayerCarousel();
 resetPlayerAuto();
 console.info('[TOBA Hero] carousel memuat', players.length, 'pemain dari Google Sheets');
 } else if (list.some(p => p.type === 'BALL')) {
 /* hanya bola baru dari API → refresh bola saja */
 renderPlayerCarousel();
 }
 }

 function startComposition() {
 stopPlayerAuto();
 clearTimeout(groupTimer); groupTimer = 0;
 buildLocal();
 heroFetchApi(list => {
 if (list && list.length) {
 validatePhotos(list, ok => {
 if (ok.length) prepareApiPhotos(ok);
 else console.warn('[TOBA Hero] gambar API gagal dimuat — tetap pakai aset lokal');
 });
 } else {
 console.warn('[TOBA Hero] API tidak merespons — tetap pakai aset lokal');
 }
 });
 }

 /* ---- kompatibilitas pergantian bahasa ('toba:langchange') ----
 re-render bahasa membangun ulang DOM home → elemen lama hilang.
 restartHeroCut(): stop semua timer, ambil elemen BARU, render ulang.
 Timer listener dipasang SEKALI di luar (tidak bertambah). */
 function restartHeroCut() {
 stopPlayerAuto();
 clearTimeout(groupTimer); groupTimer = 0;
 box = document.getElementById('heroCutShow');
 groupBox = document.getElementById('heroGroupShow');
 if (!box) return;
 ball = null;
 playerSources = [];
 groupPhotos = [];
 groupIndex = 0;
 playerIndex = 0;
 if (groupBox) groupBox.innerHTML = '';
 if (isDesktop() &&!box.classList.contains('hero-cut-desktop')) box.classList.add('hero-cut-desktop');
 startComposition();
 }

 document.addEventListener('toba:langchange', () => {
 if (document.body.dataset.page === 'home') restartHeroCut();
 });

 if (isDesktop() &&!box.classList.contains('hero-cut-desktop')) box.classList.add('hero-cut-desktop');

 if (reduce) {
 /* reduced-motion: satu frame statis, tanpa autoplay, tanpa gesture timer */
 buildLocal();
 stopPlayerAuto();
 return;
 }

 startComposition();

 /* hemat resource: tab tersembunyi → timer berhenti; kembali → lanjut */
 document.addEventListener('visibilitychange', () => {
 if (document.hidden) { stopPlayerAuto(); clearTimeout(groupTimer); groupTimer = 0; }
 else {
 startPlayerAuto(); if (groupPhotos.length > 1 || groupBox?.children.length > 1) {
 clearTimeout(groupTimer);
 groupTimer = setTimeout(() => {
 const imgs = groupBox? [...groupBox.querySelectorAll('.hero-group-img')] : [];
 if (imgs.length > 1) {
 const prev = groupIndex;
 groupIndex = (groupIndex + 1) % imgs.length;
 imgs[prev].style.opacity = '0';
 imgs[groupIndex].style.opacity = '1';
 groupTimer = setTimeout(arguments.callee, GROUP_MS);
 }
 }, GROUP_MS);
 }
 }
 });
 window.addEventListener('pagehide', () => { stopPlayerAuto(); clearTimeout(groupTimer); });
})();
/* ---------- home hero entrance: staged reveal after the welcome intro ----------
 The river + copy fade in as one choreographed moment; if the intro is skipped
 or reduced-motion is on, the hero settles immediately. */
(function () {
 if (document.body.dataset.page!== 'home') return;
 const hero = document.querySelector('.hero-home');
 if (!hero) return;
 const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const settle = () => requestAnimationFrame(() => hero.classList.add('in'));
 if (reduce ||!document.getElementById('tobaIntro')) settle();
 else {
 document.addEventListener('toba:introdone', settle, { once: true });
 /* safety nets: intro removed externally, or its script never fires */
 const poll = setInterval(() => { if (!document.getElementById('tobaIntro')) { clearInterval(poll); settle(); } }, 300);
 setTimeout(() => { clearInterval(poll); settle(); }, 3000);
 }
})();

/* ---------- P11/P12: marquee TOBA APPAREL – kalimat seamless, warna orange.
 Dibangun di sini (bukan inline HTML) supaya tiap item identik: loop modulo
 tanpa celah, teks tidak pernah terpotong di tengah kalimat. ---------- */
(function marqueeApparel(){
 const inner = document.querySelector('.cine-marquee-inner');
 if (!inner) return;
 
 const shirtIcon = '<svg class="cm-product-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4 4 6 2 11l4 2 2-3v10h8V10l2 3 4-2-2-5-4-2c-1 2-7 2-8 0Z"/></svg>';

 const ballIcon = '<svg class="cm-product-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3c-2 5-2 13 0 18M3 12h18M5.6 5.6c4 2 8.8 2 12.8 0M5.6 18.4c4-2 8.8-2 12.8 0"/></svg>';

 const sockIcon = '<svg class="cm-product-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h7v10l5 4c1 1 0 4-2 4H7c-3 0-4-3-2-5l3-3Z"/><path d="M8 7h7"/></svg>';

 const phrase =
 '<span class="cm-toba">TOBA APPAREL</span>' +
 shirtIcon +
 '<span class="cm-apparel">GET YOURS NOW</span>' +
 ballIcon +
 '<span class="cm-other">WEAR YOUR COMMUNITY ANYTIME, ANYWHERE</span>' +
 sockIcon;

 inner.innerHTML = '<div class="cine-m-track" data-dir="rtl" data-speed="38"><div class="cine-m-inner">'
 + `<span class="cine-m-item">${phrase}</span>`
 + `<span class="cine-m-item" aria-hidden="true">${phrase}</span>`
 + `<span class="cine-m-item" aria-hidden="true">${phrase}</span>`
 + `<span class="cine-m-item" aria-hidden="true">${phrase}</span>`
 + '</div></div>';
})();

/* =====================================================================
 PROMPT 1-10 – CINEMATIC ENGINE – namespace.cine-, lifecycle-controlled
 All loops are IntersectionObserver-gated, rAF-driven, and cleaned up.
 Marquee/gallery never mutate DOM; position accumulates continuously so
 a pause/resume never causes a jump. Reduced-motion disables everything.
 ===================================================================== */
(function cineEngine(){
 if (document.body.dataset.page!== 'home') return;
 if (reduceMotion) return; /* reduced motion: konten tetap tampil statis */

 const sec = sel => document.querySelector(sel);
 const cineGal = sec('.cine-gallery');
 const cineApp = sec('.cine-apparel') || sec('.cine-marquee');
 const cineRev = sec('.cine-reviews');

 /* ---------- SHARED STATE ---------- */
 const tracks = []; /* {el, dir, speed, pos, half} – marquee + gallery rows */
 const vis = new Map(); /* section element -> visible flag */
 let lastT = 0, rafId = 0;
 const clamp = (v,a,b)=>Math.min(b,Math.max(a,v));
 const dpr = () => clamp(window.devicePixelRatio || 1, 1, 2);
 /* Prompt 42/43: ukur ulang saat semua aset siap (font/gambar) */
 window.addEventListener('load', () => { cineEngine._measured = false; }, { once: true });

 function measureTrack(tr){
 const seq = tr.el.querySelector('.cine-g-seq,.cine-m-item');
 if (!seq) return;
 /* Prompt 42/43: ukur pitch penuh satu kelompok (lebar + gap antar-seq),
 bukan hanya scrollWidth – scrollWidth bisa meleset bila font belum
 siap / gambar belum render, dan itulah penyebab celah kosong di
 baris kedua & pada titik pergantian kelompok marquee. */
 
 // Lebar satu kelompok foto termasuk padding-right.
 // Jangan tambahkan padding lagi agar titik loop tetap presisi.
 const w = seq.getBoundingClientRect().width;

 if (w > 40) tr.half = w; /* jangan menurunkan half ke nilai sampah */
 }
 function makeTracks(){
 tracks.length = 0;
 document.querySelectorAll('.cine-g-track,.cine-m-track').forEach(el => {
 const tr = { el, dir: el.dataset.dir === 'rtl'? -1 : 1, speed: Number(el.dataset.speed)||30, pos: 0, half: 0, paused:false };
 measureTrack(tr); tracks.push(tr);
 });
 }

 /* scroll velocity influences marquee subtly (clamped, never reverses) */
 let scrollBoost = 0;
 window.addEventListener('scroll', () => {
 scrollBoost = clamp(((window.scrollY - (cineEngine._lastY||window.scrollY))), -120, 120) *.06;
 cineEngine._lastY = window.scrollY;
 }, { passive: true });

 function tick(t){
 rafId = 0;
 const dt = lastT? clamp((t - lastT)/1000, 0,.05) :.016; /* clamp tab-jumps */
 lastT = t;
 let any = false;
 tracks.forEach(tr => {
 if (!tr.half) measureTrack(tr);
 if (!tr.half || tr.paused) return;
 /* Prompt 42/43: re-measure ketika viewport/font berubah – half yang
 basi membuat wrap melompat atau menyisakan celah kosong */
 /* re-measure sekali setelah window 'load' (font & gambar siap) dan
 saat lebar viewport berubah – half basi membuat wrap menyisakan celah */
 if (!cineEngine._measured || tr._remW!== window.innerWidth) {
 tr._remW = window.innerWidth; measureTrack(tr);
 }
 if (!(vis.get(tr.section))) return; /* hanya saat section terlihat */
 any = true;
 /* pos selalu naik (akumulator unsigned) – tanda arah hanya di transform,
 sehingga wrap modulo tetap seamless untuk kedua arah */
 tr.pos += (tr.speed * dt) * (tr.speedMul || 1) * (1 + Math.abs(scrollBoost) * (tr.isMarquee?.5 :.15));
 /* wrap around half-width? seamless, tanpa lompatan */
 tr.pos = ((tr.pos % tr.half) + tr.half) % tr.half;
 /* dir=1 (ltr)? bergerak ke kanan (+x); dir=-1 (rtl)? bergerak ke kiri (-x) */
 const offset = tr.dir === 1
? tr.pos - tr.half
 : -tr.pos;

 tr.el.style.transform =
 'translate3d(' + offset.toFixed(2) + 'px,0,0)';
 });
 scrollBoost *=.9;
 if (any) rafId = requestAnimationFrame(tick);
 }
 function wake(){
 if (rafId || reduceMotion) return;
 lastT = 0;
 rafId = requestAnimationFrame(tick);
 }

 function trackSections(){
 tracks.forEach(tr => {
 tr.section = tr.el.closest('.cine-gallery,.cine-marquee,.cine-apparel');
 tr.isMarquee =!!tr.el.closest('.cine-marquee,.cine-apparel');
 tr.el.parentElement.style.overflow = 'hidden'; /* cegah horizontal overflow */
 });
 }

 /* ---------- IntersectionObserver: jalankan hanya saat terlihat ---------- */
 const io = ('IntersectionObserver' in window)? new IntersectionObserver(entries => {
 entries.forEach(en => {
 vis.set(en.target, en.isIntersecting);
 if (en.isIntersecting) {
 tracks.forEach(tr => tr.paused = false);
 wake();
 } else if ([...vis.values()].every(v =>!v)) {
 if (rafId) cancelAnimationFrame(rafId); /* cleanup rAF saat tak ada yg terlihat */
 rafId = 0;
 }
 });
 }, { rootMargin: '80px' }) : null;

 function bindIO(){
 if (!io) return;
 [cineGal, cineApp, cineRev].forEach(el => { if (el) io.observe(el); });
 }

 /* ================================================================
 PROMPT 7 – CINEMATIC FADE BG + FLOATING REVIEWS
 Crossfade timer gagal-aman: foto gagal diload dilewati, rotasi tak
 pernah berhenti permanen, tanpa rekur antar pergantian.
 ================================================================ */
 let revIdx = 0, revTimer = 0, revPaused = false;
 const POSITIONS = ['pos-bl','pos-br','pos-c','pos-bl2','pos-br2'];

 function startRevolving(){
 if (!cineRev || cineRev.dataset.cineBound) return;
 cineRev.dataset.cineBound = '1';
 const slides = [...cineRev.querySelectorAll('.cine-rbg-img')];
 const cardsBox = cineRev.querySelector('.cine-rcards');
 const valid = (cineReviews||[]).filter(r => r && r.name && r.text);

 /* review cards: hanya dirender jika ada data asli – tanpa placeholder palsu */
 let cards = [];
 if (valid.length && cardsBox) {
 cardsBox.innerHTML = valid.map((r,i) =>
 `<figure class="cine-rcard ${POSITIONS[i % POSITIONS.length]}"><blockquote>${r.text}</blockquote><figcaption>${r.name}</figcaption></figure>`
 ).join('');
 cards = [...cardsBox.children];
 cards[0]?.classList.add('show');
 } 

 /* preload berikutnya secara terkontrol (maks 1 slot) */
 const pre = new Set();
 slides.forEach((s,i) => {
 const url = s.style.backgroundImage.slice(5,-2);
 const img = new Image();
 img.onerror = () => { s.classList.add('cine-bg-dead'); }; /* gagal: lewati, rotasi jalan terus */
 img.src = url; pre.add(url);
 });

 function advance(){
 const alive = slides.filter(s =>!s.classList.contains('cine-bg-dead'));
 if (!alive.length) return; /* semua foto gagal: diamkan, tak crash */
 const cur = alive.findIndex(s => s.classList.contains('active'));
 const nxt = alive[(cur+1) % alive.length];
 cur >= 0 && alive[cur].classList.remove('active');
 nxt.classList.add('active');
 revIdx++;
 if (cards.length) {
 const ci = revIdx % cards.length;
 cards.forEach(c => c.classList.remove('show'));
 cards[ci].classList.add('show');
 }
 schedule();
 }
 function schedule(){
 clearTimeout(revTimer);
 revTimer = setTimeout(advance, revPaused? 0 : 6000); /* 6s per foto, crossfade 1.2s di CSS */
 }



 schedule();
 }

 /* ================================================================
 REVIEWS FRONTEND – Google Sheets (endpoint deployment yang sama
 dengan Hero/Gallery). Published: JSONP GET api=reviews (callback
 tobaReviewsCallback, shape terverifikasi: success/total/reviews[]
 dengan displayName, group, reviewText, rating, publishedAt).
 Submit: POST api=submitReview (name, group, rating, reviewText,
 consent)? tersimpan PENDING, tidak langsung ditampilkan.
 ================================================================ */
 function initReviewsApi(){
 const REV_API = 'https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
 const sec = document.getElementById('cineReviews');
 if (!sec) return;

 /* modal review – dibuat sekali, dirender ke body (di luar section) */
 if (!document.getElementById('reviewModalWrap')) {
 document.body.insertAdjacentHTML('beforeend', `
 <div id="reviewModalWrap" hidden>
 <div class="rev-modal" role="dialog" aria-modal="true" aria-label="${t('reviews.modal.aria')}">
 <button class="rev-close" type="button" aria-label="Close">?</button>
 <h3>${t('reviews.modal.title')}</h3>
 <form id="reviewForm" novalidate>
 <label>${t('reviews.name')}<input id="revName" type="text" maxlength="40" autocomplete="name"></label>
 <label>${t('reviews.group')}<select id="revGroup">
 <option value="Tobaladies">Tobaladies</option>
 <option value="Tobadeli">Tobadeli</option>
 <option value="Weekly Fun Game">Weekly Fun Game</option>
 <option value="Event TOBA">Event TOBA</option>
 <option value="Lainnya">Lainnya</option>
 </select></label>
 <div class="rev-stars" role="radiogroup" aria-label="${t('reviews.rating')}">
 ${[1,2,3,4,5].map(i=>`<span class="rev-star" role="radio" aria-checked="false" tabindex="0" data-v="${i}">?</span>`).join('')}
 </div>
 <label>${t('reviews.text')}<textarea id="revText" rows="4" maxlength="500"></textarea><span class="rev-count" id="revCount">0/500</span></label>
 <label class="rev-consent"><input id="revConsent" type="checkbox"> ${t('reviews.consent')}</label>
 <p class="rev-msg" id="revMsg" aria-live="polite"></p>
 <button class="pill" id="revSubmit" type="submit">${t('reviews.submit')}</button>
 </form>
 </div>
 </div>`);
 }

 /* ---- published reviews via JSONP (pola sama dengan Hero API) ---- */
 window.tobaReviewsCallback = function(res){
 if (!res ||!res.success ||!Array.isArray(res.reviews)) return;
 const published = res.reviews.filter(r => r && r.displayName && r.reviewText)
.map(r => ({ name: r.displayName, text: r.reviewText, group: r.group || '', rating: r.rating }));
 if (!published.length) return;
 const cardsBox = sec.querySelector('.cine-rcards');
 if (!cardsBox || sec.dataset.reviewsBound) return;
 sec.dataset.reviewsBound = '1';
 
 const POS = ['pos-bl', 'pos-br', 'pos-bl2', 'pos-br2'];

 // Siapkan empat slot kartu tetap
 const slotCount = Math.min(4, published.length);

 cardsBox.innerHTML = Array.from(
 { length: slotCount },
 (_, i) => `
 <figure class="cine-rcard ${POS[i]}">
 <blockquote></blockquote>
 <figcaption></figcaption>
 </figure>
 `
 ).join('');

 const cards = [...cardsBox.children];

 // Bagi seluruh review PUBLISHED ke empat posisi
 const reviewQueues = cards.map((_, slotIndex) =>
 published.filter((_, reviewIndex) =>
 reviewIndex % slotCount === slotIndex
 )
 );

 // Tampilkan isi review
 function renderReview(card, review) {
 card.querySelector('blockquote').textContent = review.text;

 card.querySelector('figcaption').textContent =
 review.name + (review.group? ' – ' + review.group : '');
 }

 // Animasi independen untuk setiap posisi
 cards.forEach((card, slotIndex) => {
 const queue = reviewQueues[slotIndex];
 let currentIndex = 0;

 function showReview() {
 renderReview(card, queue[currentIndex]);
 card.classList.add('show');
 }

 function rotateReview() {
 if (queue.length < 2) return;

 card.classList.remove('show');

 setTimeout(() => {
 currentIndex = (currentIndex + 1) % queue.length;
 showReview();

 setTimeout(rotateReview, 6500 + slotIndex * 500);
 }, 1300); /* PROMPT 6: durasi fade-in 1.2s + buffer */
 }

 setTimeout(() => {
 showReview();

 if (queue.length > 1) {
 setTimeout(rotateReview, 6500 + slotIndex * 650);
 }
 }, 800 + slotIndex * 700); /* PROMPT 6: jeda antar-bubble 0.5–0.8s */
 });


 };
 const s = document.createElement('script');
 s.src = REV_API + '?api=reviews&callback=tobaReviewsCallback';
 s.onerror = () => console.warn('[TOBA Reviews] published reviews tidak dapat dimuat');
 document.body.appendChild(s);

 /* ---- modal & form ---- */
 const openBtn = document.getElementById('reviewOpenBtn');
 const wrap = document.getElementById('reviewModalWrap');
 if (!openBtn ||!wrap) return;
 const form = document.getElementById('reviewForm');
 const nameEl = document.getElementById('revName');
 const groupEl = document.getElementById('revGroup');
 const textEl = document.getElementById('revText');
 const consentEl = document.getElementById('revConsent');
 const countEl = document.getElementById('revCount');
 const stars = [...wrap.querySelectorAll('.rev-star')];
 const msg = document.getElementById('revMsg');
 const submitBtn = document.getElementById('revSubmit');
 let rating = 0;

 function paintStars(){ stars.forEach((st,i) => st.classList.toggle('on', i < rating)); }
 stars.forEach((st,i) => {
 st.addEventListener('click', () => { rating = i + 1; paintStars(); });
 st.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rating = i + 1; paintStars(); } });
 });

 textEl.addEventListener('input', () => { countEl.textContent = textEl.value.length + '/500'; });

 function open(){ wrap.hidden = false; document.body.style.overflow = 'hidden'; setTimeout(() => nameEl.focus(), 50); }
 function close(){ wrap.hidden = true; document.body.style.overflow = ''; }
 openBtn.addEventListener('click', open);
 wrap.querySelector('.rev-close').addEventListener('click', close);
 wrap.addEventListener('click', e => { if (e.target === wrap) close(); }); /* klik backdrop saja */
 document.addEventListener('keydown', e => { if (e.key === 'Escape' &&!wrap.hidden) close(); });

 function feedback(ok, text){ msg.textContent = text; msg.className = 'rev-msg ' + (ok? 'rev-ok' : 'rev-err'); }

 form.addEventListener('submit', e => {
 e.preventDefault();
 const name = nameEl.value.trim();
 const text = textEl.value.trim();
 if (!name) { feedback(false, t('reviews.err.name')); nameEl.focus(); return; }
 if (!rating) { feedback(false, t('reviews.err.rating')); return; }
 if (!text) { feedback(false, t('reviews.err.text')); textEl.focus(); return; }
 if (!consentEl.checked) { feedback(false, t('reviews.err.consent')); consentEl.focus(); return; }
 
 const body = new URLSearchParams({
 display_name: name,
 group: groupEl.value,
 rating: String(rating),
 review_text: text,
 consent: 'true'
 }).toString();

 submitBtn.disabled = true;
 feedback(true, t('reviews.sending'));
 fetch(REV_API, {
 method: 'POST',
 headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
 body, redirect: 'follow'
 }).then(r => r.json()).then(res => {
 if (res && res.success) {
 feedback(true, t('reviews.ok.pending'));
 form.reset(); rating = 0; paintStars(); countEl.textContent = '0/500';
 setTimeout(close, 2600);
 } else {
 feedback(false, (res && res.message) || t('reviews.err.generic'));
 }
 }).catch(() => feedback(false, t('reviews.err.generic')))
.finally(() => { submitBtn.disabled = false; });
 });
 }

 /* ================================================================
 REVEAL: blur-to-focus typography + image clip reveal (IO satu kali)
 ================================================================ */
 const rio = ('IntersectionObserver' in window)? new IntersectionObserver(es => {
 es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('cine-in'); rio.unobserve(en.target); } });
 }, { threshold:.18 }) : null;
 function bindReveal(){
 document.querySelectorAll('.cine-g-head,.cine-rheadline,.cine-rsub,.cine-m-sub,.comm-cards.section-heading,.story-ed.eyebrow').forEach(el => {
 el.classList.add('cine-focus');
 rio? rio.observe(el) : el.classList.add('cine-in');
 });
 }

 /* ---------- resize: re-measure tracks (debounced, no re-init) ---------- */
 let rzT = 0;
 window.addEventListener('resize', () => {
 clearTimeout(rzT);
 rzT = setTimeout(measureTracksAll, 180);
 });
 function measureTracksAll(){ tracks.forEach(measureTrack); wake(); }

 /* ================================================================
 PROMPT 56 – GALLERY INTERAKSI – drag/swipe + image preview lightbox
 Drag menggeser track (pointer events), auto-motion lanjut setelah
 lepas. Klik foto membuka lightbox premium (close: X, backdrop, Esc,
 navigasi prev/next + arrow keys). Touch swipe tidak mengganggu
 scroll vertikal (touch-action: pan-y).
 ================================================================ */
 function bindDragAndPreview(){
 document.querySelectorAll('.cine-g-track').forEach(track => {
 if (track.dataset.dragBound) return;
 track.dataset.dragBound = '1';
 let startX = 0, startPos = 0, dragging = false, moved = false;
 const down = e => {
 if (e.button!== undefined && e.button!== 0) return;
 dragging = true; moved = false;
 startX = (e.touches? e.touches[0].clientX : e.clientX);
 const tr = tracks.find(t => t.el === track);
 startPos = tr? tr.pos : 0;
 track.classList.add('dragging');
 };
 const move = e => {
 if (!dragging) return;
 const x = (e.touches? e.touches[0].clientX : e.clientX);
 const dx = x - startX;
 if (Math.abs(dx) > 6) moved = true;
 const tr = tracks.find(t => t.el === track);
 if (tr && tr.half) {
 tr.pos = ((startPos + dx * tr.dir) % tr.half + tr.half) % tr.half;

 const offset = tr.dir === 1
? tr.pos - tr.half
 : -tr.pos;

 tr.el.style.transform =
 'translate3d(' + offset.toFixed(2) + 'px,0,0)';
 }
 if (e.cancelable && e.type === 'touchmove' && moved) e.preventDefault();
 };
 const up = () => {
 if (!dragging) return;
 dragging = false;
 track.classList.remove('dragging');
 /* auto-motion continues naturally on next rAF – pos already synced */
 };
 track.addEventListener('mousedown', down);
 window.addEventListener('mousemove', move, { passive: true });
 window.addEventListener('mouseup', up, { passive: true });
 track.addEventListener('touchstart', down, { passive: true });
 track.addEventListener('touchmove', move, { passive: false });
 track.addEventListener('touchend', up, { passive: true });
 /* klik foto – buka preview (kecuali itu adalah drag) */
 track.addEventListener('click', e => {
 if (moved) { moved = false; return; }
 const card = e.target.closest('.cine-g-card');
 if (card) openCineLightbox(card);
 }, true);
 });
 }

 /* ------- cine lightbox (modal preview premium) ------- */
 let lbEl = null;
 function openCineLightbox(card){
 const img = card.querySelector('img');
 if (!img ||!img.src) return;
 if (!lbEl) {
 lbEl = document.createElement('div');
 lbEl.className = 'cine-lightbox';
 lbEl.setAttribute('role', 'dialog');
 lbEl.setAttribute('aria-modal', 'true');
 lbEl.innerHTML = '<button class="cine-lb-x" aria-label="Close">\u2715</button>' +
 '<button class="cine-lb-prev" aria-label="Previous">\u2190</button>' +
 '<figure><img src="" alt=""><figcaption></figcaption></figure>' +
 '<button class="cine-lb-next" aria-label="Next">\u2192</button>';
 document.body.appendChild(lbEl);
 lbEl.addEventListener('click', e => {
 if (e.target === lbEl || e.target.closest('.cine-lb-x')) closeCineLightbox();
 else if (e.target.closest('.cine-lb-prev')) stepCineLightbox(-1);
 else if (e.target.closest('.cine-lb-next')) stepCineLightbox(1);
 });
 document.addEventListener('keydown', e => {
 if (!lbEl ||!lbEl.classList.contains('open')) return;
 if (e.key === 'Escape') closeCineLightbox();
 if (e.key === 'ArrowLeft') stepCineLightbox(-1);
 if (e.key === 'ArrowRight') stepCineLightbox(1);
 });
 }
 const imgs = [...document.querySelectorAll('.cine-g-card img')].filter(i => i.src &&!i.closest('.cine-g-dead'));
 lbEl.dataset.current = String(imgs.indexOf(img));
 showCineImage(imgs, Number(lbEl.dataset.current));
 lbEl.classList.add('open');
 document.body.style.overflow = 'hidden';
 }
 function cineImgs(){
 return [...document.querySelectorAll('.cine-g-card img')].filter(i => i.src &&!i.closest('.cine-g-dead'));
 }
 function showCineImage(list, idx){
 if (!lbEl ||!list.length) return;
 lbEl.dataset.current = String((idx + list.length) % list.length);
 const im = lbEl.querySelector('img');
 const src = list[Number(lbEl.dataset.current)].src;
 im.style.opacity = '0';
 im.onload = () => { im.style.opacity = '1'; };
 im.src = src;
 im.alt = list[Number(lbEl.dataset.current)].alt || 'TOBA community basketball photo';
 }
 function stepCineLightbox(d){ if (lbEl) showCineImage(cineImgs(), Number(lbEl.dataset.current) + d); }
 function closeCineLightbox(){
 if (lbEl) lbEl.classList.remove('open');
 document.body.style.overflow = '';
 }

 /* ---------- INIT (idempotent, dipanggil juga saat re-render bahasa) ---------- */
 function init(){
 makeTracks(); trackSections(); bindIO(); bindReveal(); startRevolving(); bindDragAndPreview(); initReviewsApi();
 /* hover memperlambat marquee di desktop */
 if (window.matchMedia('(pointer: fine)').matches) {
 const mq = sec('.cine-marquee');
 mq?.addEventListener('mouseenter', () => tracks.forEach(tr => { if (tr.isMarquee) tr.speedMul =.25; }), { passive: true });
 mq?.addEventListener('mouseleave', () => tracks.forEach(tr => { if (tr.isMarquee) tr.speedMul = 1; }), { passive: true });
 }
 wake();
 }
 /* saat re-render bahasa, DOM baru: reset bound-state lalu init ulang */
 window.__cineReset = () => {
 if (rafId) cancelAnimationFrame(rafId); rafId = 0;
 clearTimeout(revTimer); vis.clear();
 document.querySelectorAll('[data-cine-bound],[data-drag-bound]').forEach(el => { delete el.dataset.cineBound; delete el.dataset.dragBound; });
 if (lbEl) { lbEl.remove(); lbEl = null; } /* re-render bahasa: lightbox ikut di-render ulang */
 init();
 };
 init();
})();

/* =====================================================================
 PROMPT – INTERACTIVE BASKETBALL (easter egg physics)
 Bola basket cutout (.hero-cut-img.cut-ball) di Hero menjadi objek
 fisika ringan: tap = bounce, drag = ikut pointer, lepas = lempar
 (velocity gesture), gravity + bounce + friction natural, rotasi
 mengikuti momentum. Tanpa canvas, tanpa library – DOM + rAF saja.
 Area gerak DIBATASI ke stage foto (.hero-cut-slideshow) sehingga
 bola tidak mungkin menutupi CTA, navbar, teks, atau Music Player.
 prefers-reduced-motion? bola tetap statis (modul tidak aktif).
 ===================================================================== */
(function interactiveBall(){
 const box = document.getElementById('heroCutShow');
 if (!box) return;
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

 const BALL_SEL = '.hero-cut-img.cut-ball';
 let ballEl = null;

 /* bola dirender asinkron oleh modul komposisi? poll sampai ada.
 Node bola bisa DIGANTI saat API Sheets mengadopsi foto – re-bind bila
 node aktif tidak lagi terhubung ke dokumen. */
 let tries = 0;
 const find = setInterval(() => {
 ballEl = box.querySelector(BALL_SEL);
 if (ballEl) { clearInterval(find); init(); }
 else if (++tries > 80) clearInterval(find); /* ~8s, lalu menyerah */
 }, 100);

 function init(){
 const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if (reduce) return;

 /* --- state fisika (satuan: px & px/frame ~60fps) --- */
 const GRAVITY = 0.45, BOUNCE = 0.62, FRICTION = 0.992, WALL_FRICTION = 0.85;
 const AIR_DRAG = 0.995, MAX_V = 34, MIN_IDLE_V = 0.06;
 let x = 0, y = 0, vx = 0, vy = 0, rot = 0, vrot = 0;
 let grabDX = 0, grabDY = 0;
 let W = 0, H = 0, BW = 0;
 let dragging = false, pointerId = null;
 let lastPX = 0, lastPY = 0, lastT = 0, velX = 0, velY = 0;
 let idleTimer = 0, idleKick = Math.random() < 0.5? 1 : -1;
 let rafId = 0, running = false, userTouched = false;

 const size = () => {
 const r = box.getBoundingClientRect();
 W = r.width; H = r.height;
 BW = ballEl.getBoundingClientRect().width || 44;
 if (!userTouched) { /* posisi awal: lantai kanan (sesuai CSS) */
 x = W * 0.82; y = H - BW * 0.6;
 }
 x = Math.min(Math.max(x, BW / 2), W - BW / 2);
 y = Math.min(Math.max(y, BW / 2), H - BW / 2);
 };
 size();
 window.addEventListener('resize', () => { size(); }, { passive: true });
 if ('ResizeObserver' in window) new ResizeObserver(size).observe(box);

 const apply = () => {
 if (!ballEl.isConnected) { running = false; cancelAnimationFrame(rafId); return; }
 /* CSS menempatkan bola via right/bottom; transform harus RELATIF
 dari posisi layout itu – offsetLeft/Top mengabaikan transform */
 const baseX = ballEl.offsetLeft + ballEl.offsetWidth / 2;
 const baseY = ballEl.offsetTop + ballEl.offsetHeight / 2;
 ballEl.style.setProperty('--bx', (x - baseX) + 'px');
 ballEl.style.setProperty('--by', (y - baseY) + 'px');
 ballEl.style.setProperty('--br', rot + 'deg');
 };

 /* --- loop fisika --- */
 function step(){
 if (!dragging) {
 vy += GRAVITY;
 vx *= AIR_DRAG; vy *= AIR_DRAG;
 vx = Math.min(Math.max(vx, -MAX_V), MAX_V);
 vy = Math.min(Math.max(vy, -MAX_V), MAX_V);
 x += vx; y += vy;
 rot += vrot;

 const half = BW / 2, floor = H - half, ceil = half,
 left = half, right = W - half;
 if (y > floor) { y = floor; vy = -vy * BOUNCE; vx *= WALL_FRICTION;
 vrot = vx * 1.4;
 if (Math.abs(vy) < 1.1) vy = 0;
 }
 if (y < ceil) { y = ceil; vy = -vy * BOUNCE; }
 if (x < left) { x = left; vx = -vx * BOUNCE; vrot = -Math.abs(vrot) * 0.7; }
 if (x > right) { x = right; vx = -vx * BOUNCE; vrot = Math.abs(vrot) * 0.7; }

 /* gesekan tanah + redam rotasi */
 if (y >= floor - 0.5) vx *= FRICTION;
 vrot *= 0.985;

 /* IDLE: kalau hampir diam, drift/bounce kecil berkala –
 bola tidak pernah "stuck" di satu posisi */
 if (Math.abs(vx) < MIN_IDLE_V && Math.abs(vy) < MIN_IDLE_V && y >= floor - 2) {
 idleTimer++;
 if (idleTimer > 150 + Math.random() * 180) { /* ~3-5.5s */
 idleTimer = 0;
 vx = idleKick * (1.6 + Math.random() * 1.8);
 vy = -(3.4 + Math.random() * 2.2);
 vrot = vx * 2;
 idleKick *= -1;
 }
 }
 apply();
 }
 rafId = requestAnimationFrame(step);
 }
 const ensureRun = () => {
 if (!running) { running = true; rafId = requestAnimationFrame(step); }
 };
 /* hemat resource: pause saat tab/hero tak terlihat */
 document.addEventListener('visibilitychange', () => {
 if (document.hidden) { running = false; cancelAnimationFrame(rafId); }
 else ensureRun();
 });
 if ('IntersectionObserver' in window) {
 new IntersectionObserver(en => {
 if (en[0].isIntersecting) ensureRun();
 else { running = false; cancelAnimationFrame(rafId); }
 }).observe(box);
 } else ensureRun();

 /* --- pointer interaksi (mouse + touch via Pointer Events) --- */
 const toLocal = e => {
 const r = box.getBoundingClientRect();
 return { x: e.clientX - r.left, y: e.clientY - r.top };
 };
 ballEl.addEventListener('pointerdown', e => {
 e.preventDefault();
 e.stopPropagation();
 dragging = true; pointerId = e.pointerId; userTouched = true;
 const p = toLocal(e);
 lastPX = p.x; lastPY = p.y; lastT = performance.now();
 velX = 0; velY = 0;
 grabDX = x - p.x; grabDY = y - p.y; /* bola tidak melompat ke titik sentuh */
 x = p.x + grabDX; y = p.y + grabDY;
 idleTimer = 0;
 ballEl.classList.add('cut-ball-grab');
 try { ballEl.setPointerCapture(e.pointerId); } catch (_) {}
 apply();
 });
 ballEl.addEventListener('pointermove', e => {
 if (!dragging || e.pointerId!== pointerId) return;
 const p = toLocal(e), now = performance.now();
 const dt = Math.max(now - lastT, 1);
 /* rotasi mengikuti gerakan horizontal drag (momentum) */
 rot += (p.x - lastPX) * 0.45;
 /* velocity gesture (px/frame dinormalisasi 60fps), dieksponansi agar lemparan terasa */
 velX = ((p.x - lastPX) / dt) * 10.5;
 velY = ((p.y - lastPY) / dt) * 10.5;
 lastPX = p.x; lastPY = p.y; lastT = now;
 x = Math.min(Math.max(p.x + grabDX, BW / 2), W - BW / 2);
 y = Math.min(Math.max(p.y + grabDY, BW / 2), H - BW / 2);
 apply();
 });
 const release = e => {
 if (!dragging || (e.pointerId!== undefined && e.pointerId!== pointerId)) return;
 dragging = false; pointerId = null;
 ballEl.classList.remove('cut-ball-grab');
 vx = Math.min(Math.max(velX, -MAX_V), MAX_V);
 vy = Math.min(Math.max(velY, -MAX_V), MAX_V);
 vrot = vx * 1.6;
 idleTimer = 0;
 };
 ballEl.addEventListener('pointerup', release);
 ballEl.addEventListener('pointercancel', release);
 ballEl.addEventListener('lostpointercapture', release);

 /* TAP (tanpa drag berarti): bounce responsif ke atas */
 let downT = 0, downCX = 0, downCY = 0;
 ballEl.addEventListener('pointerdown', e => {
 downT = performance.now(); downCX = e.clientX; downCY = e.clientY;
 }, true);
 ballEl.addEventListener('pointerup', e => {
 if (performance.now() - downT < 240 &&
 Math.abs(e.clientX - downCX) < 12 &&
 Math.abs(e.clientY - downCY) < 12) {
 vy = -(6.5 + Math.random() * 2);
 vx = (Math.random() - 0.5) * 3;
 vrot = vx * 2;
 idleTimer = 0;
 }
 });

 ballEl.classList.add('cut-ball-live'); /* matikan transisi CSS posisi */
 apply();
 ensureRun();
 }
})();


/* =====================================================================
 TOBA AI ASSISTANT (TOBI) – GLOBAL FLOATING CHATBOT
 Satu instance global untuk semua halaman (di-inject via JS, bukan HTML).
 - Launcher: maskot buaya setengah badan mengintip dari tepi kanan
 (aset existing: assets/crocodile-head-trans.png), peek-a-boo anim,
 drag VERTIKAL sepanjang tepi kanan, klik = buka chat.
 - Panel: header + area percakapan + suggested questions + input.
 - Knowledge base: matcher lokal terhadap i18n.js faq.chat.q1–q7 /
 a1–a7 (jawaban resmi TOBA, dua bahasa). Tanpa AI provider.
 - Persistensi posisi via localStorage + validasi bounds + re-clamp
 saat resize; default kembali ke posisi awal.
 - Music player (#tobaMusicRoot, z-index 9990) TIDAK disentuh; TOBI
 memakai z-index 9980 dan posisi tepi kanan atas-tengah.
 ===================================================================== */
(function tobiAssistant(){
 if (window.__tobiLoaded) return;
 window.__tobiLoaded = true;

 const AVATAR = 'assets/crocodile-head-trans.png';
 const POS_KEY = 'tobi.pos.y';
 const OPEN_KEY = 'tobi.greeted';
 const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

 /* ---------- FAQ knowledge base: matcher kata kunci vs faq.chat.* ----------
 Semua jawaban HANYA dari string resmi i18n.js – tidak ada info tambahan. */
 const FAQ_KEYS = [
 ['faq.chat.a1', ['belum pernah','baru pertama','pemula','langsung join','first time','never joined','show up','newbie','start']],
 ['faq.chat.a2', ['biaya','harga','rp','rupiah','berapa','cost','price','fee','bayar','tarif','50','30']],
 ['faq.chat.a3', ['kapan','jadwal','jam','hari','di mana','dimana','lokasi','venue','where','when','schedule','brickhouse','duren sawit','alamat']],
 ['faq.chat.a4', ['benefit','fasilitas','didapat','included','termasuk','apa saja','what','get','include','air minum','dokumentasi']],
 ['faq.chat.a5', ['member','keanggotaan','harus jadi','membership','wajib']],
 ['faq.chat.a6', ['jago','skill','pemula','bagus','good','belum bisa','not good','beginner','mahir']],
 ['faq.chat.a7', ['daftar','register','cara gabung','gabung','join','ikut','bergabung','sign up','cara ikut']]
 ];
 function tobiAnswer(msg){
 const q = msg.toLowerCase();
 let best = null, bestScore = 0;
 FAQ_KEYS.forEach(([aKey, words], idx) => {
 let score = 0;
 words.forEach(w => { if (q.includes(w)) score += w.length; });
 if (score > bestScore) { bestScore = score; best = { aKey, qKey: 'faq.chat.q' + (idx + 1) }; }
 });
 if (best) return { answer: t(best.aKey), qKey: best.qKey };
 return null;
 }

 /* ---------- improvement 4+: konteks FAQ – ingat topik & jawaban singkat ----------
 "iya/boleh/mau" setelah jawaban FAQ melanjutkan topik yang sama;
 "belum" setelah pertanyaan pengalaman? arahkan ke FAQ pertama. */
 let faqPendingQuestion = null; /* faq.chat.qN terakhir yang dijawab */

 /* ---------- improvement 4: contextual engine + navigasi halaman ----------
 - ingat topik terakhir: jawaban pendek ("di mana?", "kalau gitu biayanya?")
 memakai konteks topik sebelumnya.
 - deteksi halaman tujuan? arahkan ke halaman terkait. */
 const PAGE_HINTS = [
 ['events.html', ['event','jadwal','weekly fun','fun game','agenda','kegiatan']],
 ['gallery.html', ['gallery','galeri','foto','photo']],
 ['merchandise.html', ['merch','merchandise','jersey','beli','kaos','tote','hoodie']],
 ['partnership.html', ['partnership','kerjasama','sponsor','gabung','daftar member']],
 ['tobaladies.html', ['tobaladies','ladies','tim perempuan']],
 ['tobadeli.html', ['tobadeli','deli','tim laki']],
 ['game.html', ['game','mini game','main game']]
 ];
 let lastTopic = null; /* index FAQ 1–7 yang terakhir dijawab */
 function tobiReply(msg){
 const q = msg.toLowerCase().trim();
 /* FAQ knowledge base dulu – pertanyaan FAQ harus dijawab, bukan diarahkan */
 let hit = tobiAnswer(q);
 /* navigasi halaman hanya jika bukan pertanyaan FAQ */
 if (!hit) for (const [page, words] of PAGE_HINTS) {
 if (words.some(w => q.includes(w))) {
 const base = document.documentElement.lang === 'id'
? 'Bisa kamu lihat di halaman ' : 'You can find that on the ';
 const tail = document.documentElement.lang === 'id'? ' ya!' : ' page!';
 return { answer: base + page.replace('.html','').toUpperCase() + tail, pageLink: page };
 }
 }
 /* konteks: pertanyaan lanjutan yang pendek/tidak jelas? pakai topik terakhir.
 Jawaban SANGAT pendek (iya/belum/mau/nggak/boleh) juga diarahkan ke
 topik FAQ terakhir supaya percakapan tetap nyambung. */
 if (!hit && lastTopic && q.split(/\s+/).length <= 4) {
 const shortAck = /^(iya|iyah|yeah|yes|belum|nggak|gak|tidak|mau|boleh|oke|ok|sip)[\s!.]*$/i.test(q);
 if (!shortAck || faqPendingQuestion === lastTopic) {
 hit = { answer: t('faq.chat.a' + lastTopic), qKey: 'faq.chat.q' + lastTopic };
 } else if (lastTopic === 1) {
 /* konteks pengalaman: "belum"? jawaban FAQ pemula */
 hit = { answer: t('faq.chat.a1'), qKey: 'faq.chat.q1' };
 }
 }
 if (hit) {
 const idx = hit.qKey? parseInt(hit.qKey.replace('faq.chat.q',''), 10) : 0;
 if (idx >= 1 && idx <= 7) { lastTopic = idx; faqPendingQuestion = idx; }
 return hit;
 }
 return null;
 }

 /* ---------- markup (sekali, global) ---------- */
 const root = document.createElement('div');
 root.id = 'tobiRoot';
 root.innerHTML = `
 <button class="tobi-launcher" id="tobiLauncher" type="button" aria-label="TOBI – buka chat" aria-expanded="false">
  <span class="tobi-peek"><img src="${AVATAR}" alt="" draggable="false"></span>
 </button>
 <button class="tobi-dismiss" id="tobiDismiss" type="button" aria-label="Sembunyikan TOBI">×</button>
 <div class="tobi-balloon" id="tobiBalloon" hidden role="status"></div>
 <section class="tobi-panel" id="tobiPanel" role="dialog" aria-label="TOBA Assistant" aria-modal="false" hidden>
 <header class="tobi-head">
 <span class="tobi-head-avatar"><img src="${AVATAR}" alt=""></span>
 <div class="tobi-head-copy">
 <strong id="tobiName">TOBI</strong>
 <small><span class="tobi-dot" aria-hidden="true"></span><span id="tobiSub">Toba Assistant</span><span class="tobi-sep" aria-hidden="true">·</span><span id="tobiStatus"></span></small>
 </div>
 <button class="tobi-head-btn" id="tobiMinimize" type="button" aria-label="Minimize chat">–</button>
 <button class="tobi-head-btn" id="tobiClose" type="button" aria-label="Tutup chat">x</button>
 </header>
 <div class="tobi-log" id="tobiLog" role="log" aria-live="polite"></div>
 <div class="tobi-chips" id="tobiChips"></div>
 <form class="tobi-inputbar" id="tobiForm">
 <input id="tobiInput" type="text" autocomplete="off" maxlength="300" placeholder="">
 <button class="tobi-send" id="tobiSend" type="submit" aria-label="Kirim">
 <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="M3 11.5L21 3l-7 18-2.5-7.5L3 11.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
 </button>
 </form>
  </section>
  <button id="tobiRestore" type="button">Tampilkan TOBI</button>`;
 /* intro gate: launcher chatbot hanya di-append SETELAH intro selesai
 (home / Tobaladies / Tobadeli). Inisialisasi internal tetap berjalan
 normal; hanya kehadiran DOM-nya yang ditunda supaya intro tidak
 tertutup launcher. Kontrak yang sama dipakai music.js. */
 const showRoot = () => {
 document.body.appendChild(root);
 /* Task 5: kontrol panggil TOBI juga harus tersedia di semua halaman,
 termasuk halaman SPA-like yang tidak punya data-page. */
 if (!document.body.dataset.page) document.body.dataset.page = 'home';
 };
 if (document.documentElement.classList.contains('intro-running')) {
 document.addEventListener('toba:introdone', showRoot, { once: true });
 setTimeout(() => { if (!root.isConnected) showRoot(); }, 9000);
 } else showRoot();

 const launcher = root.querySelector('#tobiLauncher');
 const balloon = root.querySelector('#tobiBalloon');
 const panel = root.querySelector('#tobiPanel');
 const log = root.querySelector('#tobiLog');
 const chips = root.querySelector('#tobiChips');
 const form = root.querySelector('#tobiForm');
 const input = root.querySelector('#tobiInput');
 const statusEl = root.querySelector('#tobiStatus');
 const restoreBtn = root.querySelector('#tobiRestore');

  restoreBtn.style.cssText = `
    position: fixed;
    right: 18px;
    bottom: 82px;
    z-index: 9981;

    width: 38px;
    height: 38px;
    padding: 0;

    display: none;
    place-items: center;

    border: 1px solid rgba(255,255,255,.45);
    border-radius: 50%;

    background: rgba(23,37,29,.88);
    backdrop-filter: blur(8px);
    color: #fff;

    font-size: 0;
    cursor: pointer;
  `;

  restoreBtn.innerHTML = '🐊';
  restoreBtn.setAttribute('aria-label', 'Tampilkan TOBI');
  restoreBtn.title = 'Tampilkan TOBI';
 let open = false, peekIdleTimer = 0;
 const HIDE_KEY = 'tobi.hidden';
 const INTERACT_KEY = 'tobi.interacted'; /* Task 1: tombol glass hanya muncul setelah avatar berinteraksi */

  function hideTobi() {
    localStorage.setItem(HIDE_KEY, '1');

    clearTimeout(peekIdleTimer);
    peekIdleTimer = 0;

    open = false;
    launcher.style.display = 'none';
    balloon.hidden = true;
    balloon.classList.remove('tobi-balloon-act');
    delete balloon.dataset.act;
    panel.hidden = true;

    const dismissBtn = root.querySelector('#tobiDismiss');
    if (dismissBtn) dismissBtn.style.display = 'none';

    restoreBtn.style.display = 'grid';
  }
  const dismissBtn = root.querySelector('#tobiDismiss');

  if (dismissBtn) {
    dismissBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      hideTobi();
    });
  }

  function restoreTobi() {
    localStorage.removeItem(HIDE_KEY);
    sessionStorage.removeItem(INTERACT_KEY);

    launcher.style.display = '';
    panel.hidden = true;
    balloon.hidden = true;

    /* tombol glass kembali tersembunyi sampai avatar berinteraksi lagi (Task 1) */
    const dismissBtn = root.querySelector('#tobiDismiss');
    if (dismissBtn) dismissBtn.style.display = 'none';

    restoreBtn.style.display = 'none';

    open = false;
    clearTimeout(peekIdleTimer);

    /* sapaan muncul lagi setelah TOBI dipanggil (Task 4) */
    sessionStorage.removeItem(OPEN_KEY);
    setTimeout(showBalloon, 300);
  }
 /* ---------- Prompt 12: variasi template – pilih acak, tidak berulang dua kali ---------- */
 const lastPick = {};
 function pickVar(cat, keys){
 const opts = keys.map(k => { try { return t(k); } catch(_) { return ''; } }).filter(Boolean);
 if (!opts.length) return '';
 let s = Math.floor(Math.random() * opts.length);
 if (opts.length > 1 && lastPick[cat] === s) s = (s + 1) % opts.length;
 lastPick[cat] = s;
 return opts[s];
 }

 /* ---------- posisi launcher: drag bebas (Prompt 11) ----------
 posY/posX px; null = posisi default CSS (menempel tepi kanan).
 userPlaced = pengguna pernah memindahkan? mode User-Placed (Prompt 14):
 posisi disimpan di localStorage dan animasi keluar-masuk tepi dimatikan. */
 let posY = null, posX = null, userPlaced = false;
 /* Task 6: balloon greeting dihitung dari bounding box launcher (kiri/kanan),
 dan top dari posY aktual — bukan CSS statis yang bisa tertinggal di posisi lama. */
 function placeBalloonTop(){
 const r = launcher.getBoundingClientRect();
 balloon.style.top = Math.max(8, r.top) + 'px';
 }
 function defaultY(){ return Math.round(window.innerHeight * 0.38); }
 function defaultX(){ return window.innerWidth - (launcher.offsetWidth || 86); }
 function clampX(x){
 const w = launcher.offsetWidth || 86;
 const min = 8, max = window.innerWidth - w * 0.7 - 8; /* 30% boleh menempel keluar kanan */
 return Math.min(Math.max(x, min), Math.max(min, max));
 }
 function clampY(y){
 const h = launcher.offsetHeight || 96;
 const min = 78, max = window.innerHeight - h - 92; /* sisakan ruang utk music player di bawah */
 return Math.min(Math.max(y, min), Math.max(min, max));
 }
 function positionDismiss() {
  const dismissBtn = root.querySelector('#tobiDismiss');
  if (!dismissBtn || launcher.style.display === 'none') return;
 if (dismissBtn.style.display === 'none') return; /* Task 1: jangan posisi-kan kalau memang disembunyikan */

  const r = launcher.getBoundingClientRect();

  /* posisi mengikuti bounding box avatar; clamp agar tidak keluar viewport */
  const size = dismissBtn.offsetWidth || 20;
  dismissBtn.style.left = Math.min(Math.max(r.left + r.width * 0.72, 4), Math.max(4, window.innerWidth - size - 4)) + 'px';
  dismissBtn.style.top = Math.min(Math.max(r.top + 2, 4), Math.max(4, window.innerHeight - size - 4)) + 'px';
}
 function applyPos(){
 if (posY === null) { posY = defaultY(); }
 posY = clampY(posY);
 launcher.style.top = posY + 'px';
 if (posX!== null) {
 launcher.style.left = posX + 'px';
 launcher.style.right = 'auto';
 launcher.classList.add('tobi-free');
 }
 /* sinkronkan balon sapaan dgn posisi launcher (improvement 6 + Prompt 10) */
 root.style.setProperty('--tobi-top', posY + 'px');
 placeBalloon();
 positionDismiss();
 positionPanel();
 }
 /* Prompt 10 + Task 6: balon selalu menempel di sisi launcher, walau launcher dipindah.
 Top dihitung dari bounding box launcher, bukan CSS statis. */
 function placeBalloon(){
 const r = launcher.getBoundingClientRect();
 if (r.left + r.width / 2 > window.innerWidth / 2) {
 balloon.style.left = 'auto';
 balloon.style.right = Math.max(8, window.innerWidth - r.left + 10) + 'px';
 } else {
 balloon.style.right = 'auto';
 balloon.style.left = Math.max(8, r.right + 10) + 'px';
 }
 /* clamp top: bubble tidak menutupi wajah avatar dan tidak keluar viewport */
 balloon.style.top = Math.min(Math.max(r.top, 8), Math.max(8, window.innerHeight - 60)) + 'px';
 }
 function loadPos(){
 try {
 const raw = localStorage.getItem(POS_KEY);
 if (raw === null) { posY = null; posX = null; userPlaced = false; }
 else {
 const v = JSON.parse(raw); /* format baru {x,y}; angka = format lama (vertikal) */
 if (typeof v === 'number') { posY = clampY(v); posX = null; }
 else { posY = clampY(parseFloat(v.y)); posX = clampX(parseFloat(v.x)); }
 userPlaced = isFinite(posY) && posY!== null;
 if (!isFinite(posY)) posY = null;
 if (!isFinite(posX)) posX = null;
 }
 } catch(_) { posY = null; posX = null; userPlaced = false; }
 applyPos();
 }
 function savePos(){
 try { localStorage.setItem(POS_KEY, JSON.stringify({ x: Math.round(posX === null? defaultX() : posX), y: Math.round(posY) })); } catch(_){}
 }

 function positionPanel(){
 /* mobile: panel pakai layout fluid CSS di @media 640px, jangan ditimpa inline */
 if (window.innerWidth <= 640) { panel.style.top = ''; panel.style.left = ''; panel.style.right = ''; return; }
 if (!open) return;
 /* panel muncul di samping launcher (Task 3): dihitung dari posisi AKTUAL
 avatar via bounding box, bukan posisi hardcoded tepi kanan. */
 const r = launcher.getBoundingClientRect();
 const ph = panel.offsetHeight || 460;
 const pw = panel.offsetWidth || 320;
 let top = posY - 40;
 top = Math.min(Math.max(top, 12), Math.max(12, window.innerHeight - ph - 12));
 /* pilih sisi: launcher di setengah kanan layar → panel di kirinya; sebaliknya kanan */
 let left;
 const anchorCx = r.left + r.width / 2;
 if (anchorCx > window.innerWidth / 2) left = r.left - pw - 10;
 else left = r.right + 10;
 /* clamp agar tidak keluar viewport (desktop + mobile) */
 left = Math.min(Math.max(left, 10), Math.max(10, window.innerWidth - pw - 10));
 panel.style.top = top + 'px';
 panel.style.left = left + 'px';
 panel.style.right = 'auto';
 }

 /* Task 1: tombol glass × hanya muncul setelah pengguna berinteraksi
 dengan avatar (klik atau mulai drag) — tidak tampil saat halaman dibuka. */
 /* Task 1 + Task 2: tombol glass disembunyikan permanen saat TOBI di-hide,
 refresh halaman juga tidak memunculkannya kembali (cek HIDE_KEY). */
 function revealDismiss(){
 if (localStorage.getItem(HIDE_KEY) === '1') return;
 try { sessionStorage.setItem(INTERACT_KEY, '1'); } catch(_){}
 const btn = root.querySelector('#tobiDismiss');
 if (btn && launcher.style.display !== 'none') {
 btn.style.display = 'flex';
 positionDismiss();
 }
 }
 /* drag launcher – pointer events (mouse + touch), 2 axis; klik vs drag dibedakan */
 let drag = null;
 launcher.addEventListener('pointerdown', e => {
 if (e.button!== undefined && e.button!== 0) return;
 drag = { startX: e.clientX, startY: e.clientY, top0: posY, left0: posX === null? defaultX() : posX, moved: false };
 launcher.classList.add('dragging');
 clearTimeout(peekIdleTimer);
 revealDismiss(); /* mulai interaksi → tombol glass muncul dekat avatar */
 try { launcher.setPointerCapture(e.pointerId); } catch(_){}
 });
 launcher.addEventListener('pointermove', e => {
 if (!drag) return;
 const dy = e.clientY - drag.startY, dx = e.clientX - drag.startX;
 if (Math.abs(dy) > 6 || Math.abs(dx) > 6) drag.moved = true;
 if (drag.moved) {
 posY = clampY(drag.top0 + dy);
 posX = clampX(drag.left0 + dx);
 launcher.style.top = posY + 'px';
 launcher.style.left = posX + 'px';
 launcher.style.right = 'auto';
 launcher.classList.add('tobi-free');
 if (!balloon.hidden) placeBalloon(); /* Task 6: bubble ikut posisi avatar saat drag */
 positionDismiss();
 positionPanel();
 }
 });
 /* klik mascot = toggle (buka kalau tertutup, tutup kalau terbuka).
 endDrag membedakan klik vs drag? tidak ada double toggle. */
 function endDrag(e){
 if (!drag) return;
 const wasDrag = drag.moved;
 drag = null;
 launcher.classList.remove('dragging');
 revealDismiss(); /* klik/drag avatar → tombol glass muncul (Task 1) */
 if (wasDrag) { userPlaced = true; savePos(); positionDismiss(); positionPanel(); } /* Prompt 14: mode User-Placed */
 else toggleChat(); /* klik tanpa drag? toggle */
 }
 launcher.addEventListener('pointerup', endDrag);
 launcher.addEventListener('pointercancel', () => { if (drag) { drag = null; launcher.classList.remove('dragging'); } });
 /* touch: hanya drag – halaman tetap bisa discroll karena touch-action pada CSS */
 launcher.addEventListener('click', e => { if (drag && drag.moved) e.preventDefault(); });

 window.addEventListener('resize', () => {
 posY = clampY(posY === null? defaultY() : posY);
 if (posX!== null) posX = clampX(posX);
 launcher.style.top = posY + 'px';
 if (posX!== null) launcher.style.left = posX + 'px';
 if (!balloon.hidden) placeBalloon(); /* Task 6: bubble ikut posisi avatar saat resize */
 positionDismiss();
 positionPanel();
 });

 /* ---------- balloon sapaan (peek-a-boo) ----------
 GREETING PENDEK: via tobiGreeting() dari engine percakapan
 (3-7 kata, variasi acak, tidak berulang berturut-turut).
 Wrapper sinkron: balloon selalu digambar ulang oleh placeBalloon()
 relatif terhadap posisi launcher terbaru (posY/posX). */
 async function greetText(){
 if (typeof window.tobiGreeting === 'function') {
 const short = await window.tobiGreeting();
 if (short) return short;
 }
 return isId2()? 'Halo! Ada yang bisa dibantu?' : 'Hey! What can I do for you?';
 }
 const isId2 = () => document.documentElement.lang!== 'en';
 function showBalloon(){
  if (localStorage.getItem(HIDE_KEY) === '1') return;
  if (launcher.style.display === 'none') return; /* avatar disembunyikan */
  if (open || document.hidden) return;

  greetText().then(res => {
    if (localStorage.getItem(HIDE_KEY) === '1') return;
    if (launcher.style.display === 'none') return;
    if (open || document.hidden) return;
 const txt = typeof res === 'object' && res? res.text : res;
 const act = typeof res === 'object' && res? res.act : null;
 balloon.textContent = txt;
 balloon.classList.toggle('tobi-balloon-act',!!act);
 if (act) balloon.dataset.act = act; else delete balloon.dataset.act;
 balloon.hidden = false;
 clearTimeout(peekIdleTimer);
 peekIdleTimer = setTimeout(() => { balloon.hidden = true; }, 4200);
 });
 }
 /* Balloon interaktif: klik greeting beraksi (mis. "Tebak emoji yuk!") →
 buka chatbot & langsung mulai permainannya. */
 balloon.addEventListener('click', () => {
 const act = balloon.dataset.act;
 if (!act) return;
 balloon.hidden = true;
 delete balloon.dataset.act;
 try { sessionStorage.setItem('tobi.greetAction', act); } catch(_){}
 toggleChat(true);
 /* welcome sudah jalan → aksi diproses langsung di sini; kalau belum, welcome engine membacanya */
 if (window.tobiPersona && window.tobiPersona.startGame) {
 setTimeout(() => { try { if (sessionStorage.getItem('tobi.greetAction')) { sessionStorage.removeItem('tobi.greetAction'); addMsg(window.tobiPersona.startGame(act), 'bot'); } } catch(_){} }, 600);
 }
 });
 /* Prompt 14: peek-a-boo berkala selagi panel tertutup.
 - Default mode (belum pernah dipindah): TOBI sembunyi ke balik tepi,
 lalu mengintip lagi disertai balon sapaan.
 - User-Placed mode (sudah di-drag): posisi dihormati, hanya balon sapaan.
 - Reduced motion: tanpa animasi otomatis. */
 setInterval(() => {
 if (open || document.hidden || REDUCE) return;
 if (localStorage.getItem(HIDE_KEY) === '1') return; /* Task 2: greeting tidak muncul saat TOBI di-hide */
 if (!userPlaced) {
 launcher.classList.add('tobi-away');
 setTimeout(() => {
 if (localStorage.getItem(HIDE_KEY) === '1') return;
 launcher.classList.remove('tobi-away'); showBalloon();
 }, 1400);
 } else {
 showBalloon();
 }
 }, 45000);
 /* sapaan pertama per sesi browser — TIDAK muncul saat TOBI di-hide (Task 4) */
 setTimeout(() => {
 if (localStorage.getItem(HIDE_KEY) === '1') return;
 if (!sessionStorage.getItem(OPEN_KEY)) { sessionStorage.setItem(OPEN_KEY, '1'); showBalloon(); }
 }, 1600);

 /* ---------- chat log ---------- */
 function esc(s){ const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
 function addMsg(text, who){
 const el = document.createElement('div');
 el.className = 'tobi-msg tobi-' + who;
 el.innerHTML = (who === 'bot'? '<span class="tobi-label"></span>' : '') +
 /* Prompt 15: label pengirim selalu TOBI */
 '<div class="tobi-bubble">' + esc(text) + '</div>';
 if (who === 'bot') el.querySelector('.tobi-label').textContent = t('tobi.name');
 log.appendChild(el);
 log.scrollTop = log.scrollHeight;
 return el;
 }
 function typing(on){
 let el = log.querySelector('.tobi-typing');
 if (on &&!el) {
 el = document.createElement('div');
 el.className = 'tobi-msg tobi-bot tobi-typing';
 el.innerHTML = '<div class="tobi-bubble"><span class="tobi-dots"><i></i><i></i><i></i></span></div>';
 log.appendChild(el);
 log.scrollTop = log.scrollHeight;
 } else if (!on && el) el.remove();
 }

 function send(text){
 const msg = text.trim();
 if (!msg) return;
 addMsg(msg, 'user');
 input.value = '';
 typing(true);
 setTimeout(() => {
 typing(false);
 /* 0) PERSONA ENGINE (Prompt 7) – nama pengunjung, typo/slang, jadwal
 resmi Tobadeli & Tobaladies, partnership, percakapan santai.
 Menangani dulu; jika null? small talk lama & FAQ engine tetap jalan. */
 const persona = (window.tobiPersona && window.tobiPersona.handle(msg)) || null;
 if (persona) {
 const elP = addMsg(persona, 'bot');
 /* Prompt 7: jawaban JOIN → link klik-langsung ke Form Gabung TOBA
 (modal #joinModal di homepage, tombol #joinCtaBtn di halaman lain). */
 if (window.tobiPersona.lastIntent === 'join') {
 const link = document.createElement('a');
 const onHome = document.body.dataset.page === 'home';
 link.href = onHome? '#joinCtaBtn' : 'index.html#joinCtaBtn';
 link.className = 'tobi-page-link';
 link.textContent = document.documentElement.lang!== 'en'? 'Isi Form Gabung TOBA' : 'Fill Out the TOBA Join Form';  /* label tanpa panah */
 link.addEventListener('click', e => {
 e.preventDefault();
 if (onHome) {
 const btn = document.getElementById('joinCtaBtn');
 if (btn) { btn.scrollIntoView({ behavior: REDUCE? 'auto' : 'smooth', block: 'center' }); btn.click(); }
 } else {
 try { sessionStorage.setItem('tobi.openJoin', '1'); } catch(_){}
 location.href = 'index.html#joinCtaBtn';
 }
 closeNav?.(); toggleChat(false);
 });
 elP.querySelector('.tobi-bubble').appendChild(document.createElement('br'));
 elP.querySelector('.tobi-bubble').appendChild(link);
 }
 renderChips(); /* PROMPT 9: chips kontekstual juga setelah balasan persona */
 return;
 }
 /* 1) small talk & konteks dulu – jawaban friendly, bukan FAQ mentah */
 const small = (typeof window.tobiSmallTalk === 'function')? window.tobiSmallTalk(msg) : null;
 if (small) { addMsg(small, 'bot'); return; }
 /* 2) FAQ / navigasi / fallback engine lama */
 const hit = tobiReply(msg);
 if (hit) {
 window.tobiPersona.lastIntent = null; /* FAQ engine bukan jalur JOIN */
 const el = addMsg(hit.answer, 'bot');
 if (hit.pageLink) {
 const link = document.createElement('a');
 link.href = hit.pageLink;
 link.className = 'tobi-page-link';
 link.textContent = t('tobi.link');
 el.querySelector('.tobi-bubble').appendChild(document.createElement('br'));
 el.querySelector('.tobi-bubble').appendChild(link);
 }
 return;
 }
 /* 3) fallback ramah – variasi, tidak template kaku */
 const q0 = msg.toLowerCase();
 if (/\bbasket(ball)?\b/.test(q0)) {
 addMsg(t('tobi.basket.1'), 'bot');
 } else if (q0.split(/\s+/).length <= 3) {
 addMsg(pickVar('fallback', ['tobi.fallback.1', 'tobi.fallback.2']), 'bot');
 } else {
 addMsg(pickVar('out', ['tobi.out.1', 'tobi.out.2']), 'bot');
 }
 renderChips(); /* PROMPT 9: chips mengikuti konteks setelah setiap balasan */
 }, REDUCE? 80 : 650);
 }

 form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });

 /* suggested questions (Prompt 7): contextual chips dari persona engine –
 bervariasi per konteks; klik chip = kirim pertanyaan lewat pipeline normal
 (persona? small talk? FAQ) supaya jadwal & partnership juga terjawab. */
 function renderChips(){
 let list = null;
 try { list = (window.tobiPersona && window.tobiPersona.chips()) || null; } catch(_){ list = null; }
 if (!list ||!list.length) { chips.innerHTML = ''; return; }
 chips.innerHTML = list.map(c => `<button class="tobi-chip" type="button" data-send="${esc(c.q)}"${c.act? ` data-act="${c.act}"` : ''}${c.link? ` data-link="${c.link}"` : ''}>${esc(c.q)}</button>`).join('');
 }
 chips.addEventListener('click', e => {
 const b = e.target.closest('.tobi-chip'); if (!b) return;
 /* Task 8: chip Partnership / Form Kolaborasi membuka langsung halaman
 partnership di section form resmi (#partnerForm) — URL asli, bukan Google Form palsu */
 if (b.dataset.link) {
 addMsg(b.dataset.send, 'user'); input.value = '';
 typing(true);
 setTimeout(() => {
 typing(false);
 addMsg(document.documentElement.lang !== 'en'? 'Oke, aku antar kamu ke form kolaborasinya ya!' : 'Okay, taking you to the collaboration form!', 'bot');
 setTimeout(() => { location.href = b.dataset.link; }, 800);
 }, REDUCE? 80 : 650);
 return;
 }
 /* chip permainan (Tebak emoji) langsung memulai game, bukan sekadar kirim teks */
 if (b.dataset.act && window.tobiPersona && window.tobiPersona.startGame) {
 addMsg(b.dataset.send, 'user'); input.value = '';
 typing(true);
 setTimeout(() => { typing(false); addMsg(window.tobiPersona.startGame(b.dataset.act), 'bot'); }, REDUCE? 80 : 650);
 return;
 }
 send(b.dataset.send);
 });

 /* ---------- open / close panel ----------
 Riwayat chat TIDAK dibersihkan saat panel ditutup – percakapan tetap
 utuh saat dibuka lagi, dan welcome TIDAK dikirim ulang. */
 function toggleChat(force){
 open = force!== undefined? force :!open;
 panel.hidden =!open;
 launcher.setAttribute('aria-expanded', String(open));
 launcher.classList.toggle('open', open);
 balloon.hidden = true;
 balloon.classList.remove('tobi-balloon-act');
 delete balloon.dataset.act;
 if (open) {
 positionPanel();
 if (!log.childElementCount) {
 /* Prompt 7: first chat – TOBI kenalan & tanya nama dulu (persona engine).
 Jika persona belum siap, fallback ke welcome lama. Welcome hanya
 sekali; tidak dikirim ulang saat panel dibuka kembali. */
 if (window.tobiPersona) window.tobiPersona.welcome(addMsg, t);
 else addMsg(pickVar('welcome', ['tobi.welcome.1', 'tobi.welcome.2', 'tobi.welcome.3']), 'bot');
 }
 renderChips();
 setTimeout(() => input.focus(), 120);
 }
 }
 root.querySelector('#tobiMinimize').addEventListener('click', () => {
  toggleChat(false);
  showBalloon();
});
 root.querySelector('#tobiClose').addEventListener('click', hideTobi);
 document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) toggleChat(false); });

 /* ---------- improvement 5: launcher sembunyi saat scroll ke bawah ----------
 Sembunyi saat scroll turun, muncul lagi saat scroll naik / berhenti di atas. */
 let lastScrollY = window.scrollY, hideTimer = 0;
 function onScroll(){
 const y = window.scrollY;
 if (open) { root.classList.remove('tobi-hidden'); return; }
 if (y > lastScrollY + 8 && y > 120) root.classList.add('tobi-hidden');
 else if (y < lastScrollY - 8) root.classList.remove('tobi-hidden');
 lastScrollY = y;
 clearTimeout(hideTimer);
 hideTimer = setTimeout(() => root.classList.remove('tobi-hidden'), 4000);
 }
 window.addEventListener('scroll', onScroll, { passive: true });

 /* ---------- label ikut bahasa aktif ---------- */
 function refreshLang(){
 /* Prompt 15: seluruh teks branding TOBI ikut bahasa aktif */
 root.querySelector('#tobiName').textContent = t('tobi.name');
 root.querySelector('#tobiSub').textContent = t('tobi.sub');
 statusEl.textContent = t('tobi.status');
 launcher.setAttribute('aria-label', t('tobi.aria'));
 panel.setAttribute('aria-label', t('tobi.name') + ' – ' + t('tobi.sub'));
 input.placeholder = t('tobi.ph');
 if (open) renderChips();
 /* balloon yang sedang tampil: teks ikut bahasa baru (greeting pendek),
 posisi tetap sinkron dengan launcher */
 if (!balloon.hidden) {
 greetText().then(res => {
 if (!balloon.hidden){
 const txt = typeof res === 'object' && res? res.text : res;
 const act = typeof res === 'object' && res? res.act : null;
 balloon.textContent = txt;
 balloon.classList.toggle('tobi-balloon-act',!!act);
 if (act) balloon.dataset.act = act; else delete balloon.dataset.act;
 }
 });
 placeBalloon();
 positionDismiss();
 }
 }
 document.addEventListener('toba:langchange', refreshLang);
 refreshLang();
 loadPos();
 restoreBtn.addEventListener('click', restoreTobi);

 /* Task 1: saat halaman pertama dibuka, tombol glass × TIDAK terlihat —
 hanya muncul setelah avatar diklik / di-drag (revealDismiss). */
 const dismissBtn0 = root.querySelector('#tobiDismiss');
 if (dismissBtn0) dismissBtn0.style.display = 'none';

 if (localStorage.getItem(HIDE_KEY) === '1') {
    launcher.style.display = 'none';
    balloon.hidden = true;
    panel.hidden = true;
    if (dismissBtn0) dismissBtn0.style.display = 'none';
    restoreBtn.style.display = 'grid';
    restoreBtn.style.right = '22px';
    restoreBtn.style.bottom = '82px';
    /* Task 5: jarak aman dari music player (tm-fab) di kanan-bawah */
}
})();

/* =====================================================================
 TOBI CONVERSATION ENGINE – friendly, contextual, small talk
 (MASTER PROMPT: mascot interaction, greeting, conversational intel)
 =====================================================================
 Catatan bahasa: QA di browser tanpa localStorage 'toba-lang'=id
 memakai default EN (konsisten dengan seluruh situs, default EN).
 Greeting pendek memakai TOBI_GREETINGS di i18n.js – mengikuti
 documentElement.lang, jadi tetap berganti bersama language switch.
 – SHORT GREETINGS via 'toba:tobiGreet' event (listener di i18n.js,
 per bahasa, tanpa pengulangan berturut-turut)? balloon mascot pendek.
 – CONTEXT: riwayat intent + slot (nama topik, minat gabung, pengalaman)
? jawaban singkat seperti "iya/belum/mau" tetap nyambung.
 – SMALL TALK intents: sapaan, kabar, siapa TOBI, terima kasih, oke,
 rasa takut/pemula/jauh, ketertarikan – dengan variasi jawaban.
 – FAKTA hanya dari faq.chat.* (biaya, jadwal, lokasi, member, daftar)
 – tidak pernah mengarang harga/jadwal.
 ===================================================================== */
(function tobiConversation(){
 if (window.__tobiConv) return; /* anti duplikat listener/engine */
 window.__tobiConv = true;

 const GREET_EVENT = 'toba:tobiGreet';
 let lastGreetIdx = null;

 /* ---------- API publik untuk modul TOBI lama ---------- */
 window.tobiGreeting = function(){
 return new Promise(resolve => {
 let done = false;
 const reply = (text, idx, act) => { if (!done) { done = true; lastGreetIdx = idx; resolve(act? { text, act } : text); } };
 const detail = { last: lastGreetIdx, reply };
 document.dispatchEvent(new CustomEvent(GREET_EVENT, { detail }));
 setTimeout(() => { if (!done) { done = true; resolve(null); } }, 250); /* fallback: tidak ada listener */
 });
 };

 /* ---------- konteks percakapan ----------
 intentLog: urutan intent; slots: info yang sudah diketahui. */
 window.__tobiCtx = { intents: [], slots: {} };
 const ctx = window.__tobiCtx;

 const isId = () => document.documentElement.lang!== 'en';
 const pick = arr => arr[Math.floor(Math.random() * arr.length)];

 /* ---------- intent matchers (ID + EN keywords) ---------- */
 const INTENTS = [
 { id: 'greet', re: /^(halo|hallo|hai|hei|hi|hello|hey|woi|^p$|pagi|siang|sore|malam|good\s?(morning|afternoon|evening))\b/i },
 { id: 'who', re: /(kamu siapa|siapa kamu|siapa sih kamu|who are you|kamu apa|apa ini|lu siapa)/i },
 { id: 'howru', re: /(apa kabar|gimana kabar|how are you|kabarmu|kabar kamu)/i },
 { id: 'thanks',re: /(makasih(ya)?|makasi(h)?|terima kasih|terimakasih|thanks|thank you|thx|sip ya)/i },
 { id: 'ok', re: /^(oke|ok|okay|sip|siap|oke deh|udah|done)[\s!.]*$/i },
 { id: 'never', re: /(belum pernah|nggak pernah|tidak pernah|belum\s?(ikut|main)|never (played|joined)|baru mau mulai)/i },
 { id: 'beginner', re: /(pemula|masih (belajar|nggak jago|tidak jago)|belum jago|beginner|amateur|baru belajar)/i },
 { id: 'scared',re: /(takut|canggung|malu|sendirian|sendiri|nervous|shy|afraid)/i },
 { id: 'far', re: /(tinggal jauh|jauh dari|daerah lain|luar kota|far (away|from)|rumahku jauh)/i },
 { id: 'interested', re: /(kayaknya seru|seru banget|menarik|keren|pengen (coba|ikut)|gas ikut|sounds fun)/i },
 { id: 'interestJoin', re: /(mau ikut|ikut dong|ikut|gas ikut|aku mau ikut|mau gabung|mau join|want to join|join us)/i },
 { id: 'yes', re: /^(iya|iyah|yeah|yes|yoi|betul|benar|bener|setuju|boleh|mau|gas)[\s!.]*$/i },
 { id: 'no', re: /^(nggak|gak|ngga|tidak|no|nggak dulu|ga dulu)[\s!.]*$/i }
 ];

 function detectIntent(msg){
 for (const it of INTENTS) if (it.re.test(msg)) return it.id;
 return null;
 }

 /* ---------- balasan small talk (ID + EN), variasi acak ---------- */
 const SMALLTALK = {
 greet: {
 id: ['Halo juga! Lagi cari info tentang TOBA atau mau ngobrol dulu?','Hai! Senang kamu mampir. Mau tanya-tanya soal TOBA?','Halo! Ada yang bisa TOBI bantu?'],
 en: ['Hey there! Looking for TOBA info or just chatting?','Hi! Great to see you. Anything about TOBA?','Hello! What can I help with?']
 },
 who: {
 id: ['Hai! Aku TOBI, asisten virtual TOBA Community. Aku bisa bantu kamu cari info kegiatan, jadwal main, biaya, dan cara gabung!'],
 en: ['Hi! I\'m TOBI, the virtual assistant of TOBA Community – schedules, fees, and how to join!']
 },
 howru: {
 id: ['Aku baik, siap nemenin kamu ngobrol soal basket! Kamu sendiri gimana?','Kabar aku mantap! Kamu gimana?'],
 en: ['Doing great, ready to talk hoops! How about you?','All good here! You?']
 },
 thanks: {
 id: ['Sama-sama! Senang bisa bantu kamu.','Anytime! Kalau ada lagi, panggil aja ya.','Siap! Semoga makin semangat mainnya.'],
 en: ['You\'re welcome! Happy to help.','Anytime! Ping me again.','Got it – happy hooping.']
 },
 ok: {
 id: ['Siap! Kalau ada yang mau ditanyain lagi, panggil TOBI aja.','Oke! Sampai jumpa di lapangan.'],
 en: ['Got it! Ping me anytime.','Cool! See you on the court.']
 },
 never: {
 id: ['Wah, nggak apa-apa! Justru bisa jadi awal yang seru. Kamu tertarik mulai belajar basket dari dasar?','Belum pernah ikut TOBA atau belum pernah main basket sama sekali?'],
 en: ['No worries! That could be a fun start. Want to learn from the basics?','Never joined TOBA or never played basketball at all?']
 },
 beginner: {
 id: ['Tenang, nggak harus jago dulu kok. Yang penting mau mencoba dan belajar bareng!','Pemula juga welcome banget di TOBA. Banyak yang mulai dari nol kok.'],
 en: ['Relax, no need to be great first. Trying and learning together is what counts!','Beginners are super welcome at TOBA.']
 },
 scared: {
 id: ['Relate banget! Datang pertama kali memang bisa bikin canggung. Kalau mau, aku bantu jelaskan dulu suasana dan kegiatan TOBA.','Tenang, anak TOBA ramah kok. Kamu bisa datang bareng teman dulu kalau lebih nyaman.'],
 en: ['Totally relatable! First visits can feel awkward – want me to walk you through the vibe first?','Don\'t worry, TOBA folks are friendly. You can bring a friend too.']
 },
 far: {
 id: ['Oh begitu. Kamu dari daerah mana? Kita bisa coba cek informasi lokasi kegiatan yang tersedia.','Jauh memang tantangan. Kalau kebetulan lewat Jakarta Timur, sesi Sabtu malam jadi pilihan yang pas.'],
 en: ['I see. Where are you from? We can check the session locations.','That\'s a trek. Saturday evening sessions might fit if you pass East Jakarta.']
 },
 interested: {
 id: ['Seru banget kalau bisa main dan kenalan sama teman baru! Mau aku kasih tahu cara ikut kegiatan TOBA?','Wah, asik! Kamu sudah pernah ikut kegiatan TOBA sebelumnya atau ini pertama kalinya?'],
 en: ['So much fun meeting new people on court! Want to know how to join a session?','Nice! First time with TOBA or have you joined before?']
 },
 interestJoin: {
 id: ['Wah, asik! Kamu sudah pernah ikut kegiatan TOBA sebelumnya atau ini pertama kalinya? Kalau mau langsung daftar, tombol pendaftaran juga tersedia di halaman ini.'],
 en: ['Nice! First time with TOBA or joined before? The signup button on this page works anytime too.']
 },
 yes: {
 id: ['Mantap! Ada yang spesifik mau ditanyain – jadwal, biaya, atau cara daftar?','Oke! Aku bantu jelaskan dari jadwal dulu ya.'],
 en: ['Awesome! Anything specific – schedule, fees, or how to sign up?','Cool! Let me start with the schedule then.']
 },
 no: {
 id: ['Oke, nggak masalah. Kalau nanti berubah pikiran, aku di sini.'],
 en: ['No problem. I\'m here if you change your mind.']
 }
 };

 /* ---------- jawab berbasis konteks + small talk ----------
 Return null jika bukan small talk? modul TOBI lanjut ke FAQ engine. */
 window.tobiSmallTalk = function(msg){
 const intent = detectIntent(msg);
 const q = msg.toLowerCase().trim();
 const words = q.split(/\s+/).length;

 if (intent) {
 ctx.intents.push(intent);
 if (ctx.intents.length > 12) ctx.intents.shift();
 /* konteks: "iya/belum" menjawab pertanyaan small talk sebelumnya */
 if ((intent === 'yes' || intent === 'no') && ctx.slots.pendingQuestion) {
 const prev = ctx.slots.pendingQuestion;
 ctx.slots.pendingQuestion = null;
 if (prev === 'never' && intent === 'yes') {
 ctx.slots.knowsBasics = true;
 return pick(SMALLTALK.beginner[isId()? 'id' : 'en']);
 }
 }
 /* simpan slot konteks penting */
 if (intent === 'never') ctx.slots.pendingQuestion = 'never';
 if (intent === 'interested') ctx.slots.wantsJoin = true;

 const bank = SMALLTALK[intent];
 if (bank) return pick(bank[isId()? 'id' : 'en']);
 if (intent === 'interestJoin') {
 ctx.slots.wantsJoin = true;
 return pick(SMALLTALK.interestJoin[isId()? 'id' : 'en']);
 }
 }

 /* pernyataan pengalaman singkat tanpa keyword jelas? respon empatik */
 if (words >= 3 && /(aku|saya|gw|gue|w)\b/.test(q) && /(takut|malu|bingung|canggung|bingun|ragu)/.test(q)) {
 return pick(SMALLTALK.scared[isId()? 'id' : 'en']);
 }
 return null;
 };
})();






/* =====================================================================
 TOBI PERSONA ENGINE v2 — REVISI PROMPT 7
 (perkenalan singkat, prioritas intent — identity paling atas,
 anti-repetisi, gaya Gen Z natural, session name memory)

 JADWAL RESMI (KOREKSI):
 Tobadeli = Kamis, 20.00–22.00 WIB
 Tobaladies = SABTU, 18.00–20.00 WIB (bukan Minggu lagi)
 ===================================================================== */
(function tobiPersonaEngineV2(){
 if (window.__tobiPersonaLoaded) return;
 window.__tobiPersonaLoaded = true;

 const isId = () => document.documentElement.lang!== 'en';
 const NAME_KEY = 'tobi.name';
 const DELI = 'Tobadeli', LADIES = 'Tobaladies';
 const JAM_DELI = '20.00–22.00 WIB', JAM_LADIES = '18.00–20.00 WIB';
 const HARI_DELI = 'Kamis', HARI_LADIES = 'Sabtu';

 /* ---------- session context ---------- */
 const ctx = { name: null, topics: [], lastSchedule: null, askedName: false,
 lastAnswers: [], newbie: null, wantsJoin: null };
 try { ctx.name = sessionStorage.getItem(NAME_KEY) || null; } catch(_){}

 /* ---------- variasi tanpa berulang (global: tidak sama dengan 6 jawaban terakhir) ----------
 Ditambah TONE MODE (Adaptive Persona): gaya bahasa TOBI mengikuti gaya
 pengunjung — formal / santai / playful — dari riwayat pesan terakhir. */
 let tone = 'casual'; /* 'formal' | 'casual' | 'playful' */
 function detectTone(q, raw){
 const s = q.trim();
 /* formal: kata baku/sopan/proses/komersial — cek SEBELUM playful */
 if (/(selamat (pagi|siang|sore|malam)|saya (ingin|mau|ingin mengetahui|mohon)|apakah|informasi mengenai|mohon|prosedur|terima kasih atas|dapatkah|bisakah|mengenai|kesempatan kerja sama|terbuka untuk|dengan hormat|kegiatan komunitas|latihan( yang)?|jika berkenan|ingin mengetahui)/i.test(s)){
 return 'formal';
 }
 /* playful: tawa/ngakak/emoji bercanda */
 if (/|haha|ngakak|lol|lmao||/i.test(s)) return 'playful';
 return 'casual';
 }
 function pick(cat, arr){
 if (!arr ||!arr.length) return '';
 /* jika ada varian formal utk kategori ini & tone formal → pakai itu */
 if (tone === 'formal' && arr._formal && arr._formal.length){
 let s2 = Math.floor(Math.random() * arr._formal.length);
 for (let k2 = 0; k2 < 6; k2++){
 if (!ctx.lastAnswers.includes(arr._formal[s2])) break;
 s2 = (s2 + 1) % arr._formal.length;
 }
 ctx.lastAnswers.push(arr._formal[s2]);
 if (ctx.lastAnswers.length > 6) ctx.lastAnswers.shift();
 return arr._formal[s2];
 }
 let s = Math.floor(Math.random() * arr.length);
 for (let k = 0; k < 6; k++){
 if (!ctx.lastAnswers.includes(arr[s])) break;
 s = (s + 1) % arr.length;
 }
 ctx.lastAnswers.push(arr[s]);
 if (ctx.lastAnswers.length > 6) ctx.lastAnswers.shift();
 return arr[s];
 }
 const nama = () => ctx.name || '';
 const sapa = () => nama()? nama() : 'kamu'; /* sisipan natural */

 /* ---------- normalisasi: slang, singkatan, typo ---------- */
 const SLANG = [
 [/\bgmn\b/gi,'gimana'],[/\bgimane\b/gi,'gimana'],[/\bgmana\b/gi,'gimana'],[/\bgmn2\b/gi,'gimana'],
 [/\bjm\b/gi,'jam'],[/\bjadwl\b/gi,'jadwal'],[/\bhr\b/gi,'hari'],[/\bcwe\b/gi,'cewek'],[/\bcwo\b/gi,'cowok'],
 [/\bgmna\b/gi,'gimana'],[/\bgmna2\b/gi,'gimana'],[/\bikt\b/gi,'ikut'],[/\bga\?/gi,'tidak'],
 [/\bbrp\b/gi,'berapa'],[/\bbrapa\b/gi,'berapa'],
 [/\bdmna\b/gi,'dimana'],[/\bdmana\b/gi,'dimana'],[/\bdmn\b/gi,'dimana'],
 [/\bklo\b/gi,'kalau'],[/\bkalo\b/gi,'kalau'],[/\bklu\b/gi,'kalau'],
 [/\budh\b/gi,'sudah'],[/\bblm\b/gi,'belum'],[/\bbsk\b/gi,'besok'],
 [/\bskrg\b/gi,'sekarang'],[/\bgpp\b/gi,'gapapa'],[/\bgpp2\b/gi,'gapapa'],
 [/\bbgt\b/gi,'banget'],[/\bbsa\b/gi,'bisa'],[/\bpngen\b/gi,'pengen'],[/\bpngin\b/gi,'pengen'],
 [/\bjoin\b/gi,'gabung'],[/\bikutan\b/gi,'ikut'],
 [/\bnggak\b/gi,'tidak'],[/\bngga\b/gi,'tidak'],[/\bgak\b/gi,'tidak'],[/\bgk\b/gi,'tidak'],[/\btdk\b/gi,'tidak'],[/\bga\b/gi,'tidak'],
 [/\bsndiri\b/gi,'sendiri'],[/\btemen\b/gi,'teman'],[/\btemen2\b/gi,'teman-teman'],
 [/\bdr\b/gi,'dari'],[/\bdgn\b/gi,'dengan'],[/\bsy\b/gi,'saya'],
 [/\baku\b/gi,'saya'],[/\bgw\b/gi,'saya'],[/\bgue\b/gi,'saya'],
 [/\bnih\b/gi,'ini'],[/\btuh\b/gi,'itu'],[/\bnhi\b/gi,'ini'],
 [/\bmsh\b/gi,'masih'],[/\bjd\b/gi,'jadwal'],[/\bjdl\b/gi,'jadwal'],
 [/\bbyr\b/gi,'bayar'],[/\bbya\b/gi,'biaya'],
 [/\bkolaborasi\b/gi,'kolaborasi'],[/\bpartnership\b/gi,'partnership']
 ];
 const TEAM_FIX = [
 [/tobadel[il1]y?\b/gi,'tobadeli'],[/tobadli\b/gi,'tobadeli'],[/tobadely\b/gi,'tobadeli'],
 [/tobaladis\b/gi,'tobaladies'],[/tobaladi\b/gi,'tobaladies'],[/tobaladie\b/gi,'tobaladies'],
 [/tobalady\b/gi,'tobaladies'],[/tobaladieis\b/gi,'tobaladies']
 ];
 function normalize(msg){
 let q = ' ' + msg.toLowerCase().trim() + ' ';
 SLANG.forEach(([re, rep]) => { q = q.replace(re, rep); });
 TEAM_FIX.forEach(([re, rep]) => { q = q.replace(re, rep); });
 return q.replace(/\s+/g, ' ').trim();
 }
 function looksLike(word, target){
 if (Math.abs(word.length - target.length) > 2) return false;
 let diff = 0;
 for (let i = 0; i < Math.max(word.length, target.length); i++)
 if (word[i]!== target[i]) diff++;
 return diff <= 2;
 }

 /* ---------- INTENT — urutan array = prioritas (identity paling atas) ---------- */
 const INTENTS = [
 /* 1. IDENTITY — harus paling atas, tidak boleh tertimpa keyword lain */
 { id:'whoami', re:/^(kamu siapa|siapa kamu|kamu apa|ini siapa|siapa sih kamu|lu siapa|kamu ini siapa|kamu orang|kamu bot|kamu ai|kamu robot)[\s?!.]*$/i },
 { id:'whoami', re:/^(siapa|apa) (kamu|ini|tobi)\b[\s?!.]*$/i },
 { id:'whoami', re:/^(kamu siapa|siapa kamu|who are you)[\s?!.]*$/i },
 { id:'aboutAdmin',re:/^(kamu admin|kamu adminnya|admin ya|ini bot ya|kamu manusia|kamu asisten|adminnya)[\s?!.]*$/i },
 { id:'aboutAdmin',re:/(bisa dihubungin admin|kasih kontak admin|kontak admin|hubungin ke admin)/i },
 { id:'aboutToba', re:/(informasi mengenai|bertanya mengenai|tentang kegiatan|kegiatan toba|tentang komunitas|informasi.*(toba|komunitas))/i, need:/(toba|komunitas|kegiatan)/i },
 { id:'aboutToba', re:/^(toba itu apa|toba apa|apa itu toba|toba itu komunitas apa|kenalan sama toba|ceritain toba|toba community itu|komunitas toba itu apa)/i },
 { id:'aboutToba', re:/^(apa|apaan) (itu )?toba[\s?!.]*$/i },
 /* quick reply "Mau kenalan sama TOBA!" → pengenalan komunitas, BUKAN ngobrol santai */
 { id:'aboutToba', re:/(mau kenalan sama toba|kenalan sama toba|mau kenal toba|mau kenalan sama komunitas)/i },

 /* 2. GREETING */
 { id:'greet', re:/^(halo+|hai+|heii+|hei|hi|hey|woi|woy|hallo|haloo|assalamualaikum|pagi|siang|sore|malam|good (morning|afternoon|evening))(\s+(lagi|bro|gan|kak|cuy|bre|om|min|tobi))?\b[\s!?.]*$/i },
 { id:'makan', re:/(udah makan belum\?|sudah makan belum\?|udah makan|sudah makan|belum makan|belum lapar|masih kenyang|baru makan|udah makan belum hari ini)/i },
 { id:'makanBalik', re:/^(kamu udah\??|kamu udah makan\??|kamu makan\??|kamu lapar\??|kamu ya\?|aku nanya ke kamu)[\s!.?]*$/i },

 /* 3. VISITOR INTRODUCTION (nama) */
 { id:'nameIntro', re:/(namaku|nama saya|nama aku|saya dipanggil|aku dipanggil|panggil aku|panggil saya|boleh dipanggil|call me|kenalin dulu|kenalkan)\b/i },

 /* 4. CASUAL + FUN MODE */
 { id:'', re:/^(wkw*k+|wk(wk)+k*|ha*ha+|he+he+|lol+|lmao+|xixi+|awokawok+|asuu+|anjir|anjrit|bjir|wihh+|woww?|buset|buset\!|gokil|kocak|ngakak|receh banget|ada-ada aja|ada ada aja|yaelah|yaelah\.|lahh|lah kok|waduh)[\s!.]*$/i },
 { id:'', re:/(anjir bisa aja|bisa aja|anjir|ngakak|kocak banget|lucu banget|ngakak banget)/i, need:/^(?!.*(jadwal|biaya|daftar|gabung|lokasi|partnership|sponsor))/i },
 { id:'gameAsk', re:/(tebak[- ]tebakan|tebak dong|tebakan|main tebak|jokes dong|pantun dong|minta pantun|kasih jokes|tebak emoji|emoji|main game|main dong|buat joke|garing dong|mau quiz|quiz basket|quiz dong|play a riddle|tell me a rhyme|emoji guessing)/i },
 { id:'sad', re:/(sedih|nangis|kecewa|patah hati|hilang semangat|nggak semangat|ga semangat|putus asa|down banget|galau)/i },
 { id:'confirmOhh', re:/^(ohh?\s*\w+\s*ya\??|ohh?\s*ya\??|oh iya|ohh iya|gitu ya|betul ya|ya betul|sama ya|jadwalnya sama|sama\?|sama bukan|sama nggak)[\s!.?]*$/i },
 { id:'confused2', re:/^(hah\??|hah\s+serius\??|serius\??|masa sih\??|kok bisa\??|maksudnya gimana\??|terus gimana\??|lahh?|loh|lah kok|ohh pantes|oh pantes|oalahh?)[\s!.?]*$/i },
 { id:'agree2', re:/^(gas|gaskeun|gasskeun|sabi|kuy|hayuk|boleh juga|setuju|aman|ok deh|sip banget)[\s!.]*$/i },
 { id:'decline2', re:/^(males ah|males|ogah|gak pengen|nggak pengen|mikir dulu|lihat nanti|nanti lagi|ga dulu nggak jadi|skip dulu)[\s!.]*$/i },
 { id:'gabut', re:/(gabut|nganggur|gak ada kerjaan|bosan|bosen|bingung mau ngapain)/i },
 { id:'capek', re:/(capek|cape|lelah|penat|burnout|stres|stress|kerjaan berat|padat banget)/i },
 { id:'lagiApa', re:/(lagi apa|lagi ngapain|ngapain kamu|kamu lagi ngapain|what are you doing)/i },
 { id:'pindah', re:/(baru pindah|pindah ke jakarta|baru di jakarta|pindahan|new to jakarta)/i },
 { id:'sukaBasket', re:/(suka basket|penggemar basket|basket dari kecil|hobi basket|nonton basket)/i },

 /* 5. SCHEDULE — kontekstual, kata "jadwal/kapan/main" wajib kecuali follow-up */
 { id:'schedBoth', re:/(jadwal latihan|jadwal main|jadwal basket|jadwal.*(toba|komunitas)|latihan( yang)?|jadwalnya|schedule)/i },
 { id:'schedLadies', re:/(tobaladies|cewek|cwe|ceweknya|perempuan|women|ladies|female)/i, need:/(jadwal|kapan|jam|hari|main|latihan|sesi|waktu|schedule|when|kpan|dlm|weekend)/i },
 { id:'schedDeli', re:/(tobadeli|cowok|cwo|cowoknya|laki|pria|men|male|deli)/i, need:/(jadwal|kapan|jam|hari|main|latihan|sesi|waktu|schedule|when|kpan|dlm)/i },
 { id:'schedThisWeek', re:/(minggu ini|week ini|this week|ada main|besok main|weekend ada main)/i },
 { id:'schedFollowUp', re:/^(kalau cowok|kalau cewek|cowok|cewek|yang cowok|yang cewek|cowoknya|ceweknya|kalau laki|kalau perempuan|yang deli|yang ladies|laki[\s!.?]*|perempuan[\s!.?]*)[\s?!.]*$/i },

 /* 6–9. JOIN (Form Gabung TOBA, bukan Partnership!) / Pricing / Location / Membership */
 { id:'join', re:/(cara daftar|gimana daftar|cara gabung|gimana gabung|mau daftar|mau gabung|mau masuk|bisa gabung|bisa ikut|ikut dong|mau ikut|cara ikut|mau masuk komunitas|bergabung|mau bergabung|how to join|cara masuk|mau jadi member|mau jadi anggota|jadi member|daftar member|mau daftar member|want to join|i want to join|ikut fun game|mau ikut fun game|ikut fun game|daftar tobaladies|daftar tobadeli|mau ikut tobaladies|mau ikut tobadeli|ikut tobaladies|ikut tobadeli|daftar anggota|ikut latihan|ikut basket|ikut main|yang mana)/i },
 { id:'funGame', re:/(info fun game|fun game info|apa itu fun game|what is fun game|fun game)/i },
 { id:'pricing', re:/(biaya|harga|berapa|bayar|bayarnya|cost|price|fee|tarif|rupiah|rp|gratis|free|menanyakan biaya|biaya kegiatan)/i },
 { id:'location', re:/(lokasi|dimana|di mana|alamat|venue|tempat main|tempat latihan|tempatnya|brickhouse|duren sawit)/i },
 { id:'membership',re:/(harus jadi member|harus member|jadi member dulu|wajib member|keanggotaan|membership)/i },

 /* 10. BEGINNER SUPPORT */
 { id:'alone', re:/(malu|canggung|sendiri|sendirian|gapunya teman|tidak punya teman|nggak punya teman|takut nggak ada teman|takut ga ada temen|alone|shy)/i },
 { id:'beginner', re:/(belum jago|nggak jago|tidak jago|pemula|masih belajar|baru belajar|dribble|belum bisa main|nggak bisa main|nggak bisa basket|tidak bisa basket|amateur|beginner|belum pernah main)/i },
 { id:'confidence',re:/(takut|ragu|gugup|nervous|afraid|kurang percaya diri|percaya diri)/i },

 /* 11. PARTNERSHIP — kolaborasi, sparing, event, sponsor (BEDA dari join) */
 { id:'partnership', re:/(kolaborasi|collab|kerja sama|kerjasama|partnership|sponsor|sponsorship|mitra|proposal|brand|apparel|clothing|event bareng|bikin event|media partner|support toba|dukung toba|kerja bareng|sparring|sparing|friendly match|event crew|table official|wasit|butuh wasit|butuh crew|butuh table|komunitas lain|punya komunitas)/i },

 /* 12. EVENT & activities */
 { id:'funGame', re:/(fun game|fungame|weekly fun|open run)/i },
 { id:'event', re:/(event|tournament|turnamen|kompetisi|competition|3x3|sparring|friendly game|agenda|kegiatan minggu|dokumentasi|foto kegiatan)/i },
 { id:'activities', re:/(kegiatan apa|kegiatan apa aja|aktivitas|ngapain aja|apa aja kegiatannya|aktivitas apa)/i },
 { id:'vibe', re:/(suasana|seru nggak|asik nggak|vibe|atmosphere|worth it)/i },

 /* 13. Trial / age / difference / misc */
 { id:'trial', re:/(trial|coba dulu|sekali dulu|coba ikut|try out|coba lihat dulu)/i },
 { id:'age', re:/(umur|usia|batas usia|age limit)/i },
 { id:'difference', re:/(bedanya|beda apa|beda tobaladies|beda tobadeli|difference)/i },

 /* 14. OUT OF TOPIC */
 { id:'jagoNonton', re:/(jago nonton|jago basket tapi|jago kok|jago nonton aja|cuma jago nonton)/i },
 { id:'cariGebetan', re:/(cari gebetan|nyari gebetan|buat cari pacar|cari chemistry)/i },
 { id:'outOfTopic', re:/(resep|masakan|makanan|berita|politik|matematika|cuaca|hotel|tiket|film|movie|lagu|musik.*(bukan|selain)|sekolah|rumah sakit|bpjs|ktp|pajak)/i }
 ];

 /* fuzzy fallback untuk kata penting yang salah eja */
 function fuzzyIntent(q){
 const w = q.replace(/[^\w\s]/g,' ').split(/\s+/).filter(Boolean);
 const map = [
 ['jadwal','schedule', q => q.includes('kapan') || q.includes('main') || q.includes('tobadeli') || q.includes('tobaladies')],
 ['lokasi','location', q => q.includes('main') || q.includes('latihan')],
 ['biaya','pricing', () => true],
 ['daftar','join', () => true],
 ['gabung','join', () => true],
 ['sponsor','partnership', () => true],
 ['kolaborasi','partnership', () => true]
 ];
 for (const [word, intent, need] of map){
 if (w.some(x => looksLike(x, word)) && need(q)) return intent;
 }
 return null;
 }

 /* ---------- JAWABAN (ID) — gaya Gen Z natural, singkat dulu ---------- */
 const A = {
 whoami: [
 'Aku TOBI! Teman ngobrol dari TOBA. Soal komunitas, jadwal main, atau cara gabung, tanya aja yaa!',
 'Aku TOBI, asisten virtual TOBA. Bukan manusia beneran, tapi bisa bantu kamu kenal TOBA lebih dalam.',
 'TOBI nih, teman ngobrol dari TOBA! Ada yang pengen kamu tanyain?',
 { _formal: [
 'Selamat datang! Saya TOBI, asisten virtual TOBA Community. Silakan tanyakan informasi seputar komunitas, jadwal, atau cara bergabung.',
 'Saya TOBI, asisten virtual dari TOBA. Dengan senang hati saya bantu informasi seputar komunitas kami.'
 ] }
 ],
 aboutAdmin: [
 'Aku asisten virtual TOBA, bukan admin manusia langsung. Tapi aku bisa arahin kamu ke admin kalau perlu.',
 'Bukan admin sungguhan nih, aku cuma TOBI. Tapi informasi komunitas tanya aku aja dulu!',
 { _formal: [
 'Saya TOBI, asisten virtual TOBA, bukan admin secara langsung. Namun saya dengan senang hati membantu informasi komunitas dan dapat mengarahkan Anda ke admin bila diperlukan.'
 ] }
 ],
 aboutToba: [
 'TOBA itu Tongkrongan Basket — komunitas basket di Jakarta Timur. Tempat ketemu teman main baru, latihan, dan ikut kegiatan bareng. Kita punya Tobaladies dan Tobadeli. Mau aku ceritain kegiatan kita?',
 'TOBA itu komunitas basket di Jakarta Timur! Tempat cari teman main, latihan, dan ikut kegiatan bareng.',
 'TOBA itu tongkrongan basket di Duren Sawit sekitarnya. Ada dua kelompok, ' + LADIES + ' dan ' + DELI + '.',
 'Komunitas basket Jakarta Timur! Kegiatannya dari Weekly Fun Game sampai latihan skill rutin.',
 /* variasi saat quick reply sama dipilih lagi — informasi lanjutan, bukan jawaban sama */
 'Masih penasaran ya. Oke, aku ceritain lebih banyak. Di TOBA ada kegiatan basket untuk Tobaladies dan Tobadeli. Kamu juga bisa ikut kegiatan komunitas dan berkenalan dengan teman-teman baru.',
 { _formal: [
 'TOBA merupakan komunitas basket yang terbuka untuk orang-orang yang ingin bermain, berkembang, dan membangun koneksi melalui basket. Ada dua kelompok: ' + LADIES + ' dan ' + DELI + '.',
 'TOBA adalah komunitas basket di Jakarta Timur dengan kegiatan rutin seperti Weekly Fun Game, latihan skill, dan event bersama.'
 ] }
 ],
 greet: [
 'Haii! Ada yang bisa dibantu soal TOBA?',
 'Heii! Seneng kamu mampir. Mau tanya apa hari ini?',
 'Halo! Lagi cari info TOBA atau sekadar mampir?',
 { _formal: [
 'Selamat datang! Ada informasi mengenai TOBA yang bisa saya bantu?',
 'Senang sekali Anda mampir. Silakan, ada yang ingin ditanyakan mengenai komunitas kami?'
 ] }
 ],
 nameIntroGot: [
 /* Task 7B: setelah tahu nama, tanya kebutuhan — bukan FAQ mentah */
 'Senang kenalan dengan kamu, {name}! Lagi ingin tahu tentang kegiatan TOBA, jadwal main, cara bergabung, atau ingin berkolaborasi?',
 'Hai {name}! Salam kenal ya. Kamu mau cari info apa nih — jadwal, cara gabung, atau kerja sama?',
 'Wah, seru kenalan sama {name}! Ada yang bisa TOBI bantu hari ini? Kegiatan, jadwal, atau kolaborasi?'
 ],
 nameIntroAsk: [
 'BTW, kamu biasa dipanggil siapa nih?',
 'Btw, panggilan kamu apa ya? Biar nggak kaku hehe.'
 ],
 nameSkip: [
 'Gapapa kok! Kita lanjut ngobrol aja ',
 'Oke santai aja. Jadi, mau tanya apa hari ini?'
 ],
 nameChange: [
 'Siap! Mulai sekarang aku panggil kamu {name} ya ',
 'Oke, noted! {name} ya. Btw, tadi mau tanya apa?'
 ],
 laugh: [
 'Hahaha, ada-ada aja kamu.',
 'HAHAHA masa baru tahu sekarang. Tenang, aku bisa diajak ngobrol juga kok!',
 'Jangan sampai ketawa sendirian, nanti dikira lagi chat sama buaya beneran.',
 'LAHHH, aku cuma menjalankan tugas sebagai buaya penghibur.',
 'Wkwk, seru banget kayanya obrolannya.',
 /* apresiasi candaan — anjir bisa aja / buset / gokil / kocak / ngakak */
 'Wkwk, sesekali harus mengeluarkan jokes berkualitas.',
 'HAHAHA, kepikiran aja kan.',
 'Lahh, baru tahu aku punya bakat tersembunyi jadi pelawak.',
 'HAHAHA, yang penting berhasil bikin kamu ketawa.',
 'HAHAHA, berarti misi menghibur berhasil hari ini!',
 'NAHH, akhirnya ada yang mengapresiasi buaya satu ini.',
 'HAHAHA, kenapa lagi nih? Ada yang mau dikomentarin?',
 'Wkwk, jangan overthinking dulu, kita santuy aja.'
 ],
 gabut: [
 'Wkwk, lagi nggak ada kerjaan nih? Biasanya kalau gabut kamu ngapain?',
 'Gabut mode on ya. Mau sekalian cari kegiatan seru?'
 ],
 capek: [
 'Wah, semangat yaa. Hari ini berat banget kayaknya. Istirahat dulu juga nggak apa-apa.',
 'Kadang emang gitu, recharge pelan-pelan ya. Kalau nanti pengen lepas penat lewat basket, aku kasih tau jadwalnya '
 ],
 lagiApa: [
 'Standby doang nih, nunggu kamu chat Kamu sendiri gimana?',
 'Lagi nunggu jadwal main berikutnya hehe. Kamu lagi ngapain?'
 ],
 pindah: [
 'Ohh, welcome ke Jakarta! Lagi cari teman baru juga?',
 'Welcome to Jakarta! Sini aja kenalan sama kita, pindahan biasanya butuh lingkaran baru '
 ],
 sukaBasket: [
 'Wihh, berarti udah lama dekat sama basket! Sekarang masih sering main?',
 'Serius? Asik juga! Kamu biasanya main di posisi apa?'
 ],
 schedLadies: [
 LADIES + ' main tiap ' + HARI_LADIES + ', jam ' + JAM_LADIES + '. ' + HARI_LADIES + ' sore waktunya basket bareng nih!',
 LADIES + '? Tiap ' + HARI_LADIES + ' jam ' + JAM_LADIES + '. Catat ya!',
 'Jadwal ' + LADIES + ' tiap ' + HARI_LADIES + ' sore, ' + JAM_LADIES + '.',
 { _formal: [
 LADIES + ' memiliki jadwal latihan setiap ' + HARI_LADIES + ', pukul ' + JAM_LADIES + '.',
 'Baik, untuk ' + LADIES + ' jadwal latihannya setiap ' + HARI_LADIES + ' pukul ' + JAM_LADIES + '.'
 ] }
 ],
 schedDeli: [
 'Kalau ' + DELI + ' tiap ' + HARI_DELI + ', jam ' + JAM_DELI + '.',
 DELI + ' latihan tiap ' + HARI_DELI + ' malam, jam ' + JAM_DELI + '.',
 'Jadwal ' + DELI + ': ' + HARI_DELI + ', ' + JAM_DELI + '.',
 { _formal: [
 DELI + ' memiliki jadwal latihan setiap ' + HARI_DELI + ', pukul ' + JAM_DELI + '.',
 'Baik, untuk ' + DELI + ' jadwal latihannya setiap ' + HARI_DELI + ' pukul ' + JAM_DELI + '.'
 ] }
 ],
 schedThisWeek: [
 'Jadwal rutinnya ' + LADIES + ' ' + HARI_LADIES + ' dan ' + DELI + ' ' + HARI_DELI + '. Sesi minggu ini sebaiknya dicek pengumuman TOBA ya, biar nggak salah info.',
 LADIES + ' ' + HARI_LADIES + ' sore, ' + DELI + ' ' + HARI_DELI + ' malam. Kalau ada perubahan pasti diumumkan di kanal resmi TOBA.'
 ],
 schedFollowUp: [
 'Bedanya ' + DELI + ' ' + HARI_DELI + ' malam (' + JAM_DELI + '), ' + LADIES + ' ' + HARI_LADIES + ' sore (' + JAM_LADIES + ').',
 LADIES + ' ' + HARI_LADIES + ' sore, ' + DELI + ' ' + HARI_DELI + ' malam. Beda hari, satu komunitas!'
 ],
 join: [
 'Senang banget kamu mau gabung TOBA! Isi Form Gabung TOBA lewat tombol di bawah pesanku yaa, nanti pengurus yang follow up.',
 'Gas! Klik tombol Isi Form Gabung TOBA di bawah pesanku, langsung buka formulirnya.',
 'Boleh banget! Form Gabung TOBA udah aku siapin — klik tombolnya di bawah ya.',
 'Santaiii, bisa langsung dari chat ini kok. Isi Form Gabung TOBA lewat tombol di bawah, nanti pengurus yang follow up.',
 { _formal: [
 'Tentu! Anda dapat mengisi Form Gabung TOBA langsung melalui tautan di bawah pesan ini. Prosesnya mudah, dan tim pengurus akan menindaklanjuti.',
 'Baik, silakan klik tombol Isi Form Gabung TOBA di bawah pesan ini untuk membuka formulir pendaftaran. Setelah itu tim pengurus akan menghubungi Anda.'
 ] }
 ],
 joinShort: [
 'Wihh, gaskeun! Isi Form Gabung TOBA lewat tombol di bawah pesanku yaa!',
 'Gas! Isi Form Gabung TOBA lewat tombol ini yaa.'
 ],
 pricing: [
 'Peserta baru Rp50.000 per sesi. Kalau udah pernah ikut, jadi Rp30.000 per sesi.',
 'Rp50.000 buat pertama kali, setelah itu Rp30.000 per sesi. Berdasarkan catatan kehadiran yang diverifikasi admin.',
 { _formal: [
 'Untuk peserta pertama kali, biayanya Rp50.000 per sesi. Untuk sesi berikutnya, biayanya menjadi Rp30.000 per sesi berdasarkan catatan kehadiran yang diverifikasi admin.',
 'Baik, informasi biaya: peserta baru Rp50.000 per sesi, dan setelah itu Rp30.000 per sesi. Konfirmasi lebih lanjut dapat dilakukan melalui pengurus.'
 ] }
 ],
 location: [
 'Lokasi rutinnya di Brickhouse The East, Duren Sawit, Jakarta Timur.',
 'Brickhouse The East, Duren Sawit! Alamat lengkapnya ada di halaman Events.'
 ],
 membership: [
 'Nggak harus member dulu kok, bisa mulai dari ikut Fun Game aja.',
 'Boleh langsung ikut tanpa jadi member dulu.'
 ],
 alone: [
 'Wajar kok kalau masih malu. Datang sendiri juga nggak masalah, nanti bisa kenalan sama yang lain pelan-pelan.',
 'Gapapa banget! Datang sendiri itu wajar. Anak-anak TOBA ramah kok, banyak yang pertama kali juga datang sendiri.',
 'Datang sendiri bukan masalah Nanti bisa kenalan sama teman-teman pelan-pelan.'
 ],
 beginner: [
 /* Task 7D: "Aku masih pemula" → respons ramah + tanya pengalaman,
 lalu jelaskan pilihan kegiatan — bukan FAQ mentah. */
 'Gapapa banget! Semua juga mulai dari nol. Kamu udah pernah pegang bola sebelumnya, atau beneran baru mau coba?',
 'Nggak masalah! TOBA terbuka buat semua level. Biasanya pemula mulai dari Weekly Fun Game — santai, sambil kenalan. Mau aku jelasin kegiatannya?',
 'Tenang, nggak harus jago dulu kok. Kamu lagi cari latihan rutin atau sekadar main santai bareng teman-teman?'
 ],
 confidence: [
 'Ragu itu wajar kok. Kalau mau, aku ceritain dulu suasana kegiatan TOBA biar kamu kebayang.',
 'Relate banget! Yang penting berani datang, sisanya berjalan pelan-pelan.'
 ],
 partnership: [
 /* Task 7D: "Aku mau kerja sama" → klarifikasi jenis kolaborasi dulu */
 'Boleh! Kerja samanya untuk sponsorship, event, media, atau bentuk kolaborasi lainnya?',
 'Wah, seru! Ceritain bentuk kerja samanya dong — sponsorship, event bareng, media partner, atau yang lain?',
 'Gas! Kamu mau ngajak TOBA kerja sama dalam bentuk apa — sponsorship, event, media, atau kolaborasi lain?'
 ],
 partnershipEvent: [
 'Bisa kita obrolin nih! Kamu lagi butuh bantuan crew, table official, atau wasit?',
 'Okeee! Boleh ceritain tanggal dan lokasi event-nya? Nanti bisa diteruskan ke pengurus TOBA buat dicek.',
 'Boleh diajukan juga! Nanti perlu dicek dulu ketersediaannya yaa. Detail event-nya lewat halaman Partnership TOBA ya.'
 ],
 partnershipFollow: [
 'Seru tuh! Ceritain konsep event-nya ya, atau kirim aja lewat form di halaman Partnership.',
 'Asik juga! Kalau serius mau kerja sama, halaman Partnership adalah jalurnya. Ada form inquiry di situ.'
 ],
 funGame: [
 'Weekly Fun Game itu sesi main rutin TOBA di Brickhouse The East, Duren Sawit. Banyak anggota mulai dari sini.',
 'Itu kegiatan inti TOBA, game mingguan buat ketemu dan main bareng '
 ],
 event: [
 'Agenda terdekat ada di halaman Events ya, dari friendly game sampai tournament.',
 'Di halaman Events ada semua event TOBA. Mau cari yang kapan?'
 ],
 activities: [
 'Di TOBA ada Weekly Fun Game, latihan skill, friendly game, dan event seperti tournament.',
 'Kegiatannya variatif, mulai dari game rutin sampai sparring. Cek halaman Events buat detailnya.'
 ],
 vibe: [
 'Seru banget! Suasananya friendly, main sambil kenalan.',
 'Asik kok! Santai tapi tetap kompetitif kalau mau serius '
 ],
 trial: [
 'Bisa banget ikut sekali dulu, nggak wajib komit.',
 'Boleh kok coba dulu. Bisa mulai dari Weekly Fun Game.'
 ],
 age: [
 'Batas usia aku belum punya info pastinya. Mending tanya langsung ke admin TOBA ya biar jawabannya bener.',
 'Info batas usia nggak tersedia di data aku. Tanya admin TOBA langsung ya.'
 ],
 difference: [
 LADIES + ' itu kelompok perempuan (' + HARI_LADIES + ' sore), ' + DELI + ' kelompok laki-laki (' + HARI_DELI + ' malam). Satu komunitas TOBA.',
 'Dua kelompok, satu komunitas! ' + LADIES + ' buat cewek, ' + DELI + ' buat cowok.'
 ],
 outOfTopic: [
 'Hmm, itu di luar wilayah basket ya Tapi kalau soal TOBA, aku siap banget jawab!',
 'Wah, itu bukan wilayah aku nih. Kalau soal komunitas basket TOBA, gas — tanya apa aja!',
 'Aku nggak mau ngarang jawaban buat yang itu Tapi soal TOBA aku bisa bantu!'
 ],
 fallback: [
 'Hehe, yang mana nih? Jadwal main, cara gabung, atau soal kolaborasi? Biar aku nggak salah kasih info.',
 'Hmm, aku belum nangkep maksudnya Ceritain lebih detail dikit ya?',
 'Menarik nih, tapi aku belum paham maksudnya. Kamu lagi cari info TOBA atau sekadar ngobrol?'
 ],
 sad: [
 'Aduh, semoga harimu segera membaik yaa. Istirahat dulu, jangan dipaksain.',
 'Eh, jangan langsung mikir begitu dong. Kenalan dulu aja pelan-pelan, nggak perlu jadi orang lain buat bisa berteman.',
 'Ngerti banget maksudmu. Kadang emang ada hari yang berat ya. Aku di sini kalau mau cerita.',
 'Relate banget! Nggak apa-apa kok ngerasa gitu. Pelan-pelan aja ya '
 ],
 greetProactive: [
 /* Task 7A: perkenalan singkat + tanya nama natural, bukan daftar FAQ panjang */
 'Halo! Aku TOBI, asisten TOBA Community. Boleh tahu nama kamu siapa?',
 'Heyy! Aku TOBI dari TOBA Community. Panggilan kamu apa nih biar nggak kaku?',
 'Hai! Aku TOBI, teman ngobrol TOBA. Siapa nama kamu? Biar aku bisa menyapamu lebih akrab.',
 { _formal: [
 'Selamat datang! Saya TOBI, asisten TOBA Community. Boleh tahu nama Anda?'
 ] }
 ],
 makan: {
 ask: [
 'Udah makan belum hari ini?',
 'Hari ini udah isi tenaga belum?',
 'Jangan-jangan lagi lapar sambil scroll website TOBA nih.'
 ],
 sudah: [
 'Nahh, itu baru calon baller beneran Udah full tenaga nih ya!',
 'Sipp, aman! Perut kenyang, basket pun lancar ',
 'Mantap, itu modal utama biar nggak drop di quarter kedua '
 ],
 belum: [
 'Waduhh, basket boleh semangat, tapi makan jangan dilupakan yaa ',
 'Yaelah, isi dulu tenaganya! Setiap baller butuh bahan bakar kok '
 ],
 belumLapar: [
 'Oalahh, berarti masih tahan ya. Kalau nanti udah mulai bunyi, jangan tahan-tahan ',
 'Santuy aja, tapi jangan sampai kebingungan cari tenaga pas butuh '
 ],
 balikTanya: [
 'Aku mah buaya, makan macam apa lagi Kalau kamu gimana, udah makan?',
 'aku sih AI, makan udah lewat nyalain server doang Kamu sendiri udah makan belum?',
 'Aku mah nggak bisa makan, cuma bisa nambah chat Kamu gimana?'
 ]
 },
 gameOffer: [
 'Eh, mau tebak-tebakan nggak? Tapi jangan protes kalau receh ya ',
 'Emm, aku punya tebak-tebakan nih. Siap-siap yaa!',
 'Mau main tebak emoji yuk? Jangan-jangan kamu jago nih.'
 ],
 gameCorrect: [
 'BETULLL! Dapat nilai 100 dari TOBI ',
 'Nahhh, bener banget! Wihh, ternyata nggak gampang dikelabui ya!',
 'YESSS! Akhirnya ketemu juga jawabannya ',
 'Buset, cepet banget nebaknya! ',
 'NAHHH bener! Satu poin buat kamu '
 ],
 gameWrong: [
 'dikit lagi!',
 'HAHAHA kok kepikiran ke situ Coba pikirin lagi deh.',
 'Yahh, belum tepat nih. Mau petunjuk?',
 'jawabanmu ada-ada aja '
 ],
 gameAbsurd: [
 'WADUHHH kok bisa kepikiran ke situ. Tapi bukan itu jawabannya!',
 'HAHAHAHA kok malah ke situ Kreatif juga sih, tapi belum tepat!',
 'jawabanmu ada-ada aja. Gua nggak sanggup '
 ],
 gameGiveUp: [
 'okeee, aku kasih jawabannya yaa. Nggak ada nilai merah di sini ',
 'Yaudah, aku bocorin deh. Yang penting seru!'
 ],
 gameAfterInvite: [
 'daripada cuma tebak-tebakan, kapan-kapan kita main basket beneran yuk! ',
 'Sesen main bareng kan lebih seru dari tebak-tebakan. Mau kenalan sama TOBA?',
 'Oke, ini malah bikin tambah penasaran sama basket nih ',
 'Hehe, seru juga kan? Bayangin kalau yang dimainin bola beneran '
 ],
 pantun: [
 'Ke lapangan membawa bola,\nPulangnya mampir beli ketan.\nDaripada bengong sendirian,\nGimana kalau cari teman main barengan? ',
 'Jalan-jalan ke Kota Tua,\nJangan lupa beli es kelapa.\nNggak harus jago dari awal juga,\nYang penting berani coba! ',
 'Ke lapangan membawa sepatu,\nMain basket sampai sore hari.\nKalau mau cari teman baru,\nYuk kenalan sama TOBA Community! ',
 'Jalan-jalan membeli ketan,\nPulangnya mampir membeli jamu.\nKalau kamu cari teman,\nTOBA siap kenalan sama kamu! '
 ],
 jokes: [
 'nahh, posisi paling aman itu Yang penting dukungannya full.',
 'Waduhhh, misi utamanya basket apa cari chemistry nih?.',
 'HAHAHA ambisius juga. Yaudah, semoga dapat teman main sekaligus teman cerita.',
 'Akhirnya ada yang mengakui bakat terpendamku.',
 'Santaiii, nggak ada tes masuk jadi Stephen Curry kok.',
 'Buset, ngakak! Kamu ini receh level dewa ya.',
 'HAHAHA feeling-ku kuat ternyata '
 ],
 confirmYes: [
 'Iyaa, betul! ' + HARI_LADIES + ' sore. Bisa jadi kegiatan weekend kamu nih hehe.',
 'Yup, betul banget!',
 'Iya betul Gidap? Eh maksudku, gitu aja hehe.'
 ],
 confirmNo: [
 'Oke, mungkin maksudnya beda ya. Kamu mau tanya apa persisnya?',
 'Hmm, berarti aku salah tangkap. Bisa diulang dikit?'
 ],
 confused2: [
 'Oalahh, jadi maksudnya begitu ya? Ceritain lebih detail dikit ya ',
 'Ehh, aku jelasin ulang deh. Kamu mau tahu soal apa persisnya?',
 'Hehe, biar nggak salah tangkap — kamu lagi nanya soal TOBA atau sekadar respon obrolan tadi?',
 'Nahh, aku jawab sesuai konteks ya. Kalau maksudmu beda, bilang aja '
 ],
 agree2: [
 'Nahh, gitu dong! ',
 'Nahh, ini baru menarik!',
 'Oke, kita coba! ',
 'Wihh, boleh banget!',
 'Gaskeun! '
 ],
 decline2: [
 'Oke, nggak masalah kok Kalau nanti berubah pikiran, aku di sini.',
 'Santuy aja, nggak semua hal harus sekarang ',
 'Aman, nggak dipaksa kok Ada yang lain yang mau dibahas?'
 ],
 /* FUN MODE data: tebak emoji & tebakan */
 emojiGames: [
 { emojis: '', answers: ['buaya main basket','toba','maskot toba','buaya basket'], hint: 'Ini maskot komunitas kita nih ' },
 { emojis: '', answers: ['laper','laper banget','mie','mie ayam','makan','bakso','laper maut'], hint: 'Ini makanan favorit begoro ' },
 { emojis: '', answers: ['ngantuk','mager','tidur','susah bangun','reban'], hint: 'Biasanya bikin kita susah bangun pagi ' },
 { emojis: '', answers: ['galau','sedih','patah hati','mantan','lagu galau'], hint: 'Biasanya muncul pas denger lagu sad ' },
 { emojis: '', answers: ['basket','cinta basket','basket banget','suka basket'], hint: 'Sport favorit kita nih ' },
 { emojis: '', answers: ['sparring','main bareng','basket bareng','sparing'], hint: 'Istilahnya pas dua tim main santai ' },
 { emojis: '', answers: ['scroll hp tiduran','scroll hp sambil tiduran','mager produktif','rebahan sambil scroll'], hint: 'Kegiatan malam paling populer ' },
 { emojis: '', answers: ['pemain basket hebat','jago basket','on fire','steve curry','stephen curry'], hint: 'Saat pemain lagi hoki terus ' }
 ],
 riddleGames: [
 { q: 'Apa yang paling sering dibawa pemain basket tapi nggak pernah diajak ngobrol?', answers: ['bola','bola basket'], hint: 'Bulatan oranye, sering dipantulin ' },
 { q: 'Kenapa pemain basket jarang kesepian?', answers: ['rebound','karena selalu ada yang rebound'], hint: 'Istilahnya pas bola nggak masuk ring ' },
 { q: 'Kalau bola basket jatuh cinta, namanya apa?', answers: ['jatuh ke ring','jatuh ke ring seseorang','falling in the ring'], hint: 'Nyambung ke ring basket ' },
 { q: 'Apa yang makin dikejar malah makin jauh?', answers: ['masa lalu','waktu'], hint: 'Sesuatu yang nggak bisa diulang ' },
 { q: 'Kenapa kalender suka stres?', answers: ['tanggal tua','banyak tanggal tua'], hint: 'Berhubungan sama uang ' },
 { q: 'Kenapa ikan nggak pernah telat?', answers: ['berenang tepat waktu','selalu berenang tepat waktu','karena selalu berenang'], hint: 'Mereka selalu tepat waktu ' }
 ]
 };
 const A_EN = {
 whoami: ['I\'m TOBI! Your TOBA Community chat buddy. Ask me anything about the community!'],
 greet: ['Hey! Anything I can help with about TOBA?'],
 schedLadies: [LADIES + ' plays every ' + HARI_LADIES + ', ' + JAM_LADIES + '.'],
 schedDeli: [DELI + ' plays every ' + HARI_DELI + ', ' + JAM_DELI + '.'],
 schedThisWeek: ['Regular sessions: ' + LADIES + ' on ' + HARI_LADIES + ', ' + DELI + ' on ' + HARI_DELI + '. Changes are announced on TOBA\'s official channels.'],
 schedFollowUp: [LADIES + ' plays ' + HARI_LADIES + ' evening, ' + DELI + ' plays ' + HARI_DELI + ' night. Different days, one community!'],
 pricing: ['First-timers Rp50,000 per session, then Rp30,000. Verified by admins.'],
 location: ['Brickhouse The East, Duren Sawit, East Jakarta.'],
 partnership: ['Boleh! Is the collaboration for sponsorship, events, media, or another form?'],
 funGame: ['The Weekly Fun Game is TOBA\'s core weekly session at Brickhouse The East, Duren Sawit. Lots of members start here. Details are on the Events page.'],
 membership: ['No membership needed upfront — you can start by joining a Fun Game session.'],
 join: ['Let\'s go! Glad you want to join TOBA. Click the "Fill Out the TOBA Join Form" button below my message!'],
 aboutToba: ['TOBA is a basketball community in East Jakarta — a place to find playing partners, train, and join community activities. We have Tobaladies and Tobadeli squads.'],
 alone: ['Totally fine! TOBA folks are friendly '],
 beginner: ['No need to be great first Trying and learning together is what counts!'],
 confidence: ['First-time nerves are normal! What matters is showing up.'],
 difference: [LADIES + ' is the women\'s squad (' + HARI_LADIES + ' evening), ' + DELI + ' the men\'s (' + HARI_DELI + ' night). One community!'],
 funGame2: ['The Weekly Fun Game is TOBA\'s weekly session — the easiest way to meet the community.'],
 trial: ['You can join once first, no commitment needed.'],
 age: ['I don\'t have confirmed age-limit info. Best to ask the TOBA admins directly.'],
 event: ['Upcoming events are on the Events page — from friendly games to tournaments.'],
 activities: ['TOBA runs Weekly Fun Games, skill training, friendly games, and events like tournaments.'],
 vibe: ['Super fun! Friendly vibe, play while making new friends.'],
 outOfTopic: ['That\'s outside my court But anything about TOBA, ask away!'],
 fallback: ['Not sure I follow — schedule, joining, or collaboration?']
 };

 /* ---------- FAQ resmi dari i18n (biaya/daftar/member tidak diubah) ---------- */
 function faq(idx){
 try { return t('faq.chat.a' + idx); } catch(_) { return null; }
 }
 const FAQ_MAP = { pricing:2, register:7, membership:5 };
 const REGISTER_SHORT = ['Wihh, gaskeun! Isi Form Gabung TOBA lewat tombol di bawah pesanku yaa!'];

 /* ---------- QUICK REPLY kontekstual (PROMPT 9) ----------
 Awal percakapan: 5 pilihan info-priority (member, partnership, fun game,
 kenalan, + 1 hiburan berotasi). Setelah topik aktif: chips ikut konteks. */
 function chips(){
 const id = isId();
 const last = ctx.topics[ctx.topics.length - 1] || '';
 let sets;
 if (ctx.topics.length === 0){
 sets = id? [
 'Gabung TOBA',
 'Partnership',
 'Form Kolaborasi',
 'Jadwal Fun Game',
 'Tentang TOBA'
 ] : [
 'Join TOBA',
 'Partnership',
 'Collaboration Form',
 'Weekly Games',
 'About TOBA'
 ];
 } else if (last.startsWith('sched')){
 sets = id? [
 'Cara gabung?',
 'Lokasinya di mana?',
 'Mau tahu kegiatan lainnya!',
 'Kalau masih pemula boleh?'
 ] : ['How to join?', 'Where do you play?', 'More activities!', 'Beginners okay?'];
 } else if (last === 'aboutToba'){
 sets = id? [
 'Kegiatan TOBA apa aja?',
 'Jadwal basket kapan?',
 'Cara gabung TOBA?',
 'Ada kegiatan untuk pemula?'
 ] : ['What activities?', 'When\'s game time?', 'How to join?', 'Beginners okay?'];
 } else if (last === 'partnership' || last === 'joinAsked' || last.startsWith('join')){
 sets = id? [
 'Form Kolaborasi',
 'Partnership',
 'Aku mau gabung komunitas!',
 'Info partnership lebih detail?'
 ] : ['Collaboration Form', 'Partnership', 'I want to join!', 'More on partnership?'];
 } else if (last === 'pricing' || last === 'join' || last === 'membership' || last === 'trial'){
 sets = id? [
 'Aku mau gabung!',
 'Jadwal ' + DELI + ' kapan?',
 'Jadwal ' + LADIES + ' kapan?',
 'Harus jadi member dulu?'
 ] : ['I want to join!', 'When does ' + DELI + ' play?', 'When does ' + LADIES + ' play?', 'Member required?'];
 } else if (last === 'alone' || last === 'beginner' || last === 'confidence'){
 sets = id? [
 'Bisa datang sendiri nggak?',
 'Aku mau gabung!',
 'Jadwal ' + LADIES + ' kapan?',
 'Weekly Fun Game itu apa?'
 ] : ['Can I come alone?', 'I want to join!', 'When does ' + LADIES + ' play?', 'What\'s the Fun Game?'];
 } else if (last === 'gameAsk' || last === 'gameRound'){
 sets = id? [
 'Tebak-tebakan lagi!',
 'Pantun dong!',
 'Udah, ngobrol aja.',
 'Aku nyerah.'
 ] : ['Another one!', 'Give me a pantun!', 'Let\'s just chat.', 'I give up lol.'];
 } else if (last === 'makan'){
 sets = id? [
 'Udah dong, aku kenyang ',
 'Belum, laper nih!',
 'Btw, jadwal basket kapan?',
 'Cara gabung TOBA?'
 ] : ['Already eaten!', 'Not yet!', 'When\'s game time?', 'How to join?'];
 } else if (last === 'sad'){
 sets = id? [
 'Cerita dikit dong',
 'Mau pantun receh buat semangat!',
 'Mau tebak-tebakan garing?',
 'Btw, mau kenalan sama TOBA?'
 ] : ['Let me vent', 'Cheer me up!', 'Tell a joke', 'Tell me about TOBA'];
 } else {
 sets = id? [
 'Aku mau gabung!',
 'Ada kegiatan minggu ini?',
 'Mau ajak TOBA kolaborasi!',
 'Lokasi mainnya di mana?'
 ] : ['I want to join!', 'Any session this week?', 'Let\'s collaborate!', 'Where do you play?'];
 }
 /* Task 8: chip Partnership & Form Kolaborasi = link langsung ke form resmi
 partnership.html#partnerForm (bukan Google Form palsu). */
 const isLink = /partnership|kolaborasi|collaboration/i.test(q);
 return sets.slice(0, 5).map(q => ({
 q,
 act: /Tebak emoji/i.test(q)? 'emoji' : null,
 link: isLink? 'partnership.html#partnerForm' : null
 }));
 }

 /* ---------- greeting interaktif + chips greeting ---------- */
 function welcome(addMsg){
 if (ctx.name){
 addMsg('Hai lagi, ' + ctx.name + '! Ada yang bisa dibantu?', 'bot');
 ctx.askedName = false;
 return;
 }
 ctx.askedName = true;
 addMsg(pickF('gp', A.greetProactive), 'bot');
 /* Aksi pending dari greeting peek-a-boo (misal "Tebak emoji yuk!")
 diproses setelah welcome, supaya game langsung mulai. */
 try {
 const act = sessionStorage.getItem('tobi.greetAction');
 if (act){
 sessionStorage.removeItem('tobi.greetAction');
 if (/emoji/i.test(act)){
 setTimeout(() => addMsg(startGame('emoji'), 'bot'), 400);
 ctx.askedName = false;
 }
 }
 } catch(_){}
 }

 /* ---------- FUN MODE state ----------
 game = null | { type:'emoji'|'riddle', item, tries, revealed } */
 let game = null;
 function startGame(kind){
 const bank = kind === 'emoji'? A.emojiGames : A.riddleGames;
 let s;
 const lastItem = game? game.item : null;
 do { s = Math.floor(Math.random() * bank.length); } while (bank.length > 1 && lastItem && bank[s] === lastItem);
 game = { type: kind, item: bank[s], tries: 0, revealed: false };
 ctx.topics.push('gameRound');
 if (ctx.topics.length > 8) ctx.topics.shift();
 ctx.lastGameItem = game.item;
 return kind === 'emoji'
? 'Okeee! Coba tebak ini dong \n' + game.item.emojis
 : game.item.q + ' ';
 }
 function handleGameAnswer(raw){
 if (!game) return null;
 const q = normalize(raw).toLowerCase();
 /* variasi cara membuka jawaban — tidak selalu "Jawabannya:..." */
 const reveal = a => pick('rv', [
 'Ternyata jawabannya ' + a + '.',
 'Okeee, aku spill jawabannya yaa: ' + a + '!',
 'Jadiii, jawabannya adalah ' + a + ' ',
 'Plot twist! Ternyata ' + a + ' ',
 'Yahh, jawabannya ' + a + ' ',
 'Nah, akhirnya misterinya terbongkar juga: ' + a + ' '
 ]);
 /* variasi penutup game — CTA TOBA hanya 1 dari 5 pilihan */
 const ending = () => pick('end', [
 'HAHAHA, tepat sasaran! Ini baru pemanasan seru ',
 'Baiklah, sesi tebak-tebakan hari ini resmi ditutup.',
 'Masih berani ambil satu ronde lagi atau cukup sampai di sini? ',
 'Ngomong-ngomong, kamu memang suka tebak-tebakan begini atau lagi gabut aja? ',
 'Kalau tebak-tebakan aja sudah seru, kebayang nggak kalau main basket bareng? '
 ]);
 if (/^(nyerah|nyerah deh|aku nyerah|susah deh|gak tahu|nggak tahu|no idea|skip)/i.test(q)){
 const a = game.item.answers[0];
 game = null;
 return pick('giveup', A.gameGiveUp) + '\n' + reveal(a) + '\n' + ending();
 }
 if (/^(hint|petunjuk|kasih petunjuk|beri petunjuk|bocorin)/i.test(q)){
 return 'Petunjuknya: ' + game.item.hint;
 }
 if (/^(udah ah|capek mikir|stop|udahan|cukup|stop dulu|udah dulu|nggak jadi|ga jadi|enggak dulu)/i.test(q)){
 const a = game.item.answers[0];
 game = null;
 return pick('stop', [
 ', kita ambil istirahat sebentar yaa. Boleh, kita ngobrol biasa aja.',
 'Okeee, kita pensiun dulu dari dunia tebak-tebakan.',
 'Baiklah, kita rehat dulu Jawabannya ' + a + ' ternyata.',
 'Siapp, sekarang bebas mau ngobrolin apa '
 ]);
 }
 if (/^(ulang|lagi|tebak lagi|main lagi|one more|again|lanjut)/i.test(q)){
 const kind = game.type;
 /* jangan ulang item yang sama persis */
 const bank = kind === 'emoji'? A.emojiGames : A.riddleGames;
 let s;
 do { s = Math.floor(Math.random() * bank.length); } while (bank.length > 1 && bank[s] === game.item);
 game = { type: kind, item: bank[s], tries: 0, revealed: false };
 ctx.topics.push('gameRound');
 if (ctx.topics.length > 8) ctx.topics.shift();
 return kind === 'emoji'
? 'SIAP! Kali ini aku kasih yang sedikit menjebak \n' + game.item.emojis
 : 'Okeee, yang ini lebih menantang: ' + game.item.q + ' ';
 }
 game.tries++;
 const item = game.item;
 const correct = item.answers.some(a => q.includes(a));
 const near = game.type === 'emoji'
? /ngantuk|laper|mager|galau|basket|buaya|tidur|makan|scroll/.test(q)
 : /bola|ring|rebound|masa lalu|tanggal tua|ikan/.test(q);
 if (correct){
 game = null;
 return pick('gc', A.gameCorrect) + '\n' + ending();
 }
 if (near){
 if (game.tries >= 2){
 const a = item.answers[0];
 game = null;
 return 'Deket banget! ' + reveal(a) + '\n' + ending();
 }
 return pick('nr', [
 'Hampirrr! Dikit lagi koneksinya nyambung ' + item.hint,
 'Waduhh, tinggal satu langkah lagi! ' + item.hint,
 'Dikit lagi ketemu jawabannya! ' + item.hint,
 ', clue-nya hampir berhasil kamu pecahkan. ' + item.hint,
 'Yahh, belum berjodoh sama jawabannya kali ini. ' + item.hint
 ]);
 }
 if (game.tries >= 2){
 const a = item.answers[0];
 game = null;
 return pick('gl', [
 'Oke, kesempatan terakhir udah habis. ' + reveal(a),
 'ternyata jebakannya berhasil. ' + reveal(a),
 'HAHAHA, kali ini aku menang satu poin! ' + reveal(a)
 ]) + '\n' + ending();
 }
 if (/mantan|gebetan|dosen|gaji|politik|pacar/i.test(q)) return pick('ga', A.gameAbsurd);
 return pick('gw', [
 'Waduhh, tinggal satu langkah lagi! Coba sekali lagi.',
 'HAHAHA, jawabannya masih muter sedikit. Gas lagi!',
 'dikit lagi! Mau petunjuk?',
 'Yahh, belum tepat nih. Mau petunjuk?',
 'Hampir tepat! Coba sekali lagi '
 ]);
 }
 /* perintah game yang jatuh ke persona meski ronde belum aktif */
 function wantsGame(raw){
 return /tebak lagi|tebak lagi dong|main lagi|lagi dong|tebak dong|jokes dong|pantun dong|minta pantun|tebak emoji|kasih jokes|tebak[- ]tebakan|kasih yang gampang|yang tentang basket/i.test(normalize(raw));
 }

 /* ---------- deteksi nama ---------- */
 const extractName = (function(){
 const BANNED_MSG = /(\?|\b(kapan|dimana|di mana|berapa|gimana|apa|yang mana|mau gabung|mau daftar|mau ikut|cara gabung|cara daftar|info fun|info partnership|info game|jadwal|lokasi|biaya|tebak|pantun|quiz|kenalan|when|where|how|what|tell me|let's play|emoji guessing|i want to|get to know|fun game info|partnership info)\b)/i;
 return function extractName(msg){
 const q = normalize(msg);
 /* jangan ekstrak nama dari pesan formal/slang yang jelas bukan perkenalan */
 if (/informasi mengenai|bertanya mengenai|mengenai kegiatan||haha|lucu|parah/i.test(q)) return null;
 if (BANNED_MSG.test(q) &&!/(namaku|nama saya|panggil aku|panggil saya|call me)/i.test(q)) return null;
 let m = q.match(/(?:namaku|nama saya|nama aku|saya dipanggil|aku dipanggil|panggil aku|panggil saya|call me)\s+([a-z\u00C0-\u024F][\w\u00C0-\u024F'-]{1,20})/i);
 if (!m){
 /* pesan pendek saat menunggu nama → kata terakhir dianggap nama */
 if (ctx.askedName && msg.split(/\s+/).length <= 2 &&!/^(kapan|dimana|di mana|berapa|gimana|apa|yang mana|when|where|how|what)$/i.test(msg.trim())){
 const w = msg.replace(/[^\w\u00C0-\u024F'-]/g, ' ').trim().split(/\s+/).filter(Boolean);
 if (w.length &&!/^(tidak|nggak|enggak|gak|gapapa|gpp|skip|rahasia|nanti|males|ga\s?mau|nggak usah|ahh?|ah|deh|dong|kok|aja|banget|dulu|yaudah|okee?|sip|wkwk+|haha+|gas|kuy|sabi|iseng|laper|mager|gabut|capek|sedih|galau|udah|belum|sudah|kenyang|lapar|anjir|buset|gokil|kocak|ngakak|yaelah|tv|nonton|ohh?|oh|oalah|ooo|paham|ngerti|serius|masa|bener|betul|keren|wow|wah|asik|asyik|seru|mantap|siap|oke|ok|yes|no|nice|lol|info|infoh|boleh|gaskeun|(partnership|fun|game|member|toba|tobaladies|tobadeli|basket))$/i.test(w[w.length-1])){
 const last = w[w.length - 1];
 return last.charAt(0).toUpperCase() + last.slice(1);
 }
 }
 return null;
 }
 const bad = ['belum','mau','cari','pengen','ingin','pernah','tidak','juga','baru','lagi','suka','bisa','males','butuh','gabut','capek'];
 if (bad.includes(m[1].toLowerCase())) return null;
 return m[1].charAt(0).toUpperCase() + m[1].slice(1);
 };
 })();
 function isNameDecline(msg){
 const q = normalize(msg);
 if (q.split(/\s+/).length > 4) return false;
 return /^(tidak|nggak|gapapa|gpp|nggak usah|skip|rahasia|nanti deh|nggak mau|lanjut aja|gapapa kok)/i.test(q);
 }
 function isConfirmShort(q){
 return /^(iya|iyah|yeah|yes|yoi|betul|bener|benar|ohh|ohh?|oh ya|ohh ya|oalah|gitu ya|oke deh|sip)[\s!.?]*$/.test(q)
 || /^(ohh [a-z]+|oh [a-z]+)[\s!.?]*$/i.test(q) /* "ohh sabtu ya", "oh minggu" */
 || /^(iyaa|ohh iya|oh iya|ya betul|betul banget)[\s!.?]*$/.test(q);
 }

 /* ADAPTIVE PERSONA helper: unwrap varian formal jika tone formal */
 function pickF(cat, arr){
 const out = pick(cat, arr);
 if (out && typeof out === 'object' && out._formal) return pick(cat + 'F', out._formal);
 return out;
 }

 /* ---------- quick topic answer: dipakai saat game dijeda — jawab
 langsung topik jadwal/lokasi/biaya/join dari keyword pesan ---------- */
 function quickTopicAnswer(raw0){
 const q = normalize(raw0);
 if (/jadwal|kapan|when/i.test(q)){
 if (/tobaladies|cewek|ladies/i.test(q)){ ctx.lastSchedule = 'ladies'; return id0()? pickF('sL', A.schedLadies) : pick('sLe', A_EN.schedLadies); }
 if (/tobadeli|cowok|deli/i.test(q)){ ctx.lastSchedule = 'deli'; return id0()? pickF('sD', A.schedDeli) : pick('sDe', A_EN.schedDeli); }
 return pickF('sW', id0()? A.schedThisWeek : [A_EN.schedDeli[0] + ' ' + A_EN.schedLadies[0]]);
 }
 if (/dimana|di mana|lokasi|where/i.test(q)) return pick('loc', id0()? A.location : A_EN.location);
 if (/biaya|berapa|how much/i.test(q)){ const fa = faq(FAQ_MAP.pricing); return fa? faqPrefix(id0()) + fa : (id0()? pickF('prc', A.pricing) : pick('prce', A_EN.pricing)); }
 if (/gabung|daftar|join|member/i.test(q)){ window.tobiPersona.lastIntent = 'join'; return id0()? pickF('jn', A.join) : pick('jnE', A_EN.join); }
 if (/partnership|kolaborasi/i.test(q)) return id0()? pickF('pt', A.partnership) : pick('pte', A_EN.partnership);
 return null;
 }
 /* faqPrefix dideklarasikan di akhir IIFE dengan `function` — hoisted,
 jadi seluruh kode di atasnya sudah bisa memanggilnya. */
 const id0 = () => document.documentElement.lang!== 'en';

 /* ---------- handler utama ---------- */
 /* ---------- API publik persona ----------
 startGame(kind): dipakai chip "Tebak emoji yuk!" supaya game langsung
 dimulai (bukan sekadar mengirim teks biasa). */
 window.tobiPersona = {
 startGame(kind){ return startGame(kind === 'emoji'? 'emoji' : 'riddle'); },
 handle(msg){
 const raw0 = (msg || '').trim();
 if (!raw0) return null;
 /* FUN MODE: ronde game aktif → jawaban pengunjung diproses dulu (SEBELUM
 deteksi nama, supaya jawaban game tidak salah dianggap nama). */
 /* PROMPT 8 (topik switch): selama ronde game, pertanyaan TOBA yang jelas
 (jadwal/lokasi/biaya/join/partnership) tetap DIJAWAB — game dijeda,
 bukan dianggap jawaban tebakan. */
 if (game && /\b(jadwal|kapan|dimana|di mana|lokasi|biaya|berapa|gabung|daftar|join|partnership|kolaborasi|membership|member)\b/i.test(raw0)){
 game = null;
 /* jawaban topik langsung mengikuti pause — lewat resume-tag lalu
 diproses ulang di pipeline intent di bawah (fallback game off). */
 const pauseTag = pick('pause', id0()? [
 'Oke, jeda tebak-tebakan dulu ',
 'Sipp, tebak-tebakannya kita pause yaa '
 ] : ['Okay, pausing the game ', 'Sure, let\'s pause the game ']);
 const pivot = quickTopicAnswer(raw0);
 if (pivot) return pauseTag + '\n' + pivot;
 ctx.topics.push('gamePaused');
 return pauseTag + '\n' + (id0()? 'Silakan, tanya apa yang mau kamu tanyain ' : 'Go ahead, ask me anything ');
 }
 if (game &&!/namaku|nama saya|panggil/i.test(raw0)){
 /* ekspresi tawa/apresiasi/persetujuan saat ronde game = reaksi, bukan jawaban */
 if (/^(wkw*k+|wk(wk)+k*|ha*ha+|he+he+|lol+|lmao+|ngakak)[\s!.]*$/i.test(raw0)
 || /(anjir|bisa aja|buset|gokil|kocak|ngakak|yaelah|lucu banget)/i.test(raw0)
 || /^(gas|gaskeun|gasskeun|sabi|kuy|hayuk|males ah|males|ogah|mikir dulu|lihat nanti)[\s!.]*$/i.test(raw0)){
 return pick('wk', [
 'kok malah kita yang jadi hiburan di sini ',
 'HAHAHA, ternyata tebak-tebakan receh punya penggemar juga.',
 'HAHAHA, yang penting berhasil bikin kamu ketawa ',
 ', sesekali harus mengeluarkan jokes berkualitas '
 ]);
 }
 return handleGameAnswer(raw0);
 }
 if (!game &&!ctx.askedName && wantsGame(raw0)){
 const qw = normalize(raw0);
 if (/pantun/i.test(qw)) return pick('pn', A.pantun) + '\n' + pick('inv', A.gameAfterInvite);
 if (/joke/i.test(qw)) return pick('jk', A.jokes);
 return startGame(/emoji/i.test(qw)? 'emoji' : 'riddle');
 }
 const raw = raw0;
 const q = normalize(raw);
 const id = isId();
 /* ADAPTIVE PERSONA: formal jika pesan ini formal; playful hanya jika 2 streak; selain itu santai */
 const newTone = detectTone(q, raw);
 ctx.toneHistory = ctx.toneHistory || [];
 ctx.toneHistory.push(newTone);
 if (ctx.toneHistory.length > 3) ctx.toneHistory.shift();
 const playStreak = ctx.toneHistory.slice(-2).filter(x => x === 'playful').length;
 tone = (newTone === 'formal')? 'formal' : (playStreak >= 2? 'playful' : 'casual');
 /* formal juga harus jalan saat sedang playful: cek explicit */
 if (newTone === 'formal') tone = 'formal';

 /* 1) NAMA — tangani paling awal, TAPI jangan halangi intent JOIN:
 kalau pengunjung jelas-jelas mau gabung, langsung kasih Form Gabung. */
 const isJoinMsg = /(mau gabung|mau daftar|cara gabung|cara daftar|mau ikut|ikut dong|mau bergabung|bergabung|mau jadi member|cara ikut)/i.test(q);
 const name = extractName(raw);
 if (ctx.askedName &&!ctx.name && name &&!isNameDecline(raw) &&!isJoinMsg){
 ctx.name = name; ctx.askedName = false;
 try { sessionStorage.setItem(NAME_KEY, name); } catch(_){}
 return pick('nameGot', A.nameIntroGot).replace('{name}', name);
 }
 if (ctx.askedName && isNameDecline(raw) &&!ctx.name){
 ctx.askedName = false;
 return pick('skip', A.nameSkip);
 }
 if (ctx.name && /(?:panggil aku|panggil saya|namaku|nama saya|call me)/i.test(q)){
 const n2 = extractName(raw);
 if (n2 && n2.toLowerCase()!== ctx.name.toLowerCase()){
 ctx.name = n2;
 try { sessionStorage.setItem(NAME_KEY, n2); } catch(_){}
 return pick('chg', A.nameChange).replace('{name}', n2);
 }
 }

 /* 0.5) CONTEXT-AWARE SHORT RESPONSES (Prompt 7 fix)
 Respons pendek/slang dijawab sesuai konteks pesan sebelumnya,
 bukan dianggap pertanyaan baru atau fallback. */
 const lastTopic = ctx.topics[ctx.topics.length - 1] || '';
 const shortMsg = raw.split(/\s+/).length <= 3;
 /* PROMPT 8: pesan pendek implisit — kapan/dimana/berapa merujuk topik
 yang sedang dibahas; berapa/how much juga valid sebagai pertanyaan
 pertama (default ke FAQ biaya). Diproses SEBELUM intent matcher. */
 if (shortMsg){
 /* berapa → biaya (selalu dijawab, walau belum ada topik) */
 if (/^(berapa|berapa sih|how much|brp)[\s?.!]*$/i.test(q)){
 window.tobiPersona.lastIntent = null;
 ctx.topics.push('pricing');
 const fa = faq(FAQ_MAP.pricing);
 if (fa) return faqPrefix(id) + fa;
 return pick('prc', id? A.pricing : A_EN.pricing);
 }
 }
 if (shortMsg && ctx.topics.length){
 if (/^(siap|siyap|siyapp+|siappp+|okee+|ok(ee)+|sip|sip2|ok deh|woke+|wokes)[\s!.]*$/i.test(q)){
 return pick('ack', id? [
 'Wokee, ditunggu pertanyaannya! ',
 'Okeee, gas! ',
 'Siap! Aku standby di sini '
 ] : ['Got it, ready for your question! ', 'Okay, let\'s go! ', 'Right here, standing by ']);
 }
 if (/^(siyapp+|siappp+)\s+maksud(nya|ku)?[\s!.]*$/i.test(q)){
 return pick('ack2', id? [
 'maksudku kamu bebas tanya apa aja soal TOBA! Misalnya jadwal main, cara gabung, atau kegiatan kita. Mau bahas yang mana nih? ',
 'Hehe iya, bebas kok. Jadwal, biaya, cara gabung, sampai kolaborasi, pilih aja! '
 ] : [
 'Haha I meant you can ask anything about TOBA! Schedule, joining, activities — what would you like to know?',
 'Yep, totally open! Schedule, fees, joining, even collaborations — pick one!'
 ]);
 }
 if (/^(ohh?|oalah+|ooo|gitu ya|gitu yaa|paham|ngerti|ohh gitu|ohh? gitu)[\s!.]*$/i.test(q)){
 return pick('ohh', id? [
 'Nahh, kan seru Ada lagi yang mau ditanyain?',
 'Oalahh, sipp! Kalau ada yang bingung lagi, tanya aja ya '
 ] : [
 'Right? Anything else you want to ask?',
 'Got it! If anything\'s still unclear, just ask '
 ]);
 }
 if (/^(terus|terus gimana\??|gimana\??|terusnya|abis itu|lalu)[\s!.?]*$/i.test(q)){
 const cont = id? {
 join: 'Terus tinggal isi Form Gabung TOBA — klik tombol Isi Form Gabung TOBA di bawah pesanku yaa, nanti pengurus follow up ',
 pricing: 'Terus kalau udah ikut sekali, sesi berikutnya jadi Rp30.000 per sesi ',
 schedLadies: 'Terus kalau mau ikut, tinggal isi Form Gabung TOBA ya. Sabtu sore kita main bareng ',
 schedDeli: 'Terus kalau mau ikut, tinggal isi Form Gabung TOBA ya. Kamis malam kita main bareng '
 }[lastTopic] : {
 join: 'Then just fill out the TOBA Join Form — click the "Fill Out the TOBA Join Form" button below my message and the admins will follow up ',
 pricing: 'After your first session, it\'s Rp30,000 per session after that ',
 schedLadies: 'Want to join? Just fill out the TOBA Join Form — we play Saturday evening ',
 schedDeli: 'Want to join? Just fill out the TOBA Join Form — we play Thursday night '
 }[lastTopic] || (id? 'Hmm, terusnya gimana ya... ceritain dulu mau lanjut bahas apa? ' : 'Hmm, what\'s next... tell me what you\'d like to talk about? ');
 return cont;
 }
 if (/^(boleh( banget)?|gas|kuy|sabi|aman|okee?|yaudah|oke deh|boleh dong)[\s!.]*$/i.test(q)){
 if (lastTopic === 'join'){ window.tobiPersona.lastIntent = 'join'; return id? 'Gaskeun! Klik tombol Isi Form Gabung TOBA di bawah pesanku yaa, langsung buka formulirnya kok ' : 'Let\'s go! Click the "Fill Out the TOBA Join Form" button below my message — it opens the form directly '; }
 return pick('yes2', id? [
 'Nahh, gitu! ',
 'Fix seru nih! '
 ] : ['Nice! ', 'That\'s exciting! ']);
 }
 if (/^(mau ikut|ikut dong|mau gabung|mau daftar|ikut)[\s!.]*$/i.test(q)){
 window.tobiPersona.lastIntent = 'join';
 return id? 'Wihh, gaskeun! Kamu bisa langsung isi Form Gabung TOBA lewat tombol di bawah pesanku yaa!'
 : 'Let\'s go! You can fill out the TOBA Join Form using the button below my message!';
 }
 }
 /* PROMPT 8: pesan pendek implisit — kapan/dimana/berapa merujuk topik
 yang sedang dibahas, bukan fallback generik. Diproses SEBELUM intent
 matcher supaya tidak tersandera keyword panjang. */
 if (shortMsg){
 /* PROMPT 8 skenario C: kembali ke topik lama — "yang Sabtu itu Tobaladies kan?" */
 if (/^(tadi|yang)\b.*\b(sabtu|kamis|tobaladies|tobadeli)\b.*\b(kan|ya|bener|benar|betul)\??$/i.test(q)){
 if (/sabtu|tobaladies/i.test(q)){
 ctx.lastSchedule = 'ladies'; ctx.topics.push('schedLadies');
 return (id? 'Iyaa betul! ' : 'Yes, that\'s right! ') + (id? pickF('sL', A.schedLadies) : pick('sLe', A_EN.schedLadies));
 }
 if (/kamis|tobadeli/i.test(q)){
 ctx.lastSchedule = 'deli'; ctx.topics.push('schedDeli');
 return (id? 'Iyaa betul! ' : 'Yes, that\'s right! ') + (id? pickF('sD', A.schedDeli) : pick('sDe', A_EN.schedDeli));
 }
 }
 /* kapan mulai / kapan main → jadwal dari topik terakhir */
 if (/^(kapan|kapan mulai|kapan main|kapan latihan|kapan kegiatannya|when)[\s?.!]*$/i.test(q)){
 if (lastTopic === 'schedLadies' || ctx.lastSchedule === 'ladies'){
 ctx.lastSchedule = 'ladies'; ctx.topics.push('schedLadies');
 return id? pickF('sL', A.schedLadies) : pick('sLe', A_EN.schedLadies);
 }
 if (lastTopic === 'schedDeli' || ctx.lastSchedule === 'deli'){
 ctx.lastSchedule = 'deli'; ctx.topics.push('schedDeli');
 return id? pickF('sD', A.schedDeli) : pick('sDe', A_EN.schedDeli);
 }
 /* default: jadwal rutin keduanya */
 ctx.topics.push('schedBoth');
 return pickF('sW', id? A.schedThisWeek : [A_EN.schedDeli[0] + ' ' + A_EN.schedLadies[0]]);
 }
 /* dimana → lokasi */
 if (/^(di mana|dimana|di mana sih|where)[\s?.!]*$/i.test(q)){
 window.tobiPersona.lastIntent = null;
 ctx.topics.push('location');
 return pick('loc', id? A.location : A_EN.location);
 }
 /* dimana → lokasi (rujuk topik: masih konteks sama) */
 if (/^(dimana sih|dimana nih|where is it|where at)[\s?.!]*$/i.test(q)){
 window.tobiPersona.lastIntent = null;
 ctx.topics.push('location');
 return pick('loc', id? A.location : A_EN.location);
 }
 /* berapa → biaya (diproses di blok shortMsg atas, jadi duplikat dihapus) */
 if (/^(berapa dong|kapan\?|brp dong)$/i.test(q)){
 if (lastTopic === 'pricing'){
 window.tobiPersona.lastIntent = null;
 ctx.topics.push('pricing');
 const fa = faq(FAQ_MAP.pricing);
 return fa? faPrefix(id) + fa : (id? pickF('prc', A.pricing) : pick('prce', A_EN.pricing));
 }
 }
 /* bisa ikut → join */
 if (/^(bisa ikut|bisa gabung|bisa daftar|can i join)[\s?.!]*$/i.test(q)){
 ctx.topics.push('join'); window.tobiPersona.lastIntent = 'join';
 return id? pickF('jn', A.join) : 'Absolutely! Click the "Fill Out the TOBA Join Form" button below and you\'re set. ';
 }
 /* yang mana → rujuk konteks: kalau jadwal, kebalikan hari terakhir */
 if (/^(yang mana|which one|which)[\s?.!]*$/i.test(q)){
 if (ctx.lastSchedule){
 ctx.topics.push('schedFollowUp');
 return id? pickF('sF', A.schedFollowUp) : [A_EN.schedDeli[0] + ' ' + A_EN.schedLadies[0]][0];
 }
 if (ctx.topics.includes('join') || window.tobiPersona.lastIntent === 'join'){
 window.tobiPersona.lastIntent = 'join';
 return id? 'Nihh, klik tombol Isi Form Gabung TOBA di bawah pesanku yaa. Langsung menuju formulir pendaftaran kok '
 : 'Right here — click the "Fill Out the TOBA Join Form" button below my message. It opens the signup form directly ';
 }
 }
 }
 /* 2) MATCH INTENT — identity punya prioritas tertinggi karena urutan array */
 let hitId = null;
 const qs = q.replace(/\s+/g,' ').trim(); /* trim utk regex ^...$ */
 for (const it of INTENTS){
 if (it.need? (it.re.test(qs) && it.need.test(qs)) : it.re.test(qs)){ hitId = it.id; break; }
 }
 if (!hitId) hitId = fuzzyIntent(q);

 if (hitId === 'confirmOhh'){
 /* "sama ya / sama?" setelah jadwal → jawab beda hari, bukan "betul" */
 if (/sama|mirip/i.test(q)){
 hitId = 'schedFollowUp';
 } else if (ctx.lastSchedule){
 return pick('conf', A.confirmYes);
 } else {
 hitId = 'schedFollowUp';
 }
 }

 /* 3.5) jawaban tanya makan → respons makan (SEBELUM deteksi nama,
 supaya "Udah"/"Belum" tidak tersimpan sebagai nama) */
 if (/^(udah|sudah|udah dong|sudah dong|udah makan|sudah makan|udah kok|sudah kok)[\s!.]*$/i.test(qs)){
 ctx.askedName = false;
 return pick('ms', A.makan.sudah);
 }
 if (/^(belum|belum lapar|belum makan|masih kenyang|belum dong|nggak lapar)[\s!.]*$/i.test(qs)){
 ctx.askedName = false;
 return /belum lapar|nggak lapar|masih kenyang/.test(qs)? pick('mb', A.makan.belumLapar) : pick('mn', A.makan.belum);
 }

 /* 4) pesan sangat pendek & tidak dikenal saat menunggu nama → skip halus.
 KECUALI pesan JOIN — pengunjung yang menunggu nama tapi bilang
 "mau gabung" tetap harus langsung dapat Form Gabung. */
 if (ctx.askedName &&!ctx.name &&!hitId && raw.split(/\s+/).length <= 2 &&!isJoinMsg){
 ctx.askedName = false;
 return pick('skip', A.nameSkip);
 }

 /* 4.5) CONVERSATIONAL RESPONSES (Critical Persona Fix):
 penolakan, respons pendek, candaan & keputusan pengunjung dijawab
 sesuai konteks — JANGAN jatuh ke fallback/FAQ. */
 if (!hitId){
 const decline = /^(enggak ahh|enggak ah|gak ahh|nggak ahh|nggak ah|enggak dulu|nggak dulu|gak dulu|nanti aja deh|nanti deh|nanti dulu|nanti aja|cuma iseng kok|iseng aja kok|cuma iseng|males dulu|belum dulu|skip dulu|gpp dulu|ga dulu|tidak dulu)[\s!.]*$/i;
 if (decline.test(qs) || (/^(enggak|nggak|gak|ga|males|belum|nanti|skip)\b/i.test(qs) && raw.split(/\s+/).length <= 4)){
 ctx.topics.push('declined');
 window.tobiPersona.lastIntent = null;
 if (ctx.topics.length > 8) ctx.topics.shift();
 return pick('dc', id? [
 'gapapaa Belum kepancing basketnya yaa. Santuy, kita ngobrol aja dulu.',
 'HAHAHA okeee, nggak maksa kok Btw, kamu emang suka basket atau cuma mampir buat ngobrol sama aku nih?',
 'Yahh, belum waktunya jadi anak basket nih kayaknya. Nggak apa-apa, santuy aja ',
 'Okeee, santuy. Aku nggak bakal maksa kok Kalau nanti berubah pikiran, aku di sini!',
 'HAHAHA baiklah, kita ngobrol aja dulu. Lagi ngapain hari ini?',
 'Santuy aja Nggak semua orang harus langsung gas. Kita ngobrol aja dulu yaa'
 ] : [
 'No worries. No rush — we can just chat.',
 'Haha okay, no pressure. Do you actually like basketball, or just passing by?',
 'No problem at all — I\'m here whenever you change your mind!',
 'Sure, take it easy What\'s up today?'
 ]);
 }
 /* pengunjung ingin ngobrol aja → hormati, tanpa CTA */
 const talkOnly = /(cuma mau ngobrol|pengen ngobrol aja|mau ngobrol aja|cuma mau cerita|ngobrol aja deh|sekadar ngobrol|sekedar ngobrol)/i.test(qs);
 if (talkOnly){
 ctx.topics.push('talkOnly');
 return pick('to', id? [
 'Asik, gas ngobrol aja Ada cerita apa hari ini?',
 'Boleh banget! Ngobrol santai aja, nggak harus soal TOBA terus ',
 'Sipp, aku dengerin. Spill dong, lagi ada apa? '
 ] : [
 'Sure, let\'s just chat What\'s on your mind today?',
 'Of course! Casual talk is fine, it doesn\'t always have to be about TOBA ',
 'I\'m listening — what\'s up? '
 ]);
 }
 /* candaan/sarkasme ringan saat tidak ada intent */
 if (/^(lucu|lucu banget|kamu lucu|tobi lucu|garing|receh banget|jelek|aneh)[\s!.]*$/i.test(qs)){
 return pick('funny', id? [
 'Akhirnya ada yang mengakui bakat terpendamku.',
 'HAHAHA iya nih, humor garing spesialisasi TOBI ',
 'maklum, maskot emang garing itu brand identity ku '
 ] : [
 'Finally, someone recognizes my hidden talent!',
 'Haha yep, dry humor is TOBI\'s specialty.',
 'Well, being a mascot means dad jokes are my brand.'
 ]);
 }
 /* “aku malu” / emosi ringan tanpa intent lain */
 if (/(aku malu|malu banget|salting|gugup)/i.test(qs) && raw.split(/\s+/).length <= 4){
 return pick('shy', id? [
 'Ehh, santai dong Nggak ada yang ngejudge di sini. Pelan-pelan aja ya.',
 'Gapapaa banget! Semua juga pernah gitu. Santuy '
 ] : [
 'Relax No judgment here. Take it slow.',
 'Totally fine! Everyone\'s been there '
 ]);
 }
 }

 ctx.topics.push(hitId);
 if (ctx.topics.length > 8) ctx.topics.shift();
 /* reset join link: hanya pesan JOIN yang boleh menyertakan tombol form */
 window.tobiPersona.lastIntent = (hitId === 'join' || hitId === 'joinAsk')? 'join' : null; /* Prompt 7 + Task 7D: jawaban klarifikasi join tetap menyertakan link Form Gabung */

 /* nama disisipkan natural, tidak setiap kali */
 const useName = ctx.name && Math.random() < 0.3;
 const nm = useName? ', ' + ctx.name : '';

 switch (hitId){
 case 'whoami': {
 if (!ctx.name &&!ctx.askedName && ctx.topics.filter(x => x === 'whoami').length === 1)
 return pick('who', A.whoami) + ' ' + pick('ask', A.nameIntroAsk);
 return pick('who', A.whoami);
 }
 case 'aboutAdmin': return pick('adm', A.aboutAdmin);
 case 'aboutToba': {
 /* CRITICAL: kenalan TOBA = berikan pengenalan komunitas dulu,
 jangan tanya nama dulu (pengunjung butuh informasi nyata). */
 return id? pickF('abt', A.aboutToba) : pick('abtE', A_EN.aboutToba);
 }
 case 'greet': {
 if (ctx.name) return id? pick('grN', [
 'Hai ' + ctx.name + '! Ada yang bisa dibantu hari ini?',
 'Halo ' + ctx.name + '! Mau cari info TOBA atau sekadar ngobrol?'
 ]) : pick('grNe', ['Hi ' + ctx.name + '! What can I help with today?', 'Hello ' + ctx.name + '! TOBA info or just chatting?']);
 return id? pickF('gr', A.greet) : pick('grE', A_EN.greet);
 }
 case 'makan': {
 const s = qs;
 if (/^belum lapar|masih kenyang|baru makan|udah makan|sudah makan/i.test(s))
 return /belum lapar|masih kenyang/.test(s)? pick('mb', A.makan.belumLapar) : pick('ms', A.makan.sudah);
 return pick('mn', A.makan.belum);
 }
 case 'makanBalik':
 return pick('mbk', A.makan.balikTanya);
 case 'schedLadies':
 ctx.lastSchedule = 'ladies';
 return id? pickF('sL', A.schedLadies) : pick('sLe', A_EN.schedLadies);
 case 'schedDeli':
 ctx.lastSchedule = 'deli';
 return id? pickF('sD', A.schedDeli) : pick('sDe', A_EN.schedDeli);
 case 'schedBoth':
 case 'schedThisWeek':
 return pickF('sW', id? A.schedThisWeek : [A_EN.schedDeli[0] + ' ' + A_EN.schedLadies[0]]);
 case 'schedFollowUp': {
 /* balas kebalikan dari jadwal terakhir yang dibahas */
 if (ctx.lastSchedule === 'ladies'){
 ctx.lastSchedule = 'deli';
 return id? pickF('sD', A.schedDeli) : pick('sDe', A_EN.schedDeli);
 }
 if (ctx.lastSchedule === 'deli'){
 ctx.lastSchedule = 'ladies';
 return id? pickF('sL', A.schedLadies) : pick('sLe', A_EN.schedLadies);
 }
 return pick('sF', id? A.schedFollowUp : [A_EN.schedDeli[0] + ' ' + A_EN.schedLadies[0]]);
 }
 case 'register': {
 const ans = faq(FAQ_MAP.register);
 if (ctx.topics.length > 1 && ans &&!ctx.lastAnswers.includes(ans)){
 /* cukup jawab dari FAQ resmi kalau baru pertama kali */
 }
 return faqPrefix(id) + (id? pick('reg', REGISTER_SHORT) : 'Easy! Click the "Fill Out the TOBA Join Form" button below to open the form. ');
 }
 case 'pricing': {
 const ans = faq(FAQ_MAP.pricing);
 if (ans) return faqPrefix(id) + ans;
 return id? pickF('prc', A.pricing) : pick('prce', A_EN.pricing);
 }
 case 'membership': {
 const ans = faq(FAQ_MAP.membership);
 if (ans) return faqPrefix(id) + ans;
 return pick('mem', id? A.membership : ['No membership needed upfront.']);
 }
 case 'location':
 return pick('loc', id? A.location : A_EN.location);
 case 'alone':
 ctx.newbie = true;
 return pick('aln', id? A.alone : ['Totally fine! TOBA folks are friendly.']);
 case 'beginner':
 ctx.newbie = true;
 return pick('beg', id? A.beginner : ['No need to be great first.']);
 case 'confidence':
 return pick('cnf', id? A.confidence : ['First-time nerves are normal!']);
 case 'partnership': {
 /* event service vs kolaborasi/sponsor */
 if (/crew|table official|wasit|butuh bantuan event/i.test(q))
 return pick('pev', id? A.partnershipEvent : ['We can discuss it — share the details via the Partnership page!']);
 /* sudah di halaman Partnership → scroll langsung ke form resmi (#partnerForm); */
 if (document.body.dataset.page === 'partnership') {
 setTimeout(() => {
 const el = document.getElementById('partnerForm');
 if (el) el.scrollIntoView({ behavior: REDUCE? 'auto' : 'smooth', block: 'start' });
 }, 350);
 } else {
 /* di halaman lain → buka Partnership langsung di section form resmi */
 setTimeout(() => { location.href = 'partnership.html#partnerForm'; }, 900);
 }
 return id? pickF('pt', A.partnership) : pick('pte', A_EN.partnership);
 }
 case 'join': {
 /* Task 7D: "Aku mau ikut basket" → klarifikasi dulu: Tobaladies / Tobadeli.
 Kalau pengunjung sudah menyebut salah satu tim, langsung ke Form Gabung. */
 if (/tobaladies|cewek|perempuan|ladies/i.test(q)) {
 ctx.topics.push('joinLadies');
 return id? pickF('jn', A.join) : pick('jnE', A_EN.join);
 }
 if (/tobadeli|cowok|laki|deli/i.test(q)) {
 ctx.topics.push('joinDeli');
 return id? pickF('jn', A.join) : pick('jnE', A_EN.join);
 }
 if (!ctx.topics.includes('joinAsked')) {
 ctx.topics.push('joinAsked');
 window.tobiPersona.lastIntent = 'joinAsk';
 return id? pick('jA', [
 'Wah, seru! Kamu tertarik bergabung dengan tim perempuan ' + LADIES + ' atau tim laki-laki ' + DELI + '?',
 'Mantap! Mau gabung di grup ' + LADIES + ' (perempuan) atau ' + DELI + ' (laki-laki)?'
 ]) : pick('jAe', [
 'Fun! Are you interested in joining the women\'s squad ' + LADIES + ' or the men\'s ' + DELI + '?',
 'Awesome! Which group — ' + LADIES + ' (women) or ' + DELI + ' (men)?'
 ]);
 }
 return id? pickF('jn', A.join) : pick('jnE', A_EN.join);
 }
 case 'funGame':
 return pick('fg', id? A.funGame : A_EN.funGame);
 case 'event':
 return pick('ev', id? A.event : ['Check the Events page for the latest schedule.']);
 case 'activities':
 return pick('act', id? A.activities : ['Fun Game, training, friendly games, events.']);
 case 'vibe':
 return pick('vib', id? A.vibe : ['Friendly and welcoming!']);
 case 'trial':
 return pick('trl', id? A.trial : ['You can join once first.']);
 case 'age':
 return pick('age', id? A.age : ['Best to ask the TOBA admins directly.']);
 case 'difference':
 return pick('dff', id? A.difference : [LADIES + ' (women, ' + HARI_LADIES + ') vs ' + DELI + ' (men, ' + HARI_DELI + ').']);
 case '': {
 /* apresiasi candaan vs tawa murni — respons mengikuti konteks */
 if (/(anjir|bisa aja|buset|gokil|kocak|ngakak|receh|ada-ada aja|lucu|apresiasi|bakat|pelawak|penghibur|bikin kamu ketawa|menghibur)/i.test(q)){
 return pick('ap', [
 ', sesekali harus mengeluarkan jokes berkualitas ',
 'HAHAHA, kepikiran aja kan ',
 'Lahh, baru tahu aku punya bakat tersembunyi jadi pelawak ',
 'HAHAHA, yang penting berhasil bikin kamu ketawa ',
 'HAHAHA, berarti misi menghibur berhasil hari ini!',
 'NAHH, akhirnya ada yang mengapresiasi buaya satu ini ',
 'Buset, kamu bisa aja '
 ]);
 }
 /* humor: candaan diikuti, bukan fallback info */
 if (ctx.name && Math.random() < 0.5) return pick('wkN', [
 'Hahaha, ada-ada aja kamu ' + ctx.name + ' ',
 'Haha, santai banget nih ' + ctx.name + ' ',
 'kamu ini ya ',
 'HAHAHA iya nih, santuy kan obrolannya '
 ]);
 return pick('wk', id? A.laugh : ['Haha, got me there!', 'Looks like we became the entertainment here!', 'Mission to make you laugh: accomplished!']);
 }
 case 'confused2':
 return pick('c2', id? A.confused2 : ['Let me explain again!']);
 case 'agree2':
 return pick('a2', id? A.agree2 : ['Nice, let\'s go!']);
 case 'decline2':
 return pick('d2', id? A.decline2 : ['No problem! I\'m here anytime.']);
 case 'gabut':
 return pick('gb', id? A.gabut : ['Bored? Same.']);
 case 'capek':
 return pick('cp', id? A.capek : ['Hang in there!']);
 case 'lagiApa':
 return pick('la', id? A.lagiApa : ['Just waiting for the next game.']);
 case 'pindah':
 return pick('pd', id? A.pindah : ['Welcome to Jakarta!']);
 case 'sukaBasket':
 return pick('sb', id? A.sukaBasket : ['Long-time hooper!']);
 case 'outOfTopic':
 return pick('oot', id? A.outOfTopic : A_EN.outOfTopic);
 case 'jagoNonton':
 return pick('jn2', id? [
 'nahh, posisi paling aman itu Yang penting dukungannya full.',
 'HAHAHA jago nonton itu skill juga kok Mungkin level MVP penonton.',
 'auto jadi analis basket nih '
 ] : [
 'Haha, the safest position Full support counts!'
 ]);
 case 'cariGebetan':
 return pick('cg', id? [
 'Waduhhh, misi utamanya basket apa cari chemistry nih?.',
 'HAHAHA duo misi nih. Semoga dapat teman main sekaligus teman cerita '
 ] : [
 'Whoa, is the mission basketball or finding chemistry?',
 'Haha double mission. Hope you find a playing partner and a friend.'
 ]);
 case 'sad':
 return pick('sd', id? A.sad : ['Take care of yourself first.']);
 case 'gameAsk': {
 /* mood gate: jangan ajak main kalau sedang serius/sedih */
 if (ctx.topics.includes('sad')) return pick('sd', id? A.sad : ['Take care first.']);
 if (/pantun/i.test(q)) return pick('pn', id? A.pantun : ['Here\'s one!']) + '\n' + pick('inv', A.gameAfterInvite);
 if (/joke/i.test(q)) return pick('jk', id? A.jokes : ['Haha, got one for you!']);
 return startGame(/emoji/i.test(q)? 'emoji' : 'riddle');
 }
 }

 /* 6) TIDAK ADA intent → bukan otomatis FAQ!
 Kalau baru selesai permainan / pengunjung baru saja menolak ajakan,
 pertahankan suasana santai — jangan jatuh ke fallback FAQ. */
 if (!hitId){
 const recentInvite = ctx.topics.some(x => x === 'gameRound' || x === 'declined' || x === 'talkOnly');
 if (recentInvite && raw.split(/\s+/).length <= 6){
 return pick('keep', id? [
 'Hehe, santai aja Ngobrol aja yuk, nggak harus soal TOBA terus.',
 'oke, kita santuy aja Ada lagi yang mau diomongin?',
 'Boleh banget ngobrol santai Cerita aja, aku dengerin.'
 ] : [
 'Sure, let\'s keep it casual. Chat about anything — not just TOBA.',
 'Haha okay, chilling. Anything else you want to talk about?',
 'Casual chat works for me. Go ahead, I\'m listening.'
 ]);
 }
 return null; /* benar-benar tidak jelas → engine lama */
 }
 },
 chips,
 welcome
 };

 /* faqPrefix: dideklarasikan sebelum dipakai (sebelumnya di akhir IIFE,
 tidak terjangkau oleh blok shortMsg yang memanggilnya lebih awal). */
 function faqPrefix(id){
 return pick('pre', id
? ['', 'Oke! ', 'Nahh, ini yang kamu cari: ', 'Ohh, paham. Begini: ']
 : ['', 'Sure. ', 'Good question. ']);
 }
})();




