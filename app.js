async function loadContent(){
  if (location.protocol === 'file:') return window.DEFAULT_CONTENT;
  try {
    const res = await fetch('/content.json', {cache:'no-store'});
    if (!res.ok) throw new Error('İçerik yüklenemedi');
    return await res.json();
  } catch (error) {
    console.warn('content.json yüklenemedi, varsayılan içerik kullanılıyor.', error);
    return window.DEFAULT_CONTENT;
  }
}
function setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value||''}
function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function makeLinks(data){
  const tel=`tel:+${data.phoneLink}`;
  const wa=`https://wa.me/${data.phoneLink}?text=${encodeURIComponent(data.whatsappMessage||'')}`;
  ['callTop','callHero','callContact'].forEach(id=>{const e=document.getElementById(id);if(!e)return;e.href=tel;if(id!=='callTop')e.textContent=data.phoneDisplay});
  ['whatsappHero','whatsappContact','floatingWhatsapp'].forEach(id=>{const e=document.getElementById(id);if(e)e.href=wa});
  const fb=document.getElementById('facebookTop');if(fb)fb.href=data.facebook||'#';
  const ig=document.getElementById('instagramTop');if(ig)ig.href=data.instagram||'#';
}
function render(data){
  ['heroEyebrow','heroTitle','heroText','campaignTitle','campaignText','addressText','footerText'].forEach(k=>setText(k,data[k]));
  makeLinks(data);
  const logo=data.logoImage||'armek-logo.jpg';
  ['headerLogo','heroLogo'].forEach(id=>{const el=document.getElementById(id);if(el)el.src=logo});
  const favicon=document.getElementById('favicon');if(favicon)favicon.href=logo;
  const campaign=document.getElementById('campaignImage');if(campaign)campaign.src=data.campaignImage||'';
  const campaignSection=document.getElementById('kampanya');if(campaignSection)campaignSection.style.display=data.campaignVisible===false?'none':'';
  const prices=document.getElementById('prices');
  if(prices){
    const list=Array.isArray(data.prices)?data.prices:[];
    prices.style.display=(data.pricesVisible===false||list.length===0)?'none':'';
    prices.innerHTML=list.map(x=>`<article class="price-card"><h3>${escapeHtml(x.title)}</h3><div class="price">${escapeHtml(x.price)}</div><p>${escapeHtml(x.note||'')}</p></article>`).join('');
  }
  const services=Array.isArray(data.services)?data.services:[];
  document.getElementById('services').innerHTML=services.map(x=>`<article class="card"><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.text)}</p></article>`).join('');
  const areas=Array.isArray(data.areas)?data.areas:[];
  document.getElementById('areas').innerHTML=areas.map(x=>`<span>${escapeHtml(x)}</span>`).join('');
  const faqs=Array.isArray(data.faqs)?data.faqs:[];
  document.getElementById('faqs').innerHTML=faqs.map(x=>`<div class="faq"><button aria-expanded="false">${escapeHtml(x.q)}</button><p>${escapeHtml(x.a)}</p></div>`).join('');
  document.querySelectorAll('.faq button').forEach(b=>b.addEventListener('click',()=>{const f=b.parentElement;f.classList.toggle('open');b.setAttribute('aria-expanded',f.classList.contains('open'))}));
}
const menu=document.querySelector('.menu-btn');if(menu)menu.addEventListener('click',()=>document.querySelector('.topbar nav').classList.toggle('open'));
document.getElementById('year').textContent=new Date().getFullYear();
loadContent().then(render).catch(err=>console.error(err));
