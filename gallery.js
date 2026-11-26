/* Public API: read-only JSONP (api=gallery). Foto yang tampil hanya yang
   sudah lolos filter publikasi di sisi Apps Script:
   permission_status=Granted, status=Approved, processing_status=COPIED,
   archive_file_id terisi, publish_status=Published.
   Gallery upgrade: grid 4/3/2 kolom, filter komunitas + caption + fotografer,
   pagination 12/24, download foto arsip, lightbox caption + download. */
const GALLERY_API='https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
let galleryPhotos=[],galleryState='loading',lightboxIndex=-1;
let jsonpRequest=null;
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
    galleryPhotos=res.photos
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
        url:p.imageUrl||(
          (p.archiveFileId||p.archive_file_id)
            ? 'https://drive.google.com/thumbnail?id='+encodeURIComponent(p.archiveFileId||p.archive_file_id)+'&sz=w1200'
            : ''
        )
      }))
      .filter(p=>p.url)
      .sort((a,b)=>a.order-b.order);
    galleryState='ok';
  }catch(error){
    console.error('TOBA Gallery API error:',error);
    galleryState='error';
  }
  if(document.body.dataset.page==='gallery')renderGalleryUI();
}
window.tobaGalleryCallback=tobaGalleryCallback;window.galleryFetchFail=galleryFetchFail;window.loadGallery=loadGallery;
function galleryFetchFail(){
  if(jsonpRequest){clearTimeout(jsonpRequest.timeout);jsonpRequest.script.remove();jsonpRequest=null;}
  galleryState='error';
  if(document.body.dataset.page==='gallery')renderGalleryUI();
}
function loadGallery(){
  galleryState='loading';renderGalleryUI();
  const old=document.getElementById('tobaGalleryJsonp');if(old)old.remove();
  const script=document.createElement('script');script.id='tobaGalleryJsonp';
  /* komunitas dikirim ke API, tapi seluruh foto tetap disimpan agar filter
     lokal tidak butuh fetch ulang saat pengguna berpindah tab komunitas */
  const url=GALLERY_API+'?api=gallery&community='+encodeURIComponent(galleryCommunityFilter==='All'?'':galleryCommunityFilter)+'&callback=tobaGalleryCallback';
  script.src=url;script.onerror=galleryFetchFail;
  jsonpRequest={script,timeout:setTimeout(galleryFetchFail,15000)};
  document.body.appendChild(script);
}

/* ---------- filter pipeline ---------- */
function filteredPhotos(){
  const q=gallerySearch.trim().toLowerCase();
  return galleryPhotos.filter(p=>{
    if(galleryCommunityFilter!=='All'&&p.community!==galleryCommunityFilter)return false;
    if(galleryPhotographer&&(p.photographer||'')!==galleryPhotographer)return false;
    if(q&&!(p.caption||'').toLowerCase().includes(q))return false;
    return true;
  });
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
const DL_ICON='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></svg>';

/* download via fetch blob — nama file rapi, kualitas arsip terbaik */
function downloadPhoto(idx){
  const p=galleryFiltered[idx];if(!p)return;
  const btn=document.querySelector(`.gallery-dl[data-dl="${idx}"]`);
  if(btn)btn.classList.add('busy');
  const name=downloadName(p);
  const src=p.archiveId
    ? 'https://drive.google.com/uc?export=download&id='+encodeURIComponent(p.archiveId)
    : p.url;
  fetch(src).then(r=>{
    if(!r.ok)throw new Error('HTTP '+r.status);
    return r.blob();
  }).then(blob=>{
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);a.download=name;
    document.body.appendChild(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);
  }).catch(()=>{
    /* fallback: buka file arsip langsung (kualitas asli, biar browser yang simpan) */
    window.open(src,'_blank','noopener');
  }).finally(()=>{if(btn)btn.classList.remove('busy');});
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
    if(statusBox)statusBox.innerHTML=`<div class="gallery-state"><p><strong>${t('gallery.empty')}</strong></p><p>${t('gallery.empty.sub')}</p></div>`;
    grid.innerHTML='';
    if(pager)pager.hidden=true;
    return;
  }

  const base=(galleryPage-1)*galleryPerPage;
  grid.innerHTML=slice.map((p,i)=>galleryCard(p,base+i)).join('');
  grid.querySelectorAll('img[data-api-photo]').forEach(img=>{img.addEventListener('error',()=>{img.closest('.gallery-item').classList.add('img-failed');img.replaceWith(Object.assign(document.createElement('div'),{className:'gallery-fallback',textContent:'✳'}))})});
  /* image reveal on scroll */
  const ro=('IntersectionObserver' in window)?new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');ro.unobserve(en.target)}})},{threshold:.1}):null;
  grid.querySelectorAll('.gallery-item').forEach(el=>{if(!ro)el.classList.add('in');else if(el.getBoundingClientRect().top<window.innerHeight)el.classList.add('in');else ro.observe(el)});
  /* lightbox triggers */
  grid.querySelectorAll('.gallery-item').forEach(card=>{
    card.addEventListener('click',e=>{if(e.target.closest('.gallery-dl'))return;openLightbox(Number(card.dataset.index));});
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(Number(card.dataset.index))}});
  });
  grid.querySelectorAll('.gallery-dl').forEach(btn=>{
    btn.addEventListener('click',e=>{e.stopPropagation();downloadPhoto(Number(btn.dataset.dl));});
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
function openLightbox(i){
  const list=galleryFiltered;if(!list.length)return;
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
  const lb=document.getElementById('tobaLightbox'),list=galleryFiltered;
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
  const n=galleryFiltered.length;if(!n)return;
  lightboxIndex=(lightboxIndex+d+n)%n;showLightboxImage();
}
function closeLightbox(){
  const lb=document.getElementById('tobaLightbox');
  if(lb)lb.classList.remove('open');
  document.documentElement.style.overflow='';
  lightboxIndex=-1;
}

/* ---------- interactions (single listener set) ---------- */
/* filter komunitas — reset pagination + filter lain, tanpa reload */
document.addEventListener('click',e=>{
  const b=e.target.closest('#galleryFilters [data-filter]');if(!b)return;
  galleryCommunityFilter=b.dataset.filter;
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
