const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const icons=['✦','◉','⌁','⚙'];
async function init(){
  let c={}; try{c=await fetch('content.json?'+Date.now()).then(r=>r.json())}catch(e){console.warn('İçerik okunamadı',e)}
  const set=(id,val)=>{const el=$(id);if(el&&val!==undefined&&val!==null)el.textContent=val};
  set('#heroEyebrow',c.heroEyebrow);set('#heroTitle',c.heroTitle);set('#heroText',c.heroText);set('#campaignTitle',c.campaignTitle);set('#campaignText',c.campaignText);set('#footerAddress',c.addressText);set('#footerText',c.footerText);set('#year',new Date().getFullYear());
  if(c.logoImage)$('#logoImage').src=c.logoImage;
  if(c.heroImage)$('#heroImage').src=c.heroImage;
  if(c.campaignImage)$('#campaignImage').src=c.campaignImage;
  const tel=`tel:+${c.phoneLink||'905525223575'}`; const wa=`https://wa.me/${c.phoneLink||'905525223575'}?text=${encodeURIComponent(c.whatsappMessage||'Merhaba, bilgi almak istiyorum.')}`;
  ['#topPhone','#heroPhone','#contactPhone','#footerPhone'].forEach(id=>{const el=$(id);if(el){el.href=tel;if(id==='#topPhone'||id==='#footerPhone')el.textContent=c.phoneDisplay||'0552 522 35 75'}});
  ['#headerWhatsapp','#heroWhatsapp','#campaignWhatsapp','#faqWhatsapp','#contactWhatsapp','#floatingWhatsapp'].forEach(id=>{const el=$(id);if(el)el.href=wa});
  if(c.facebook)$('#facebook').href=c.facebook;if(c.instagram)$('#instagram').href=c.instagram;
  const sg=$('#serviceGrid');(c.services||[]).forEach((s,i)=>sg.insertAdjacentHTML('beforeend',`<article class="service-card reveal"><div class="service-icon">${icons[i%icons.length]}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`));
  const pl=$('#priceList');(c.prices||[]).forEach(p=>pl.insertAdjacentHTML('beforeend',`<div class="price-item"><div><strong>${esc(p.title)}</strong><small>${esc(p.note||'')}</small></div><b>${esc(p.price)}</b></div>`));
  const al=$('#areaList');(c.areas||[]).forEach(a=>al.insertAdjacentHTML('beforeend',`<span class="area-pill reveal">${esc(a)}</span>`));
  const fl=$('#faqList');(c.faqs||[]).slice(0,7).forEach(f=>fl.insertAdjacentHTML('beforeend',`<div class="faq-item reveal"><button class="faq-question">${esc(f.q)}</button><div class="faq-answer"><p>${esc(f.a)}</p></div></div>`));
  $$('.faq-question').forEach(b=>b.addEventListener('click',()=>{const i=b.parentElement;i.classList.toggle('open');i.querySelector('.faq-answer').style.maxHeight=i.classList.contains('open')?i.querySelector('.faq-answer').scrollHeight+'px':'0'}));
  const toggle=$('.menu-toggle'),nav=$('.main-nav');toggle.addEventListener('click',()=>{nav.classList.toggle('open');toggle.setAttribute('aria-expanded',nav.classList.contains('open'))});$$('.main-nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});$$('.reveal').forEach(el=>io.observe(el));
}
function esc(v=''){return String(v).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
init();
