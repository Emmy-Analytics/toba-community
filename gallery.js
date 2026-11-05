/* Public API: read-only. If the admin dashboard doGet is still on the same
   deployment, an unauthenticated browser JSONP gets redirected to Google Sign-in
   (HTML, not JS) which triggers script.onerror -> error state (never fake data).
   Separating the public API into its own deployment (doGet with api=gallery only,
   public access) is required before the live gallery will render photos.
   Editorial upgrade: asymmetric grid via CSS, immersive lightbox with keyboard nav. */
const GALLERY_API='https://script.google.com/macros/s/AKfycbxgx0kHXRa7uR3PuADKiEgvs_sLHp0U9UbxHsxkPwWl9kjlCZnQWa6iZBa1NW9tjrcLvg/exec';
let galleryPhotos=[],galleryState='loading',galleryCommunityFilter='All',lightboxIndex=-1;
let jsonpRequest=null;
function tobaGalleryCallback(res){
  if(jsonpRequest){clearTimeout(jsonpRequest.timeout);jsonpRequest.script.remove();jsonpRequest=null;}
  try{
    const rows=(res&&Array.isArray(res.photos))?res.photos:[];
    galleryPhotos=rows
      .filter(p=>p&&p.archive_file_id&&p.publish_status==='Published'&&p.status==='Approved'&&p.permission_status==='Granted'&&p.processing_status==='COPIED')
      .map(p=>({
        id:p.photo_id||p.photoId||Math.random().toString(36).slice(2),
        community:p.community||'',
        title:p.title||'',
        caption:p.caption||'',
        photographer:p.photographer||'',
        order:Number(p.display_order||p.displayOrder||0),
        url:'https://drive.google.com/thumbnail?id='+p.archive_file_id+'&sz=w1600'
      }))
      .sort((a,b)=>a.order-b.order);
    galleryState='ok';
  }catch(e){galleryState='error';}
  if(document.body.dataset.page==='gallery')renderGalleryUI();
}
window.tobaGalleryCallback=tobaGalleryCallback;window.galleryFetchFail=galleryFetchFail;window.loadGallery=loadGallery;
function galleryFetchFail(){if(jsonpRequest){clearTimeout(jsonpRequest.timeout);jsonpRequest.script.remove();jsonpRequest=null;}galleryState='error';if(document.body.dataset.page==='gallery')renderGalleryUI();}
function loadGallery(){
  galleryState='loading';renderGalleryUI();
  const old=document.getElementById('tobaGalleryJsonp');if(old)old.remove();
  const script=document.createElement('script');script.id='tobaGalleryJsonp';
  const url=GALLERY_API+'?api=gallery&community='+encodeURIComponent(galleryCommunityFilter==='All'?'':galleryCommunityFilter)+'&callback=tobaGalleryCallback';
  script.src=url;script.onerror=galleryFetchFail;
  jsonpRequest={script,timeout:setTimeout(galleryFetchFail,15000)};
  document.body.appendChild(script);
}
function galleryAlt(p){return (p.caption||p.title)+' — '+(p.photographer?('by '+p.photographer+', '):'')+t('gallery.alt');}
function galleryCard(p,i){
  return `<article class="gallery-item api-photo img-reveal" data-category="${p.community}" data-index="${i}" tabindex="0" role="button" aria-label="${galleryAlt(p)}"><img src="${p.url}" alt="${galleryAlt(p)}" loading="lazy" data-api-photo>${(p.caption||p.title)?`<div class="pad">${p.caption||p.title}</div>`:''}</article>`;
}
function visiblePhotos(){
  return galleryPhotos.filter(p=>galleryCommunityFilter==='All'||p.community===galleryCommunityFilter);
}
function renderGalleryUI(){
  const grid=document.getElementById('galleryGrid');if(!grid)return;
  const statusBox=document.getElementById('galleryStatus');
  if(galleryState==='loading'){
    if(statusBox)statusBox.innerHTML=`<div class="gallery-state"><span class="gallery-spinner" aria-hidden="true"></span><p>${t('gallery.loading')}</p></div>`;
    grid.innerHTML='';return;
  }
  if(galleryState==='error'){
    if(statusBox)statusBox.innerHTML=`<div class="gallery-state error"><p><strong>${t('gallery.error')}</strong></p><p>${t('gallery.error.sub')}</p><button class="pill" id="galleryRetry">${t('gallery.retry')}</button><p class="gallery-notice">${t('gallery.demo.note')}</p></div>`;
    grid.innerHTML='';document.getElementById('galleryRetry')?.addEventListener('click',loadGallery);return;
  }
  if(statusBox)statusBox.innerHTML='';
  const visible=visiblePhotos();
  if(!galleryPhotos.length||!visible.length){
    if(statusBox)statusBox.innerHTML=`<div class="gallery-state"><p><strong>${t('gallery.empty')}</strong></p><p>${t('gallery.empty.sub')}</p></div>`;
    grid.innerHTML='';return;
  }
  grid.innerHTML=visible.map(galleryCard).join('');
  grid.querySelectorAll('img[data-api-photo]').forEach(img=>{img.addEventListener('error',()=>{img.closest('.gallery-item').classList.add('img-failed');img.replaceWith(Object.assign(document.createElement('div'),{className:'gallery-fallback',textContent:'✳'}))})});
  /* image reveal on scroll */
  const ro=('IntersectionObserver' in window)?new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');ro.unobserve(en.target)}})},{threshold:.1}):null;
  grid.querySelectorAll('.gallery-item').forEach(el=>{if(!ro)el.classList.add('in');else if(el.getBoundingClientRect().top<window.innerHeight)el.classList.add('in');else ro.observe(el)});
  /* lightbox triggers */
  const open=(i)=>openLightbox(i);
  grid.querySelectorAll('.gallery-item').forEach(card=>{
    card.addEventListener('click',()=>open(Number(card.dataset.index)));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(Number(card.dataset.index))}});
  });
}
/* ---------- immersive lightbox ---------- */
function openLightbox(i){
  const list=visiblePhotos();if(!list.length)return;
  lightboxIndex=i;showLightboxImage();
  let lb=document.getElementById('tobaLightbox');
  if(!lb){
    lb=document.createElement('div');lb.id='tobaLightbox';lb.className='lightbox';
    lb.innerHTML=`<button class="lightbox-x" id="lbClose" aria-label="Close">✕</button><button class="lightbox-nav lb-prev" id="lbPrev" aria-label="Previous">←</button><img src="" alt=""><button class="lightbox-nav lb-next" id="lbNext" aria-label="Next">→</button><div class="lightbox-cap"></div>`;
    document.body.appendChild(lb);
    lb.querySelector('#lbClose').addEventListener('click',closeLightbox);
    lb.querySelector('#lbPrev').addEventListener('click',()=>stepLightbox(-1));
    lb.querySelector('#lbNext').addEventListener('click',()=>stepLightbox(1));
    lb.addEventListener('click',e=>{if(e.target===lb)closeLightbox()});
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
  const lb=document.getElementById('tobaLightbox'),list=visiblePhotos();
  if(!lb||lightboxIndex<0||lightboxIndex>=list.length)return;
  const p=list[lightboxIndex];
  lb.querySelector('img').src=p.url;lb.querySelector('img').alt=galleryAlt(p);
  lb.querySelector('.lightbox-cap').textContent=[p.caption||p.title,p.photographer?('© '+p.photographer):''].filter(Boolean).join(' — ');
}
function stepLightbox(d){
  const n=visiblePhotos().length;if(!n)return;
  lightboxIndex=(lightboxIndex+d+n)%n;showLightboxImage();
}
function closeLightbox(){
  const lb=document.getElementById('tobaLightbox');
  if(lb)lb.classList.remove('open');
  document.documentElement.style.overflow='';
  lightboxIndex=-1;
}
/* ---------- community filter (preserved behavior) ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('#galleryFilters [data-filter]');if(!b)return;galleryCommunityFilter=b.dataset.filter;document.querySelectorAll('#galleryFilters [data-filter]').forEach(x=>x.classList.toggle('active',x===b));if(galleryState==='ok')renderGalleryUI();});
