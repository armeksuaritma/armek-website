const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const fallback={
 businessName:"ARMEK Su Arıtma",phoneDisplay:"0552 522 35 75",phoneLink:"905525223575",whatsappMessage:"Merhaba, su arıtma ürünleri ve hizmetleri hakkında bilgi almak istiyorum.",
 heroEyebrow:"ARMEK SU ARITMA SERVİSİ",heroTitle:"Eviniz için güvenilir ve profesyonel su arıtma çözümleri",heroText:"Cihaz satışı, montaj, filtre değişimi ve teknik servis hizmetleri.",heroImage:"/uploads/gemini_generated_image_xmulihxmulihxmul.png",
 heroMediaType:"image",heroVideo:"",heroVideoPoster:"",heroSlides:[],products:[],works:[],testimonials:[],services:[],areas:[],faqs:[],advantages:[],
 visibility:{products:true,campaign:true,services:true,works:true,about:true,testimonials:true,areas:true,faq:true}
};
let DATA=fallback, currentGallery=[], galleryIndex=0;

const safe=(v,d="")=>v??d;
const whatsapp=(phone,msg)=>`https://wa.me/${String(phone).replace(/\D/g,"")}?text=${encodeURIComponent(msg||"")}`;
function setText(id,val){const el=document.getElementById(id);if(el)el.textContent=safe(val)}
function setLink(id,href,text){const el=document.getElementById(id);if(!el)return;el.href=href;if(text)el.textContent=text}
function setImg(id,src){const el=document.getElementById(id);if(el&&src)el.src=src}
function loadAnalytics(measurementId){
 const id=String(measurementId||"").trim();
 if(!/^G-[A-Z0-9]+$/i.test(id)||window.__armekAnalyticsLoaded)return;
 window.__armekAnalyticsLoaded=true;
 window.dataLayer=window.dataLayer||[];
 window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
 const script=document.createElement("script");
 script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
 document.head.appendChild(script);
 window.gtag("js",new Date());
 window.gtag("config",id,{send_page_view:true});
}
function trackEvent(name,params={}){
 if(typeof window.gtag!=="function")return;
 window.gtag("event",name,params);
}
function bindAnalyticsClicks(){
 document.addEventListener("click",event=>{
  const link=event.target.closest("a");if(!link)return;
  const href=link.getAttribute("href")||"";
  if(/^https:\/\/wa\.me\//i.test(href)){
   trackEvent("whatsapp_click",{link_text:(link.textContent||"").trim(),link_url:href,page_location:location.href});
  }else if(/^tel:/i.test(href)){
   trackEvent("phone_click",{link_text:(link.textContent||"").trim(),phone_number:href.replace(/^tel:/i,""),page_location:location.href});
  }
 },{capture:true});
}
function stars(n){const v=Math.max(1,Math.min(5,Number(n)||5));return "★".repeat(v)+"☆".repeat(5-v)}
function productFeatures(product){
 const out=[];
 (product.features||[]).forEach(f=>{const v=typeof f==="string"?f:(f&&f.item)||"";if(v)out.push(v)});
 String(product.featureText||"").split(/\r?\n/).map(x=>x.trim()).filter(Boolean).forEach(v=>{if(!out.includes(v))out.push(v)});
 return out;
}
function applyVisibility(v={}){
 const map={products:"products",campaign:"campaign",services:"services",works:"works",about:"about",testimonials:"testimonials",areas:"areas",faq:"faq",brands:"brands",beforeAfter:"beforeAfter"};
 Object.entries(map).forEach(([key,cls])=>$$(`.section-toggle-${cls}`).forEach(el=>el.classList.toggle("section-hidden",v[key]===false)));
 $$(".nav-products").forEach(el=>el.classList.toggle("section-hidden",v.products===false));
 $$(".nav-campaign").forEach(el=>el.classList.toggle("section-hidden",v.campaign===false));
 $$(".nav-services").forEach(el=>el.classList.toggle("section-hidden",v.services===false));
 $$(".nav-works").forEach(el=>el.classList.toggle("section-hidden",v.works===false));
 $$(".nav-testimonials").forEach(el=>el.classList.toggle("section-hidden",v.testimonials===false));
 $$(".nav-faq").forEach(el=>el.classList.toggle("section-hidden",v.faq===false));
}
function renderHeroMedia(data){
 const slider=$("#heroSlider"),dots=$("#heroDots");
 if(!slider||!dots)return;
 const type=data.heroMediaType||((data.heroVideo)?"video":((data.heroSlides||[]).length?"slider":"image"));
 const fallbackImage=data.heroVideoPoster||data.heroImage||fallback.heroImage;
 dots.innerHTML="";

 if(type==="video"&&data.heroVideo){
  slider.innerHTML=`<div class="hero-video-wrap"><video id="heroVideo" class="hero-video" autoplay muted loop playsinline preload="metadata" poster="${fallbackImage}" disablepictureinpicture controlslist="nodownload noplaybackrate nofullscreen"><source src="${data.heroVideo}" type="video/mp4"></video><img class="hero-video-fallback" src="${fallbackImage}" alt="${data.heroTitle||"ARMEK Su Arıtma"}"></div>`;
  const video=$("#heroVideo"),fallbackNode=$(".hero-video-fallback");
  if(video){
   video.muted=true;
   video.controls=false;
   video.addEventListener("canplay",()=>fallbackNode?.classList.add("hidden"),{once:true});
   video.addEventListener("error",()=>{video.style.display="none";fallbackNode?.classList.remove("hidden")});
   const attempt=video.play();if(attempt&&typeof attempt.catch==="function")attempt.catch(()=>{});
  }
  return;
 }

 if(type==="slider"){
  const slides=(data.heroSlides||[]).filter(x=>x&&x.image);
  if(slides.length){
   slider.innerHTML=slides.map((s,i)=>`<div class="hero-slide ${i===0?"active":""}"><img src="${s.image}" alt="${s.alt||data.heroTitle||"ARMEK"}"></div>`).join("");
   dots.innerHTML=slides.length>1?slides.map((_,i)=>`<button class="slider-dot ${i===0?"active":""}" data-slide="${i}" aria-label="${i+1}. görsel"></button>`).join(""):"";
   let idx=0;
   const show=i=>{const all=$$(".hero-slide"),ds=$$(".slider-dot");idx=(i+all.length)%all.length;all.forEach((x,j)=>x.classList.toggle("active",j===idx));ds.forEach((x,j)=>x.classList.toggle("active",j===idx))};
   $$(".slider-dot").forEach(d=>d.onclick=()=>show(Number(d.dataset.slide)));
   if(slides.length>1)setInterval(()=>show(idx+1),5000);
   return;
  }
 }

 slider.innerHTML=`<div class="hero-slide active"><img src="${data.heroImage||fallback.heroImage}" alt="${data.heroTitle||"ARMEK Su Arıtma"}"></div>`;
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
 const description=$("#productModalDescription");
 description.textContent=product.description||"";
 description.style.display=product.description?"":"none";
 setText("productModalPrice",product.price||"Fiyat için arayın");
 const features=productFeatures(product);
 $("#productModalFeatures").innerHTML=features.map(f=>`<li>${f}</li>`).join("");
 $("#productThumbs").innerHTML=photos.map((src,i)=>`<button class="product-thumb ${i===0?"active":""}" data-product-photo="${src}"><img src="${src}" alt="${product.name||"Ürün"} ${i+1}"></button>`).join("");
 $$("[data-product-photo]").forEach(btn=>btn.onclick=()=>{$("#productModalImage").src=btn.dataset.productPhoto;$$('.product-thumb').forEach(x=>x.classList.remove('active'));btn.classList.add('active')});
 $("#productModalWhatsapp").href=whatsapp(DATA.phoneLink,`${product.name||"Ürün"} hakkında bilgi almak istiyorum.`);
 trackEvent("view_product",{item_name:product.name||"Ürün",item_category:product.category||"Ürün",item_brand:product.brand||"",value:product.price||""});
 modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeProduct(){const modal=$("#productModal");modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""}
function renderProducts(items=[]){
 items=(items||[]).filter(x=>x&&x.active!==false).sort((x,y)=>(Number(x.order)||999)-(Number(y.order)||999));
 const root=$("#products"),filters=$("#productFilters"); if(!root)return;
 if(!items.length){root.innerHTML="";filters.innerHTML="";return}
 const cats=["Tümü",...new Set(items.map(x=>x.category||"Diğer"))];
 filters.innerHTML=cats.map((c,i)=>`<button class="filter-tab ${i===0?"active":""}" data-category="${c}">${c}</button>`).join("");
 const draw=cat=>{
  const list=cat==="Tümü"?items:items.filter(x=>(x.category||"Diğer")===cat);
  root.innerHTML=list.map((p,i)=>`<article class="product-card reveal" data-product-index="${items.indexOf(p)}">${p.badge?`<span class="product-badge">${p.badge}</span>`:""}<div class="product-image"><img src="${p.image||productPhotos(p)[0]||"/armek-logo.jpg"}" alt="${p.name||"Ürün"}"></div><div class="product-body"><span class="product-category">${p.category||"Ürün"}</span><h3>${p.name||""}</h3><ul class="product-features">${productFeatures(p).map(f=>`<li>${f}</li>`).join("")}</ul><div class="product-footer"><a class="product-whatsapp-button" href="${whatsapp(DATA.phoneLink,`${p.name||"Ürün"} için fiyat bilgisi almak istiyorum.`)}" target="_blank" rel="noopener">Fiyat Sor</a></div></div></article>`).join("");
  $$('[data-product-index]').forEach(card=>card.onclick=e=>{if(e.target.closest('.product-whatsapp-button'))return;e.preventDefault();openProduct(items[Number(card.dataset.productIndex)])});
  observeReveals();
 };
 draw("Tümü");
 $$(".filter-tab",filters).forEach(btn=>btn.onclick=()=>{$$(".filter-tab",filters).forEach(x=>x.classList.remove("active"));btn.classList.add("active");draw(btn.dataset.category)});
 window.selectProductCategory=cat=>{const target=[...filters.querySelectorAll('[data-category]')].find(x=>x.dataset.category===cat);if(target)target.click()};
}
function normalizePhotos(work){const photos=[];if(work.image)photos.push(work.image);(work.images||[]).forEach(x=>{const src=typeof x==="string"?x:x.image;if(src&&!photos.includes(src))photos.push(src)});return photos}
function openLightbox(work,index=0){currentGallery=normalizePhotos(work);if(!currentGallery.length)return;galleryIndex=index;updateLightbox(work);trackEvent("view_work",{work_title:work.title||"Yaptığımız İş",work_category:work.category||"",work_location:work.location||""});$("#lightbox").classList.add("open");$("#lightbox").setAttribute("aria-hidden","false")}
function updateLightbox(work){$("#lightboxImage").src=currentGallery[galleryIndex];$("#lightboxCaption").textContent=[work.title,work.location,work.date].filter(Boolean).join(" • ")}
function renderWorks(items=[]){
 items=(items||[]).filter(x=>x&&x.active!==false);
 const root=$("#works"),filters=$("#workFilters");if(!root)return;
 if(!items.length){root.innerHTML="";filters.innerHTML="";return}
 const cats=["Tümü",...new Set(items.map(x=>x.category||"Diğer"))];
 filters.innerHTML=cats.map((c,i)=>`<button class="filter-tab ${i===0?"active":""}" data-work-category="${c}">${c}</button>`).join("");
 const draw=cat=>{const list=cat==="Tümü"?items:items.filter(x=>(x.category||"Diğer")===cat);root.innerHTML=list.map((w,i)=>{const photos=normalizePhotos(w);return `<article class="work-card reveal"><div class="work-cover" data-work-index="${items.indexOf(w)}"><img src="${photos[0]||"/armek-logo.jpg"}" alt="${w.title||"Yaptığımız iş"}">${photos.length>1?`<span class="photo-count">▣ ${photos.length} fotoğraf</span>`:""}</div><div class="work-body"><h3>${w.title||""}</h3><div class="work-meta"><span>${w.category||""}</span>${w.location?`<span>📍 ${w.location}</span>`:""}${w.date?`<span>🗓 ${w.date}</span>`:""}</div>${w.text?`<p>${w.text}</p>`:""}</div></article>`}).join("");$$("[data-work-index]").forEach(el=>el.onclick=()=>openLightbox(items[Number(el.dataset.workIndex)]));observeReveals()};
 draw("Tümü");$$("[data-work-category]").forEach(btn=>btn.onclick=()=>{$$("[data-work-category]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");draw(btn.dataset.workCategory)});
}

function renderBrands(items=[]){
 const root=$("#brands");if(!root)return;const list=(items||[]).filter(x=>x&&x.active!==false);
 root.innerHTML=list.map(b=>`<a class="brand-card reveal" ${b.url?`href="${b.url}" target="_blank" rel="noopener"`:""}>${b.logo?`<img src="${b.logo}" alt="${b.name||"Marka"}">`:`<span>${b.name||"Marka"}</span>`}</a>`).join("");
 if(!list.length)root.closest("section")?.classList.add("section-hidden");
}
function renderBeforeAfter(works=[]){
 const root=$("#beforeAfter");if(!root)return;const list=(works||[]).filter(w=>w&&w.active!==false&&w.beforeImage&&w.afterImage);
 root.innerHTML=list.map(w=>`<article class="compare-card reveal"><div class="compare-images"><div class="compare-pane"><img src="${w.beforeImage}" alt="${w.title||"Çalışma"} öncesi"><span class="compare-label">ÖNCESİ</span></div><div class="compare-pane"><img src="${w.afterImage}" alt="${w.title||"Çalışma"} sonrası"><span class="compare-label">SONRASI</span></div></div><div class="compare-body"><h3>${w.title||"Uygulama"}</h3><p>${w.text||""}</p></div></article>`).join("");
 if(!list.length)root.closest("section")?.classList.add("section-hidden");
}
function updateStructuredData(data){
 const products=(data.products||[]).filter(x=>x&&x.active!==false).slice(0,20);
 const graph=[{
  "@type":"LocalBusiness",
  "@id":"https://armeksuaritma.com.tr/#business",
  "name":data.businessName||"ARMEK Su Arıtma",
  "url":"https://armeksuaritma.com.tr/",
  "logo":new URL(data.logoImage||"/armek-logo.jpg",location.origin).href,
  "image":new URL(data.seoImage||data.logoImage||"/armek-logo.jpg",location.origin).href,
  "telephone":data.phoneDisplay||"",
  "description":data.seoDescription||data.heroText||"",
  "areaServed":"Antalya",
  "address":{"@type":"PostalAddress","addressLocality":data.addressText||"Antalya","addressCountry":"TR"},
  "sameAs":[data.facebook,data.instagram].filter(Boolean)
 }];
 if(products.length){graph.push({"@type":"ItemList","name":"ARMEK Su Arıtma Ürünleri","itemListElement":products.map((p,i)=>({"@type":"ListItem","position":i+1,"item":{"@type":"Product","name":p.name||"Ürün","image":p.image?new URL(p.image,location.origin).href:undefined,"description":productFeatures(p).join(", "),"brand":p.brand?{"@type":"Brand","name":p.brand}:undefined}}))})}
 const node=$("#structuredData");if(node)node.textContent=JSON.stringify({"@context":"https://schema.org","@graph":graph});
}
function render(data){
 DATA={...fallback,...data,visibility:{...fallback.visibility,...(data.visibility||{})}};
 loadAnalytics(DATA.analyticsMeasurementId||"G-DQBRPFTJ5J");
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
 const gv=$("#googleSiteVerification");if(gv)gv.content=DATA.googleSiteVerification||"";const cl=$("#canonicalLink");if(cl)cl.href="https://armeksuaritma.com.tr/";updateStructuredData(DATA);
 renderHeroMedia(DATA);renderProducts(DATA.products||[]);renderWorks(DATA.works||[]);renderBrands(DATA.brands||[]);renderBeforeAfter(DATA.works||[]);
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
async function loadJson(path,fallbackValue){
 try{const r=await fetch(`${path}?v=${Date.now()}`);return r.ok?await r.json():fallbackValue}catch(e){return fallbackValue}
}
function mergeUnique(oldItems=[],newItems=[],key="name"){
 const map=new Map();
 [...oldItems,...newItems].forEach((item,i)=>{
  if(!item)return;
  const id=String(item.slug||item[key]||item.title||item.q||item.name||i).trim().toLowerCase();
  map.set(id,item);
 });
 return [...map.values()];
}
async function boot(){
 const [base,homeData,settingsData,seoData,productData,workData,testimonialData,serviceData,campaignData,faqData]=await Promise.all([
  loadJson('/content.json',{}),
  loadJson('/home.json',{}),
  loadJson('/settings.json',{}),
  loadJson('/seo.json',{}),
  loadJson('/products.json',{products:[]}),
  loadJson('/works.json',{works:[]}),
  loadJson('/testimonials.json',{testimonials:[]}),
  loadJson('/services.json',{services:[]}),
  loadJson('/campaigns.json',{campaigns:[]}),
  loadJson('/faqs.json',{faqs:[]})
 ]);
 const campaigns=(campaignData.campaigns||[]).filter(x=>x&&x.active!==false);
 const currentCampaign=campaigns[0]||{};
 const merged={
  ...base,
  ...settingsData,
  ...homeData,
  ...seoData,
  products:mergeUnique(base.products||[],productData.products||[],'name'),
  works:mergeUnique(base.works||[],workData.works||[],'title'),
  testimonials:mergeUnique(base.testimonials||[],testimonialData.testimonials||[],'name').filter(x=>x&&x.active!==false),
  services:mergeUnique(base.services||[],serviceData.services||[],'title').filter(x=>x&&x.active!==false),
  faqs:mergeUnique(base.faqs||[],faqData.faqs||[],'q').filter(x=>x&&x.active!==false),
  ...(currentCampaign.title?{
    campaignTitle:currentCampaign.title,
    campaignText:currentCampaign.text,
    campaignImage:currentCampaign.image,
    prices:currentCampaign.prices||base.prices,
    campaignVisible:currentCampaign.active!==false
  }:{})
 };
 render(merged);
}
bindAnalyticsClicks();
boot();
$$('[data-product-close]').forEach(el=>el.onclick=closeProduct);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProduct()});
$$('[data-product-nav]').forEach(link=>link.addEventListener('click',()=>{setTimeout(()=>window.selectProductCategory&&window.selectProductCategory(link.dataset.productNav),100)}));
