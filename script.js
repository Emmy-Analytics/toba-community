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
  <div class="hero-gradient-shift" aria-hidden="true"></div>  <!-- Prompt 36: pergantian warna perlahan -->
  <div class="hero-atmosphere" aria-hidden="true" data-pointer-depth="7"></div>
  <!-- Prompt 54: cinematic photo collage — dokumentasi asli TOBA, layered editorial -->
  <div class="hero-collage" aria-hidden="true">
    <figure class="hc-photo hc-a" data-cine-h="0.22"><img src="${photos.training}" alt="" loading="eager"></figure>
    <figure class="hc-photo hc-b" data-cine-h="0.38"><img src="${photos.women}" alt="" loading="lazy"></figure>
    <figure class="hc-photo hc-c" data-cine-h="0.55"><img src="${photos.men}" alt="" loading="lazy"></figure>
    <figure class="hc-photo hc-d" data-cine-h="0.7"><img src="${photos.arena}" alt="" loading="lazy"></figure>
  </div>
  <!-- Prompt 37-38: multiple SVG cutout composition — di dalam kolom head/body flow -->
  <div class="hero-cut-slideshow" id="heroCutShow" aria-hidden="true"></div>
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

<section class="cine-reviews" id="cineReviews" aria-label="${t('cine.reviews.aria')}">
  <div class="cine-rbg" aria-hidden="true">
    ${cinePhotos.map((p,i)=>`<div class="cine-rbg-img${i===0?' active':''}" style="background-image:url('${p}')"></div>`).join('')}
    <!-- Prompt 57: starfield canvas — partikel berlapis depth, twinkle halus -->
    <div class="starfield-layer"><canvas id="tobaStars"></canvas></div>
  </div>
  <div class="cine-rbg-overlay" aria-hidden="true"></div>
  <div class="cine-rcenter">
    <h2 class="cine-rheadline">${t('cine.reviews.h')}</h2>
    <p class="cine-rsub">${t('cine.reviews.sub')}</p>
  </div>
  <div class="cine-rcards" aria-live="polite"></div>
</section>

<!-- Prompt 69: section hijau "LANGSUNG DARI LAPANGAN" dihapus —
     dokumentasinya sudah tampil di galeri bergerak di bawah -->

<section class="section-wrap agenda-section"><div class="section-heading"><div><p class="eyebrow">${t('home.events.eyebrow')}</p><h2>${t('home.events.h')}</h2></div><a class="text-link" href="events.html">${t('home.events.link')}</a></div>${eventScroller(events.slice(0, 4).map(eventCard).join(''))}</section>

<section class="cine-gallery" aria-label="${t('cine.gallery.aria')}">
  <div class="cine-g-head"><p class="eyebrow">${t('cine.gallery.eyebrow')}</p><h2 class="cine-g-title">${t('cine.gallery.h')}</h2><a class="text-link" href="gallery.html">${t('cine.gallery.cta')}</a></div>
  <div class="cine-g-row cine-g-r1"><div class="cine-g-track" data-dir="rtl" data-speed="28">${cineRow(cineRow1)}</div></div>
  <div class="cine-g-row cine-g-r2"><div class="cine-g-track" data-dir="ltr" data-speed="38">${cineRow(cineRow2)}</div></div>
  <div class="cine-g-row cine-g-r3"><div class="cine-g-track" data-dir="rtl" data-speed="48">${cineRow(cineRow3)}</div></div>
  <p class="cine-g-empty" hidden>${t('cine.gallery.empty')}</p>
</section>

<section class="cine-marquee" id="cineApparel" aria-label="TOBA APPAREL">
  <div class="cine-m-track" data-dir="ltr" data-speed="22"><div class="cine-m-inner">
    <span class="cine-m-item"><span class="cm-toba">TOBA</span> <span class="cm-apparel">APPAREL</span> <svg class="cine-m-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4z"/></svg> <span class="cm-other">WEAR THE CULTURE</span> <svg class="cine-m-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4z"/></svg> <span class="cm-toba">TOBA</span> <span class="cm-apparel">APPAREL</span> <svg class="cine-m-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4z"/></svg> </span><span class="cine-m-item" aria-hidden="true"><span class="cm-toba">TOBA</span> <span class="cm-apparel">APPAREL</span> <svg class="cine-m-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4z"/></svg> <span class="cm-other">WEAR THE CULTURE</span> <svg class="cine-m-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4z"/></svg> <span class="cm-toba">TOBA</span> <span class="cm-apparel">APPAREL</span> <svg class="cine-m-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4z"/></svg> </span><span class="cine-m-item" aria-hidden="true"><span class="cm-toba">TOBA</span> <span class="cm-apparel">APPAREL</span> <svg class="cine-m-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4z"/></svg> <span class="cm-other">WEAR THE CULTURE</span> <svg class="cine-m-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4z"/></svg> <span class="cm-toba">TOBA</span> <span class="cm-apparel">APPAREL</span> <svg class="cine-m-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4z"/></svg> </span>
  </div></div>
</section>

<section class="section-wrap merch-section"><div class="section-heading"><div><p class="eyebrow">${t('home.merch.eyebrow')}</p><h2><span class="mw-ink">TOBA</span> <span class="accent-orange">MERCH.</span></h2></div><a class="text-link" href="merchandise.html">${t('home.merch.link')}</a></div><div class="product-grid">${products.slice(0, 4).map(productCard).join('')}</div></section>

<section class="section-wrap contact-section"><button class="contact-card part-card-inner" id="joinCtaBtn" type="button" onclick="window.location.href='partnership.html'" aria-label="${t('home.call.btn')}"><div class="contact-copy"><p class="eyebrow">${t('home.call.label')}</p><h3>${t('home.call.h')}</h3><p class="lede">${t('home.call.d')}</p></div><a class="pill contact-cta" href="partnership.html" onclick="event.stopPropagation()">${t('home.call.btn')}</a></button></section>

`
}

/* ---------- PROMPT 1-10 · CINEMATIC MODULE (namespace .cine-) ---------- */
const cinePhotos = [photos.women, photos.men, photos.training, photos.women2, photos.arena, photos.game2];
const cineRow1 = [photos.game2, photos.men, photos.women, photos.men2, photos.women3, photos.arena, photos.training, photos.women2];
const cineRow2 = [photos.team, photos.women3, photos.hoop, photos.training, photos.ladies3, photos.men2, photos.ball, photos.floor, photos.women, photos.men, photos.game2];   /* Prompt 57: +3 foto agar kelompok cukup lebar untuk viewport */
const cineRow3 = [photos.hoop, photos.ladies3, photos.ball, photos.floor, photos.men2, photos.team, photos.women, photos.game2];
const cineReviews = []; /* isi dengan review asli berizin: {name:'…', text:'…'} — kosong = kartu disembunyikan, tidak ada data fiktif */
function cineRow(arr){
  const card = (src,i)=>`<figure class="cine-g-card"><img src="${src}" alt="${t('cine.gallery.alt')}" loading="lazy" onerror="this.parentElement.classList.add('cine-g-dead')"></figure>`;
  const seq = arr.map(card).join('');
  /* Prompt 30/42: spacer penutup di DALAM tiap seq — jarak antar-seq identik
     dengan jarak antar-card, sehingga wrap modulo tidak menyisakan celah kosong.
     Prompt 42: tiap baris diberi 3 kelompok identik — satu kelompok terlalu
     pendek utk viewport lebar membuat sisi kanan kosong saat animasi berjalan;
     engine memakai kelompok pertama sebagai satuan loop (half). */
  /* Prompt 57: 4 kelompok identik per baris — kelompok foto pendek (row2
     memakai foto landscape/kecil, lebar total < viewport) membuat sisi kanan
     kosong; menambah kelompok menjamin track total selalu > 2× viewport.
     Semua kelompok urutan/lebar/gap identik → wrap modulo tetap seamless. */
  const grp = `<div class="cine-g-seq">${seq}</div>`;
  return grp + `<div class="cine-g-seq" aria-hidden="true">${seq}</div><div class="cine-g-seq" aria-hidden="true">${seq}</div><div class="cine-g-seq" aria-hidden="true">${seq}</div>`;
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
  <div class="hero-copy"><p class="eyebrow">${women ? t('intro.ladies.eyebrow') : t('intro.deli.eyebrow')}</p>
    <h1>${women ? '<span class="accent-pink">TOBA</span>LADIES' : '<span class="accent-orange">TOBA</span>DELI'}</h1>
    <p class="brand-fullname">${women ? t('brand.name.ladies') : t('brand.name.deli')}</p>
    <p class="hero-subtitle">${sub}. ${desc}</p>
    <div class="hero-actions"><a class="pill pill-${tone}" href="partnership.html">${cta1}</a><a class="pill secondary" href="events.html">${cta2}</a></div>
    <p class="eyebrow" style="color:var(--muted)">${t('comm.eyebrow2')}</p></div></section>

<section class="section-wrap"><div class="two-col"><div class="photo-frame img-reveal" data-parallax="${women ? '0.07' : '-0.06'}"><img src="${img}" alt="${t('comm.illust')} ${name}" loading="lazy">${women ? '<img class="mascot mascot-wordmark" src="assets/logopinkpng.png" alt="Logo Tobaladies">' : ''}<span class="frame-caption accent-${tone}">${name}</span></div>
  <div style="align-self:end;padding-bottom:8px"><p class="eyebrow">${t('comm.about')}</p><h2>${t('comm.h')}</h2><p class="lede">${t('comm.lede')}</p>${women ? '' : `<p class="brand-note">${t('brand.deli.note')}</p>`}<a class="text-link" href="events.html">${t('comm.link')}</a></div></div></section>

<section class="section-wrap comm-story"><div class="comm-story-grid">
  <div class="photo-frame img-reveal" data-parallax="${women ? '0.06' : '-0.05'}"><img src="${women ? photos.ladies3 : photos.men2}" alt="${t('comm.illust')} ${name}" loading="lazy"><span class="frame-caption accent-${tone}">${name}</span></div>
  <div class="comm-story-copy">
    <p class="eyebrow accent-${tone}">${t(women ? 'tl.story.eyebrow' : 'deli.story.eyebrow')}</p>
    <h2>${t(women ? 'tl.story.h' : 'deli.story.h')}</h2>
    <p class="tl-lead">${t(women ? 'tl.story.lead' : 'deli.story.p1')}</p>
    <p>${t(women ? 'tl.story.p1' : 'deli.story.p2')}</p>
    ${women ? `<p>${t('tl.story.p2')}</p>` : ''}
  </div>
</div></section>

<section class="dark-section"><div class="dark-section-inner">
  <div class="section-heading"><div><p class="eyebrow">${tPair('NEXT UP','SELANJUTNYA')}</p><h2>${tPair('COMMUNITY <span class="accent-' + tone + '">SCHEDULE.</span>','JADWAL <span class="accent-' + tone + '">KOMUNITAS.</span>')}</h2></div><a class="text-link" href="events.html">${t('home.events.link')}</a></div>
  ${eventScroller(events.filter(e => e.community === (women ? 'Tobaladies' : 'Tobadeli') || e.community === 'All Community').slice(0, 4).map(eventCard).join(''))}
  <div class="feature-strip feature-checklist" role="list" style="margin-top:clamp(40px,6vh,64px)">${[1,2,3,4].map(n=>`<div class="feature feature-check" role="listitem"><span class="check-ind" aria-hidden="true"><svg viewBox="0 0 16 16" width="13" height="13" fill="none"><path d="M2.5 8.5l3.5 3.5 7-8" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span><div class="check-copy"><strong>${t('comm.f'+n)}</strong><span>${t('comm.f'+n+'s')}</span></div></div>`).join('')}</div>
</div></section>

<section class="section-wrap"><div class="callout"><div><p class="eyebrow">${t('comm.join.eyebrow')}</p><h3>${t('comm.join.h')}</h3><p class="lede">${t('comm.pill.d')}</p></div><a class="pill" href="partnership.html">${ctaJoin}</a></div></section>`
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
<section class="section-wrap two-col"><div><p class="eyebrow">${t('part.ways')}</p><h2>${t('part.h')}</h2><div class="card-grid part-grid">${[1,2,3,4,5,6,7,8].map(n=>`<div class="info-card"><div class="pad"><h3>${t('part.c'+n)}</h3><p>${t('part.c'+n+'p')}</p></div></div>`).join('')}</div></div>
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
/* Prompt 9/21: "Kembali ke atas" dihapus dari semua halaman — guard agar error tidak muncul jika markup sisa */
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
document.addEventListener('toba:langchange', () => { if (page === 'game') return; appEl.innerHTML = (renderers[page] || home)(); document.querySelector(`[data-nav="${page}"]`)?.classList.add('active'); if (page === 'gallery') { galleryState === 'ok' ? renderGalleryUI() : loadGallery(); } initReveal(); initStorySteps(); initParallax(); initKinetic(); initPointerScene(); initMerchTilt(); initFaq(); window.__cineReset && window.__cineReset(); window.__starsReset && window.__starsReset(); });

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

/* =====================================================================
   PROMPT 54-55 · CINEMATIC SCROLL ENGINE — hero collage drifts RIGHT
   as the user scrolls (no hijack: pure rAF + scrollY). Layer speeds come
   from data-cine-h (0=still, 1=fast). Reduced-motion skips everything.
   ===================================================================== */
(function cineHeroScroll(){
  if (document.body.dataset.page !== 'home') return;
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
      const rise = Math.min(y * l.h * 0.06, 36);          /* slight upward lift */
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


/* =====================================================================
   PROMPT 57 · STARFIELD ENGINE — cinematic depth particles (canvas)
   ===================================================================== */
(function starfield(){
  if (document.body.dataset.page !== 'home') return;
  if (reduceMotion) return;
  let canvas = null, ctx = null, raf = 0, running = false, stars = [], W = 0, H = 0;
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const COUNT = mobile ? 55 : 130;
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
        en.isIntersecting ? wake() : sleep();
      }), { rootMargin: '60px' }).observe(sec);
    } else wake();
    document.addEventListener('visibilitychange', () => document.hidden ? sleep() : wake());
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
      r: (0.6 + Math.random() * 1.7) * (mobile ? 0.85 : 1),
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
    const dt = lastT ? Math.min((t - lastT) / 1000, .05) : .016;
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
   PROMPT 27 · HERO SVG CUTOUT SLIDESHOW
   Aset lokal: assets/img/cutout/*.svg (cutout orang, transparan).
   Fade 800ms, durasi tiap slide 3s. Timer + class toggle saja.
   Slide di-preload; gambar aktif dipertahankan sampai berikutnya siap.
   prefers-reduced-motion → tampilan statis (slide pertama, tanpa autoplay).
   ===================================================================== */
/* =====================================================
   PROMPT 37-38 · HERO SVG CUTOUT — MULTIPLE PHOTOS COMPOSITION
   Semua aset di assets/img/cutout/ diaudit; aset valid dipakai.
   3 foto tampil BERSAMAAN per komposisi (1 utama + 2 pendukung).
   4 preset komposisi dikontrol (bukan posisi acak), fade 900ms,
   durasi komposisi 5s. Foto tetap di bawah judul, di atas CTA
   (container .hero-cut-slideshow ada di grid-area "visual").
   prefers-reduced-motion → komposisi statis pertama, tanpa timer.
   ===================================================================== */
(function heroCutShow(){
  if (document.body.dataset.page !== 'home') return;
  const CUT = 'assets/img/cutout/';
  /* audit aset: semua SVG lokal cutout; 9 valid (transparan, tanpa mask/clip rusak).
     "bola basket.svg" dipakai sebagai pendukung kecil (.cut-ball) di beberapa komposisi. */
  const FILES = ['fuzisal.svg','mandy.svg','dw nai.svg','vina.svg','yuiii.svg','grup dina.svg','yuki.svg','zia.svg','grup lastri.svg','bola basket.svg'];
  const BALL = 'bola basket.svg';
  const box = document.getElementById('heroCutShow');
  if (!box || box.dataset.cutBound) return;
  box.dataset.cutBound = '1';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Prompt 50: rotasi satu-per-satu — setiap komposisi punya durasi tampil
     BERBEDA (2.6s-6.4s), bukan interval identik. Bola basket (Prompt 48)
     muncul lebih sering: slot kecil .cut-ball di 5 dari 7 komposisi,
     posisi bergantian (kanan/kiri) tanpa mendominasi frame. */
  const COMPOS = [
    { d: 4200, main:'fuzisal.svg',   s1:['mandy.svg','cut-slot-b'],       ball:['cut-slot-a'] },
    { d: 2600, main:'mandy.svg',     s1:['yuiii.svg','cut-slot-c'],       ball:null },
    { d: 6400, main:'grup dina.svg', s1:['zia.svg','cut-slot-e'],         ball:['cut-slot-f'] },
    { d: 3000, main:'vina.svg',      s1:['yuki.svg','cut-slot-g'],        ball:null },
    { d: 5200, main:'dw nai.svg',    s1:['grup lastri.svg','cut-slot-d'], ball:['cut-slot-e'] },
    { d: 2400, main:'yuiii.svg',     s1:['zia.svg','cut-slot-h'],         ball:['cut-slot-c'] },
    { d: 5800, main:'yuki.svg',      s1:['mandy.svg','cut-slot-a'],       ball:['cut-slot-g'] }
  ];
  /* preload semua aset sekali — tidak ada reload per pergantian */
  const cache = {};
  FILES.forEach(f => { const i = new Image(); i.src = CUT + encodeURIComponent(f); i.decoding = 'async'; cache[f] = i; });

  let idx = 0, timer = 0, started = false;
  function render(ci){
    const c = COMPOS[ci % COMPOS.length];
    box.innerHTML = '';
    const put = (file, cls, extra) => {
      const img = cache[file];
      if (!img || !img.complete || !img.naturalWidth) return false;
      const node = img.cloneNode(false);
      node.className = 'hero-cut-img ' + cls + (extra ? ' ' + extra : '');
      node.alt = '';
      box.appendChild(node);
      return true;
    };
    /* gambar belum siap → pertahankan render sebelumnya (tanpa frame kosong) */
    const ready = put(c.main, 'cut-main');
    put(c.s1[0], 'cut-sup', c.s1[1]);
    if (c.ball) put(BALL, 'cut-ball', c.ball[0]);
    return ready;
  }
  function advance(){
    const next = (idx + 1) % COMPOS.length;
    const c = COMPOS[next];
    const need = [c.main, c.s1[0]].concat(c.ball ? [BALL] : []);
    const allReady = need.every(f => cache[f] && cache[f].complete && cache[f].naturalWidth);
    if (!allReady) { schedule(); return; }   /* pertahankan komposisi aktif */
    idx = next;
    render(idx);   /* CSS cutIn animation menangani fade ~700ms */
  }
  function schedule(){ clearTimeout(timer); timer = setTimeout(advance, COMPOS[idx].d); }
  const start = () => {
    if (started) return; started = true;
    render(0);
    if (!reduce) schedule();
  };
  if (cache[FILES[0]].complete) start();
  else { cache[FILES[0]].onload = start; cache[FILES[0]].onerror = () => box.remove(); }
  document.addEventListener('visibilitychange', () => {
    if (reduce || document.hidden) return;
    clearTimeout(timer);
    if (started) schedule();
  });
  window.addEventListener('pagehide', () => clearTimeout(timer));
})();
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

/* =====================================================================
   PROMPT 1-10 · CINEMATIC ENGINE — namespace .cine-, lifecycle-controlled
   All loops are IntersectionObserver-gated, rAF-driven, and cleaned up.
   Marquee/gallery never mutate DOM; position accumulates continuously so
   a pause/resume never causes a jump. Reduced-motion disables everything.
   ===================================================================== */
(function cineEngine(){
  if (document.body.dataset.page !== 'home') return;
  if (reduceMotion) return;                                  /* reduced motion: konten tetap tampil statis */

  const sec = sel => document.querySelector(sel);
  const cineGal = sec('.cine-gallery');
  const cineApp = sec('.cine-apparel') || sec('.cine-marquee');
  const cineRev = sec('.cine-reviews');

  /* ---------- SHARED STATE ---------- */
  const tracks = [];       /* {el, dir, speed, pos, half} — marquee + gallery rows */
  const vis   = new Map(); /* section element -> visible flag */
  let lastT = 0, rafId = 0;
  const clamp = (v,a,b)=>Math.min(b,Math.max(a,v));
  const dpr = () => clamp(window.devicePixelRatio || 1, 1, 2);
  /* Prompt 42/43: ukur ulang saat semua aset siap (font/gambar) */
  window.addEventListener('load', () => { cineEngine._measured = false; }, { once: true });

  function measureTrack(tr){
    const seq = tr.el.querySelector('.cine-g-seq, .cine-m-item');
    if (!seq) return;
    /* Prompt 42/43: ukur pitch penuh satu kelompok (lebar + gap antar-seq),
       bukan hanya scrollWidth — scrollWidth bisa meleset bila font belum
       siap / gambar belum render, dan itulah penyebab celah kosong di
       baris kedua & pada titik pergantian kelompok marquee. */
    let w = seq.getBoundingClientRect().width;
    const cs = getComputedStyle(seq);
    const sib = seq.nextElementSibling;
    if (sib) { /* gap antar-seq (flex gap) atau padding-right seq */
      const gap = parseFloat(getComputedStyle(tr.el).columnGap) || 0;
      w += gap + (parseFloat(cs.paddingRight) || 0);
    }
    if (w > 40) tr.half = w;                    /* jangan menurunkan half ke nilai sampah */
  }
  function makeTracks(){
    tracks.length = 0;
    document.querySelectorAll('.cine-g-track, .cine-m-track').forEach(el => {
      const tr = { el, dir: el.dataset.dir === 'rtl' ? -1 : 1, speed: Number(el.dataset.speed)||30, pos: 0, half: 0, paused:false };
      measureTrack(tr); tracks.push(tr);
    });
  }

  /* scroll velocity influences marquee subtly (clamped, never reverses) */
  let scrollBoost = 0;
  window.addEventListener('scroll', () => {
    scrollBoost = clamp(((window.scrollY - (cineEngine._lastY||window.scrollY))), -120, 120) * .06;
    cineEngine._lastY = window.scrollY;
  }, { passive: true });

  function tick(t){
    rafId = 0;
    const dt = lastT ? clamp((t - lastT)/1000, 0, .05) : .016;  /* clamp tab-jumps */
    lastT = t;
    let any = false;
    tracks.forEach(tr => {
      if (!tr.half) measureTrack(tr);
      if (!tr.half || tr.paused) return;
      /* Prompt 42/43: re-measure ketika viewport/font berubah — half yang
         basi membuat wrap melompat atau menyisakan celah kosong */
      /* re-measure sekali setelah window 'load' (font & gambar siap) dan
         saat lebar viewport berubah — half basi membuat wrap menyisakan celah */
      if (!cineEngine._measured || tr._remW !== window.innerWidth) {
        tr._remW = window.innerWidth; measureTrack(tr);
      }
      if (!(vis.get(tr.section))) return;                    /* hanya saat section terlihat */
      any = true;
      /* pos selalu naik (akumulator unsigned) — tanda arah hanya di transform,
         sehingga wrap modulo tetap seamless untuk kedua arah */
      tr.pos += (tr.speed * dt) * (tr.speedMul || 1) * (1 + Math.abs(scrollBoost) * (tr.isMarquee ? .5 : .15));
      /* wrap around half-width → seamless, tanpa lompatan */
      tr.pos = ((tr.pos % tr.half) + tr.half) % tr.half;
      /* dir=1 (ltr) → bergerak ke kanan (+x); dir=-1 (rtl) → bergerak ke kiri (-x) */
      tr.el.style.transform = 'translate3d(' + (tr.pos * tr.dir).toFixed(2) + 'px,0,0)';
    });
    scrollBoost *= .9;
    if (any) rafId = requestAnimationFrame(tick);
  }
  function wake(){
    if (rafId || reduceMotion) return;
    lastT = 0;
    rafId = requestAnimationFrame(tick);
  }

  function trackSections(){
    tracks.forEach(tr => {
      tr.section = tr.el.closest('.cine-gallery, .cine-marquee, .cine-apparel');
      tr.isMarquee = !!tr.el.closest('.cine-marquee, .cine-apparel');
      tr.el.parentElement.style.overflow = 'hidden';         /* cegah horizontal overflow */
    });
  }

  /* ---------- IntersectionObserver: jalankan hanya saat terlihat ---------- */
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver(entries => {
    entries.forEach(en => {
      vis.set(en.target, en.isIntersecting);
      if (en.isIntersecting) {
        tracks.forEach(tr => tr.paused = false);
        wake();
      } else if ([...vis.values()].every(v => !v)) {
        if (rafId) cancelAnimationFrame(rafId);              /* cleanup rAF saat tak ada yg terlihat */
        rafId = 0;
      }
    });
  }, { rootMargin: '80px' }) : null;

  function bindIO(){
    if (!io) return;
    [cineGal, cineApp, cineRev].forEach(el => { if (el) io.observe(el); });
  }

  /* ================================================================
     PROMPT 7 · CINEMATIC FADE BG + FLOATING REVIEWS
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

    /* review cards: hanya dirender jika ada data asli — tanpa placeholder palsu */
    let cards = [];
    if (valid.length && cardsBox) {
      cardsBox.innerHTML = valid.map((r,i) =>
        `<figure class="cine-rcard ${POSITIONS[i % POSITIONS.length]}"><blockquote>${r.text}</blockquote><figcaption>${r.name}</figcaption></figure>`
      ).join('');
      cards = [...cardsBox.children];
      cards[0]?.classList.add('show');
    } else if (cardsBox) {
      cardsBox.remove();                                       /* tanpa review asli: sembunyikan, headline+bg tetap */
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
      const alive = slides.filter(s => !s.classList.contains('cine-bg-dead'));
      if (!alive.length) return;                               /* semua foto gagal: diamkan, tak crash */
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
      revTimer = setTimeout(advance, revPaused ? 0 : 6000);    /* 6s per foto, crossfade 1.2s di CSS */
    }



    schedule();
  }

  /* ================================================================
     REVEAL: blur-to-focus typography + image clip reveal (IO satu kali)
     ================================================================ */
  const rio = ('IntersectionObserver' in window) ? new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('cine-in'); rio.unobserve(en.target); } });
  }, { threshold: .18 }) : null;
  function bindReveal(){
    document.querySelectorAll('.cine-g-head,.cine-rheadline,.cine-rsub,.cine-m-sub,.comm-cards .section-heading,.story-ed .eyebrow').forEach(el => {
      el.classList.add('cine-focus');
      rio ? rio.observe(el) : el.classList.add('cine-in');
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
     PROMPT 56 · GALLERY INTERAKSI — drag/swipe + image preview lightbox
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
        if (e.button !== undefined && e.button !== 0) return;
        dragging = true; moved = false;
        startX = (e.touches ? e.touches[0].clientX : e.clientX);
        const tr = tracks.find(t => t.el === track);
        startPos = tr ? tr.pos : 0;
        track.classList.add('dragging');
      };
      const move = e => {
        if (!dragging) return;
        const x = (e.touches ? e.touches[0].clientX : e.clientX);
        const dx = x - startX;
        if (Math.abs(dx) > 6) moved = true;
        const tr = tracks.find(t => t.el === track);
        if (tr && tr.half) {
          tr.pos = ((startPos - dx * tr.dir) % tr.half + tr.half) % tr.half;
          tr.el.style.transform = 'translate3d(' + (tr.pos * tr.dir).toFixed(2) + 'px,0,0)';
        }
        if (e.cancelable && e.type === 'touchmove' && moved) e.preventDefault();
      };
      const up = () => {
        if (!dragging) return;
        dragging = false;
        track.classList.remove('dragging');
        /* auto-motion continues naturally on next rAF — pos already synced */
      };
      track.addEventListener('mousedown', down);
      window.addEventListener('mousemove', move, { passive: true });
      window.addEventListener('mouseup', up, { passive: true });
      track.addEventListener('touchstart', down, { passive: true });
      track.addEventListener('touchmove', move, { passive: false });
      track.addEventListener('touchend', up, { passive: true });
      /* klik foto — buka preview (kecuali itu adalah drag) */
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
    if (!img || !img.src) return;
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
        if (!lbEl || !lbEl.classList.contains('open')) return;
        if (e.key === 'Escape') closeCineLightbox();
        if (e.key === 'ArrowLeft') stepCineLightbox(-1);
        if (e.key === 'ArrowRight') stepCineLightbox(1);
      });
    }
    const imgs = [...document.querySelectorAll('.cine-g-card img')].filter(i => i.src && !i.closest('.cine-g-dead'));
    lbEl.dataset.current = String(imgs.indexOf(img));
    showCineImage(imgs, Number(lbEl.dataset.current));
    lbEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function cineImgs(){
    return [...document.querySelectorAll('.cine-g-card img')].filter(i => i.src && !i.closest('.cine-g-dead'));
  }
  function showCineImage(list, idx){
    if (!lbEl || !list.length) return;
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
    makeTracks(); trackSections(); bindIO(); bindReveal(); startRevolving(); bindDragAndPreview();
    /* hover memperlambat marquee di desktop */
    if (window.matchMedia('(pointer: fine)').matches) {
      const mq = sec('.cine-marquee');
      mq?.addEventListener('mouseenter', () => tracks.forEach(tr => { if (tr.isMarquee) tr.speedMul = .25; }), { passive: true });
      mq?.addEventListener('mouseleave', () => tracks.forEach(tr => { if (tr.isMarquee) tr.speedMul = 1; }), { passive: true });
    }
    wake();
  }
  /* saat re-render bahasa, DOM baru: reset bound-state lalu init ulang */
  window.__cineReset = () => {
    if (rafId) cancelAnimationFrame(rafId); rafId = 0;
    clearTimeout(revTimer); vis.clear();
    document.querySelectorAll('[data-cine-bound],[data-drag-bound]').forEach(el => { delete el.dataset.cineBound; delete el.dataset.dragBound; });
    if (lbEl) { lbEl.remove(); lbEl = null; }               /* re-render bahasa: lightbox ikut di-render ulang */
    init();
  };
  init();
})();
