/* Public API: read-only JSONP (api=gallery). Foto yang tampil hanya yang
   sudah lolos filter publikasi di sisi Apps Script:
   permission_status=Granted, status=Approved, processing_status=COPIED,
   archive_file_id terisi, publish_status=Published.
   Gallery upgrade: grid 4/3/2 kolom, filter komunitas + caption + fotografer,
   pagination 12/24, download foto arsip, lightbox caption + download. */
const GALLERY_API='https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
let galleryPhotos=[],galleryState='loading',lightboxIndex=-1;
let jsonpRequest=null;
let jsonpToken=0;                       /* anti stale-response: token tiap request */
/* filter & pagination state */
let galleryCommunityFilter='All';
let gallerySearch='',gallerySearchRaw='';
let galleryPhotographer='';           /* '' = Semua Fotografer */
let galleryPage=1,galleryPerPage=12;
let galleryFiltered=[];               /* hasil filter aktif (tanpa pagination) */

function tobaGalleryCallback(res){
  if(jsonpRequest){clearTimeout(jsonpRequest.timeout);jsonpRequest.script.remove();jsonpRequest=null;}
  try{
    if(!res||res.success===false||!Array.isArray(res.photos))throw new Error('Respons API Gallery tidak valid');
    const mapped=res.photos
      .map(p=>({
        id:String(p.photoId||p.photo_id||p.id||Math.random().toString(36).slice(2)),
        community:p.community||'',
        title:p.title||'',
        caption:p.caption||'',
        photographer:p.photographer||p.photographerName||'',
        photographerId:p.photographerId||p.photographer_id||'',
        order:Number(p.displayOrder||p.display_order||0),
        /* arsip = kualitas terbaik (COPIED), bukan source */
        archiveId:p.archiveFileId||p.archive_file_id||'',
        url:(p.imageUrl||(
          (p.archiveFileId||p.archive_file_id)
            ? 'https://drive.google.com/thumbnail?id='+encodeURIComponent(p.archiveFileId||p.archive_file_id)+'&sz=w800'
            : ''
        )).replace(/=w\d+/i, '=w800')
      }))
      .filter(p=>p.url)
      .sort((a,b)=>a.order-b.order);
    /* MASTER COLLECTION disimpan penuh — filter komunitas adalah view di
       atasnya, sehingga tab Semua tidak pernah kehilangan foto. */
    console.log('TOBA GALLERY CB', mapped.length, res.photos.length);
    galleryPhotos=mapped;
    galleryState='ok';
  }catch(error){
    console.error('TOBA Gallery API error:',error);
    galleryState='error';
  }
  if(document.body.dataset.page==='gallery'){renderGalleryUI();renderGalleryHero();}
}
window.tobaGalleryCallback=tobaGalleryCallback;window.galleryFetchFail=galleryFetchFail;window.loadGallery=loadGallery;
let tokenPending=0;
function galleryFetchFail(){
  if(jsonpRequest){clearTimeout(jsonpRequest.timeout);jsonpRequest.script.remove();jsonpRequest=null;}
  galleryState='error';
  if(document.body.dataset.page==='gallery')renderGalleryUI();
}
function loadGallery(){
  galleryState='loading';renderGalleryUI();
  const old=document.getElementById('tobaGalleryJsonp');if(old)old.remove();
  const script=document.createElement('script');script.id='tobaGalleryJsonp';
  /* SELALU ambil SEMUA komunitas: master collection lengkap; filter komunitas
     dilakukan lokal supaya tab Semua tidak pernah kehilangan foto. */
  const url=GALLERY_API+'?api=gallery&community=&callback=tobaGalleryCallback';
  script.src=url;script.onerror=galleryFetchFail;
  jsonpRequest={script,timeout:setTimeout(galleryFetchFail,15000)};
  document.body.appendChild(script);
}

/* ---------- filter pipeline ---------- */
function filteredPhotos(){
  const q=gallerySearch.trim().toLowerCase();
  const out=galleryPhotos.filter(p=>{           /* SELALU dari master collection */
    if(galleryCommunityFilter!=='All'&&String(p.community||'').toLowerCase()!==galleryCommunityFilter.toLowerCase())return false;
    if(galleryPhotographer&&(p.photographer||'')!==galleryPhotographer)return false;
    if(q){
      const cap=(p.caption||'').toLowerCase();
      const tit=(p.title||'').toLowerCase();
      if(!cap.includes(q)&&!tit.includes(q))return false;
    }
    return true;
  });
  return out;
}
function photographerOptions(){
  const seen=new Set();
  galleryPhotos.forEach(p=>{if(p.photographer)seen.add(p.photographer);});
  return [...seen].sort((a,b)=>a.localeCompare(b));
}
function syncPhotographerDropdown(){
  const sel=document.getElementById('galleryPhotographer');
  if(!sel)return;
  const opts=photographerOptions();
  sel.innerHTML=`<option value="">${t('gallery.ph.all')}</option>`+
    opts.map(n=>`<option value="${n.replace(/"/g,'&quot;')}">${n}</option>`).join('');
  if(galleryPhotographer&&!opts.includes(galleryPhotographer)){galleryPhotographer='';}
  sel.value=galleryPhotographer;
}

/* ---------- card ---------- */
function galleryAlt(p){return (p.caption||p.title)+' — '+(p.photographer?('by '+p.photographer+', '):'')+t('gallery.alt');}
function downloadName(p){
  const comm=(p.community||'TOBA').replace(/[^A-Za-z]+/g,'');
  const n=String(p.order||0).padStart(3,'0');
  return `TOBA-${comm||'Community'}-${n}.jpg`;
}
function galleryCard(p,i){
  return `<article class="gallery-item api-photo img-reveal" data-category="${p.community}" data-index="${i}" tabindex="0" role="button" aria-label="${galleryAlt(p)}">
    <img src="${p.url}" alt="${galleryAlt(p)}" loading="lazy" data-api-photo>
    <button class="gallery-dl" type="button" data-dl="${i}" aria-label="Download photo" title="Download">${DL_ICON}</button>
    ${(p.caption||p.title)?`<div class="pad">${p.caption||p.title}</div>`:''}
  </article>`;
}
/* ---------- card & grid binding ---------- */
const DL_ICON='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></svg>';

/* reveal-on-scroll + tilt + lightbox + download — sekali bind per render */
let galleryRevealIO=null;
function bindGalleryGrid(grid){
  grid.querySelectorAll('img[data-api-photo]').forEach(img=>{
    /* decoding async + partial loading: foto yang gagal → fallback per item,
       foto lain tetap tampil (jangan kosongkan grid) */
    img.decoding='async';
    img.addEventListener('error',()=>{img.closest('.gallery-item').classList.add('img-failed');img.replaceWith(Object.assign(document.createElement('div'),{className:'gallery-fallback',textContent:'✳'}))});
    /* FIX loading bug: pastikan reveal clip-path terbuka saat foto selesai dimuat —
       mengatasi race IO threshold vs layout (foto "hilang" sampai refresh) */
    if(img.complete&&img.naturalWidth>0)img.closest('.gallery-item').classList.add('in');
    else img.addEventListener('load',()=>{img.closest('.gallery-item')?.classList.add('in');},{once:true});
  });
  /* image reveal on scroll */
  if(!galleryRevealIO){
    galleryRevealIO=('IntersectionObserver' in window)?new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');galleryRevealIO.unobserve(en.target)}})},{threshold:.01,rootMargin:'120px 0px'}):null;
  }
  grid.querySelectorAll('.gallery-item').forEach(el=>{
    if(!galleryRevealIO)el.classList.add('in');
    else if(el.getBoundingClientRect().top<window.innerHeight)el.classList.add('in');
    else galleryRevealIO.observe(el);
  });
  /* subtle 3D tilt (pointer-fine, motion-safe) */
  const REDUCE=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE=window.matchMedia('(pointer: fine)').matches;
  grid.querySelectorAll('.gallery-item').forEach(card=>{
    card.addEventListener('click',e=>{if(e.target.closest('.gallery-dl'))return;openLightbox(Number(card.dataset.index),galleryFiltered);});
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(Number(card.dataset.index),galleryFiltered)}});
    if(FINE&&!REDUCE){
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.setProperty('--gx',(x*100)+'%');
        card.style.setProperty('--gy',(y*100)+'%');
        card.style.transform=`perspective(700px) rotateY(${x*4}deg) rotateX(${-y*4}deg)`;
      });
      card.addEventListener('pointerleave',()=>{card.style.transform='';});
    }
  });
  grid.querySelectorAll('.gallery-dl').forEach(btn=>{
    btn.addEventListener('click',e=>{e.stopPropagation();downloadPhoto(Number(btn.dataset.dl));});
  });
}

/* ---------- hero featured photos + featured editorial section ---------- */
let heroPhotosBound=false;
/* Five Interactive Glass Highlight Panels — kategori: nama saja, tanpa nomor.
 Foto dari kategori terkait di master collection (API asli); kategori tanpa
 foto memakai fallback foto lokal TOBA yang relevan — tidak ada metadata palsu. */
const HL_CATS=[
 {key:'fun', label:['Weekly Fun Game'], comms:['all'], fallback:'assets/img/web/toba-015.jpg'},
 {key:'deli', label:['Tobadeli'], comms:['tobadeli'], fallback:'assets/img/web/toba-060.jpg'},
 {key:'ladies',label:['Tobaladies'], comms:['tobaladies'], fallback:'assets/img/web/toba-052.jpg'},
 {key:'events',label:['Events'], comms:['all'], fallback:'assets/img/web/toba-026.jpg'},
 {key:'community',label:['Community'], comms:['all'], fallback:'assets/img/web/toba-047.jpg'} /* toba-045 diganti: terrotasi 90° (Prompt 19) */
];
let hlActive=-1; /* default: belum ada foto aktif — semua grayscale */
let hlBound=false;
let hlInteracted=false; /* Prompt 16: sinkronisasi snap hanya setelah interaksi nyata */
function hlPickPhoto(cat,used){
  /* 1) foto asli dari kategori terkait (urutan arsip), 2) foto lain yang belum terpakai,
     3) fallback lokal yang valid — dipilih sekali, tidak diacak tiap render. */
  const cands=cat.comms.map(c=>c==='all'?galleryPhotos:galleryPhotos.filter(p=>String(p.community||'').toLowerCase()===c)).flat();
  /* foto utama kategori = yang belum terpakai; jika habis, ambil foto unik lain
  dari master collection (anti duplikat), baru fallback lokal. */
  let pick=cands.find(p=>!used.has(p.id)) || galleryPhotos.find(p=>!used.has(p.id));
  const url=pick?pick.url:cat.fallback;
  if(pick)used.add(pick.id);
  return {url,isApi:!!pick,alt:pick?galleryAlt(pick):('TOBA '+cat.label[0])};
}
function renderGalleryHero(){
  const carousel=document.getElementById('hlCarousel');
  const box=document.getElementById('galleryHeroPhotos');
  if(box&&!box.dataset.dead){box.dataset.dead='1';box.remove();} /* strip lama (legacy) tidak dipakai lagi */
  if(!carousel||hlBound)return;
  if(galleryState!=='ok'||!galleryPhotos.length)return; /* tunggu data */
  const used=new Set();
  const panels=HL_CATS.map((cat,i)=>{
    const ph=hlPickPhoto(cat,used);
    return `<figure class="hl-panel" data-cat="${cat.key}" data-idx="${i}" role="option" tabindex="0" aria-selected="false" aria-label="${cat.label[0]}" style="--panel-accent:${HL_ACCENTS[i]||'#E8722A'}">
      <img src="${ph.url}" alt="${ph.alt}" loading="lazy" ${ph.isApi?'data-api-photo':''}>
      <figcaption class="hl-label"><span>${cat.label[0]}</span></figcaption>
    </figure>`;
  }).join('');
  carousel.innerHTML=`<div class="hl-track">${panels}</div>`;
  /* fallback tampil jika foto gagal dimuat */
  carousel.querySelectorAll('.hl-panel img').forEach(img=>{
    img.addEventListener('error',()=>{const p=img.closest('.hl-panel');const cat=HL_CATS[Number(p.dataset.idx)];if(cat&&!img.dataset.fbdone){img.dataset.fbdone='1';img.src=cat.fallback;}});
  });
  bindHlPanels();
  initHlMobile();
  carousel.classList.add('ready');
  hlBound=true;
  renderGalleryFeatured();
}
function hlSetActive(i){
  /* GALLAX-style: TANPA sliding/swapping — hanya status warna yang berpindah.
     Panel aktif tetap full color walau mouse sudah keluar; posisi/ukuran/urutan
     kelima panel TIDAK PERNAH berubah. */
  const carousel=document.getElementById('hlCarousel');
  if(!carousel)return;
  hlActive=((i % HL_CATS.length) + HL_CATS.length) % HL_CATS.length;
  carousel.querySelectorAll('.hl-panel').forEach(el=>{
    const on=Number(el.dataset.idx)===hlActive;
    el.classList.toggle('active',on);
    el.setAttribute('aria-selected',String(on));
  });
}
function hlClear(){
  const carousel=document.getElementById('hlCarousel');
  if(!carousel)return;
  hlActive=-1;
  carousel.querySelectorAll('.hl-panel').forEach(el=>{el.classList.remove('active');el.setAttribute('aria-selected','false');});
}
function bindHlPanels(){
  const carousel=document.getElementById('hlCarousel');
  if(!carousel)return;
  const FINE=window.matchMedia('(pointer: fine)').matches;
  carousel.querySelectorAll('.hl-panel').forEach(el=>{
    const i=Number(el.dataset.idx);
    if(FINE){
      /* Desktop (Prompt 25): HOVER = satu-satunya pemicu aktivasi foto.
         Klik TIDAK berfungsi apa pun — tidak navigasi, tidak ubah state,
         tidak scroll (foto murni visual + pemicu hover). */
      el.addEventListener('mouseenter',()=>{hlSetActive(i);heroStart(i);});
      el.addEventListener('click',e=>e.preventDefault());
    }
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();hlSetActive(i);heroStart(i);}});
  });
  if(FINE){
    /* kursor keluar dari seluruh showcase → semua foto grayscale;
       sisa liquid terakhir tetap mengalir sampai habis (Prompt 7) */
    carousel.addEventListener('mouseleave',()=>{hlClear();heroStop();});
  }
}
/* ---------- interaksi warna headline hero gallery ----------
  Prompt 12-18: mapping warna pemicu liquid per panel (TOBA tokens):
  1. Weekly Fun Game → TOBA Orange
  2. Tobadeli        → TOBA Dark Green
  3. Tobaladies      → TOBA Pink
  4. Events          → TOBA Dark Green
  5. Community       → TOBA Orange */

/* TOBA LIQUID COLOR PALETTE */
const HL_ACCENTS = [
  '#E8722A', // Weekly Fun Game - Orange
  '#315A3B', // Tobadeli - Dark Green
  '#D64D78', // Tobaladies - Pink
  '#8064A8', // Events - Purple
  '#D64D78'  // Community - Pink
];

let heroFlow = null;
let heroFlowIdx = -1;


function heroStart(i) {
  if (REDUCE_MQ.matches) return;

  const el = document.getElementById('galleryHeroTitle');
  if (!el) return;

  const span = el.querySelector('.gh-accent');
  if (!span) return;

  const color = HL_ACCENTS[i] || '#E8722A';

  // Jika animasi sudah berjalan, cukup ganti warna.
  // Jangan hapus atau buat ulang elemen karena posisi animasi harus tetap.
  if (heroFlow && heroFlow.isConnected) {
    heroFlow.style.setProperty('--flow-color', color);
    heroFlowIdx = i;
    return;
  }

  // Buat animasi hanya jika belum ada.
  const flow = document.createElement('span');
  flow.className = 'gh-flow';
  flow.setAttribute('aria-hidden', 'true');
  flow.textContent = span.textContent;

  flow.style.setProperty('--flow-color', color);
  flow.style.left = span.offsetLeft + 'px';
  flow.style.top = span.offsetTop + 'px';
  flow.style.width = span.offsetWidth + 'px';
  flow.style.height = span.offsetHeight + 'px';
  flow.style.font = getComputedStyle(span).font;

  el.appendChild(flow);

  heroFlow = flow;
  heroFlowIdx = i;
}

function heroStop() {
  if (!heroFlow || !heroFlow.isConnected) {
    heroFlow = null;
    heroFlowIdx = -1;
    return;
  }

  const flow = heroFlow;

  // Hentikan aliran baru, biarkan aliran terakhir turun.
  flow.classList.add('gh-flow-drain');

  flow.addEventListener('animationend', () => {
    flow.remove();
  }, { once: true });

  heroFlow = null;
  heroFlowIdx = -1;
}

const REDUCE_MQ=window.matchMedia('(prefers-reduced-motion: reduce)');
/* openHlCollection dihapus (Prompt 25): klik panel tidak lagi navigasi
   atau mengubah state — panel murni visual + pemicu hover. */
function openHlCollection_unused(i){
  const FINE=window.matchMedia('(pointer: fine)').matches;
  if(!FINE)return; /* mobile: tap hanya menjalankan interaksi panel — tanpa navigasi/scroll */
  const cat=HL_CATS[i];if(!cat)return;
  const target=document.getElementById('galleryFilters');
  if(!target){return;}
  /* label filter: Semua/All untuk fun/events/community; Tobaladies/Tobadeli untuk kategorinya.
     Panel yang berkategori 'all' memfilter ke tab Semua (koleksi master lengkap). */
  const want=cat.key==='deli'?'Tobadeli':(cat.key==='ladies'?'Tobaladies':'All');
  let btn=null;
  document.querySelectorAll('#galleryFilters [data-filter]').forEach(b=>{
    const k=(b.dataset.filter||'').toLowerCase();
    if((want==='All'&&(k==='all'||k==='semua'))||want.toLowerCase()===k)btn=b;
  });
  if(btn){btn.click();}
  /* scroll halus ke koleksi foto */
  const grid=document.getElementById('galleryGrid')||target;
  if(grid)grid.scrollIntoView({behavior:REDUCE_MQ.matches?'auto':'smooth',block:'start'});
}
/* featured section: komposisi asimetris dari foto asli terpilih */
let featuredBound=false;
function renderGalleryFeatured(){
  const sec=document.getElementById('galleryFeatured'),grid=document.getElementById('gfGrid');
  if(!sec||!grid||featuredBound)return;
  if(galleryState!=='ok'||galleryPhotos.length<4)return;
  const REDUCE=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE=window.matchMedia('(pointer: fine)').matches;
  const picks=galleryPhotos.slice(0,5);
  grid.innerHTML=picks.map((p,i)=>`
    <figure class="gf-shot gf-${i+1}${i===0?' gf-lead':''}" data-idx="${galleryPhotos.indexOf(p)}" tabindex="0" role="button" aria-label="${galleryAlt(p)}">
      <img src="${p.url}" alt="${galleryAlt(p)}" loading="lazy">
      <figcaption><span class="gf-cap">${(p.caption||p.title||'').replace(/</g,'&lt;')}</span>${p.photographer?`<span class="gf-ph">© ${p.photographer.replace(/</g,'&lt;')}</span>`:''}</figcaption>
    </figure>`).join('');
  sec.hidden=false;
  requestAnimationFrame(()=>sec.classList.add('in'));
  grid.querySelectorAll('.gf-shot').forEach(el=>{
    const idx=Number(el.dataset.idx);
    el.addEventListener('click',()=>openLightbox(idx,galleryPhotos));
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(idx,galleryPhotos)}});
    if(FINE&&!REDUCE){
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*3}deg) rotateX(${-y*3}deg)`;});
      el.addEventListener('pointerleave',()=>{el.style.transform='';});
    }
  });
  featuredBound=true;
}

/* download via fetch blob — nama file rapi, kualitas arsip terbaik */


function downloadPhoto(idx){
  const p=(lightboxList&&lightboxIndex>=0?lightboxList:galleryFiltered)[idx];
  if(!p)return;

  const imageUrl=String(p.url||'');
  const match=imageUrl.match(/[?&]id=([^&]+)/);
  const fileId=p.archiveId||(match?match[1]:'');

  if(!fileId){
    console.error('Data foto:',p);
    if(typeof toast==='function')toast('File arsip foto tidak ditemukan.');else alert('File arsip foto tidak ditemukan.');
    return;
  }
  /* Preferensi: unduh asli arsip; kalau diblokir browser, tab fallback
     tetap membuka foto arsip kualitas penuh (bukan thumbnail). */
  const directUrl='https://drive.google.com/uc?export=download&id='+encodeURIComponent(fileId);
  const fallbackUrl='https://drive.google.com/file/d/'+encodeURIComponent(fileId)+'/view';
  let opened=false;
  try{
    const w=window.open(directUrl,'_blank','noopener');
    opened=!!w;
  }catch(err){opened=false;}
  if(!opened){
    /* fallback jujur: buka halaman foto arsip, bukan klaim "sudah terunduh" */
    window.open(fallbackUrl,'_blank','noopener');
  }
}



/* ---------- render ---------- */
function pageSlice(){
  const start=(galleryPage-1)*galleryPerPage;
  return galleryFiltered.slice(start,start+galleryPerPage);
}
function renderGalleryUI(){
  const grid=document.getElementById('galleryGrid');if(!grid)return;
  const statusBox=document.getElementById('galleryStatus');
  const countBox=document.getElementById('galleryCount');
  const pager=document.getElementById('galleryPager');
  const pagerInfo=document.getElementById('galleryPageInfo');
  const prevBtn=document.getElementById('galleryPrev');
  const nextBtn=document.getElementById('galleryNext');
  const jump=document.getElementById('galleryJump');
  const searching=gallerySearch.trim().length>0;

  if(galleryState==='loading'){
    if(statusBox)statusBox.innerHTML=`<div class="gallery-state"><span class="gallery-spinner" aria-hidden="true"></span><p>${t('gallery.loading')}</p></div>`;
    grid.innerHTML='';
    if(pager)pager.hidden=true;
    if(countBox)countBox.textContent='';
    return;
  }
  if(galleryState==='error'){
    if(statusBox)statusBox.innerHTML=`<div class="gallery-state error"><p><strong>${t('gallery.error')}</strong></p><p>${t('gallery.error.sub')}</p><button class="pill" id="galleryRetry">${t('gallery.retry')}</button><p class="gallery-notice">${t('gallery.demo.note')}</p></div>`;
    grid.innerHTML='';
    if(pager)pager.hidden=true;
    if(countBox)countBox.textContent='';
    document.getElementById('galleryRetry')?.addEventListener('click',loadGallery);
    return;
  }
  if(statusBox)statusBox.innerHTML='';
  syncPhotographerDropdown();
  galleryFiltered=filteredPhotos();
  const totalPages=Math.max(1,Math.ceil(galleryFiltered.length/galleryPerPage));
  if(galleryPage>totalPages)galleryPage=totalPages;
  const slice=pageSlice();

  if(countBox){
    if(!galleryFiltered.length){countBox.textContent='';}
    else{
      const from=(galleryPage-1)*galleryPerPage+1;
      const to=Math.min(galleryPage*galleryPerPage,galleryFiltered.length);
      countBox.textContent=t('gallery.count').replace('{from}',from).replace('{to}',to).replace('{total}',galleryFiltered.length);
    }
  }

  if(!galleryFiltered.length){
    if(statusBox){
      statusBox.innerHTML=searching
        ? `<div class="gallery-state"><p><strong>${t('gallery.noMatch')}</strong></p><p>${t('gallery.noMatch.sub')}</p><button class="pill" id="galleryClearSearch">${t('gallery.clearSearch')}</button></div>`
        : `<div class="gallery-state"><p><strong>${t('gallery.empty')}</strong></p><p>${t('gallery.empty.sub')}</p></div>`;
    }
    grid.innerHTML='';
    if(pager)pager.hidden=true;
    document.getElementById('galleryClearSearch')?.addEventListener('click',()=>{
      gallerySearch='';gallerySearchRaw='';galleryPage=1;
      const inp=document.getElementById('gallerySearch');if(inp)inp.value='';
      renderGalleryUI();
    });
    return;
  }

  const base=(galleryPage-1)*galleryPerPage;
  grid.innerHTML=slice.map((p,i)=>galleryCard(p,base+i)).join('');
  bindGalleryGrid(grid);
  /* safety net anti-foto-hilang: item yang jatuh di viewport pertama
     langsung di-reveal — tidak bergantung IO/timing sama sekali */
  requestAnimationFrame(()=>{
    grid.querySelectorAll('.gallery-item:not(.in)').forEach(el=>{
      if(el.getBoundingClientRect().top<window.innerHeight*1.2)el.classList.add('in');
    });
  });

  /* pager */
  if(pager){
    pager.hidden=totalPages<=1&&galleryPerPage>=galleryFiltered.length;
    if(pagerInfo)pagerInfo.innerHTML=`<span class="gallery-page-active">${galleryPage}</span> / ${totalPages}`;
    if(prevBtn)prevBtn.disabled=galleryPage<=1;
    if(nextBtn)nextBtn.disabled=galleryPage>=totalPages;
    if(jump){
      const cur=Number(jump.value)||galleryPage;
      jump.innerHTML=Array.from({length:totalPages},(_,i)=>`<option value="${i+1}"${i+1===galleryPage?' selected':''}>${i+1}</option>`).join('');
      jump.value=String(galleryPage);
      if(jump.options.length!==totalPages)jump.value=String(galleryPage); /* keep valid */
      if(cur>totalPages)jump.value=String(totalPages);
    }
  }
}
function galleryGoPage(n){
  galleryPage=Math.max(1,n);
  renderGalleryUI();
  document.getElementById('galleryGrid')?.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ---------- immersive lightbox ---------- */
let lightboxList=null;
function openLightbox(i,list){
  lightboxList=list||galleryFiltered;
  if(!lightboxList.length)return;
  lightboxIndex=i;showLightboxImage();
  let lb=document.getElementById('tobaLightbox');
  if(!lb){
    lb=document.createElement('div');lb.id='tobaLightbox';lb.className='lightbox';
    lb.innerHTML=`<button class="lightbox-x" id="lbClose" aria-label="Close">✕</button>
      <button class="lightbox-nav lb-prev" id="lbPrev" aria-label="Previous">←</button>
      <img src="" alt="">
      <button class="lightbox-nav lb-next" id="lbNext" aria-label="Next">→</button>
      <button class="lightbox-dl" id="lbDownload" aria-label="Download photo">${DL_ICON}</button>
      <div class="lightbox-cap"></div>`;
    document.body.appendChild(lb);
    lb.querySelector('#lbClose').addEventListener('click',closeLightbox);
    lb.querySelector('#lbPrev').addEventListener('click',()=>stepLightbox(-1));
    lb.querySelector('#lbNext').addEventListener('click',()=>stepLightbox(1));
    lb.querySelector('#lbDownload').addEventListener('click',()=>downloadPhoto(lightboxIndex));
    lb.addEventListener('click',e=>{if(e.target===lb)closeLightbox()});
    /* touch swipe navigation */
    let tsx=0,tsy=0;
    lb.addEventListener('touchstart',e=>{tsx=e.touches[0].clientX;tsy=e.touches[0].clientY},{passive:true});
    lb.addEventListener('touchmove',e=>{
      const dx=e.touches[0].clientX-tsx;
      lb.classList.add(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(e.touches[0].clientY-tsy)?(dx<0?'swipe-next':'swipe-prev'):'swipe-reset');
    },{passive:true});
    lb.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].clientX-tsx,dy=e.changedTouches[0].clientY-tsy;
      lb.classList.remove('swipe-next','swipe-prev','swipe-reset');
      if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)){dx<0?stepLightbox(1):stepLightbox(-1);}
    },{passive:true});
    document.addEventListener('keydown',e=>{
      if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')closeLightbox();
      if(e.key==='ArrowLeft')stepLightbox(-1);
      if(e.key==='ArrowRight')stepLightbox(1);
    });
  }
  lb.classList.add('open');document.documentElement.style.overflow='hidden';
}
function showLightboxImage(){
  const lb=document.getElementById('tobaLightbox'),list=lightboxList||galleryFiltered;
  if(!lb||lightboxIndex<0||lightboxIndex>=list.length)return;
  const p=list[lightboxIndex];
  const img=lb.querySelector('img');
  img.style.opacity='0';img.style.transform='scale(.985)';
  img.onload=()=>{img.style.opacity='1';img.style.transform='none'};
  img.src=p.url;
  img.alt=galleryAlt(p);
  lb.querySelector('.lightbox-cap').textContent=[p.caption||p.title,p.community,p.photographer?('© '+p.photographer):''].filter(Boolean).join(' — ');
}
function stepLightbox(d){
  const n=(lightboxList||galleryFiltered).length;if(!n)return;
  lightboxIndex=(lightboxIndex+d+n)%n;showLightboxImage();
}
function closeLightbox(){
  const lb=document.getElementById('tobaLightbox');
  if(lb)lb.classList.remove('open');
  document.documentElement.style.overflow='';
  lightboxIndex=-1;lightboxList=null;
}

/* ---------- interactions (single listener set) ---------- */
/* filter komunitas — reset pagination + filter lain, tanpa reload */
document.addEventListener('click',e=>{
  const b=e.target.closest('#galleryFilters [data-filter]');if(!b)return;
  /* BUGFIX: tombol memakai data-filter=label terjemahan ("Semua").
     Normalisasi ke nilai kanonik All/Tobaladies/Tobadeli supaya tab Semua
     tidak pernah menyaring komunitas yang tidak ada (penyebab empty state). */
  const raw=b.dataset.filter||'';
  const key=raw.toLowerCase();
  galleryCommunityFilter=(key==='all'||key==='semua')?'All':(key==='tobaladies'?'Tobaladies':(key==='tobadeli'?'Tobadeli':'All'));
  document.querySelectorAll('#galleryFilters [data-filter]').forEach(x=>x.classList.toggle('active',x===b));
  if(galleryState!=='ok')return;
  galleryPage=1;
  /* reset dropdown fotografer ke semua agar kombinasi filter tidak salah konteks */
  galleryPhotographer='';
  const sel=document.getElementById('galleryPhotographer');if(sel)sel.value='';
  renderGalleryUI();
});
/* pencarian caption — debounce 300ms */
let gallerySearchTimer=0;
document.addEventListener('input',e=>{
  if(e.target.id!=='gallerySearch')return;
  gallerySearchRaw=e.target.value;
  clearTimeout(gallerySearchTimer);
  gallerySearchTimer=setTimeout(()=>{gallerySearch=gallerySearchRaw;galleryPage=1;renderGalleryUI();},300);
});
/* dropdown fotografer */
document.addEventListener('change',e=>{
  if(e.target.id==='galleryPhotographer'){galleryPhotographer=e.target.value;galleryPage=1;renderGalleryUI();}
  if(e.target.id==='galleryPerPage'){
    galleryPerPage=Number(e.target.value)||12;
    galleryPage=1;renderGalleryUI();
  }
  if(e.target.id==='galleryJump'){galleryGoPage(Number(e.target.value)||1);}
});
/* tombol pager */
document.addEventListener('click',e=>{
  if(e.target.closest('#galleryPrev')){galleryGoPage(galleryPage-1);return;}
  if(e.target.closest('#galleryNext')){galleryGoPage(galleryPage+1);return;}
  if(e.target.closest('#galleryPerPageWrap'))return; /* biarkan change yang menangani */
});

/* ---------- Prompt 16-18: kondisi awal netral & interaksi mobile ----------
   Tidak ada panel aktif saat load: `hlActive=-1` (default). Liquid HANYA
   berjalan setelah interaksi nyata (hover di desktop, tap di mobile).
   Foto dipilih dari API TOBA yang sudah berjalan — tidak ada sistem kedua.
   Panel adalah <figure> (bukan <a href>) dan TIDAK ada scrollIntoView/scrollTo
   di interaksi panel — tap tidak pernah memindahkan posisi scroll halaman.

   Mobile horizontal swipe (Prompt 18): native CSS scroll-snap di .hl-carousel
   (overflow-x auto) — kelima panel bisa di-swipe tanpa JS gesture tambahan.
   Scroll vertikal halaman tidak terganggu dan swipe TIDAK memicu liquid:
   perubahan panel via swipe tidak memanggil heroAccent, hanya tap yang memicu. */
/* sinkronisasi panel aktif saat swipe (tanpa memicu liquid — liquid hanya
   dari tap/hover nyata) */
function bindHlSnap(carousel){
  if(!('IntersectionObserver' in window)||carousel.dataset.snapBound)return;
  carousel.dataset.snapBound='1';
  const io=new IntersectionObserver(entries=>{
    /* Prompt 19: foto yang paling terlihat → otomatis jadi foto aktif
       (liquid ikut berpindah ke warna kategori foto terbaru).
       Callback PERTAMA setelah observe() diabaikan — hanya swipe nyata
       (scroll position berubah setelah init) yang boleh mengubah aktif.
       Ini mencegah foto aktif otomatis di desktop saat load. */
    if(!carousel.dataset.swiped){
      carousel.dataset.swiped='1';
      return;
    }
    let best=null,bestRatio=0;
    entries.forEach(en=>{
      if(en.intersectionRatio>bestRatio){bestRatio=en.intersectionRatio;best=en.target;}
    });
    if(best&&bestRatio>0.55){
      const i=Number(best.dataset.idx);
      if(i!==hlActive){hlSetActive(i);heroStart(i);}
    }
  },{root:carousel,threshold:[0.55]});
  carousel.querySelectorAll('.hl-panel').forEach(p=>io.observe(p));
}
function FINE_POINTER(){return window.matchMedia('(pointer: fine)').matches;}
function initHlMobile(){
  const carousel=document.getElementById('hlCarousel');
  if(!carousel)return;
  bindHlSnap(carousel);
  /* Prompt 19: foto pertama otomatis aktif saat halaman dibuka (mobile) —
     delay 1 frame agar observer tidak menimpanya dengan event threshold 0 */
  if(!FINE_POINTER())requestAnimationFrame(()=>{
    if(hlActive<0){hlSetActive(0);heroStart(0);}
  });
}
