const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const serviceIcons=['◈','⌁','✦','⚙','◉','✓'];
let allWorks=[];
async function init(){
  let c={};try{const r=await fetch(`content.json?v=${Date.now()}`);if(!r.ok)throw new Error(r.status);c=await r.json()}catch(e){console.warn('İçerik okunamadı',e)}
  const set=(id,val)=>{const el=$(id);if(el&&val!==undefined&&val!==null)el.textContent=val};
  ['heroEyebrow','heroTitle','heroText','campaignTitle','campaignText','aboutTitle','aboutText','footerText'].forEach(k=>set(`#${k}`,c[k]));
  set('#topbarText',c.topbarText);set('#footerAddress',c.addressText);set('#year',new Date().getFullYear());set('#statExperience',c.statExperience);set('#statService',c.statService);
  const img=(id,src)=>{const el=$(id);if(el&&src)el.src=src};img('#logoImage',c.logoImage);img('#footerLogo',c.logoImage);img('#heroImage',c.heroImage);img('#campaignImage',c.campaignImage);img('#aboutImage',c.aboutImage);
  if(c.campaignVisible===false)$('#campaign').hidden=true;
  const phone=c.phoneLink||'905525223575',tel=`tel:+${phone}`,wa=`https://wa.me/${phone}?text=${encodeURIComponent(c.whatsappMessage||'Merhaba, bilgi almak istiyorum.')}`;
  ['#topPhone','#heroPhone','#contactPhone','#footerPhone'].forEach(id=>{const el=$(id);if(el){el.href=tel;if(id==='#topPhone'||id==='#footerPhone')el.textContent=c.phoneDisplay||'0552 522 35 75'}});
  ['#headerWhatsapp','#heroWhatsapp','#worksWhatsapp','#campaignWhatsapp','#faqWhatsapp','#contactWhatsapp','#floatingWhatsapp'].forEach(id=>{const el=$(id);if(el)el.href=wa});
  if(c.facebook)$('#facebook').href=c.facebook;if(c.instagram)$('#instagram').href=c.instagram;
  renderServices(c.services||[]);renderPrices(c.prices||[],c.pricesVisible);renderAdvantages(c.advantages||[]);renderAreas(c.areas||[]);renderFaqs(c.faqs||[]);renderTestimonials(c.testimonials||[]);renderWorks(c.works||[]);
  setupNav();setupReveal();setupModal();
}
function renderServices(items){const el=$('#serviceGrid');items.forEach((s,i)=>el.insertAdjacentHTML('beforeend',`<article class="service-card reveal"><div class="service-icon">${serviceIcons[i%serviceIcons.length]}</div><span>0${i+1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`))}
function renderPrices(items,visible){const el=$('#priceList');if(visible===false)el.hidden=true;items.forEach(p=>el.insertAdjacentHTML('beforeend',`<div class="price-item"><div><strong>${esc(p.title)}</strong><small>${esc(p.note||'')}</small></div><b>${esc(p.price)}</b></div>`))}
function renderAdvantages(items){const el=$('#advantages');items.forEach(a=>el.insertAdjacentHTML('beforeend',`<div class="check-item"><i>✓</i><span>${esc(a)}</span></div>`))}
function renderAreas(items){const el=$('#areaList');items.forEach(a=>el.insertAdjacentHTML('beforeend',`<span class="area-pill reveal">${esc(a)}</span>`))}
function renderFaqs(items){const el=$('#faqList');items.slice(0,10).forEach(f=>el.insertAdjacentHTML('beforeend',`<div class="faq-item reveal"><button class="faq-question">${esc(f.q)}<i>+</i></button><div class="faq-answer"><p>${esc(f.a)}</p></div></div>`));$$('.faq-question').forEach(b=>b.addEventListener('click',()=>{const i=b.parentElement,ans=i.querySelector('.faq-answer');i.classList.toggle('open');ans.style.maxHeight=i.classList.contains('open')?ans.scrollHeight+'px':'0'}))}
function renderTestimonials(items){const el=$('#testimonialGrid');items.forEach(t=>el.insertAdjacentHTML('beforeend',`<article class="testimonial-card reveal"><div class="stars">★★★★★</div><p>“${esc(t.text)}”</p><div><b>${esc(t.name)}</b><span>${esc(t.location||'Antalya')}</span></div></article>`))}
function renderWorks(items){allWorks=items;const cats=['Tümü',...new Set(items.map(x=>x.category).filter(Boolean))],f=$('#workFilters');cats.forEach((cat,i)=>f.insertAdjacentHTML('beforeend',`<button class="work-filter ${i===0?'active':''}" data-cat="${esc(cat)}">${esc(cat)}</button>`));$$('.work-filter').forEach(b=>b.addEventListener('click',()=>{$$('.work-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');drawWorks(b.dataset.cat)}));drawWorks('Tümü')}
function drawWorks(cat){const el=$('#worksGrid');el.innerHTML='';const items=cat==='Tümü'?allWorks:allWorks.filter(x=>x.category===cat);if(!items.length){el.innerHTML='<p class="empty-state">Henüz bu kategoride çalışma eklenmedi.</p>';return}items.forEach((w,i)=>el.insertAdjacentHTML('beforeend',`<article class="work-card reveal visible" data-index="${allWorks.indexOf(w)}"><div class="work-image"><img src="${attr(w.image)}" alt="${attr(w.title)}" loading="lazy"><span>${esc(w.category||'Uygulama')}</span></div><div class="work-info"><small>${esc([w.location,w.date].filter(Boolean).join(' • '))}</small><h3>${esc(w.title)}</h3><p>${esc(w.text||'')}</p><button>Detayları Gör →</button></div></article>`));$$('.work-card').forEach(card=>card.addEventListener('click',()=>openWork(allWorks[+card.dataset.index]))) }
function setupModal(){const m=$('#workModal');$('.modal-close').addEventListener('click',()=>m.close());m.addEventListener('click',e=>{if(e.target===m)m.close()})}
function openWork(w){img('#modalImage',w.image);setText('#modalMeta',[w.category,w.location,w.date].filter(Boolean).join(' • '));setText('#modalTitle',w.title);setText('#modalText',w.text);$('#workModal').showModal()}
function setupNav(){const toggle=$('.menu-toggle'),nav=$('.main-nav');toggle.addEventListener('click',()=>{nav.classList.toggle('open');toggle.setAttribute('aria-expanded',nav.classList.contains('open'))});$$('.main-nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
function setupReveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});$$('.reveal').forEach(el=>io.observe(el))}
function setText(id,v){const el=$(id);if(el)el.textContent=v||''}function img(id,src){const el=$(id);if(el&&src)el.src=src}function esc(v=''){return String(v).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}function attr(v=''){return esc(v)}
init();
