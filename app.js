const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const fallback={
 businessName:"ARMEK Su Arıtma",phoneDisplay:"0552 522 35 75",phoneLink:"905525223575",whatsappMessage:"Merhaba, su arıtma ürünleri ve hizmetleri hakkında bilgi almak istiyorum.",
 heroEyebrow:"ARMEK SU ARITMA SERVİSİ",heroTitle:"Eviniz için güvenilir ve profesyonel su arıtma çözümleri",heroText:"Cihaz satışı, montaj, filtre değişimi ve teknik servis hizmetleri.",heroImage:"/uploads/gemini_generated_image_xmulihxmulihxmul.png",
 heroSlides:[],products:[],works:[],testimonials:[],services:[],areas:[],faqs:[],advantages:[],
 visibility:{products:true,campaign:true,services:true,works:true,about:true,testimonials:true,areas:true,faq:true}
};
let DATA=fallback, currentGallery=[], galleryIndex=0;

const safe=(v,d="")=>v??d;
const whatsapp=(phone,msg)=>`https://wa.me/${String(phone).replace(/\D/g,"")}?text=${encodeURIComponent(msg||"")}`;
function setText(id,val){const el=document.getElementById(id);if(el)el.textContent=safe(val)}
function setLink(id,href,text){const el=document.getElementById(id);if(!el)return;el.href=href;if(text)el.textContent=text}
function setImg(id,src){const el=document.getElementById(id);if(el&&src)el.src=src}
function stars(n){const v=Math.max(1,Math.min(5,Number(n)||5));return "★".repeat(v)+"☆".repeat(5-v)}
function applyVisibility(v={}){
 const map={products:"products",campaign:"campaign",services:"services",works:"works",about:"about",testimonials:"testimonials",areas:"areas",faq:"faq"};
 Object.entries(map).forEach(([key,cls])=>$$(`.section-toggle-${cls}`).forEach(el=>el.classList.toggle("section-hidden",v[key]===false)));
 $$(".nav-products").forEach(el=>el.classList.toggle("section-hidden",v.products===false));
 $$(".nav-campaign").forEach(el=>el.classList.toggle("section-hidden",v.campaign===false));
 $$(".nav-services").forEach(el=>el.classList.toggle("section-hidden",v.services===false));
 $$(".nav-works").forEach(el=>el.classList.toggle("section-hidden",v.works===false));
 $$(".nav-testimonials").forEach(el=>el.classList.toggle("section-hidden",v.testimonials===false));
 $$(".nav-faq").forEach(el=>el.classList.toggle("section-hidden",v.faq===false));
}
function renderHeroSlides(data){
 const slides=(data.heroSlides||[]).filter(x=>x&&x.image);
 if(!slides.length)slides.push({image:data.heroImage||fallback.heroImage,alt:data.heroTitle});
 const slider=$("#heroSlider"),dots=$("#heroDots");
 slider.innerHTML=slides.map((s,i)=>`<div class="hero-slide ${i===0?"active":""}"><img src="${s.image}" alt="${s.alt||data.heroTitle||"ARMEK"}"></div>`).join("");
 dots.innerHTML=slides.length>1?slides.map((_,i)=>`<button class="slider-dot ${i===0?"active":""}" data-slide="${i}" aria-label="${i+1}. görsel"></button>`).join(""):"";
 let idx=0,timer;
 const show=i=>{const all=$$(".hero-slide"),ds=$$(".slider-dot");idx=(i+all.length)%all.length;all.forEach((x,j)=>x.classList.toggle("active",j===idx));ds.forEach((x,j)=>x.classList.toggle("active",j===idx))};
 $$(".slider-dot").forEach(d=>d.onclick=()=>show(Number(d.dataset.slide)));
 if(slides.length>1)timer=setInterval(()=>show(idx+1),5000);
}
function productPhotos(product){
 const photos=[];
 if(product.image)photos.push(product.image);
 (product.images||[]).forEach(x=>{const src=typeof x==="string"?x:x.image;if(src&&!photos.includes(src))photos.push(src)});
 return photos;
}
function openProduct(product){
 const modal=$("#productModal"), photos=productPhotos(product), first=photos[0]||"/armek-logo.jpg";
 $("#productModalImage").src=first;
 $("#productModalImage").alt=product.name||"Ürün";
 setText("productModalCategory",product.category||"Ürün");
 setText("productModalName",product.name||"");
 setText("productModalDescription",product.description||"");
 setText("productModalPrice",product.price||"Fiyat için arayın");
 $("#productModalFeatures").innerHTML=(product.features||[]).map(f=>`<li>${typeof f==="string"?f:f.item||""}</li>`).join("");
 $("#productThumbs").innerHTML=photos.map((src,i)=>`<button class="product-thumb ${i===0?"active":""}" data-product-photo="${src}"><img src="${src}" alt="${product.name||"Ürün"} ${i+1}"></button>`).join("");
 $$("[data-product-photo]").forEach(btn=>btn.onclick=()=>{$("#productModalImage").src=btn.dataset.productPhoto;$$('.product-thumb').forEach(x=>x.classList.remove('active'));btn.classList.add('active')});
 $("#productModalWhatsapp").href=whatsapp(DATA.phoneLink,`${product.name||"Ürün"} hakkında bilgi almak istiyorum.`);
 modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeProduct(){const modal=$("#productModal");modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""}
function renderProducts(items=[]){
 const root=$("#products"),filters=$("#productFilters"); if(!root)return;
 if(!items.length){root.innerHTML="";filters.innerHTML="";return}
 const cats=["Tümü",...new Set(items.map(x=>x.category||"Diğer"))];
 filters.innerHTML=cats.map((c,i)=>`<button class="filter-tab ${i===0?"active":""}" data-category="${c}">${c}</button>`).join("");
 const draw=cat=>{
  const list=cat==="Tümü"?items:items.filter(x=>(x.category||"Diğer")===cat);
  root.innerHTML=list.map((p,i)=>`<article class="product-card reveal" data-product-index="${items.indexOf(p)}">${p.badge?`<span class="product-badge">${p.badge}</span>`:""}<div class="product-image"><img src="${p.image||productPhotos(p)[0]||"/armek-logo.jpg"}" alt="${p.name||"Ürün"}"></div><div class="product-body"><span class="product-category">${p.category||"Ürün"}</span><h3>${p.name||""}</h3><p>${p.description||""}</p><ul class="product-features">${(p.features||[]).slice(0,4).map(f=>`<li>${typeof f==="string"?f:f.item||""}</li>`).join("")}</ul><div class="product-footer"><span class="product-price">${p.price||"Fiyat için arayın"}</span><button class="mini-button" type="button">Ürünü İncele</button></div></div></article>`).join("");
  $$('[data-product-index]').forEach(card=>card.onclick=e=>{e.preventDefault();openProduct(items[Number(card.dataset.productIndex)])});
  observeReveals();
 };
 draw("Tümü");
 $$(".filter-tab",filters).forEach(btn=>btn.onclick=()=>{$$(".filter-tab",filters).forEach(x=>x.classList.remove("active"));btn.classList.add("active");draw(btn.dataset.category)});
 window.selectProductCategory=cat=>{const target=[...filters.querySelectorAll('[data-category]')].find(x=>x.dataset.category===cat);if(target)target.click()};
}
function normalizePhotos(work){const photos=[];if(work.image)photos.push(work.image);(work.images||[]).forEach(x=>{const src=typeof x==="string"?x:x.image;if(src&&!photos.includes(src))photos.push(src)});return photos}
function openLightbox(work,index=0){currentGallery=normalizePhotos(work);if(!currentGallery.length)return;galleryIndex=index;updateLightbox(work);$("#lightbox").classList.add("open");$("#lightbox").setAttribute("aria-hidden","false")}
function updateLightbox(work){$("#lightboxImage").src=currentGallery[galleryIndex];$("#lightboxCaption").textContent=[work.title,work.location,work.date].filter(Boolean).join(" • ")}
function renderWorks(items=[]){
 const root=$("#works"),filters=$("#workFilters");if(!root)return;
 if(!items.length){root.innerHTML=`<div class="empty-note">Yaptığımız işler yönetici panelinden eklendiğinde burada görünecek.</div>`;filters.innerHTML="";return}
 const cats=["Tümü",...new Set(items.map(x=>x.category||"Diğer"))];
 filters.innerHTML=cats.map((c,i)=>`<button class="filter-tab ${i===0?"active":""}" data-work-category="${c}">${c}</button>`).join("");
 const draw=cat=>{const list=cat==="Tümü"?items:items.filter(x=>(x.category||"Diğer")===cat);root.innerHTML=list.map((w,i)=>{const photos=normalizePhotos(w);return `<article class="work-card reveal"><div class="work-cover" data-work-index="${items.indexOf(w)}"><img src="${photos[0]||"/armek-logo.jpg"}" alt="${w.title||"Yaptığımız iş"}">${photos.length>1?`<span class="photo-count">▣ ${photos.length} fotoğraf</span>`:""}</div><div class="work-body"><h3>${w.title||""}</h3><div class="work-meta"><span>${w.category||""}</span>${w.location?`<span>📍 ${w.location}</span>`:""}${w.date?`<span>🗓 ${w.date}</span>`:""}</div>${w.text?`<p>${w.text}</p>`:""}</div></article>`}).join("");$$("[data-work-index]").forEach(el=>el.onclick=()=>openLightbox(items[Number(el.dataset.workIndex)]));observeReveals()};
 draw("Tümü");$$("[data-work-category]").forEach(btn=>btn.onclick=()=>{$$("[data-work-category]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");draw(btn.dataset.workCategory)});
}
function render(data){
 DATA={...fallback,...data,visibility:{...fallback.visibility,...(data.visibility||{})}};
 document.title=DATA.seoTitle||DATA.businessName||"ARMEK Su Arıtma";
 $("#metaDescription").content=DATA.seoDescription||DATA.heroText||"";
 $("#ogTitle").content=DATA.seoTitle||DATA.businessName||"";
 $("#ogDescription").content=DATA.seoDescription||DATA.heroText||"";
 $("#ogImage").content=DATA.seoImage||DATA.logoImage||"/armek-logo.jpg";
 setImg("headerLogo",DATA.logoImage);setImg("footerLogo",DATA.logoImage);setImg("favicon",DATA.logoImage);
 ["heroEyebrow","heroTitle","heroText","statExperience","statService","campaignTitle","campaignText","aboutTitle","aboutText","addressText","footerText","topbarText","productsTitle","productsText"].forEach(id=>setText(id,DATA[id]));
 setImg("campaignImage",DATA.campaignImage);setImg("aboutImage",DATA.aboutImage);
 const tel=`tel:+${String(DATA.phoneLink).replace(/\D/g,"")}`,wa=whatsapp(DATA.phoneLink,DATA.whatsappMessage);
 ["callTop","callHero","callContact"].forEach(id=>setLink(id,tel,DATA.phoneDisplay));
 ["whatsappHero","whatsappAbout","whatsappContact","floatingWhatsapp"].forEach(id=>setLink(id,wa));
 ["facebookTop","facebookFooter"].forEach(id=>setLink(id,DATA.facebook||"#"));
 ["instagramTop","instagramFooter"].forEach(id=>setLink(id,DATA.instagram||"#"));
 renderHeroSlides(DATA);renderProducts(DATA.products||[]);renderWorks(DATA.works||[]);
 $("#services").innerHTML=(DATA.services||[]).map((s,i)=>`<article class="service-card reveal"><div class="service-icon">${String(i+1).padStart(2,"0")}</div><h3>${s.title||""}</h3><p>${s.text||""}</p></article>`).join("");
 $("#prices").innerHTML=(DATA.prices||[]).map(p=>`<article class="price-card"><div><h3>${p.title||""}</h3><small>${p.note||""}</small></div><strong>${p.price||""}</strong></article>`).join("");
 $("#advantages").innerHTML=(DATA.advantages||[]).map(x=>`<li>${typeof x==="string"?x:x.item||""}</li>`).join("");
 $("#testimonials").innerHTML=(DATA.testimonials||[]).map(t=>`<article class="testimonial-card reveal"><div class="stars">${stars(t.rating)}</div><p>“${t.text||""}”</p><div class="testimonial-user"><b>${t.name||""}</b><span>${t.location||""}</span></div></article>`).join("");
 $("#areas").innerHTML=(DATA.areas||[]).map(x=>`<span>${typeof x==="string"?x:x.item||""}</span>`).join("");
 $("#faqs").innerHTML=(DATA.faqs||[]).map(f=>`<article class="faq-item"><button class="faq-question">${f.q||""}<span>＋</span></button><div class="faq-answer"><p>${f.a||""}</p></div></article>`).join("");
 $$(".faq-question").forEach(q=>q.onclick=()=>q.parentElement.classList.toggle("open"));
 applyVisibility(DATA.visibility);$("#year").textContent=new Date().getFullYear();observeReveals();
}
function observeReveals(){const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});$$(".reveal:not(.visible)").forEach(el=>obs.observe(el))}
$(".menu-button").onclick=()=>{$(".main-nav").classList.toggle("open");$(".menu-button").setAttribute("aria-expanded",$(".main-nav").classList.contains("open"))};
$$(".main-nav a").forEach(a=>a.onclick=()=>$(".main-nav").classList.remove("open"));
$("#lightboxClose").onclick=()=>$("#lightbox").classList.remove("open");$("#lightbox").onclick=e=>{if(e.target===$("#lightbox"))$("#lightbox").classList.remove("open")};
$("#lightboxPrev").onclick=()=>{galleryIndex=(galleryIndex-1+currentGallery.length)%currentGallery.length;$("#lightboxImage").src=currentGallery[galleryIndex]};
$("#lightboxNext").onclick=()=>{galleryIndex=(galleryIndex+1)%currentGallery.length;$("#lightboxImage").src=currentGallery[galleryIndex]};
fetch(`/content.json?v=${Date.now()}`).then(r=>r.ok?r.json():Promise.reject()).then(render).catch(()=>render(fallback));
$$('[data-product-close]').forEach(el=>el.onclick=closeProduct);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProduct()});
$$('[data-product-nav]').forEach(link=>link.addEventListener('click',()=>{setTimeout(()=>window.selectProductCategory&&window.selectProductCategory(link.dataset.productNav),100)}));
