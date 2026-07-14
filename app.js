async function loadContent(){
  if (location.protocol === 'file:') return window.DEFAULT_CONTENT;
  try {
    const res=await fetch('content.json',{cache:'no-store'});
    if(!res.ok) throw new Error('İçerik yüklenemedi');
    return await res.json();
  } catch (error) {
    console.warn('content.json yüklenemedi, varsayılan içerik kullanılıyor.', error);
    return window.DEFAULT_CONTENT;
  }
}
function setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value||''}
function makeLinks(data){
  const tel=`tel:+${data.phoneLink}`; const wa=`https://wa.me/${data.phoneLink}?text=${encodeURIComponent(data.whatsappMessage||'')}`;
  ['callTop','callHero','callContact'].forEach(id=>{const e=document.getElementById(id);e.href=tel;if(id!=='callTop')e.textContent=data.phoneDisplay});
  ['whatsappHero','whatsappContact','floatingWhatsapp'].forEach(id=>document.getElementById(id).href=wa);
  document.getElementById('facebookTop').href=data.facebook; document.getElementById('instagramTop').href=data.instagram;
}
function render(data){
  ['heroEyebrow','heroTitle','heroText','campaignTitle','campaignText','addressText','footerText'].forEach(k=>setText(k,data[k]));
  makeLinks(data); document.getElementById('campaignImage').src=data.campaignImage;
  document.getElementById('kampanya').style.display=data.campaignVisible===false?'none':'';
  document.getElementById('services').innerHTML=data.services.map(x=>`<article class="card"><h3>${x.title}</h3><p>${x.text}</p></article>`).join('');
  document.getElementById('areas').innerHTML=data.areas.map(x=>`<span>${x}</span>`).join('');
  document.getElementById('faqs').innerHTML=data.faqs.map((x,i)=>`<div class="faq"><button aria-expanded="false">${x.q}</button><p>${x.a}</p></div>`).join('');
  document.querySelectorAll('.faq button').forEach(b=>b.addEventListener('click',()=>{const f=b.parentElement;f.classList.toggle('open');b.setAttribute('aria-expanded',f.classList.contains('open'))}));
}
document.querySelector('.menu-btn').addEventListener('click',()=>document.querySelector('.topbar nav').classList.toggle('open'));
document.getElementById('year').textContent=new Date().getFullYear();
loadContent().then(render).catch(err=>console.error(err));
